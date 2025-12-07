# 📚 MỤC LỤC - Tài Liệu Người B

## 🎯 Tổng Quan

Folder này chứa tài liệu giải thích chi tiết tất cả các files mà **Người B** phụ trách.

---

## 📖 Danh Sách Tài Liệu

### **1. Components**
- [📄 BackButton.js](./BackButton_EXPLAINED.md)
  - Component nút "Quay lại"
  - Điều hướng về trang trước hoặc fallback route

### **2. Pages**
- [📄 ProductDetail.js](./ProductDetail_EXPLAINED.md)
  - Trang chi tiết sản phẩm
  - **Logic thêm vào giỏ hàng** (quan trọng)
  - Gallery hình ảnh
  
- [📄 Cart.js](./Cart_EXPLAINED.md)
  - Trang giỏ hàng
  - Quản lý items (thêm, xóa, cập nhật số lượng)
  - **Logic đặt hàng (checkout)** (quan trọng)
  
- [📄 Wallet.js](./Wallet_EXPLAINED.md)
  - Trang ví điện tử
  - Nạp tiền (tạo QR VietQR)
  - Lịch sử giao dịch
  
- [📄 MyOrders.js](./MyOrders_EXPLAINED.md)
  - Lịch sử đơn hàng
  - Xem chi tiết đơn hàng (modal)
  
- [📄 Profile.js](./Profile_EXPLAINED.md)
  - Thông tin cá nhân
  - Cập nhật profile
  - Đổi mật khẩu (optional)

### **3. Redux Slices**
- [📄 cartSlice.js](./cartSlice_EXPLAINED.md)
  - Quản lý giỏ hàng (Redux state)
  - Actions: add, remove, update quantity, clear
  - **Persist vào localStorage**
  
- [📄 orderSlice.js](./orderSlice_EXPLAINED.md)
  - Quản lý đơn hàng (Redux state)
  - Async actions: createOrder, fetchMyOrders, fetchAllOrders, updateOrderStatus

### **4. Routing**
- [📄 PrivateRoute.js](./PrivateRoute_EXPLAINED.md)
  - Bảo vệ routes cho user
  - Kiểm tra authentication
  - Redirect nếu chưa đăng nhập

---

## 🎯 Các Logic Quan Trọng

### **1. Thêm vào giỏ hàng (ProductDetail.js)**
- Kiểm tra đăng nhập
- Dispatch `addToCart` với product + quantity
- Alert thành công

### **2. Đặt hàng (Cart.js)**
- Validate địa chỉ giao hàng
- Dispatch `createOrder`
- Cập nhật balance
- Clear cart
- Redirect về trang chủ

### **3. Nạp tiền (Wallet.js)**
- Tạo QR code VietQR
- Gửi yêu cầu nạp tiền
- Trigger events cho admin
- Hiển thị lịch sử giao dịch

### **4. Quản lý giỏ hàng (cartSlice.js)**
- Add to cart (cộng dồn nếu đã có)
- Remove from cart
- Update quantity
- Persist vào localStorage

### **5. Tạo đơn hàng (orderSlice.js)**
- Async action `createOrder`
- Gọi API `/api/orders`
- Return `{ order, newBalance }`

---

## 🔗 Dependencies

Người B cần sử dụng từ Người A:
- `store/slices/authSlice.js` - Authentication state
- `store/slices/productSlice.js` - Product data
- `utils/currency.js` - Format currency
- `components/common/Icon.js` - Icons (nếu cần)

---

## 📊 Tổng Kết Files

| Loại | Số lượng | Files |
|------|----------|-------|
| **Components** | 1 | BackButton.js |
| **Pages** | 5 | ProductDetail, Cart, Wallet, MyOrders, Profile |
| **Redux Slices** | 2 | cartSlice, orderSlice |
| **Routing** | 1 | PrivateRoute |
| **Tổng** | **9 files** | |

---

## ✅ Checklist Hoàn Thành

### **Components:**
- [x] BackButton.js

### **Pages:**
- [x] ProductDetail.js + CSS
- [x] Cart.js + CSS
- [x] Wallet.js + CSS
- [x] MyOrders.js + CSS
- [x] Profile.js

### **Redux:**
- [x] cartSlice.js
- [x] orderSlice.js

### **Routing:**
- [x] PrivateRoute.js

---

## 💡 Tips & Best Practices

1. **localStorage:** Giỏ hàng cần persist khi refresh
2. **Loading States:** Luôn hiển thị loading khi fetch data
3. **Error Handling:** Alert lỗi rõ ràng cho user
4. **Validation:** Validate form trước khi submit
5. **Events:** Trigger events để admin cập nhật real-time

---

## 🔄 Flow Tổng Quan

1. **User xem sản phẩm (ProductDetail)**
   → Thêm vào giỏ hàng
   → Lưu vào Redux + localStorage

2. **User vào giỏ hàng (Cart)**
   → Xem danh sách items
   → Cập nhật số lượng
   → Đặt hàng
   → Tạo order → Clear cart

3. **User nạp tiền (Wallet)**
   → Tạo QR code
   → Chuyển khoản
   → Xác nhận → Gửi yêu cầu
   → Admin duyệt → Cộng tiền

4. **User xem đơn hàng (MyOrders)**
   → Fetch danh sách orders
   → Xem chi tiết từng order

5. **User cập nhật profile (Profile)**
   → Chỉnh sửa thông tin
   → Submit → Update profile

---

**📖 Xem file README.md để biết tổng quan: [README.md](./README.md)**

