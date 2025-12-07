# 📦 MyOrders.js - Giải Thích Chi Tiết

## 📍 File: `src/pages/MyOrders.js` + `MyOrders.css`

## 🎯 Mục Đích

Trang **lịch sử đơn hàng** cho phép:
- Xem danh sách đơn hàng của user
- Xem chi tiết từng đơn hàng (modal)
- Hiển thị trạng thái đơn hàng (pending, processing, shipped, completed, cancelled)

---

## 📝 Code Chi Tiết - Phần 1: Imports & Setup

```javascript
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../store/slices/orderSlice';
import { formatCurrency } from '../utils/currency';
import BackButton from '../components/common/BackButton';
import './MyOrders.css';
```

**Giải thích:**
- `fetchMyOrders`: Action Redux để lấy danh sách đơn hàng
- `axios`: Gọi API để lấy chi tiết đơn hàng
- `formatCurrency`: Format giá tiền

---

## 📝 Code Chi Tiết - Phần 2: Component Setup

```javascript
const MyOrders = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.orders);
  const { token } = useSelector(state => state.auth);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);
```

**Giải thích:**
- `items`: Danh sách đơn hàng từ Redux
- `loading`: Đang tải danh sách
- `selectedOrder`: Đơn hàng được chọn để xem chi tiết
- `detailLoading`: Đang tải chi tiết đơn hàng
- **useEffect:** Fetch danh sách khi component mount

---

## 📝 Code Chi Tiết - Phần 3: Open Detail (Xem Chi Tiết)

```javascript
const openDetail = async (orderId) => {
  try {
    setDetailLoading(true);
    const response = await axios.get(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSelectedOrder(response.data.order);
  } catch (error) {
    alert(error.response?.data?.message || 'Không thể tải chi tiết đơn hàng');
  } finally {
    setDetailLoading(false);
  }
};

const closeDetail = () => setSelectedOrder(null);
```

**Giải thích:**
- **openDetail:** 
  - Gọi API `/api/orders/${orderId}` để lấy chi tiết
  - Set `selectedOrder` để hiển thị modal
- **closeDetail:** Đóng modal (set `selectedOrder = null`)

---

## 📝 Code Chi Tiết - Phần 4: Render - Loading & Empty States

```javascript
{loading ? (
  <div className="loading">Đang tải...</div>
) : items.length === 0 ? (
  <div className="empty-message">
    <p>Bạn chưa có đơn hàng nào</p>
  </div>
) : (
  // Table với danh sách đơn hàng
)}
```

**Giải thích:**
- **Loading:** "Đang tải..."
- **Empty:** "Bạn chưa có đơn hàng nào"

---

## 📝 Code Chi Tiết - Phần 5: Render - Orders Table

```javascript
<div className="orders-history-table">
  <table className="table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Tổng tiền</th>
        <th>Trạng thái</th>
        <th>Thanh toán</th>
        <th>Ngày đặt</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {items.map(order => (
        <tr key={order.id}>
          <td>#{order.id}</td>
          <td>{formatCurrency(order.total)}</td>
          <td>
            <span className={`order-badge ${order.status}`}>
              {order.status}
            </span>
          </td>
          <td>Số dư ví</td>
          <td>{new Date(order.created_at).toLocaleString('vi-VN')}</td>
          <td>
            <button
              className="btn btn-secondary"
              onClick={() => openDetail(order.id)}
              disabled={detailLoading}
            >
              Xem
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

**Giải thích:**

### **Table Columns:**
- **ID:** `#123`
- **Tổng tiền:** Format currency
- **Trạng thái:** Badge với màu sắc (pending, processing, shipped, completed, cancelled)
- **Thanh toán:** "Số dư ví" (chỉ dùng ví)
- **Ngày đặt:** Format datetime Việt Nam
- **Action:** Button "Xem" để mở modal chi tiết

### **Status Badge:**
- Class `order-badge ${order.status}` để style theo trạng thái

---

## 📝 Code Chi Tiết - Phần 6: Render - Order Detail Modal

```javascript
{selectedOrder && (
  <div className="modal-overlay" onClick={closeDetail}>
    <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="modal-header">
        <h2>Đơn hàng #{selectedOrder.id}</h2>
        <p>Đặt lúc: {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</p>
      </div>
      
      {/* Shipping Address */}
      <div className="order-detail-section">
        <h3>Địa chỉ giao hàng</h3>
        <p>{selectedOrder.shipping_address}</p>
      </div>
      
      {/* Order Items */}
      <div className="order-detail-section order-detail-items">
        <h3>Sản phẩm</h3>
        <div className="admin-table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items?.map(item => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="order-items-total">
          <span>Tổng cộng: {formatCurrency(selectedOrder.total)}</span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="modal-actions">
        <button className="btn" onClick={closeDetail}>Đóng</button>
      </div>
    </div>
  </div>
)}
```

**Giải thích:**

### **Modal Structure:**
1. **Header:** ID đơn hàng + ngày đặt
2. **Shipping Address:** Địa chỉ giao hàng
3. **Order Items Table:**
   - Tên sản phẩm
   - Số lượng
   - Đơn giá
   - Thành tiền (price × quantity)
4. **Total:** Tổng cộng
5. **Actions:** Button "Đóng"

### **Modal Overlay:**
- Click ngoài modal → Đóng (`closeDetail`)
- Click trong modal → Không đóng (`e.stopPropagation()`)

---

## 🎨 CSS (MyOrders.css)

### **Table:**
```css
.orders-history-table {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### **Status Badges:**
```css
.order-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
  color: #fff;
}

.order-badge.pending { background: #ffc107; color: #000; }  /* Vàng */
.order-badge.processing { background: #17a2b8; }  /* Xanh dương */
.order-badge.shipped { background: #007bff; }  /* Xanh */
.order-badge.completed { background: #28a745; }  /* Xanh lá */
.order-badge.cancelled { background: #dc3545; }  /* Đỏ */
```

### **Modal:**
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content.modal-large {
  max-width: 900px;  /* Modal lớn hơn */
}
```

---

## 💡 Flow Hoạt Động

1. **User vào trang MyOrders:** Fetch danh sách đơn hàng
2. **User xem danh sách:** Table với các đơn hàng
3. **User click "Xem":** Mở modal chi tiết
4. **Fetch order detail:** Gọi API `/api/orders/${id}`
5. **Hiển thị chi tiết:**
   - Thông tin đơn hàng
   - Địa chỉ giao hàng
   - Danh sách sản phẩm
   - Tổng tiền
6. **User click "Đóng":** Đóng modal

---

## 🔗 Dependencies

- **Redux:** `orderSlice` (fetchMyOrders)
- **API:** `/api/orders/${id}` (chi tiết đơn hàng)
- **Utils:** `formatCurrency`
- **Components:** `BackButton`

---

## ⚠️ Lưu Ý

1. **Order Items:** Phải có `selectedOrder.items` (array)
2. **Status:** Có thể thêm logic để user hủy đơn (nếu pending)
3. **Real-time:** Có thể thêm polling để cập nhật status tự động

---

## ✅ Checklist Implementation

- [ ] Fetch danh sách đơn hàng
- [ ] Hiển thị table với orders
- [ ] Status badges với màu sắc
- [ ] Button "Xem" chi tiết
- [ ] Fetch order detail
- [ ] Modal hiển thị chi tiết
- [ ] Hiển thị địa chỉ giao hàng
- [ ] Hiển thị danh sách sản phẩm
- [ ] Tính tổng tiền
- [ ] Loading states
- [ ] Empty state
- [ ] Error handling

