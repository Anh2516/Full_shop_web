# 🛒 Cart.js - Giải Thích Chi Tiết

## 📍 File: `src/pages/Cart.js` + `Cart.css`

## 🎯 Mục Đích

Trang **giỏ hàng** cho phép:
- Xem danh sách sản phẩm trong giỏ
- Cập nhật số lượng
- Xóa sản phẩm
- **Đặt hàng** (checkout) - Logic quan trọng

---

## 📝 Code Chi Tiết - Phần 1: Imports & Setup

```javascript
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import { updateBalance } from '../store/slices/authSlice';
import './Cart.css';
import { formatCurrency } from '../utils/currency';
import BackButton from '../components/common/BackButton';
```

**Giải thích:**
- `removeFromCart`, `updateQuantity`, `clearCart`: Actions quản lý giỏ hàng
- `createOrder`: **Action quan trọng** - Tạo đơn hàng
- `updateBalance`: Cập nhật số dư ví sau khi đặt hàng
- `formatCurrency`: Format giá tiền

---

## 📝 Code Chi Tiết - Phần 2: Component Setup

```javascript
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.orders);
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const paymentGateway = 'wallet'; // Chỉ dùng số dư ví

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
```

**Giải thích:**
- `items`: Danh sách sản phẩm trong giỏ (từ Redux)
- `user`: Thông tin user (để lấy balance, address)
- `loading`: Trạng thái đang tạo đơn hàng
- `shippingAddress`: Địa chỉ giao hàng (mặc định từ user.address)
- `paymentGateway`: Chỉ dùng ví (wallet)
- `total`: Tính tổng tiền = sum(price × quantity)

---

## 📝 Code Chi Tiết - Phần 3: Handle Checkout (QUAN TRỌNG)

```javascript
const handleCheckout = async () => {
  // 1. Validation: Kiểm tra địa chỉ
  if (!shippingAddress) {
    alert('Vui lòng nhập địa chỉ giao hàng');
    return;
  }

  // 2. Chuẩn bị dữ liệu đơn hàng
  const orderData = {
    items: items.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    })),
    total,
    shipping_address: shippingAddress,
    payment_method: 'wallet',
    payment_gateway: 'wallet'
  };

  try {
    // 3. Tạo đơn hàng
    const result = await dispatch(createOrder(orderData)).unwrap();
    
    // 4. Cập nhật balance ngay lập tức
    if (result.newBalance !== undefined) {
      dispatch(updateBalance(result.newBalance));
    }
    
    // 5. Xóa giỏ hàng
    dispatch(clearCart());
    
    // 6. Trigger event để admin cập nhật chấm đỏ
    window.dispatchEvent(new Event('pendingCountsUpdate'));
    
    // 7. Thông báo và redirect
    alert('Đặt hàng thành công!');
    navigate('/');
  } catch (error) {
    alert(error || 'Lỗi đặt hàng, vui lòng thử lại');
  }
};
```

**Giải thích từng bước:**

1. **Validation:** Kiểm tra có địa chỉ giao hàng
2. **Prepare Data:** Chuyển đổi items thành format API cần:
   - `product_id`, `quantity`, `price`
3. **Create Order:** Dispatch `createOrder` (async action)
4. **Update Balance:** Cập nhật số dư ví sau khi trừ tiền
5. **Clear Cart:** Xóa giỏ hàng sau khi đặt hàng thành công
6. **Trigger Event:** Thông báo admin có đơn hàng mới
7. **Success/Error:** Alert và redirect

**Đây là logic chính của Người B:** Xử lý đặt hàng!

---

## 📝 Code Chi Tiết - Phần 4: Empty Cart State

```javascript
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
```

**Giải thích:**
- Nếu giỏ hàng trống: Hiển thị thông báo và nút "Tiếp tục mua sắm"

---

## 📝 Code Chi Tiết - Phần 5: Cart Items Render

```javascript
<div className="cart-items">
  {items.map(item => (
    <div key={item.product.id} className="cart-item">
      {/* Product Image */}
      <img src={item.product.image || '/placeholder.jpg'} alt={item.product.name} />
      
      {/* Product Info */}
      <div className="cart-item-info">
        <h3>{item.product.name}</h3>
        <p>{formatCurrency(item.product.price)}</p>
      </div>
      
      {/* Quantity Controls */}
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
      
      {/* Total Price */}
      <div className="cart-item-total">
        {formatCurrency(parseFloat(item.product.price) * item.quantity)}
      </div>
      
      {/* Remove Button */}
      <button
        onClick={() => dispatch(removeFromCart(item.product.id))}
        className="btn btn-danger"
      >
        Xóa
      </button>
    </div>
  ))}
</div>
```

