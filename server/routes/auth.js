const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { pool: db } = require('../config/database');
const { generateToken, verifyToken } = require('../config/auth');
const { generateUniqueCustomerCode, ensureCustomerCode } = require('../utils/customerCode');

// Đăng ký
router.post('/register', [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('name').notEmpty().withMessage('Tên không được để trống')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, phone, address } = req.body;

    // Kiểm tra email đã tồn tại
    const [existingUser] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const customerCode = await generateUniqueCustomerCode(db);

    const [result] = await db.execute(
      'INSERT INTO users (email, password, name, phone, address, balance, customer_code, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone || null, address || null, 0, customerCode, 'user']
    );

    const token = generateToken(result.insertId, 'user');

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: result.insertId,
        email,
        name,
        role: 'user',
        balance: 0,
        customer_code: customerCode
      }
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Đăng nhập
router.post('/login', [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu không được để trống')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Tìm user
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const user = users[0];
    user.customer_code = await ensureCustomerCode(db, user.id, user.customer_code);

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        balance: user.balance,
        customer_code: user.customer_code
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy thông tin user hiện tại
router.get('/me', verifyToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, email, name, phone, address, balance, customer_code, role, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    const user = users[0];
    user.customer_code = await ensureCustomerCode(db, user.id, user.customer_code);

    res.json({ user });
  } catch (error) {
    console.error('Lỗi lấy thông tin user:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;

