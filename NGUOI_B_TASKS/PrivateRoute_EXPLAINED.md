# 🔒 PrivateRoute.js - Giải Thích Chi Tiết

## 📍 File: `src/components/routing/PrivateRoute.js`

## 🎯 Mục Đích

Component **bảo vệ routes** cho user (không phải admin):
- Chỉ cho phép user đã đăng nhập truy cập
- Redirect đến `/login` nếu chưa đăng nhập
- Redirect đến `/admin` nếu là admin (nếu `allowAdmin = false`)

---

## 📝 Code Chi Tiết - Toàn Bộ

```javascript
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowAdmin = true }) => {
  const { isAuthenticated, user, token, loading } = useSelector(state => state.auth);

  // Kiểm tra token trong localStorage để biết có đang đăng nhập không
  const hasToken = token || localStorage.getItem('token');

  // Nếu có token nhưng chưa xác thực xong (đang loading hoặc chưa authenticated), chờ đợi
  if (hasToken && (loading || !isAuthenticated)) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>Đang tải...</div>;
  }

  // Chỉ redirect khi chắc chắn không có token hoặc đã load xong nhưng không authenticated
  if (!hasToken || (!loading && !isAuthenticated)) {
    return <Navigate to="/login" />;
  }

  if (!allowAdmin && user?.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default PrivateRoute;
```

---

## 🔍 Giải Thích Từng Phần

### **1. Imports**
```javascript
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
```
- `useSelector`: Lấy state từ Redux
- `Navigate`: Component để redirect

### **2. Component Props**
```javascript
const PrivateRoute = ({ children, allowAdmin = true }) => {
```
- **children:** Component/page cần bảo vệ
- **allowAdmin:** Cho phép admin truy cập không (mặc định: `true`)

### **3. Get Auth State**
```javascript
const { isAuthenticated, user, token, loading } = useSelector(state => state.auth);
```
- `isAuthenticated`: Đã xác thực chưa
- `user`: Thông tin user (có `role`)
- `token`: JWT token
- `loading`: Đang tải authentication

### **4. Check Token**
```javascript
const hasToken = token || localStorage.getItem('token');
```
- Kiểm tra token từ Redux hoặc localStorage
- **Tại sao?** Khi refresh trang, Redux state có thể reset, nhưng token vẫn còn trong localStorage

### **5. Loading State (QUAN TRỌNG)**
```javascript
if (hasToken && (loading || !isAuthenticated)) {
  return <div>Đang tải...</div>;
}
```
**Giải thích:**
- **Nếu có token nhưng:**
  - `loading = true`: Đang fetch user data
  - `!isAuthenticated`: Chưa xác thực xong
- **→ Hiển thị "Đang tải..."** thay vì redirect ngay

**Tại sao cần?**
- Khi refresh trang, Redux state reset
- Cần thời gian để fetch user data từ API
- Nếu redirect ngay → User bị đá về login dù đã đăng nhập

### **6. Not Authenticated**
```javascript
if (!hasToken || (!loading && !isAuthenticated)) {
  return <Navigate to="/login" />;
}
```
**Giải thích:**
- **Redirect nếu:**
  - Không có token (`!hasToken`)
  - HOẶC đã load xong (`!loading`) nhưng không authenticated (`!isAuthenticated`)

**Tại sao check `!loading`?**
- Tránh redirect khi đang loading
- Chỉ redirect khi chắc chắn không authenticated

### **7. Admin Check**
```javascript
if (!allowAdmin && user?.role === 'admin') {
  return <Navigate to="/admin" />;
}
```
**Giải thích:**
- **Nếu `allowAdmin = false`** (chỉ cho user thường):
  - Và user là admin → Redirect đến `/admin`

**Ví dụ:**
- `/cart`: `allowAdmin={false}` → Admin không vào được
- `/profile`: `allowAdmin={true}` → Admin vào được

