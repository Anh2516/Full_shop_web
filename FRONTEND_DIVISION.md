# Phân Chia Công Việc Frontend (Client) - 3 Người

## 📋 Tổng Quan

Dự án được chia thành 3 phần chính, mỗi người phụ trách một module độc lập nhưng có thể làm việc song song:

---

## 👤 **NGƯỜI 1: PUBLIC PAGES (Trang Công Khai)**

### 🎯 Trách nhiệm:
Phát triển các trang công khai mà tất cả người dùng (kể cả chưa đăng nhập) có thể truy cập.

### 📁 Files phụ trách:

#### **Pages:**
- ✅ `client/src/pages/Home.js` + `Home.css`
  - Trang chủ với hero section, featured products, features
  - Hiển thị sản phẩm nổi bật
  
- ✅ `client/src/pages/Products.js` + `Products.css`
  - Trang danh sách sản phẩm
  - Filter, search, pagination
  
- ✅ `client/src/pages/ProductDetail.js` + `ProductDetail.css`
  - Trang chi tiết sản phẩm
  - Hiển thị hình ảnh, mô tả, giá, thêm vào giỏ hàng

#### **Shared Components:**
- ✅ `client/src/components/layout/Navbar.js` + `Navbar.css`
  - Thanh điều hướng chung (cần phối hợp với người 2 và 3)
  - Logo, menu links, user menu

#### **Shared Styles:**
- ✅ `client/src/App.css` (base styles)
- ✅ `client/src/index.css` (global styles, CSS variables)

### 🔗 Dependencies:
- Redux: `productSlice` (để fetch products)
- Utils: `currency.js` (format giá)
- Components: `Icon.js` (icons)

### 📝 Công việc cụ thể:
1. ✅ Hoàn thiện UI/UX trang chủ
2. ✅ Tối ưu hiển thị danh sách sản phẩm
3. ✅ Xây dựng trang chi tiết sản phẩm đẹp mắt
4. ✅ Responsive design cho mobile
5. ✅ Tích hợp với Redux để load dữ liệu

---

## 👤 **NGƯỜI 2: USER PAGES (Trang Người Dùng)**

### 🎯 Trách nhiệm:
Phát triển các trang dành cho người dùng đã đăng nhập (không phải admin).

### 📁 Files phụ trách:

#### **Authentication:**
- ✅ `client/src/pages/auth/Login.js`
- ✅ `client/src/pages/auth/Register.js`
- ✅ `client/src/pages/auth/Auth.css`
  - Form đăng nhập/đăng ký
  - Validation, error handling
  - Redirect sau khi login

#### **User Features:**
- ✅ `client/src/pages/Cart.js` + `Cart.css`
  - Giỏ hàng
  - Thêm/xóa sản phẩm, cập nhật số lượng
  - Tính tổng tiền
  
- ✅ `client/src/pages/Wallet.js` + `Wallet.css`
  - Nạp tiền vào ví
  - Lịch sử giao dịch
  - Form nạp tiền
  
- ✅ `client/src/pages/MyOrders.js` + `MyOrders.css`
  - Lịch sử đơn hàng
  - Chi tiết đơn hàng
  - Trạng thái đơn hàng
  
- ✅ `client/src/pages/Profile.js`
  - Thông tin cá nhân
  - Chỉnh sửa profile

#### **Routing:**
- ✅ `client/src/components/routing/PrivateRoute.js`
  - Bảo vệ routes cho user
  - Kiểm tra authentication

### 🔗 Dependencies:
- Redux: `authSlice`, `cartSlice`, `orderSlice`
- Components: `Navbar` (từ người 1)
- Utils: `currency.js`

### 📝 Công việc cụ thể:
1. ✅ Xây dựng form đăng nhập/đăng ký
2. ✅ Quản lý giỏ hàng (CRUD)
3. ✅ Tích hợp ví điện tử
4. ✅ Hiển thị lịch sử đơn hàng
5. ✅ Quản lý profile người dùng
6. ✅ Xử lý authentication flow

---

## 👤 **NGƯỜI 3: ADMIN PAGES (Trang Quản Trị)**

### 🎯 Trách nhiệm:
Phát triển các trang dành cho admin để quản lý hệ thống.

### 📁 Files phụ trách:

#### **Admin Pages:**
- ✅ `client/src/pages/admin/Dashboard.js`
  - Dashboard tổng quan
  - Thống kê, biểu đồ
  - Stat cards
  
- ✅ `client/src/pages/admin/Products.js`
  - Quản lý sản phẩm (CRUD)
  - Upload hình ảnh
  - Filter, search
  
- ✅ `client/src/pages/admin/Orders.js`
  - Quản lý đơn hàng
  - Cập nhật trạng thái đơn hàng
  - Xem chi tiết đơn hàng
  
- ✅ `client/src/pages/admin/Users.js`
  - Quản lý người dùng
  - Xem thông tin, chỉnh sửa
  - Duyệt nạp tiền
  
- ✅ `client/src/pages/admin/Inventory.js`
  - Quản lý nhập kho
  - Cập nhật số lượng tồn kho

#### **Admin Styles:**
- ✅ `client/src/pages/admin/Admin.css`
  - Styles chung cho tất cả admin pages
  - Modal, table, form styles

