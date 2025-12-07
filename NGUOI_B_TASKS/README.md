# 📋 PHẦN CÔNG VIỆC CỦA NGƯỜI B (Customer & Shopping)

## 🎯 Tổng Quan

Người B phụ trách phát triển các tính năng dành cho **khách hàng** (customer) và **mua sắm** (shopping). Các tính năng này được xây dựng dựa trên framework đã có từ Người A.

---

## 📁 Danh Sách Files Phụ Trách

### **1. Components**
- ✅ `src/components/common/BackButton.js`

### **2. Pages**
- ✅ `src/pages/ProductDetail.js` + `ProductDetail.css`
- ✅ `src/pages/Cart.js` + `Cart.css`
- ✅ `src/pages/Wallet.js` + `Wallet.css`
- ✅ `src/pages/MyOrders.js` + `MyOrders.css`
- ✅ `src/pages/Profile.js`

### **3. Redux Slices**
- ✅ `src/store/slices/cartSlice.js`
- ✅ `src/store/slices/orderSlice.js`

### **4. Routing**
- ✅ `src/components/routing/PrivateRoute.js`

---

## 📖 Giải Thích Chi Tiết Từng File

Xem các file giải thích chi tiết trong folder này:
- [BackButton.js - Giải thích](./BackButton_EXPLAINED.md)
- [ProductDetail.js - Giải thích](./ProductDetail_EXPLAINED.md)
- [Cart.js - Giải thích](./Cart_EXPLAINED.md)
- [Wallet.js - Giải thích](./Wallet_EXPLAINED.md)
- [MyOrders.js - Giải thích](./MyOrders_EXPLAINED.md)
- [Profile.js - Giải thích](./Profile_EXPLAINED.md)
- [cartSlice.js - Giải thích](./cartSlice_EXPLAINED.md)
- [orderSlice.js - Giải thích](./orderSlice_EXPLAINED.md)
- [PrivateRoute.js - Giải thích](./PrivateRoute_EXPLAINED.md)

---

## 🔗 Dependencies

Người B cần sử dụng các components/utils từ Người A:
- `store/slices/authSlice.js` - Để lấy thông tin user, token
- `store/slices/productSlice.js` - Để fetch product details
- `utils/currency.js` - Để format giá tiền
- `components/common/Icon.js` - Để hiển thị icons

---

## ✅ Checklist Hoàn Thành

- [ ] BackButton component
- [ ] ProductDetail page (với logic thêm vào giỏ hàng)
- [ ] Cart page (quản lý giỏ hàng)
- [ ] Wallet page (nạp tiền, lịch sử)
- [ ] MyOrders page (lịch sử đơn hàng)
- [ ] Profile page (thông tin cá nhân)
- [ ] cartSlice (Redux state cho giỏ hàng)
- [ ] orderSlice (Redux state cho đơn hàng)
- [ ] PrivateRoute (bảo vệ routes)

---

**📖 Xem thêm:** `../PHAN_CHIA_FILES.md` để biết phân chia đầy đủ

