# 📁 PHÂN CHIA FILES CODE CHO 3 NGƯỜI

## 👤 **NGƯỜI 1: PUBLIC PAGES (Trang Công Khai)**

### ✅ **Files phụ trách:**

```
client/src/
├── pages/
│   ├── Home.js                    ✅ NGƯỜI 1
│   ├── Home.css                   ✅ NGƯỜI 1
│   ├── Products.js                ✅ NGƯỜI 1
│   ├── Products.css               ✅ NGƯỜI 1
│   ├── ProductDetail.js           ✅ NGƯỜI 1
│   └── ProductDetail.css          ✅ NGƯỜI 1
│
└── components/
    └── layout/
        ├── Navbar.js              ✅ NGƯỜI 1 (cần phối hợp với người 2, 3)
        └── Navbar.css             ✅ NGƯỜI 1
```

### 📝 **Chi tiết từng file:**

| File | Mô tả | Công việc |
|------|-------|-----------|
| `pages/Home.js` | Trang chủ | Hero section, featured products, features list |
| `pages/Home.css` | Styles trang chủ | CSS cho hero, products grid, animations |
| `pages/Products.js` | Danh sách sản phẩm | List products, filter, search, pagination |
| `pages/Products.css` | Styles danh sách | CSS cho product grid, filter bar |
| `pages/ProductDetail.js` | Chi tiết sản phẩm | Hiển thị thông tin, images, add to cart |
| `pages/ProductDetail.css` | Styles chi tiết | CSS cho product detail, image gallery |
| `components/layout/Navbar.js` | Thanh điều hướng | Logo, menu links, user menu, dropdown |
| `components/layout/Navbar.css` | Styles navbar | CSS cho navbar, responsive menu |

### 🔗 **Dependencies cần dùng:**
- `store/slices/productSlice.js` (để fetch products)
- `utils/currency.js` (format giá)
- `components/common/Icon.js` (icons)

---

## 👤 **NGƯỜI 2: USER PAGES (Trang Người Dùng)**

### ✅ **Files phụ trách:**

```
client/src/
├── pages/
│   ├── auth/
│   │   ├── Login.js               ✅ NGƯỜI 2
│   │   ├── Register.js             ✅ NGƯỜI 2
│   │   └── Auth.css                ✅ NGƯỜI 2
│   │
│   ├── Cart.js                    ✅ NGƯỜI 2
│   ├── Cart.css                   ✅ NGƯỜI 2
│   ├── Wallet.js                  ✅ NGƯỜI 2
│   ├── Wallet.css                 ✅ NGƯỜI 2
│   ├── MyOrders.js                ✅ NGƯỜI 2
│   ├── MyOrders.css               ✅ NGƯỜI 2
│   └── Profile.js                 ✅ NGƯỜI 2
│
└── components/
    └── routing/
        └── PrivateRoute.js        ✅ NGƯỜI 2
```

### 📝 **Chi tiết từng file:**

| File | Mô tả | Công việc |
|------|-------|-----------|
| `pages/auth/Login.js` | Trang đăng nhập | Form login, validation, error handling |
| `pages/auth/Register.js` | Trang đăng ký | Form register, validation, submit |
| `pages/auth/Auth.css` | Styles auth | CSS cho login/register forms |
| `pages/Cart.js` | Giỏ hàng | Hiển thị cart items, update quantity, remove |
| `pages/Cart.css` | Styles giỏ hàng | CSS cho cart table, buttons |
| `pages/Wallet.js` | Ví điện tử | Form nạp tiền, lịch sử giao dịch |
| `pages/Wallet.css` | Styles ví | CSS cho wallet form, transaction list |
| `pages/MyOrders.js` | Lịch sử đơn hàng | Hiển thị orders, chi tiết order |
| `pages/MyOrders.css` | Styles đơn hàng | CSS cho orders list, order detail |
| `pages/Profile.js` | Thông tin cá nhân | Hiển thị và chỉnh sửa profile |
| `components/routing/PrivateRoute.js` | Bảo vệ routes | Kiểm tra authentication, redirect |

