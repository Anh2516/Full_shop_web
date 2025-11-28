import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct, toggleProductVisibility } from '../../store/slices/productSlice';
import axios from 'axios';
import './Admin.css';
import BackButton from '../../components/common/BackButton';
import { formatCurrency } from '../../utils/currency';

const Products = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const { items, loading } = useSelector(state => state.products);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: '',
    is_visible: true
  });

  useEffect(() => {
    fetchCategories();
  }, [token]);

  useEffect(() => {
    dispatch(fetchProducts({ admin: true, limit: 1000, search: debouncedSearch || undefined }));
  }, [dispatch, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      if (!token) return;
      const response = await axios.get('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Lỗi lấy categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category_id: formData.category_id ? Number(formData.category_id) : null
    };

    if (editingProduct) {
      await dispatch(updateProduct({ id: editingProduct.id, productData: payload }));
    } else {
      await dispatch(createProduct(payload));
    }
    await dispatch(fetchProducts({ admin: true, limit: 1000, search: debouncedSearch || undefined }));
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      image: '',
      is_visible: true
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category_id: product.category_id || '',
      image: product.image || '',
      is_visible: Boolean(product.is_visible)
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      await dispatch(deleteProduct(id));
    }
  };

  const handleToggleVisibility = async (product) => {
    await dispatch(toggleProductVisibility({ id: product.id, isVisible: !product.is_visible }));
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="admin-header">
          <h1>Quản lý sản phẩm</h1>
          <div className="admin-filters">
            <BackButton />
            <input
              type="text"
              className="admin-search"
              placeholder="Tìm theo tên, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <div className="admin-table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Danh mục</th>
                  <th>Trưng bày</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>{product.category_name || 'N/A'}</td>
                    <td>
                      <span className={`visibility-badge ${product.is_visible ? 'visible' : 'hidden'}`}>
                        {product.is_visible ? 'Đang hiển thị' : 'Đang ẩn'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(product)}
                        className="btn btn-secondary"
                      >
                        {product.is_visible ? 'Ẩn' : 'Hiện'}
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(product)} className="btn btn-primary">
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="btn btn-danger">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên sản phẩm</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Giá</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Tồn kho</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Danh mục</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>URL hình ảnh</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_visible}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    />
                    Hiển thị trên gian hàng
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn">
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

