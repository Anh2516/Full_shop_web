# 🛒 cartSlice.js - Giải Thích Chi Tiết

## 📍 File: `src/store/slices/cartSlice.js`

## 🎯 Mục Đích

Redux slice quản lý **giỏ hàng** (cart state):
- Lưu trữ items trong giỏ hàng
- **Lưu vào localStorage** (persist khi refresh)
- Actions: add, remove, update quantity, clear

---

## 📝 Code Chi Tiết - Phần 1: Setup

```javascript
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('cart')) || [],
  },
  reducers: {
    // Actions sẽ được định nghĩa ở đây
  },
});
```

**Giải thích:**
- `name: 'cart'`: Tên slice (dùng trong Redux DevTools)
- `initialState`: State ban đầu
  - Lấy từ `localStorage.getItem('cart')` (nếu có)
  - Nếu không có → `[]` (mảng rỗng)

**Tại sao dùng localStorage?**
- Giỏ hàng cần **persist** khi user refresh trang
- Không cần đăng nhập để có giỏ hàng

---

## 📝 Code Chi Tiết - Phần 2: addToCart Action

```javascript
addToCart: (state, action) => {
  const { product, quantity } = action.payload;
  const existingItem = state.items.find(item => item.product.id === product.id);
  
  if (existingItem) {
    // Nếu sản phẩm đã có trong giỏ → Tăng số lượng
    existingItem.quantity += quantity;
  } else {
    // Nếu chưa có → Thêm mới
    state.items.push({ product, quantity });
  }
  // Lưu vào localStorage
  localStorage.setItem('cart', JSON.stringify(state.items));
},
```

**Giải thích:**

### **Logic:**
1. **Tìm item:** Kiểm tra sản phẩm đã có trong giỏ chưa
2. **Nếu có:** Tăng `quantity` (cộng dồn)
3. **Nếu chưa:** Thêm item mới vào mảng
4. **Persist:** Lưu vào localStorage

### **Payload:**
```javascript
{
  product: { id: 1, name: '...', price: 100000, ... },
  quantity: 2
}
```

### **Ví dụ:**
```javascript
// Lần 1: Thêm sản phẩm A, quantity = 1
dispatch(addToCart({ product: productA, quantity: 1 }));
// items: [{ product: productA, quantity: 1 }]

// Lần 2: Thêm lại sản phẩm A, quantity = 2
dispatch(addToCart({ product: productA, quantity: 2 }));
// items: [{ product: productA, quantity: 3 }] (1 + 2 = 3)
```

---

## 📝 Code Chi Tiết - Phần 3: removeFromCart Action

```javascript
removeFromCart: (state, action) => {
  state.items = state.items.filter(item => item.product.id !== action.payload);
  localStorage.setItem('cart', JSON.stringify(state.items));
},
```

**Giải thích:**
- **Payload:** `productId` (number)
- **Logic:** Filter ra item có `product.id !== productId`
- **Persist:** Lưu vào localStorage

### **Ví dụ:**
```javascript
// items: [
//   { product: { id: 1, ... }, quantity: 2 },
//   { product: { id: 2, ... }, quantity: 1 }
// ]

dispatch(removeFromCart(1));

// items: [
//   { product: { id: 2, ... }, quantity: 1 }
// ]
```

---

## 📝 Code Chi Tiết - Phần 4: updateQuantity Action

```javascript
updateQuantity: (state, action) => {
  const { productId, quantity } = action.payload;
  const item = state.items.find(item => item.product.id === productId);
  if (item) {
    item.quantity = quantity;
  }
  localStorage.setItem('cart', JSON.stringify(state.items));
},
```

**Giải thích:**
- **Payload:** `{ productId, quantity }`
- **Logic:** Tìm item và update `quantity` trực tiếp
- **Persist:** Lưu vào localStorage

### **Ví dụ:**
```javascript
// items: [{ product: { id: 1, ... }, quantity: 2 }]

dispatch(updateQuantity({ productId: 1, quantity: 5 }));

// items: [{ product: { id: 1, ... }, quantity: 5 }]
```

**Dùng khi nào?**
- User click +/- trong Cart page
- Set số lượng cụ thể (không cộng dồn)

---

## 📝 Code Chi Tiết - Phần 5: clearCart Action

```javascript
clearCart: (state) => {
  state.items = [];
  localStorage.removeItem('cart');
},
```

**Giải thích:**
- **Payload:** Không có
- **Logic:** Reset `items = []` và xóa localStorage

**Dùng khi nào?**
- Sau khi đặt hàng thành công
- User muốn xóa toàn bộ giỏ hàng

---

## 📝 Code Chi Tiết - Phần 6: Export

```javascript
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

**Giải thích:**
- **Actions:** Export các actions để dispatch
- **Reducer:** Export reducer để thêm vào store

---

## 💡 Cách Sử Dụng

### **1. Import:**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
```

### **2. Dispatch Actions:**
```javascript
const dispatch = useDispatch();

// Thêm vào giỏ
dispatch(addToCart({ product: productData, quantity: 1 }));

// Xóa khỏi giỏ
dispatch(removeFromCart(productId));

// Cập nhật số lượng
dispatch(updateQuantity({ productId: 1, quantity: 5 }));

// Xóa toàn bộ
dispatch(clearCart());
```

### **3. Select State:**
```javascript
const { items } = useSelector(state => state.cart);

// items: [
//   { product: {...}, quantity: 2 },
//   { product: {...}, quantity: 1 }
// ]
```

---

## 🔗 State Structure

```javascript
{
  cart: {
    items: [
      {
        product: {
          id: 1,
          name: 'Sản phẩm A',
          price: 100000,
          image: '...',
          stock: 10,
          ...
        },
        quantity: 2
      },
      // ...
    ]
  }
}
```

---

## ⚠️ Lưu Ý

1. **localStorage Sync:**
   - Mỗi action đều lưu vào localStorage
   - Đảm bảo giỏ hàng persist khi refresh

2. **Product Reference:**
   - Lưu toàn bộ object `product` (không chỉ ID)
   - Cần để hiển thị thông tin trong Cart page

3. **Quantity Validation:**
   - Không validate min/max trong slice
   - Validation nên làm ở component (Cart.js)

4. **No Async Actions:**
   - Slice này chỉ quản lý local state
   - Không có API calls

---

## ✅ Checklist Implementation

- [ ] Initial state từ localStorage
- [ ] addToCart (cộng dồn nếu đã có)
- [ ] removeFromCart
- [ ] updateQuantity
- [ ] clearCart
- [ ] Persist vào localStorage
- [ ] Export actions và reducer

---

## 🔄 Flow Hoạt Động

1. **User thêm sản phẩm (ProductDetail):**
   - Dispatch `addToCart({ product, quantity })`
   - Item được thêm/cập nhật
   - Lưu vào localStorage

2. **User vào Cart page:**
   - Load items từ Redux (đã có từ localStorage)
   - Hiển thị danh sách

3. **User cập nhật số lượng:**
   - Dispatch `updateQuantity({ productId, quantity })`
   - Update state và localStorage

4. **User xóa sản phẩm:**
   - Dispatch `removeFromCart(productId)`
   - Filter và lưu localStorage

5. **User đặt hàng thành công:**
   - Dispatch `clearCart()`
   - Reset state và localStorage

