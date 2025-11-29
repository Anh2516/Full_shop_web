import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './Navbar.css';
import { formatCurrency } from '../../utils/currency';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const cartItems = useSelector(state => state.cart.items);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const baseLinks = [{ to: '/products', label: 'Sản phẩm' }];
  let navLinks = baseLinks;

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      navLinks = [
        ...baseLinks,
        { to: '/admin', label: 'Dashboard' },
        { to: '/admin/products', label: 'QL sản phẩm' },
        { to: '/admin/orders', label: 'QL đơn hàng' },
        { to: '/admin/users', label: 'QL người dùng' },
        { to: '/admin/inventory', label: 'QL nhập kho' }
      ];
    } else {
      navLinks = [
        ...baseLinks,
        { to: '/orders/history', label: 'Đơn hàng' },
        { to: '/wallet', label: 'Nạp tiền' },
        { to: '/cart', label: 'Giỏ hàng' }
      ];
    }
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          ShopWeb
        </Link>
        <div className="navbar-menu">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="navbar-link">
              {link.label}
              {link.to === '/cart' && cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              {user?.role !== 'admin' && typeof user?.balance !== 'undefined' && (
                <span className="navbar-balance">Số dư: {formatCurrency(user.balance)}</span>
              )}
              <Link to="/profile" className="navbar-user" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                Xin chào, {user?.name}
              </Link>
              <button onClick={handleLogout} className="btn btn-primary">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
              <Link to="/register" className="btn btn-success">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

