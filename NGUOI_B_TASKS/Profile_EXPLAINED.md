# 👤 Profile.js - Giải Thích Chi Tiết

## 📍 File: `src/pages/Profile.js`

## 🎯 Mục Đích

Trang **thông tin cá nhân** cho phép:
- Xem thông tin user (mã khách hàng, tên, email, phone, địa chỉ, số dư)
- **Cập nhật thông tin** (tên, email, phone, địa chỉ)
- **Đổi mật khẩu** (tùy chọn)

---

## 📝 Code Chi Tiết - Phần 1: Imports & Setup

```javascript
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser, updateProfile } from '../store/slices/authSlice';
import './auth/Auth.css';
```

**Giải thích:**
- `getCurrentUser`: Lấy thông tin user hiện tại
- `updateProfile`: **Action quan trọng** - Cập nhật profile
- Dùng CSS từ `Auth.css` (form styles)

---

## 📝 Code Chi Tiết - Phần 2: Component Setup

```javascript
const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
```

**Giải thích:**
- `user`: Thông tin user từ Redux
- `loading`: Đang tải user
- `error`: Lỗi (nếu có)
- `formData`: State của form (tất cả fields)
- `submitting`: Đang submit form
- `successMessage`: Thông báo thành công

---

## 📝 Code Chi Tiết - Phần 3: Load User Data

```javascript
useEffect(() => {
  if (user) {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      password: '',
      confirmPassword: ''
    });
  } else {
    dispatch(getCurrentUser());
  }
}, [user, dispatch]);
```

**Giải thích:**
- **Nếu có user:** Fill form với data từ user
- **Nếu chưa có user:** Fetch user data
- **Password fields:** Luôn để trống (chỉ điền khi muốn đổi)

---

## 📝 Code Chi Tiết - Phần 4: Handle Change

```javascript
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
  setSuccessMessage('');  // Clear success message khi user thay đổi
};
```

**Giải thích:**
- Update `formData` với giá trị mới
- Clear success message khi user edit

---

## 📝 Code Chi Tiết - Phần 5: Handle Submit (QUAN TRỌNG)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setSuccessMessage('');
  
  // 1. Validation: Kiểm tra mật khẩu xác nhận
  if (formData.password && formData.password !== formData.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp');
    setSubmitting(false);
    return;
  }

  try {
    // 2. Chuẩn bị dữ liệu update
    const updateData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    };

    // 3. Chỉ thêm password nếu user muốn đổi
    if (formData.password) {
      updateData.password = formData.password;
    }

    // 4. Dispatch updateProfile
    await dispatch(updateProfile(updateData)).unwrap();
    
    // 5. Success: Hiển thị thông báo và reset password fields
    setSuccessMessage('Cập nhật thông tin thành công!');
    setFormData({
      ...formData,
      password: '',
      confirmPassword: ''
    });
  } catch (error) {
    alert(error || 'Có lỗi xảy ra khi cập nhật thông tin');
  } finally {
    setSubmitting(false);
  }
};
```

**Giải thích từng bước:**

1. **Validation:** Kiểm tra password và confirmPassword khớp không
2. **Prepare Data:** Chỉ gửi các field cần update
3. **Password:** Chỉ thêm password nếu user điền (muốn đổi)
4. **Update:** Dispatch `updateProfile` (async action)
5. **Success:** Hiển thị thông báo và reset password fields
6. **Error:** Alert lỗi

**Đây là logic chính:** Cập nhật thông tin user!

---

## 📝 Code Chi Tiết - Phần 6: Loading State

```javascript
if (loading && !user) {
  return (
    <div className="main-content">
      <div className="auth-container">
        <div className="loading">Đang tải...</div>
      </div>
    </div>
  );
}
```

**Giải thích:**
- Hiển thị "Đang tải..." khi chưa có user data

---

## 📝 Code Chi Tiết - Phần 7: Render - Form

```javascript
return (
  <div className="main-content">
    <div className="auth-container">
      <div className="auth-card">
        <h2>Thông tin cá nhân</h2>
        
        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Success Message */}
        {successMessage && (
          <div style={{ 
            background: '#d4edda', 
            color: '#155724', 
            padding: '12px', 
            borderRadius: '4px', 
            marginBottom: '20px' 
          }}>
            {successMessage}
          </div>
        )}
        
        {user && (
          <>
            {/* Customer Code (Read-only) */}
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Mã khách hàng</label>
              <input type="text" value={user.customer_code || ''} disabled />
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Email */}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Phone */}
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              {/* Address */}
              <div className="form-group">
                <label>Địa chỉ</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              
              {/* New Password (Optional) */}
              <div className="form-group">
                <label>Mật khẩu mới (để trống nếu không đổi)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                />
              </div>
              
              {/* Confirm Password (Conditional) */}
              {formData.password && (
                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength="6"
                  />
                </div>
              )}
              
              {/* Balance (Read-only) */}
              <div className="form-group">
                <label>Số dư</label>
                <input 
                  type="text" 
                  value={new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(user.balance || 0)} 
                  disabled 
                />
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '10px' }}
                disabled={submitting}
              >
                {submitting ? 'Đang lưu...' : 'Cập nhật thông tin'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  </div>
);
```

**Giải thích:**

### **Form Fields:**

1. **Customer Code (Read-only):**
   - Disabled, không thể sửa
   - Hiển thị `user.customer_code`

2. **Name, Email, Phone, Address:**
   - Editable
   - Required: name, email

3. **Password (Optional):**
   - Chỉ hiển thị khi user điền password
   - `minLength="6"`

4. **Confirm Password (Conditional):**
   - Chỉ hiển thị khi có password
   - Validate khớp với password

5. **Balance (Read-only):**
   - Disabled
   - Format currency VND

6. **Submit Button:**
   - Disabled khi `submitting`
   - Text: "Đang lưu..." hoặc "Cập nhật thông tin"

---

## 🎨 CSS

Dùng CSS từ `Auth.css` (form styles chung):
- `.auth-container`: Container
- `.auth-card`: Card wrapper
- `.form-group`: Form field
- `.error-message`: Error text
- `.btn`: Button styles

---

## 💡 Flow Hoạt Động

1. **User vào trang Profile:** Fetch user data
2. **Form được fill:** Với data từ user
3. **User chỉnh sửa:** Update `formData`
4. **User đổi mật khẩu (optional):** Điền password + confirmPassword
5. **User click "Cập nhật thông tin":**
   - Validate password (nếu có)
   - Dispatch `updateProfile`
   - Success: Hiển thị thông báo, reset password fields
   - Error: Alert lỗi

---

## 🔗 Dependencies

- **Redux:** `authSlice` (getCurrentUser, updateProfile)
- **CSS:** `Auth.css` (form styles)

---

## ⚠️ Lưu Ý

1. **Password Optional:** Chỉ gửi password nếu user điền
2. **Validation:** Kiểm tra password khớp trước khi submit
3. **Read-only Fields:** Customer code và balance không thể sửa
4. **Success Message:** Tự động clear khi user edit

---

## ✅ Checklist Implementation

- [ ] Fetch user data
- [ ] Fill form với user data
- [ ] Form fields (name, email, phone, address)
- [ ] Password fields (optional, conditional)
- [ ] Validation (password match)
- [ ] Update profile logic
- [ ] Success message
- [ ] Error handling
- [ ] Loading states
- [ ] Read-only fields (customer_code, balance)

