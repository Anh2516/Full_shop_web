const express = require('express');
const router = express.Router();
const { pool: db } = require('../config/database');
const { verifyToken, requireAdmin } = require('../config/auth');

const buildProductQuery = ({ category, search, limitNum, offset, includeHidden }) => {
  let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
  const params = [];

  if (!includeHidden) {
    query += ' AND p.is_visible = 1';
  }

  if (category) {
    const categoryId = parseInt(category, 10);
    if (!isNaN(categoryId)) {
      query += ' AND p.category_id = ?';
      params.push(categoryId);
    }
  }

  if (search && search.trim()) {
    const trimmed = search.trim();
    const keyword = `%${trimmed}%`;
    const numericId = parseInt(trimmed, 10);
    query += ' AND (p.name LIKE ? OR p.description LIKE ?';
    params.push(keyword, keyword);
    if (!isNaN(numericId)) {
      query += ' OR p.id = ?';
      params.push(numericId);
    }
    query += ')';
  }

  query += ' ORDER BY p.created_at DESC';
  query += ` LIMIT ${limitNum} OFFSET ${offset}`;

  return { query, params };
};

const buildCountQuery = ({ category, search, includeHidden }) => {
  let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
  const countParams = [];

  if (!includeHidden) {
    countQuery += ' AND is_visible = 1';
  }

  if (category) {
    countQuery += ' AND category_id = ?';
    countParams.push(parseInt(category, 10));
  }
  if (search && search.trim()) {
    const trimmed = search.trim();
    const keyword = `%${trimmed}%`;
    const numericId = parseInt(trimmed, 10);
    countQuery += ' AND (name LIKE ? OR description LIKE ?';
    countParams.push(keyword, keyword);
    if (!isNaN(numericId)) {
      countQuery += ' OR id = ?';
      countParams.push(numericId);
    }
    countQuery += ')';
  }

  return { countQuery, countParams };
};

const getPaginationMeta = (pageNum, limitNum, total) => ({
  page: pageNum,
  limit: limitNum,
  total: total || 0,
  pages: Math.ceil((total || 0) / limitNum)
});

const listProducts = async (req, res, includeHidden = false) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    const { query, params } = buildProductQuery({ category, search, limitNum, offset, includeHidden });
    const [products] = await db.execute(query, params);

    const { countQuery, countParams } = buildCountQuery({ category, search, includeHidden });
    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    res.json({
      products: products || [],
      pagination: getPaginationMeta(pageNum, limitNum, total)
    });
  } catch (error) {
    console.error('Lỗi lấy sản phẩm:', error);
    res.status(500).json({
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Lấy tất cả sản phẩm public
router.get('/', async (req, res) => listProducts(req, res, false));

// Lấy tất cả sản phẩm cho admin (bao gồm ẩn)
router.get('/admin', verifyToken, requireAdmin, async (req, res) => listProducts(req, res, true));

// Top sản phẩm bán chạy
router.get('/best-sellers', async (req, res) => {
  try {
    const [bestSellers] = await db.execute(
      `SELECT p.id, p.name, p.image, SUM(oi.quantity) as total_sold
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       WHERE o.status IN ("completed","shipped","processing")
       GROUP BY p.id, p.name, p.image
       ORDER BY total_sold DESC
       LIMIT 3`
    );
    res.json({ bestSellers });
  } catch (error) {
    console.error('Lỗi lấy best seller:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy sản phẩm theo ID
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.execute(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ product: products[0] });
  } catch (error) {
    console.error('Lỗi lấy sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Tạo sản phẩm mới (Admin only)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, stock, category_id, image, is_visible } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, stock, category_id, image, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description || null, price, stock, category_id || null, image || null, typeof is_visible === 'undefined' ? 1 : is_visible ? 1 : 0]
    );

    const [newProduct] = await db.execute(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [result.insertId]
    );

    res.status(201).json({ product: newProduct[0], message: 'Tạo sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi tạo sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Cập nhật sản phẩm (Admin only)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, stock, category_id, image, is_visible } = req.body;

    await db.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image = ?, is_visible = ? WHERE id = ?',
      [name, description, price, stock, category_id, image, typeof is_visible === 'undefined' ? 1 : is_visible ? 1 : 0, req.params.id]
    );

    const [updatedProduct] = await db.execute(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );

    res.json({ product: updatedProduct[0], message: 'Cập nhật sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xóa sản phẩm (Admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi xóa sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Cập nhật trạng thái trưng bày
router.put('/:id/visibility', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { is_visible } = req.body;
    const flag = is_visible ? 1 : 0;

    await db.execute('UPDATE products SET is_visible = ? WHERE id = ?', [flag, req.params.id]);

    const [productRows] = await db.execute(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ product: productRows[0], message: 'Cập nhật trạng thái trưng bày thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;

