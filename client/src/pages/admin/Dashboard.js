import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  FaUsers, 
  FaBox, 
  FaShoppingCart, 
  FaDollarSign, 
  FaChartLine, 
  FaWallet, 
  FaCalendarDay,
  FaTrophy
} from 'react-icons/fa';
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
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('7');

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

  useEffect(() => {
    const fetchRevenueChart = async () => {
      try {
        const response = await axios.get(`/api/admin/revenue-chart?period=${chartPeriod}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Format dữ liệu cho chart
        const formattedData = response.data.data.map(item => ({
          date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
          revenue: parseFloat(item.revenue) || 0,
          orders: item.orders || 0
        }));
        setRevenueData(formattedData);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu chart:', error);
      }
    };
    if (token) {
      fetchRevenueChart();
    }
  }, [token, chartPeriod]);

  if (loading) {
    return <div className="main-content"><div className="loading">Đang tải...</div></div>;
  }

  const statCards = [
    { 
      title: 'Tổng người dùng', 
      value: stats.totalUsers, 
      icon: FaUsers, 
      color: '#007bff',
      bgColor: '#e7f3ff'
    },
    { 
      title: 'Tổng sản phẩm', 
      value: stats.totalProducts, 
      icon: FaBox, 
      color: '#28a745',
      bgColor: '#e6f4ea'
    },
    { 
      title: 'Tổng đơn hàng', 
      value: stats.totalOrders, 
      icon: FaShoppingCart, 
      color: '#ffc107',
      bgColor: '#fff8e1'
    },
    { 
      title: 'Doanh thu', 
      value: formatCurrency(stats.totalRevenue), 
      icon: FaDollarSign, 
      color: '#17a2b8',
      bgColor: '#e0f7fa'
    },
    { 
      title: 'Lợi nhuận', 
      value: formatCurrency(stats.profit), 
      icon: FaChartLine, 
      color: '#28a745',
      bgColor: '#e6f4ea'
    },
    { 
      title: 'Số dư khách hàng', 
      value: formatCurrency(stats.totalBalance), 
      icon: FaWallet, 
      color: '#6f42c1',
      bgColor: '#f3e5f5'
    },
    { 
      title: 'Đơn hàng hôm nay', 
      value: stats.recentOrders, 
      icon: FaCalendarDay, 
      color: '#dc3545',
      bgColor: '#fdecea'
    }
  ];

  return (
    <div className="main-content">
      <div className="container">
        <BackButton />
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaChartLine style={{ color: '#007bff' }} />
          Dashboard Admin
        </h1>
        
        {/* Stat Cards */}
        <div className="stats-grid">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div key={index} className="stat-card" style={{ 
                borderLeft: `4px solid ${card.color}`,
                backgroundColor: '#fff'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }}>
                  <h3 style={{ margin: 0, color: '#666', fontSize: '14px' }}>{card.title}</h3>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent style={{ color: card.color, fontSize: '20px' }} />
                  </div>
                </div>
                <p className="stat-value" style={{ color: card.color, margin: 0 }}>
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
          gap: '20px', 
          marginTop: '40px' 
        }}>
          {/* Revenue Chart */}
          <div style={{ 
            background: 'white', 
            padding: '25px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaDollarSign style={{ color: '#28a745' }} />
                Doanh thu theo thời gian
              </h2>
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="7">7 ngày qua</option>
                <option value="30">30 ngày qua</option>
                <option value="365">1 năm qua</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelStyle={{ color: '#333' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#28a745" 
                  strokeWidth={2}
                  name="Doanh thu"
                  dot={{ fill: '#28a745', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Chart */}
          <div style={{ 
            background: 'white', 
            padding: '25px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            <h2 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaShoppingCart style={{ color: '#ffc107' }} />
              Số đơn hàng theo thời gian
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `${value} đơn`}
                  labelStyle={{ color: '#333' }}
                />
                <Legend />
                <Bar 
                  dataKey="orders" 
                  fill="#ffc107" 
                  name="Số đơn hàng"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <div className="best-seller-section" style={{ marginTop: '40px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <FaTrophy style={{ color: '#ffc107' }} />
              Sản phẩm bán chạy
            </h2>
            <div className="best-seller-grid">
              {bestSellers.map((product, index) => (
                <div key={product.id} className="best-seller-card" style={{
                  position: 'relative'
                }}>
                  {index === 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      backgroundColor: '#ffc107',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      <FaTrophy />
                    </div>
                  )}
                  <img src={product.image || '/placeholder.jpg'} alt={product.name} />
                  <div className="best-seller-info">
                    <h3>{product.name}</h3>
                    <p style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '5px',
                      color: '#28a745',
                      fontWeight: 'bold'
                    }}>
                      <FaShoppingCart /> Đã bán: {product.total_sold}
                    </p>
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
