# 💰 Wallet.js - Giải Thích Chi Tiết

## 📍 File: `src/pages/Wallet.js` + `Wallet.css`

## 🎯 Mục Đích

Trang **ví điện tử** cho phép:
- Xem số dư hiện tại
- **Nạp tiền** vào ví (tạo QR code VietQR)
- Xem lịch sử giao dịch (pending, approved, rejected)

---

## 📝 Code Chi Tiết - Phần 1: Imports & Setup

```javascript
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../store/slices/authSlice';
import { formatCurrency } from '../utils/currency';
import './Wallet.css';
import BackButton from '../components/common/BackButton';
```

**Giải thích:**
- `axios`: Gọi API để nạp tiền và lấy lịch sử
- `getCurrentUser`: Lấy thông tin user (có customer_code)
- `formatCurrency`: Format giá tiền

---

## 📝 Code Chi Tiết - Phần 2: Component Setup

```javascript
const Wallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector(state => state.auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [qrModal, setQrModal] = useState(false);
  const [pendingTopup, setPendingTopup] = useState(null);
  
  const statusLabel = {
    pending: 'Chờ duyệt',
    approved: 'Đã cộng',
    rejected: 'Từ chối'
  };

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };
```

**Giải thích:**
- `transactions`: Danh sách giao dịch
- `loading`: Đang tải lịch sử
- `submitting`: Đang submit nạp tiền
- `amount`: Số tiền muốn nạp
- `qrModal`: Hiển thị/ẩn modal QR code
- `pendingTopup`: Thông tin nạp tiền đang chờ xác nhận
- `statusLabel`: Map status sang tiếng Việt
- `authHeader`: Header cho API calls (có token)

---

## 📝 Code Chi Tiết - Phần 3: Fetch Transactions

```javascript
const fetchTransactions = async () => {
  try {
    setLoading(true);
    const response = await axios.get('/api/wallet', authHeader);
    setTransactions(response.data.transactions || []);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!token) {
    navigate('/login');
    return;
  }
  fetchTransactions();
}, [token, navigate]);
```

**Giải thích:**
- **fetchTransactions:** Gọi API `/api/wallet` để lấy lịch sử
- **useEffect:** Khi component mount:
  - Kiểm tra có token không (nếu không → redirect login)
  - Fetch transactions

---

## 📝 Code Chi Tiết - Phần 4: Handle Top Up (Tạo QR)

```javascript
const handleTopUp = (e) => {
  e.preventDefault();
  const value = parseFloat(amount);
  if (!value || value <= 0) {
    alert('Số tiền nạp phải lớn hơn 0');
    return;
  }
  setPendingTopup({ amount: value });
  setQrModal(true);
};
```

**Giải thích:**
- Validate số tiền > 0
- Set `pendingTopup` với số tiền
- Mở modal QR code

---

## 📝 Code Chi Tiết - Phần 5: Handle Confirm Transfer (QUAN TRỌNG)

```javascript
const handleConfirmTransfer = async () => {
  if (!pendingTopup) return;
  setSubmitting(true);
  try {
    // 1. Gửi yêu cầu nạp tiền
    const response = await axios.post('/api/wallet/topup', {
      amount: pendingTopup.amount,
      method: 'vietqr',
      note: user?.customer_code  // Mã khách hàng làm nội dung chuyển khoản
    }, authHeader);
    
    // 2. Trigger event để admin biết có yêu cầu mới
    window.dispatchEvent(new CustomEvent('newTopupRequest', { 
      detail: { 
        userId: user?.id,
        amount: pendingTopup.amount 
      }
    }));
    
    // 3. Trigger refresh cho Navbar admin (cập nhật chấm đỏ)
    window.dispatchEvent(new CustomEvent('pendingCountsUpdate', { 
      detail: { immediate: true }
    }));
    
    // 4. Refresh transactions
    await fetchTransactions();
    
    // 5. Reset form và đóng modal
    setAmount('');
    setQrModal(false);
    setPendingTopup(null);
    alert('Đã gửi yêu cầu nạp tiền, vui lòng chờ admin xác nhận!');
  } catch (error) {
    alert(error.response?.data?.message || 'Không thể nạp tiền');
  } finally {
    setSubmitting(false);
  }
};
```

