# 🔙 BackButton.js - Giải Thích Chi Tiết

## 📍 File: `src/components/common/BackButton.js`

## 🎯 Mục Đích

Component này tạo một nút "Quay lại" để điều hướng người dùng về trang trước hoặc trang mặc định.

---

## 📝 Code Chi Tiết

```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ label = 'Quay lại', fallback = '/' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button type="button" className="btn btn-outline-secondary back-button" onClick={handleBack}>
      ← {label}
    </button>
  );
};

export default BackButton;
```

---

## 🔍 Giải Thích Từng Phần

### **1. Import Statements**
```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';
```
- `React`: Cần thiết cho React component
- `useNavigate`: Hook từ React Router để điều hướng

### **2. Component Function**
```javascript
const BackButton = ({ label = 'Quay lại', fallback = '/' }) => {
```
- **Props:**
  - `label`: Text hiển thị trên nút (mặc định: "Quay lại")
  - `fallback`: Route mặc định nếu không có lịch sử (mặc định: "/")

### **3. useNavigate Hook**
```javascript
const navigate = useNavigate();
```
- Lấy hàm `navigate` để điều hướng

### **4. handleBack Function**
```javascript
const handleBack = () => {
  if (window.history.length > 2) {
    navigate(-1);  // Quay lại trang trước
  } else {
    navigate(fallback);  // Đi đến trang mặc định
  }
};
```
- **Logic:**
  - Nếu có lịch sử (history.length > 2): quay lại trang trước với `navigate(-1)`
  - Nếu không: điều hướng đến `fallback` route

### **5. Render**
```javascript
return (
  <button type="button" className="btn btn-outline-secondary back-button" onClick={handleBack}>
    ← {label}
  </button>
);
```
- Nút với:
  - `type="button"`: Không submit form
  - `className`: Styles từ CSS
  - `onClick={handleBack}`: Xử lý khi click
  - `← {label}`: Hiển thị mũi tên và label

---

## 💡 Cách Sử Dụng

### **Ví dụ 1: Sử dụng mặc định**
```javascript
<BackButton />
// Hiển thị: "← Quay lại"
// Fallback: "/"
```

### **Ví dụ 2: Tùy chỉnh label**
```javascript
<BackButton label="Về trang chủ" />
// Hiển thị: "← Về trang chủ"
```

### **Ví dụ 3: Tùy chỉnh fallback**
```javascript
<BackButton fallback="/products" />
// Nếu không có history, sẽ đi đến "/products"
```

### **Ví dụ 4: Đầy đủ**
```javascript
<BackButton label="Quay lại danh sách" fallback="/products" />
```

---

## 🎨 CSS Classes Cần Có

Component sử dụng các class:
- `.btn`: Base button style
- `.btn-outline-secondary`: Secondary button style
- `.back-button`: Custom style cho back button

---

## ⚠️ Lưu Ý

1. **History Length Check:**
   - `window.history.length > 2` kiểm tra có trang trước không
   - Nếu chỉ có 1 trang (trang hiện tại), sẽ dùng fallback

2. **Fallback Route:**
   - Nên đặt fallback hợp lý (ví dụ: "/products" cho ProductDetail)

3. **Reusability:**
   - Component này có thể dùng ở nhiều nơi với props khác nhau

---

## 🔗 Liên Kết

- Sử dụng trong: ProductDetail, Cart, Wallet, MyOrders
- Dependencies: React Router DOM

