import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  FaShoppingBag, 
  FaChartLine, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaWarehouse,
  FaHistory,
  FaWallet,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';
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

  const baseLinks = [{ to: '/products', label: 'Sản phẩm', icon: FaShoppingBag }];
  let navLinks = baseLinks;

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      navLinks = [
        ...baseLinks,
        { to: '/admin', label: 'Dashboard', icon: FaChartLine },
        { to: '/admin/products', label: 'QL sản phẩm', icon: FaBox },
        { to: '/admin/orders', label: 'QL đơn hàng', icon: FaShoppingCart },
        { to: '/admin/users', label: 'QL người dùng', icon: FaUsers },
        { to: '/admin/inventory', label: 'QL nhập kho', icon: FaWarehouse }
      ];
    } else {
      navLinks = [
        ...baseLinks,
        { to: '/orders/history', label: 'Đơn hàng', icon: FaHistory },
        { to: '/wallet', label: 'Nạp tiền', icon: FaWallet },
        { to: '/cart', label: 'Giỏ hàng', icon: FaShoppingCart }
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
          {navLinks.map(link => {
            const IconComponent = link.icon;
            return (
              <Link key={link.to} to={link.to} className="navbar-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconComponent />
                {link.label}
                {link.to === '/cart' && cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <>
              {user?.role !== 'admin' && typeof user?.balance !== 'undefined' && (
                <span className="navbar-balance" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <FaWallet /> Số dư: {formatCurrency(user.balance)}
                </span>
              )}
              <Link to="/profile" className="navbar-user" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaUser /> Xin chào, {user?.name}
              </Link>
              <button onClick={handleLogout} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaSignOutAlt /> Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaSignInAlt /> Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-success" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaUserPlus /> Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