**Giải thích từng bước:**

1. **Gửi yêu cầu:** POST `/api/wallet/topup` với:
   - `amount`: Số tiền
   - `method`: 'vietqr'
   - `note`: `customer_code` (mã khách hàng)

2. **Trigger Events:**
   - `newTopupRequest`: Thông báo admin có yêu cầu mới
   - `pendingCountsUpdate`: Cập nhật chấm đỏ trong Navbar admin

3. **Refresh:** Lấy lại danh sách transactions

4. **Reset:** Clear form và đóng modal

**Đây là logic chính:** Tạo yêu cầu nạp tiền và thông báo admin!

---

## 📝 Code Chi Tiết - Phần 6: QR Code URL

```javascript
const qrUrl = pendingTopup && user?.customer_code
  ? `https://img.vietqr.io/image/mbbank-2516999999999-compact2.png?amount=${encodeURIComponent(pendingTopup.amount)}&addInfo=${encodeURIComponent(user.customer_code)}&accountName=DANG%20TUAN%20ANH`
  : null;
```

**Giải thích:**
- Tạo URL QR code từ VietQR API
- Parameters:
  - `amount`: Số tiền
  - `addInfo`: Nội dung chuyển khoản (customer_code)
  - `accountName`: Tên tài khoản

---

## 📝 Code Chi Tiết - Phần 7: Render - Header & Balance

```javascript
<div className="wallet-header">
  <BackButton />
  <h1>Ví ShopWeb</h1>
  <div className="wallet-balance-card">
    <p>Số dư hiện tại</p>
    <strong>{formatCurrency(user?.balance || 0)}</strong>
  </div>
</div>
```

**Giải thích:**
- Hiển thị số dư hiện tại từ `user.balance`

---

## 📝 Code Chi Tiết - Phần 8: Render - Top Up Form

```javascript
<div className="wallet-card">
  <h2>Nạp tiền vào ví</h2>
  <form onSubmit={handleTopUp}>
    <div className="form-group">
      <label>Số tiền (VND)</label>
      <input
        type="number"
        min="10000"
        step="1000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
    </div>
    <div className="form-note">
      <p>Hệ thống sẽ tạo QR VietQR MB Bank. Nội dung chuyển khoản phải là <strong>{user?.customer_code || 'mã khách hàng'}</strong>.</p>
    </div>
    <button type="submit" className="btn btn-primary" disabled={submitting}>
      Tạo mã QR
    </button>
  </form>