### 🔗 **Dependencies cần dùng:**
- `store/slices/authSlice.js` (authentication)
- `store/slices/cartSlice.js` (cart management)
- `store/slices/orderSlice.js` (orders)
- `utils/currency.js` (format giá)
- `components/layout/Navbar.js` (từ người 1)

---

## 👤 **NGƯỜI 3: ADMIN PAGES (Trang Quản Trị)**

### ✅ **Files phụ trách:**

```
client/src/
├── pages/
│   └── admin/
│       ├── Dashboard.js            ✅ NGƯỜI 3
│       ├── Products.js             ✅ NGƯỜI 3
│       ├── Orders.js               ✅ NGƯỜI 3
│       ├── Users.js                ✅ NGƯỜI 3
│       ├── Inventory.js            ✅ NGƯỜI 3
│       └── Admin.css               ✅ NGƯỜI 3
│
└── components/
    ├── charts/
    │   ├── SimpleLineChart.js      ✅ NGƯỜI 3
    │   ├── SimpleBarChart.js       ✅ NGƯỜI 3
    │   └── Chart.css               ✅ NGƯỜI 3
    │
    └── routing/
        └── AdminRoute.js           ✅ NGƯỜI 3
```

### 📝 **Chi tiết từng file:**

| File | Mô tả | Công việc |
|------|-------|-----------|
| `pages/admin/Dashboard.js` | Dashboard admin | Stat cards, charts, tổng quan hệ thống |
| `pages/admin/Products.js` | Quản lý sản phẩm | CRUD products, upload images, filter |
| `pages/admin/Orders.js` | Quản lý đơn hàng | Xem orders, cập nhật status, chi tiết |
| `pages/admin/Users.js` | Quản lý người dùng | Xem users, edit, duyệt nạp tiền |
| `pages/admin/Inventory.js` | Quản lý kho | Nhập kho, cập nhật số lượng |
| `pages/admin/Admin.css` | Styles admin | CSS chung cho tất cả admin pages |
| `components/charts/SimpleLineChart.js` | Biểu đồ đường | Custom line chart component |
| `components/charts/SimpleBarChart.js` | Biểu đồ cột | Custom bar chart component |
| `components/charts/Chart.css` | Styles charts | CSS cho charts, tooltips |
| `components/routing/AdminRoute.js` | Bảo vệ admin routes | Kiểm tra role admin, redirect |

### 🔗 **Dependencies cần dùng:**
- `store/slices/authSlice.js` (authentication)
- `store/slices/productSlice.js` (products)
- `store/slices/orderSlice.js` (orders)
- `utils/currency.js` (format giá)
- `components/layout/Navbar.js` (từ người 1)

---

## 🔄 **SHARED FILES (Cả 3 người cần biết - KHÔNG SỬA TÙY TIỆN)**

### ⚠️ **Files chung - Cần phối hợp khi sửa:**

```
client/src/
├── App.js                         🔄 SHARED (routing chính)
├── App.css                        🔄 SHARED (base styles)
├── index.js                       🔄 SHARED (entry point)
├── index.css                      🔄 SHARED (global styles, CSS variables)
│
├── store/
│   ├── store.js                   🔄 SHARED (Redux config)
│   └── slices/
│       ├── authSlice.js           🔄 SHARED (authentication state)
│       ├── productSlice.js        🔄 SHARED (products state)
│       ├── cartSlice.js           🔄 SHARED (cart state)
│       └── orderSlice.js          🔄 SHARED (orders state)
│
├── components/
│   └── common/
│       ├── Icon.js                🔄 SHARED (icon component)
│       └── BackButton.js          🔄 SHARED (back button)
│
└── utils/
    └── currency.js                 🔄 SHARED (format currency)
```

### 📋 **Quy tắc khi làm việc với Shared Files:**