#### **Charts Components:**
- ✅ `client/src/components/charts/SimpleLineChart.js`
- ✅ `client/src/components/charts/SimpleBarChart.js`
- ✅ `client/src/components/charts/Chart.css`
  - Biểu đồ cho dashboard
  - Custom SVG charts

#### **Routing:**
- ✅ `client/src/components/routing/AdminRoute.js`
  - Bảo vệ routes cho admin
  - Kiểm tra role admin

### 🔗 Dependencies:
- Redux: `authSlice`, `productSlice`, `orderSlice`
- Components: `Navbar` (từ người 1)
- Utils: `currency.js`

### 📝 Công việc cụ thể:
1. ✅ Xây dựng dashboard với charts
2. ✅ CRUD sản phẩm (thêm, sửa, xóa)
3. ✅ Quản lý đơn hàng (duyệt, hủy, cập nhật)
4. ✅ Quản lý người dùng
5. ✅ Quản lý kho hàng
6. ✅ Tích hợp upload hình ảnh
7. ✅ Xử lý admin authentication

---

## 🔄 **SHARED/COMMON (Cả 3 người cần biết)**

### 📁 Files chung:

#### **Redux Store:**
- ✅ `client/src/store/store.js` - Redux store configuration
- ✅ `client/src/store/slices/authSlice.js` - Authentication state
- ✅ `client/src/store/slices/productSlice.js` - Products state
- ✅ `client/src/store/slices/cartSlice.js` - Cart state
- ✅ `client/src/store/slices/orderSlice.js` - Orders state

#### **Common Components:**
- ✅ `client/src/components/common/Icon.js` - Icon component
- ✅ `client/src/components/common/BackButton.js` - Back button

#### **Utils:**
- ✅ `client/src/utils/currency.js` - Format currency

#### **Main App:**
- ✅ `client/src/App.js` - Main routing (cần phối hợp khi thêm routes mới)
- ✅ `client/src/index.js` - Entry point

### ⚠️ **Lưu ý khi làm việc:**
- **Không được sửa** Redux slices mà không thông báo cho nhóm
- **Phối hợp** khi cần thêm routes mới vào `App.js`
- **Thống nhất** về naming conventions và code style
- **Commit message** rõ ràng: `[Person1/Person2/Person3] Description`

---

## 📊 **Phân Bổ Công Việc Theo Độ Phức Tạp**

| Người | Độ phức tạp | Số lượng files | Tính năng chính |
|-------|-------------|----------------|-----------------|
| **Người 1** | ⭐⭐ (Trung bình) | ~6 files | Hiển thị, UI/UX |
| **Người 2** | ⭐⭐⭐ (Khá phức tạp) | ~8 files | Authentication, State management |
| **Người 3** | ⭐⭐⭐⭐ (Phức tạp) | ~9 files | CRUD, Charts, Admin logic |

---

## 🚀 **Quy Trình Làm Việc**

### 1. **Setup ban đầu:**
```bash
# Clone repo
git clone <repo-url>
cd beta_ver2

# Install dependencies
cd client
npm install
```

### 2. **Tạo branch riêng:**
```bash
# Người 1
git checkout -b feature/person1-public-pages

# Người 2
git checkout -b feature/person2-user-pages

# Người 3
git checkout -b feature/person3-admin-pages
```

### 3. **Làm việc:**
- Mỗi người làm việc trên branch riêng
- Commit thường xuyên với message rõ ràng
- Test kỹ trước khi push

### 4. **Merge:**
- Tạo Pull Request khi hoàn thành
- Code review lẫn nhau
- Merge vào `main` branch

---

## 📝 **Checklist Hoàn Thành**

### Người 1 - Public Pages:
- [ ] Home page hoàn chỉnh, responsive
- [ ] Products listing với filter/search
- [ ] Product detail page đẹp mắt
- [ ] Navbar hoạt động tốt
- [ ] Tích hợp Redux để load data

### Người 2 - User Pages:
- [ ] Login/Register form hoạt động
- [ ] Cart CRUD đầy đủ
- [ ] Wallet nạp tiền + lịch sử
- [ ] MyOrders hiển thị đúng
- [ ] Profile page
- [ ] PrivateRoute bảo vệ routes

### Người 3 - Admin Pages:
- [ ] Dashboard với charts
- [ ] Products CRUD + upload images
- [ ] Orders management
- [ ] Users management
- [ ] Inventory management
- [ ] AdminRoute bảo vệ routes

---

## 💡 **Tips & Best Practices**

1. **Communication:** Thường xuyên trao đổi về API endpoints, data structure
2. **Consistency:** Sử dụng cùng CSS variables, cùng component patterns
3. **Testing:** Test trên nhiều trình duyệt (Chrome, Firefox, Edge)
4. **Responsive:** Đảm bảo mobile-friendly
5. **Performance:** Tối ưu images, lazy loading nếu cần
6. **Error Handling:** Xử lý lỗi một cách user-friendly

---

## 📞 **Liên Hệ & Hỗ Trợ**

Nếu có vấn đề hoặc cần hỗ trợ:
- Tạo issue trên GitHub
- Hoặc trao đổi trực tiếp trong nhóm

**Chúc cả nhóm làm việc hiệu quả! 🎉**