**Giải thích:**

### **Quantity Controls:**
- **Decrease (-):** `Math.max(1, quantity - 1)` - Tối thiểu là 1
- **Increase (+):** `Math.min(stock, quantity + 1)` - Tối đa là stock

### **Actions:**
- `updateQuantity`: Cập nhật số lượng
- `removeFromCart`: Xóa sản phẩm khỏi giỏ

---

## 📝 Code Chi Tiết - Phần 6: Cart Summary (Checkout Form)

```javascript
<div className="cart-summary">
  <h2>Thông tin đơn hàng</h2>
  
  {/* Shipping Address */}
  <div className="form-group">
    <label>Địa chỉ giao hàng</label>
    <textarea
      value={shippingAddress}
      onChange={(e) => setShippingAddress(e.target.value)}
      rows="3"
      required
    />
  </div>
  
  {/* Payment Method */}
  <div className="form-group">
    <label>Phương thức thanh toán</label>
    <div style={{ padding: '10px', backgroundColor: '#f8f9fa' }}>
      <strong>Số dư ví ShopWeb</strong>
    </div>
  </div>
  
  {/* Balance Display */}
  <div className="summary-row">
    <span>Số dư ví ShopWeb:</span>
    <strong>{formatCurrency(user?.balance || 0)}</strong>
  </div>
  
  {/* Total Price */}
  <div className="summary-row">
    <span>Tổng tiền:</span>
    <span className="total-price">{formatCurrency(total)}</span>
  </div>
  
  {/* Actions */}
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
```

**Giải thích:**

### **Form Fields:**
- **Shipping Address:** Textarea để nhập địa chỉ
- **Payment Method:** Hiển thị "Số dư ví ShopWeb" (chỉ dùng ví)

### **Summary:**
- **Balance:** Số dư hiện tại
- **Total:** Tổng tiền đơn hàng

### **Actions:**
- **"Nạp thêm tiền":** Điều hướng đến `/wallet`
- **"Đặt hàng":** Gọi `handleCheckout` (disabled khi loading)

---

## 🎨 CSS (Cart.css)

### **Layout:**
```css
.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;  /* Items | Summary */
  gap: 30px;
}
```

### **Cart Item:**
```css
.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  /* Image | Info | Quantity | Total | Remove */
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### **Summary (Sticky):**
```css
.cart-summary {
  position: sticky;
  top: 100px;  /* Dính khi scroll */
  height: fit-content;
}
```

### **Responsive:**
```css
@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;  /* 1 cột trên mobile */
  }
}
```

---

## 💡 Flow Hoạt Động

1. **User vào trang Cart:** Hiển thị items từ Redux
2. **User cập nhật số lượng:** Click +/- → Dispatch `updateQuantity`
3. **User xóa sản phẩm:** Click "Xóa" → Dispatch `removeFromCart`
4. **User nhập địa chỉ:** Update `shippingAddress`
5. **User click "Đặt hàng":**
   - Validate địa chỉ
   - Dispatch `createOrder`
   - Cập nhật balance
   - Clear cart
   - Redirect về trang chủ

---

## 🔗 Dependencies

- **Redux:** `cartSlice`, `orderSlice`, `authSlice`
- **React Router:** `useNavigate`
- **Utils:** `formatCurrency`
- **Components:** `BackButton`

---

## ⚠️ Lưu Ý

1. **Balance Check:** Nên kiểm tra số dư đủ không (có thể thêm validation)
2. **Stock Check:** Nên kiểm tra stock còn đủ không trước khi đặt
3. **Loading State:** Disable button khi đang xử lý
4. **Error Handling:** Hiển thị lỗi rõ ràng

---

## ✅ Checklist Implementation

- [ ] Hiển thị danh sách items trong giỏ
- [ ] Update quantity (+/-)
- [ ] Remove item
- [ ] Tính tổng tiền
- [ ] Form địa chỉ giao hàng
- [ ] Hiển thị số dư ví
- [ ] Checkout logic (createOrder)
- [ ] Update balance sau checkout
- [ ] Clear cart sau checkout
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design