### **8. Allow Access**
```javascript
return children;
```
- Nếu pass tất cả checks → Render `children` (page)

---

## 💡 Cách Sử Dụng

### **Ví dụ 1: Cart (chỉ user thường)**
```javascript
<Route 
  path="/cart" 
  element={
    <PrivateRoute allowAdmin={false}>
      <Cart />
    </PrivateRoute>
  } 
/>
```

### **Ví dụ 2: Profile (cho cả admin)**
```javascript
<Route 
  path="/profile" 
  element={
    <PrivateRoute allowAdmin={true}>
      <Profile />
    </PrivateRoute>
  } 
/>
```

### **Ví dụ 3: Wallet (chỉ user thường)**
```javascript
<Route 
  path="/wallet" 
  element={
    <PrivateRoute allowAdmin={false}>
      <Wallet />
    </PrivateRoute>
  } 
/>
```

---

## 🔄 Flow Hoạt Động

### **Scenario 1: User đã đăng nhập**
1. User vào `/cart`
2. `hasToken = true`, `isAuthenticated = true`
3. Pass tất cả checks
4. Render `<Cart />`

### **Scenario 2: User chưa đăng nhập**
1. User vào `/cart`
2. `hasToken = false`
3. Redirect đến `/login`

### **Scenario 3: Refresh trang**
1. User refresh `/cart`
2. Redux state reset → `isAuthenticated = false`, `loading = false`
3. Nhưng `hasToken = true` (từ localStorage)
4. Check: `hasToken && (loading || !isAuthenticated)`
   - `true && (false || true)` = `true`
5. Hiển thị "Đang tải..."
6. App.js fetch user data → `isAuthenticated = true`
7. Re-render → Pass checks → Render `<Cart />`

### **Scenario 4: Admin vào Cart**
1. Admin vào `/cart` (với `allowAdmin={false}`)
2. `user.role = 'admin'`
3. Check: `!allowAdmin && user?.role === 'admin'`
   - `true && true` = `true`
4. Redirect đến `/admin`

---

## ⚠️ Lưu Ý

1. **localStorage Check:**
   - Cần check localStorage để tránh redirect khi refresh
   - Token có thể còn trong localStorage nhưng Redux state reset

2. **Loading State:**
   - Phải chờ loading xong mới redirect
   - Hiển thị "Đang tải..." trong lúc chờ

3. **allowAdmin:**
   - `true`: Cho phép admin (mặc định)
   - `false`: Chỉ cho user thường

4. **Optional Chaining:**
   - Dùng `user?.role` để tránh lỗi nếu `user = null`

---

## 🔗 Dependencies

- **Redux:** `authSlice` (isAuthenticated, user, token, loading)
- **React Router:** `Navigate`
- **localStorage:** Để check token khi refresh

---

## ✅ Checklist Implementation

- [ ] Check token từ Redux và localStorage
- [ ] Loading state (chờ authentication)
- [ ] Redirect nếu chưa đăng nhập
- [ ] Admin check (với allowAdmin)
- [ ] Render children nếu pass

---

## 🆚 So Sánh với AdminRoute

| Feature | PrivateRoute | AdminRoute |
|---------|--------------|------------|
| **Cho phép user** | ✅ | ❌ |
| **Cho phép admin** | Tùy `allowAdmin` | ✅ |
| **Redirect nếu user** | ❌ | ✅ (về `/`) |
| **Redirect nếu admin** | Tùy `allowAdmin` | ❌ |

---

## 📝 Tóm Tắt Logic

```
1. Có token? 
   → Không → Redirect /login
   → Có → Bước 2

2. Đang loading hoặc chưa authenticated?
   → Có → Hiển thị "Đang tải..."
   → Không → Bước 3

3. Đã authenticated?
   → Không → Redirect /login
   → Có → Bước 4

4. allowAdmin = false và user là admin?
   → Có → Redirect /admin
   → Không → Render children ✅
```

