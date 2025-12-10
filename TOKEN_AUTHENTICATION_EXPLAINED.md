  # 🔐 Giải Thích Chi Tiết: Token Authentication Flow

## 📋 Tổng Quan

Hệ thống sử dụng **JWT (JSON Web Token)** để xác thực người dùng. Token được tạo ở **backend** khi đăng nhập/đăng ký, lưu ở **localStorage** trên frontend, và được gửi kèm mỗi request để xác thực.

---

## 🔄 Flow Hoàn Chỉnh

### **Bước 1: Tạo Token (Backend)**

**File:** `server/config/auth.js`

```javascript
const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { userId, role },                    // Payload: thông tin user
    process.env.JWT_SECRET || 'your_secret_key',  // Secret key để mã hóa
    { expiresIn: process.env.JWT_EXPIRE || '7d' }   // Thời gian hết hạn (7 ngày)
  );
};
```

**Giải thích:**
- `jwt.sign()` tạo token từ 3 phần:
  1. **Payload**: `{ userId, role }` - thông tin user được mã hóa trong token
  2. **Secret**: Key bí mật để ký token (lưu trong `.env`)
  3. **Options**: Thời gian hết hạn (mặc định 7 ngày)

**Ví dụ token được tạo:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjM4MjM0NTY3LCJleHAiOjE2Mzg4MzkzNjd9.abc123...
```

---

### **Bước 2: Trả Token Về Frontend (Backend)**

**File:** `server/routes/auth.js` - Route `/api/auth/login`

```javascript
// Sau khi kiểm tra email/password đúng
const token = generateToken(user.id, user.role);

res.json({
  message: 'Đăng nhập thành công',
  token,  // ← Token được trả về trong response
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    balance: user.balance,
    customer_code: user.customer_code
  }
});
```

**Response từ backend:**
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Nguyễn Văn A",
    "role": "user",
    "balance": 1000000,
    "customer_code": "10023"
  }
}
```

---

### **Bước 3: Lưu Token Vào localStorage (Frontend)**

**File:** `client/src/store/slices/authSlice.js` - Action `login`

```javascript
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // 1. Gửi request đăng nhập
      const response = await axios.post(`${API_URL}/login`, credentials);
      
      // 2. Nhận token từ response
      const { token, user } = response.data;
      
      // 3. Lưu token vào localStorage ← ĐÂY LÀ NƠI TOKEN ĐƯỢC LƯU
      localStorage.setItem('token', token);
      
      // 4. Trả về để lưu vào Redux state
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);
```

**Giải thích:**
- `localStorage.setItem('token', token)` lưu token vào **Browser's localStorage**
- localStorage là storage của browser, dữ liệu **persist** ngay cả khi đóng browser
- Token được lưu dưới key `'token'`

**Kiểm tra token trong browser:**
- Mở DevTools (F12) → Tab "Application" → "Local Storage" → `http://tuananh.surf`
- Sẽ thấy: `token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`

---

### **Bước 4: Đọc Token Từ localStorage (Frontend)**

**File:** `client/src/store/slices/authSlice.js` - Initial State

```javascript
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,  // ← ĐỌC TOKEN KHI APP KHỞI ĐỘNG
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  // ...
});
```

**Giải thích:**
- Khi app khởi động, Redux đọc token từ localStorage
- Nếu có token → user đã đăng nhập trước đó
- Nếu không có → user chưa đăng nhập

---

### **Bước 5: Gửi Token Kèm Request (Frontend)**

**File:** `client/src/store/slices/authSlice.js` - Action `getCurrentUser`

```javascript
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Lấy token từ localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Không có token');
      }
      
      // 2. Gửi token trong header Authorization
      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }  // ← GỬI TOKEN Ở ĐÂY
      });
      
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue(error.response?.data?.message || 'Lỗi xác thực');
    }
  }
);
```

**Giải thích:**
- Token được gửi trong **HTTP Header** với format: `Authorization: Bearer <token>`
- Format chuẩn JWT: `Bearer <token>` (có từ "Bearer" phía trước)

