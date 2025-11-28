import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import BackButton from '../../components/common/BackButton';
import './Admin.css';
import { formatCurrency } from '../../utils/currency';

const Dashboard = () => {
  const { token } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    profit: 0,
    recentOrders: 0,
    totalBalance: 0
  });
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data.stats);
        setBestSellers(response.data.bestSellers || []);
      } catch (error) {
        console.error('Lỗi lấy thống kê:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return <div className="main-content"><div className="loading">Đang tải...</div></div>;
  }

  return (
    <div className="main-content">
      <div className="container">
        <BackButton />
        <h1>Dashboard Admin</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Tổng người dùng</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Tổng sản phẩm</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
          <div className="stat-card">
            <h3>Tổng đơn hàng</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Doanh thu</h3>
            <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="stat-card">
            <h3>Lợi nhuận</h3>
            <p className="stat-value">{formatCurrency(stats.profit)}</p>
          </div>
          <div className="stat-card">
            <h3>Số dư khách hàng</h3>
            <p className="stat-value">{formatCurrency(stats.totalBalance)}</p>
          </div>
          <div className="stat-card">
            <h3>Đơn hàng hôm nay</h3>
            <p className="stat-value">{stats.recentOrders}</p>
          </div>
        </div>

        {bestSellers.length > 0 && (
          <div className="best-seller-section">
            <h2>Best Seller</h2>
            <div className="best-seller-grid">
              {bestSellers.map(product => (
                <div key={product.id} className="best-seller-card">
                  <img src={product.image || '/placeholder.jpg'} alt={product.name} />
                  <div className="best-seller-info">
                    <h3>{product.name}</h3>
                    <p>Bán được: {product.total_sold}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