</div>
```

**Giải thích:**
- Input số tiền (min: 10,000 VND)
- Lưu ý: Nội dung chuyển khoản phải là `customer_code`
- Submit → Mở modal QR

---

## 📝 Code Chi Tiết - Phần 9: Render - Transaction History

```javascript
<div className="wallet-card">
  <h2>Lịch sử giao dịch</h2>
  {loading ? (
    <div className="loading">Đang tải...</div>
  ) : transactions.length === 0 ? (
    <p>Chưa có giao dịch nào</p>
  ) : (
    <div className="wallet-history">
      {transactions.map((txn) => (
        <div key={txn.id} className="wallet-history-item">
          <div>
            <p className="wallet-history-amount">{formatCurrency(txn.amount)}</p>
            <p className="wallet-history-note">{txn.note || 'Nạp tiền ví'}</p>
          </div>
          <div className="wallet-history-meta">
            <span className="wallet-status" data-status={txn.status}>
              {statusLabel[txn.status] || txn.status}
            </span>
            <span className="wallet-method">{txn.method?.toUpperCase()}</span>
            <span>{new Date(txn.created_at).toLocaleString('vi-VN')}</span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
```

**Giải thích:**
- **Loading state:** "Đang tải..."
- **Empty state:** "Chưa có giao dịch nào"
- **Transaction item:**
  - Số tiền
  - Nội dung (note)
  - Status (pending/approved/rejected) với màu sắc
  - Method (VIETQR)
  - Ngày giờ

---

## 📝 Code Chi Tiết - Phần 10: Render - QR Modal

```javascript
{qrModal && pendingTopup && (
  <div className="modal-overlay" onClick={() => {
    if (submitting) return;
    setQrModal(false);
    setPendingTopup(null);
  }}>
    <div className="modal-content wallet-qr-modal" onClick={(e) => e.stopPropagation()}>
      <h2>Quét QR để nạp tiền</h2>
      <p>Số tiền: <strong>{formatCurrency(pendingTopup.amount)}</strong></p>
      <p>Nội dung chuyển khoản (ID khách hàng): <strong className="wallet-code">{user?.customer_code}</strong></p>
      {qrUrl && (
        <div className="wallet-qr-wrapper">
          <img src={qrUrl} alt="QR thanh toán" />
        </div>
      )}
      <div className="wallet-qr-actions">
        <button
          className="btn"
          onClick={() => {
            if (submitting) return;
            setQrModal(false);
            setPendingTopup(null);
          }}
          disabled={submitting}
        >
          Quay lại
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleConfirmTransfer} 
          disabled={submitting}
        >
          {submitting ? 'Đang xác nhận...' : 'Xác nhận đã chuyển'}
        </button>
      </div>
    </div>
  </div>
)}
```

**Giải thích:**
- **Modal overlay:** Click ngoài để đóng (trừ khi đang submit)
- **QR Code:** Hiển thị ảnh QR từ VietQR
- **Customer Code:** Hiển thị rõ để user copy
- **Actions:**
  - "Quay lại": Đóng modal
  - "Xác nhận đã chuyển": Gọi `handleConfirmTransfer`

---

## 🎨 CSS (Wallet.css)

### **Layout:**
```css
.wallet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
```

### **Status Badges:**
```css
.wallet-status[data-status="pending"] {
  background-color: #f0ad4e;  /* Vàng - Chờ duyệt */
}

.wallet-status[data-status="approved"] {
  background-color: #28a745;  /* Xanh - Đã cộng */
}

.wallet-status[data-status="rejected"] {
  background-color: #dc3545;  /* Đỏ - Từ chối */
}
```

### **QR Modal:**
```css
.wallet-qr-wrapper {
  margin: 20px auto;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
}

.wallet-qr-wrapper img {
  width: 280px;
  height: 280px;
  object-fit: contain;
}
```

---

## 💡 Flow Hoạt Động

1. **User vào trang Wallet:** Fetch transactions
2. **User nhập số tiền:** Ví dụ: 100,000
3. **User click "Tạo mã QR":** Mở modal với QR code
4. **User quét QR và chuyển khoản:** Ngoài app (mobile banking)
5. **User click "Xác nhận đã chuyển":**
   - Gửi yêu cầu nạp tiền đến server
   - Trigger events để admin biết
   - Refresh transactions
   - Đóng modal
6. **Admin duyệt:** Status chuyển từ "pending" → "approved"
7. **Balance được cộng:** Tự động cập nhật (qua event)

---

## 🔗 Dependencies

- **Redux:** `authSlice` (user, token)
- **API:** `/api/wallet`, `/api/wallet/topup`
- **External:** VietQR API (QR code generation)
- **Utils:** `formatCurrency`
- **Components:** `BackButton`

---

## ⚠️ Lưu Ý

1. **Customer Code:** Phải đúng trong nội dung chuyển khoản
2. **Pending Status:** Chờ admin duyệt mới được cộng tiền
3. **Events:** Trigger events để admin cập nhật real-time
4. **QR Code:** Dùng VietQR API (có thể thay đổi bank/account)

---

## ✅ Checklist Implementation

- [ ] Hiển thị số dư ví
- [ ] Form nạp tiền
- [ ] Tạo QR code (VietQR)
- [ ] Modal QR code
- [ ] Xác nhận đã chuyển khoản
- [ ] Gửi yêu cầu nạp tiền
- [ ] Hiển thị lịch sử giao dịch
- [ ] Status badges (pending/approved/rejected)
- [ ] Trigger events cho admin
- [ ] Loading states
- [ ] Error handling

