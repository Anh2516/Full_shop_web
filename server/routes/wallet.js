const express = require('express');
const router = express.Router();
const { pool: db } = require('../config/database');
const { verifyToken, requireAdmin } = require('../config/auth');
const { ensureCustomerCode } = require('../utils/customerCode');

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const [transactions] = await db.execute(
      `SELECT id, amount, method, type, status, note, created_at, approved_at
       FROM wallet_transactions
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.userId]
    );

    await ensureCustomerCode(db, req.user.userId);

    res.json({ transactions });
  } catch (error) {
    console.error('Lỗi lấy lịch sử ví:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.post('/topup', async (req, res) => {
  try {
    const { amount, method, note } = req.body;
    const value = parseFloat(amount);

    if (!value || value <= 0) {
      return res.status(400).json({ message: 'Số tiền không hợp lệ' });
    }

    const paymentMethod = method || 'transfer';

    const [result] = await db.execute(
      `INSERT INTO wallet_transactions (user_id, amount, method, type, status, note)
       VALUES (?, ?, ?, 'topup', 'pending', ?)`,
      [req.user.userId, value, paymentMethod, note || null]
    );

    const [userRows] = await db.execute(
      'SELECT id, email, name, phone, address, balance, customer_code, role, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    const user = userRows[0];
    user.customer_code = await ensureCustomerCode(db, user.id, user.customer_code);

    res.status(201).json({
      message: 'Yêu cầu nạp tiền đã được gửi, vui lòng chờ admin xác nhận',
      transaction: {
        id: result.insertId,
        amount: value,
        method: paymentMethod,
        type: 'topup',
        status: 'pending',
        note: note || null,
        created_at: new Date()
      },
      user
    });
  } catch (error) {
    console.error('Lỗi nạp tiền:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.get('/admin/pending', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.query;
    let query = `SELECT wt.*, u.name as user_name, u.email as user_email
      FROM wallet_transactions wt
      JOIN users u ON wt.user_id = u.id
      WHERE wt.status = 'pending'`;
    const params = [];

    if (userId) {
      query += ' AND wt.user_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY wt.created_at ASC';

    const [transactions] = await db.execute(query, params);
    res.json({ transactions });
  } catch (error) {
    console.error('Lỗi lấy giao dịch chờ duyệt:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.post('/admin/:id/approve', requireAdmin, async (req, res) => {
  const transactionId = parseInt(req.params.id, 10);
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      'SELECT * FROM wallet_transactions WHERE id = ? FOR UPDATE',
      [transactionId]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Không tìm thấy giao dịch' });
    }

    const transaction = rows[0];
    if (transaction.status !== 'pending') {
      await connection.rollback();
      return res.status(400).json({ message: 'Giao dịch đã được xử lý' });
    }

    await connection.execute(
      'UPDATE wallet_transactions SET status = "approved", approved_by = ?, approved_at = NOW() WHERE id = ?',
      [req.user.userId, transactionId]
    );

    await connection.execute(
      'UPDATE users SET balance = balance + ? WHERE id = ?',
      [transaction.amount, transaction.user_id]
    );

    await connection.commit();

    const [userRows] = await db.execute(
      'SELECT id, email, name, phone, address, balance, customer_code, role, created_at FROM users WHERE id = ?',
      [transaction.user_id]
    );

    res.json({
      message: 'Đã duyệt nạp tiền',
      transaction: {
        ...transaction,
        status: 'approved',
        approved_by: req.user.userId,
        approved_at: new Date()
      },
      user: userRows[0]
    });
  } catch (error) {
    console.error('Lỗi duyệt giao dịch:', error);
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
    }
    res.status(500).json({ message: 'Lỗi server' });
  } finally {
    connection.release();
  }
});

router.post('/admin/:id/reject', requireAdmin, async (req, res) => {
  const transactionId = parseInt(req.params.id, 10);
  const { reason } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      'SELECT * FROM wallet_transactions WHERE id = ? FOR UPDATE',
      [transactionId]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Không tìm thấy giao dịch' });
    }

    const transaction = rows[0];
    if (transaction.status !== 'pending') {
      await connection.rollback();
      return res.status(400).json({ message: 'Giao dịch đã được xử lý' });
    }

    const updatedNote = reason
      ? `${transaction.note || ''}\nRejected: ${reason}`
      : transaction.note;

    await connection.execute(
      'UPDATE wallet_transactions SET status = "rejected", approved_by = ?, approved_at = NOW(), note = ? WHERE id = ?',
      [req.user.userId, updatedNote, transactionId]
    );

    await connection.commit();

    res.json({
      message: 'Đã từ chối giao dịch',
      transaction: {
        ...transaction,
        status: 'rejected',
        note: updatedNote,
        approved_by: req.user.userId,
        approved_at: new Date()
      }
    });
  } catch (error) {
    console.error('Lỗi từ chối giao dịch:', error);
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
    }
    res.status(500).json({ message: 'Lỗi server' });
  } finally {
    connection.release();
  }
});

module.exports = router;