1. **Redux Slices:** 
   - ❌ KHÔNG sửa mà không thông báo nhóm
   - ✅ Chỉ đọc và sử dụng
   - ✅ Nếu cần thêm action mới, thông báo trước

2. **App.js (Routing):**
   - ✅ Người 1: Thêm routes cho Home, Products, ProductDetail
   - ✅ Người 2: Thêm routes cho Login, Register, Cart, Wallet, MyOrders, Profile
   - ✅ Người 3: Thêm routes cho Admin pages
   - ⚠️ Phối hợp để tránh conflict

3. **Common Components:**
   - ✅ Có thể sử dụng tự do
   - ✅ Nếu cần thêm icon mới, thông báo người 1 (vì Navbar cũng dùng)

4. **Utils:**
   - ✅ Sử dụng tự do
   - ✅ Nếu cần thêm utility mới, thông báo nhóm

---

## 📊 **TỔNG KẾT SỐ LƯỢNG FILES**

| Người | Số files JS | Số files CSS | Tổng files |
|-------|-------------|--------------|------------|
| **NGƯỜI 1** | 4 files | 4 files | **8 files** |
| **NGƯỜI 2** | 7 files | 4 files | **11 files** |
| **NGƯỜI 3** | 7 files | 2 files | **9 files** |
| **SHARED** | 9 files | 2 files | **11 files** |

---

## 🎯 **CHECKLIST THEO NGƯỜI**

### ✅ **NGƯỜI 1 - Checklist:**
- [ ] `pages/Home.js` - Hoàn thành
- [ ] `pages/Home.css` - Hoàn thành
- [ ] `pages/Products.js` - Hoàn thành
- [ ] `pages/Products.css` - Hoàn thành
- [ ] `pages/ProductDetail.js` - Hoàn thành
- [ ] `pages/ProductDetail.css` - Hoàn thành
- [ ] `components/layout/Navbar.js` - Hoàn thành
- [ ] `components/layout/Navbar.css` - Hoàn thành

### ✅ **NGƯỜI 2 - Checklist:**
- [ ] `pages/auth/Login.js` - Hoàn thành
- [ ] `pages/auth/Register.js` - Hoàn thành
- [ ] `pages/auth/Auth.css` - Hoàn thành
- [ ] `pages/Cart.js` - Hoàn thành
- [ ] `pages/Cart.css` - Hoàn thành
- [ ] `pages/Wallet.js` - Hoàn thành
- [ ] `pages/Wallet.css` - Hoàn thành
- [ ] `pages/MyOrders.js` - Hoàn thành
- [ ] `pages/MyOrders.css` - Hoàn thành
- [ ] `pages/Profile.js` - Hoàn thành
- [ ] `components/routing/PrivateRoute.js` - Hoàn thành

### ✅ **NGƯỜI 3 - Checklist:**
- [ ] `pages/admin/Dashboard.js` - Hoàn thành
- [ ] `pages/admin/Products.js` - Hoàn thành
- [ ] `pages/admin/Orders.js` - Hoàn thành
- [ ] `pages/admin/Users.js` - Hoàn thành
- [ ] `pages/admin/Inventory.js` - Hoàn thành
- [ ] `pages/admin/Admin.css` - Hoàn thành
- [ ] `components/charts/SimpleLineChart.js` - Hoàn thành
- [ ] `components/charts/SimpleBarChart.js` - Hoàn thành
- [ ] `components/charts/Chart.css` - Hoàn thành
- [ ] `components/routing/AdminRoute.js` - Hoàn thành

---

## 💡 **LƯU Ý QUAN TRỌNG**

1. **Mỗi người chỉ sửa files của mình** - Tránh conflict
2. **Phối hợp khi cần** - Navbar, App.js routing
3. **Commit message rõ ràng** - `[Person1] Update Home page`
4. **Test trước khi push** - Đảm bảo không break code
5. **Thông báo khi cần sửa shared files** - Tránh conflict

---

**📖 Xem thêm:** `FRONTEND_DIVISION.md` (chi tiết đầy đủ)