**Ví dụ request:**
```
GET /api/auth/me
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **Bước 6: Verify Token (Backend)**

**File:** `server/config/auth.js` - Middleware `verifyToken`

```javascript
const verifyToken = (req, res, next) => {
  // 1. Lấy token từ header Authorization
  const token = req.headers.authorization?.split(' ')[1];  // Lấy phần sau "Bearer "
  
  if (!token) {
    return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
  }
  
  try {
    // 2. Verify token bằng JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    
    // 3. Lưu thông tin user vào req.user để dùng ở các route tiếp theo
    req.user = decoded;  // { userId: 1, role: 'user', iat: ..., exp: ... }
    
    next();  // Cho phép tiếp tục
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};
```

**Giải thích:**
- `jwt.verify()` kiểm tra:
  1. Token có đúng format không?
  2. Token có được ký bằng JWT_SECRET đúng không?
  3. Token có hết hạn chưa?
- Nếu hợp lệ → decode payload → `req.user = { userId, role }`
- Nếu không hợp lệ → trả về 401 Unauthorized

---

### **Bước 7: Sử Dụng Token Trong Route (Backend)**

**File:** `server/routes/products.js` - Route tạo sản phẩm (Admin only)

```javascript
// Middleware verifyToken chạy trước → req.user đã có thông tin user
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    // req.user đã được set bởi verifyToken middleware
    const userId = req.user.userId;  // ← LẤY USER ID TỪ TOKEN
    const userRole = req.user.role;   // ← LẤY ROLE TỪ TOKEN
    
    // Kiểm tra quyền admin
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Yêu cầu quyền admin' });
    }
    
    // Tạo sản phẩm...
  } catch (error) {
    // ...
  }
});
```

**Giải thích:**
- Sau khi `verifyToken` middleware chạy, `req.user` chứa thông tin từ token
- Có thể dùng `req.user.userId` và `req.user.role` để xác thực

---

## 📍 Tóm Tắt: Token Ở Đâu?

### **1. Token được TẠO ở đâu?**
- **Backend**: `server/config/auth.js` → `generateToken()`
- Khi nào: Khi user đăng nhập/đăng ký thành công

### **2. Token được LƯU ở đâu?**
- **Frontend**: `localStorage` (Browser's storage)
- Code: `localStorage.setItem('token', token)`
- Vị trí: DevTools → Application → Local Storage

### **3. Token được GỬI như thế nào?**
- **HTTP Header**: `Authorization: Bearer <token>`
- Code: `headers: { Authorization: 'Bearer ' + token }`
- Mỗi request cần xác thực đều gửi token trong header

### **4. Token được VERIFY ở đâu?**
- **Backend**: `server/config/auth.js` → `verifyToken()` middleware
- Chạy trước mỗi route cần xác thực
- Verify bằng `jwt.verify()` với JWT_SECRET

---

## 🔍 Ví Dụ Thực Tế

### **Scenario: User đăng nhập và xem sản phẩm**

1. **User nhập email/password** → Click "Đăng nhập"
2. **Frontend gửi POST** `/api/auth/login` với `{ email, password }`
3. **Backend kiểm tra** email/password → Tạo token bằng `generateToken()`
4. **Backend trả về** `{ token, user }`
5. **Frontend lưu token** vào `localStorage.setItem('token', token)`
6. **User vào trang sản phẩm** → Frontend gọi `getCurrentUser()`
7. **Frontend lấy token** từ `localStorage.getItem('token')`
8. **Frontend gửi GET** `/api/auth/me` với header `Authorization: Bearer <token>`
9. **Backend verify token** bằng `verifyToken()` middleware
10. **Backend trả về** thông tin user nếu token hợp lệ

---

## ⚠️ Lưu Ý Quan Trọng

1. **Token hết hạn**: Token có thời hạn (7 ngày), sau đó cần đăng nhập lại
2. **Token bị xóa**: Khi logout → `localStorage.removeItem('token')`
3. **Token không hợp lệ**: Nếu token bị sửa đổi hoặc hết hạn → 401 Unauthorized
4. **JWT_SECRET**: Phải giữ bí mật, không commit lên Git (dùng `.env`)

---

## 🛠️ Debug Token

### **Kiểm tra token trong browser:**
```javascript
// Console (F12)
localStorage.getItem('token')  // Xem token hiện tại
```

### **Kiểm tra token có hợp lệ không:**
- Mở https://jwt.io
- Paste token vào
- Xem payload: `{ userId, role, iat, exp }`

### **Xóa token (logout):**
```javascript
localStorage.removeItem('token')
```

---

## 📚 File Liên Quan

- **Backend:**
  - `server/config/auth.js` - Tạo và verify token
  - `server/routes/auth.js` - Route đăng nhập/đăng ký

- **Frontend:**
  - `client/src/store/slices/authSlice.js` - Lưu và quản lý token
  - `client/src/components/routing/PrivateRoute.js` - Kiểm tra token để bảo vệ route
  - `client/src/components/routing/AdminRoute.js` - Kiểm tra token và role admin

---

**Kết luận:** Token được tạo ở **backend**, lưu ở **localStorage** (frontend), và được gửi kèm mỗi request trong **HTTP Header** để backend verify và xác thực người dùng.

