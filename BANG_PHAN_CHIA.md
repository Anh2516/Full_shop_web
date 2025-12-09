# 📋 BẢNG PHÂN CHIA FILES - 3 NGƯỜI

## 👤 NGƯỜI 1: PUBLIC PAGES

| STT | File Path | Loại | Mô tả |
|-----|-----------|------|-------|
| 1 | `pages/Home.js` | JS | Trang chủ |
| 2 | `pages/Home.css` | CSS | Styles trang chủ |
| 3 | `pages/Products.js` | JS | Danh sách sản phẩm |
| 4 | `pages/Products.css` | CSS | Styles danh sách |
| 5 | `pages/ProductDetail.js` | JS | Chi tiết sản phẩm |
| 6 | `pages/ProductDetail.css` | CSS | Styles chi tiết |
| 7 | `components/layout/Navbar.js` | JS | Thanh điều hướng |
| 8 | `components/layout/Navbar.css` | CSS | Styles navbar |

**Tổng: 8 files (4 JS + 4 CSS)**

---

## 👤 NGƯỜI 2: USER PAGES

| STT | File Path | Loại | Mô tả |
|-----|-----------|------|-------|
| 1 | `pages/auth/Login.js` | JS | Trang đăng nhập |
| 2 | `pages/auth/Register.js` | JS | Trang đăng ký |
| 3 | `pages/auth/Auth.css` | CSS | Styles auth |
| 4 | `pages/Cart.js` | JS | Giỏ hàng |
| 5 | `pages/Cart.css` | CSS | Styles giỏ hàng |
| 6 | `pages/Wallet.js` | JS | Ví điện tử |
| 7 | `pages/Wallet.css` | CSS | Styles ví |
| 8 | `pages/MyOrders.js` | JS | Lịch sử đơn hàng |
| 9 | `pages/MyOrders.css` | CSS | Styles đơn hàng |
| 10 | `pages/Profile.js` | JS | Thông tin cá nhân |
| 11 | `components/routing/PrivateRoute.js` | JS | Bảo vệ routes |

**Tổng: 11 files (8 JS + 3 CSS)**

---

## 👤 NGƯỜI 3: ADMIN PAGES

| STT | File Path | Loại | Mô tả |
|-----|-----------|------|-------|
| 1 | `pages/admin/Dashboard.js` | JS | Dashboard admin |
| 2 | `pages/admin/Products.js` | JS | Quản lý sản phẩm |
| 3 | `pages/admin/Orders.js` | JS | Quản lý đơn hàng |
| 4 | `pages/admin/Users.js` | JS | Quản lý người dùng |
| 5 | `pages/admin/Inventory.js` | JS | Quản lý kho |
| 6 | `pages/admin/Admin.css` | CSS | Styles admin |
| 7 | `components/charts/SimpleLineChart.js` | JS | Biểu đồ đường |
| 8 | `components/charts/SimpleBarChart.js` | JS | Biểu đồ cột |
| 9 | `components/charts/Chart.css` | CSS | Styles charts |
| 10 | `components/routing/AdminRoute.js` | JS | Bảo vệ admin routes |

**Tổng: 10 files (8 JS + 2 CSS)**

---

## 🔄 SHARED FILES (Cả 3 người - KHÔNG SỬA TÙY TIỆN)

| STT | File Path | Loại | Ghi chú |
|-----|-----------|------|---------|
| 1 | `App.js` | JS | Routing chính - cần phối hợp |
| 2 | `App.css` | CSS | Base styles |
| 3 | `index.js` | JS | Entry point |
| 4 | `index.css` | CSS | Global styles |
| 5 | `store/store.js` | JS | Redux config |
| 6 | `store/slices/authSlice.js` | JS | Auth state |
| 7 | `store/slices/productSlice.js` | JS | Products state |
| 8 | `store/slices/cartSlice.js` | JS | Cart state |
| 9 | `store/slices/orderSlice.js` | JS | Orders state |
| 10 | `components/common/Icon.js` | JS | Icon component |
| 11 | `components/common/BackButton.js` | JS | Back button |
| 12 | `utils/currency.js` | JS | Format currency |

**Tổng: 12 files (11 JS + 1 CSS)**

---

## 📊 TỔNG KẾT

| Người | JS Files | CSS Files | Tổng |
|-------|----------|-----------|------|
| **NGƯỜI 1** | 4 | 4 | **8 files** |
| **NGƯỜI 2** | 8 | 3 | **11 files** |
| **NGƯỜI 3** | 8 | 2 | **10 files** |
| **SHARED** | 11 | 1 | **12 files** |
| **TỔNG** | **31** | **10** | **41 files** |

---

## ⚠️ LƯU Ý

1. **Mỗi người chỉ sửa files của mình**
2. **Phối hợp khi sửa:** `App.js`, `Navbar.js`
3. **KHÔNG sửa Redux slices** mà không thông báo
4. **Commit message:** `[Person1/Person2/Person3] Description`

---

📖 **Xem chi tiết:** `PHAN_CHIA_FILES.md`

