# 📦 orderSlice.js - Giải Thích Chi Tiết

## 📍 File: `src/store/slices/orderSlice.js`

## 🎯 Mục Đích

Redux slice quản lý **đơn hàng** (orders state):
- Tạo đơn hàng (checkout)
- Lấy danh sách đơn hàng của user
- Lấy tất cả đơn hàng (admin)
- Cập nhật trạng thái đơn hàng (admin)

---

## 📝 Code Chi Tiết - Phần 1: Imports & Setup

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/orders';
```

**Giải thích:**
- `createAsyncThunk`: Tạo async actions (API calls)
- `axios`: HTTP client để gọi API
- `API_URL`: Base URL cho orders API

---

## 📝 Code Chi Tiết - Phần 2: createOrder (Async Action)

```javascript
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(API_URL, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { 
        order: response.data.order,
        newBalance: response.data.newBalance 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tạo đơn hàng');
    }
  }
);
```

**Giải thích:**

### **createAsyncThunk:**
- **Type:** `'orders/createOrder'`
- **Payload Creator:** Function async nhận `orderData`

### **Logic:**
1. **Lấy token:** Từ Redux state (`getState().auth.token`)
2. **POST request:** `/api/orders` với `orderData` và token
3. **Return:** `{ order, newBalance }`
   - `order`: Đơn hàng vừa tạo
   - `newBalance`: Số dư mới sau khi trừ tiền
4. **Error:** Return `rejectWithValue` với error message

### **Payload (orderData):**
```javascript
{
  items: [
    { product_id: 1, quantity: 2, price: 100000 },
    { product_id: 2, quantity: 1, price: 200000 }
  ],
  total: 400000,
  shipping_address: '123 Đường ABC',
  payment_method: 'wallet',
  payment_gateway: 'wallet'
}
```

**Dùng khi nào?**
- User click "Đặt hàng" trong Cart page

---

## 📝 Code Chi Tiết - Phần 3: fetchMyOrders (Async Action)

```javascript
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải đơn hàng');
    }
  }
);
```

**Giải thích:**
- **Type:** `'orders/fetchMyOrders'`
- **Payload:** Không có (dùng `_`)
- **GET request:** `/api/orders/my-orders`
- **Return:** Array orders của user

**Dùng khi nào?**
- User vào MyOrders page
- Cần refresh danh sách đơn hàng

---

## 📝 Code Chi Tiết - Phần 4: fetchAllOrders (Admin)

```javascript
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải đơn hàng');
    }
  }
);
```

**Giải thích:**
- **Type:** `'orders/fetchAllOrders'`
- **Params:** Query params (filter, pagination, ...)
- **GET request:** `/api/orders/admin/all`
- **Return:** Array tất cả orders

**Dùng khi nào?**
- Admin vào Orders page
- Admin filter/search orders

---

## 📝 Code Chi Tiết - Phần 5: updateOrderStatus (Admin)

```javascript
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await axios.put(`${API_URL}/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi cập nhật đơn hàng');
    }
  }
);
```

**Giải thích:**
- **Type:** `'orders/updateOrderStatus'`
- **Payload:** `{ id, status }`
- **PUT request:** `/api/orders/${id}/status`
- **Return:** `{ id, status }` để update state

**Dùng khi nào?**
- Admin cập nhật trạng thái đơn hàng (pending → processing → shipped → completed)

---

## 📝 Code Chi Tiết - Phần 6: Slice Definition

```javascript
const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle async actions
  },
});
```

**Giải thích:**
- **Initial State:**
  - `items`: Array orders
  - `loading`: Đang tải
  - `error`: Lỗi (nếu có)
- **Reducers:** Không có (chỉ dùng async actions)
- **extraReducers:** Xử lý async actions

---

## 📝 Code Chi Tiết - Phần 7: Extra Reducers - createOrder

```javascript
builder
  .addCase(createOrder.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(createOrder.fulfilled, (state, action) => {
    state.loading = false;
    // newBalance sẽ được xử lý trong authSlice
  })
  .addCase(createOrder.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })
```

**Giải thích:**
- **pending:** Set `loading = true`, clear error
- **fulfilled:** Set `loading = false` (không thêm order vào items vì user không cần xem ngay)
- **rejected:** Set `loading = false`, set error

**Lưu ý:** `newBalance` được xử lý trong component (Cart.js) để update `authSlice`

---

## 📝 Code Chi Tiết - Phần 8: Extra Reducers - fetchMyOrders

```javascript
.addCase(fetchMyOrders.pending, (state) => {
  state.loading = true;
})
.addCase(fetchMyOrders.fulfilled, (state, action) => {
  state.loading = false;
  state.items = action.payload;  // Set orders
})
.addCase(fetchMyOrders.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
```

**Giải thích:**
- **pending:** Set loading
- **fulfilled:** Set `items = action.payload` (danh sách orders)
- **rejected:** Set error

---

## 📝 Code Chi Tiết - Phần 9: Extra Reducers - fetchAllOrders

```javascript
.addCase(fetchAllOrders.pending, (state) => {
  state.loading = true;
})
.addCase(fetchAllOrders.fulfilled, (state, action) => {
  state.loading = false;
  state.items = action.payload;
})
.addCase(fetchAllOrders.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
```

**Giải thích:**
- Tương tự `fetchMyOrders`
- Dùng cho admin (tất cả orders)

---

## 📝 Code Chi Tiết - Phần 10: Extra Reducers - updateOrderStatus

```javascript
.addCase(updateOrderStatus.fulfilled, (state, action) => {
  const order = state.items.find(o => o.id === action.payload.id);
  if (order) {
    order.status = action.payload.status;
  }
})
```

**Giải thích:**
- **fulfilled:** Tìm order trong `items` và update `status`
- **Không có pending/rejected:** Vì chỉ cần update local state

---

## 💡 Cách Sử Dụng

### **1. Import:**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, fetchMyOrders } from '../store/slices/orderSlice';
```

### **2. Dispatch Actions:**
```javascript
const dispatch = useDispatch();

// Tạo đơn hàng
const result = await dispatch(createOrder(orderData)).unwrap();
// result: { order, newBalance }

// Lấy danh sách đơn hàng
dispatch(fetchMyOrders());
```

### **3. Select State:**
```javascript
const { items, loading, error } = useSelector(state => state.orders);
```

---

## 🔗 State Structure

```javascript
{
  orders: {
    items: [
      {
        id: 1,
        total: 400000,
        status: 'pending',
        shipping_address: '123 Đường ABC',
        created_at: '2024-01-01T00:00:00Z',
        items: [
          { product_name: 'Sản phẩm A', quantity: 2, price: 100000 },
          // ...
        ]
      },
      // ...
    ],
    loading: false,
    error: null
  }
}
```

---

## ⚠️ Lưu Ý

1. **Token từ State:**
   - Dùng `getState().auth.token` để lấy token
   - Không cần truyền token từ component

2. **Error Handling:**
   - Dùng `rejectWithValue` để return error message
   - Component có thể catch error với `.unwrap()`

3. **Loading State:**
   - Mỗi async action có `pending` state
   - Component có thể disable buttons khi `loading = true`

4. **Items Update:**
   - `fetchMyOrders` và `fetchAllOrders` replace toàn bộ `items`
   - `updateOrderStatus` chỉ update 1 order trong `items`

---

## ✅ Checklist Implementation

- [ ] createOrder async action
- [ ] fetchMyOrders async action
- [ ] fetchAllOrders async action (admin)
- [ ] updateOrderStatus async action (admin)
- [ ] Extra reducers cho tất cả actions
- [ ] Loading states
- [ ] Error handling
- [ ] Export reducer

---

## 🔄 Flow Hoạt Động

1. **User đặt hàng (Cart.js):**
   - Dispatch `createOrder(orderData)`
   - Pending → Loading
   - Fulfilled → Cập nhật balance, clear cart
   - Rejected → Alert lỗi

2. **User xem đơn hàng (MyOrders.js):**
   - Dispatch `fetchMyOrders()`
   - Pending → Loading
   - Fulfilled → Hiển thị danh sách
   - Rejected → Alert lỗi

3. **Admin cập nhật status (Admin Orders):**
   - Dispatch `updateOrderStatus({ id, status })`
   - Fulfilled → Update status trong state
   - Rejected → Alert lỗi

