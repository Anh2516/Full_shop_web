import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import './Cart.css';
import { formatCurrency } from '../utils/currency';
import BackButton from '../components/common/BackButton';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.orders);
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [paymentGateway, setPaymentGateway] = useState('cod');

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!shippingAddress) {
      alert('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    const orderData = {
      items: items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      total,
      shipping_address: shippingAddress,
      payment_method: 'cod',
      payment_gateway: paymentGateway
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      alert('Đặt hàng thành công!');
      navigate('/');
    } catch (error) {
      alert(error || 'Lỗi đặt hàng, vui lòng thử lại');
    }
  };

  if (items.length === 0) {
    return (
      <div className="main-content">
        <div className="container">
          <BackButton />
          <h1>Giỏ hàng</h1>
          <div className="empty-cart">
            <p>Giỏ hàng của bạn đang trống</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <BackButton />
        <h1>Giỏ hàng</h1>
        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.product.id} className="cart-item">
                <img src={item.product.image || '/placeholder.jpg'} alt={item.product.name} />
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p>{formatCurrency(item.product.price)}</p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    onClick={() => dispatch(updateQuantity({
                      productId: item.product.id,
                      quantity: Math.max(1, item.quantity - 1)
                    }))}
                    className="btn-quantity"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateQuantity({
                      productId: item.product.id,
                      quantity: Math.min(item.product.stock, item.quantity + 1)
                    }))}
                    className="btn-quantity"
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  {formatCurrency(parseFloat(item.product.price) * item.quantity)}
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.product.id))}
                  className="btn btn-danger"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Thông tin đơn hàng</h2>
            <div className="form-group">
              <label>Địa chỉ giao hàng</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows="3"
                required
              />
            </div>
            <div className="form-group">
              <label>Cổng thanh toán</label>
              <select
                value={paymentGateway}
                onChange={(e) => setPaymentGateway(e.target.value)}
              >
                <option value="cod">Thanh toán khi nhận hàng</option>
                <option value="vnpay">VNPay</option>
                <option value="momo">Momo</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            <div className="summary-row">
              <span>Số dư ví ShopWeb:</span>
              <strong>{formatCurrency(user?.balance || 0)}</strong>
            </div>
            <div className="summary-row">
              <span>Tổng tiền:</span>
              <span className="total-price">{formatCurrency(total)}</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-checkout"
              onClick={() => navigate('/wallet')}
            >
              Nạp thêm tiền
            </button>
            <button
              onClick={handleCheckout}
              className="btn btn-primary btn-checkout"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

