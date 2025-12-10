# 📝 Tổng Hợp Các Chỉnh Sửa Từ Khi Deploy Lên Web

Tài liệu này liệt kê tất cả các thay đổi đã được thực hiện để deploy dự án lên production (Railway + Spaceship).

---

## 🎯 Mục Lục

1. [Cấu Hình API Base URL](#1-cấu-hình-api-base-url)
2. [Cấu Hình CORS Backend](#2-cấu-hình-cors-backend)
3. [Cập Nhật Tất Cả API Calls Trong Frontend](#3-cập-nhật-tất-cả-api-calls-trong-frontend)
4. [Sửa Lỗi Database Schema](#4-sửa-lỗi-database-schema)
5. [Sửa Lỗi Orders - JSON Parsing](#5-sửa-lỗi-orders---json-parsing)
6. [Sửa Lỗi Products - Error Handling & Sorting](#6-sửa-lỗi-products---error-handling--sorting)
7. [Thêm Endpoint Xóa User](#7-thêm-endpoint-xóa-user)
8. [Sửa Lỗi Product Detail - Hiển Thị Nhiều Ảnh](#8-sửa-lỗi-product-detail---hiển-thị-nhiều-ảnh)
9. [Sửa CSS Homepage](#9-sửa-css-homepage)

---

## 1. Cấu Hình API Base URL

### **File Mới: `client/src/config/api.js`**

**Mục đích:** Tạo helper function để quản lý API base URL một cách nhất quán.

**Nội dung:**
```javascript
// API Configuration
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://fullshopweb-production.up.railway.app';

export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE}/${cleanEndpoint}`;
};

// Axios instance với baseURL đã cấu hình
export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API_BASE;
```

**Lý do:** 
- Trước đây frontend sử dụng relative URLs (`/api/...`) chỉ hoạt động khi frontend và backend cùng domain
- Sau khi deploy, frontend ở `tuananh.surf` và backend ở `railway.app`, cần absolute URL
- Helper này đảm bảo tất cả API calls đều dùng đúng base URL

---

## 2. Cấu Hình CORS Backend

### **File: `server/index.js`**

**Thay đổi:** Cấu hình CORS để cho phép requests từ domain frontend.

**Trước:**
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

**Sau:**
```javascript
// CORS configuration - cho phép tất cả origins hoặc chỉ định cụ thể
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'https://tuananh.surf', 'http://tuananh.surf'];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Tạm thời cho phép tất cả để debug
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Lý do:**
- Backend cần cho phép requests từ `https://tuananh.surf` (frontend domain)
- Cấu hình linh hoạt qua biến môi trường `ALLOWED_ORIGINS`

**Biến môi trường Railway:**
```
ALLOWED_ORIGINS=https://tuananh.surf,http://tuananh.surf
```

---

## 3. Cập Nhật Tất Cả API Calls Trong Frontend

### **Các File Đã Cập Nhật:**

#### **3.1. Redux Slices**

**`client/src/store/slices/authSlice.js`**
- **Trước:** `const API_URL = '/api/auth';`
- **Sau:** 
  ```javascript
  import { getApiUrl } from '../../config/api';
  const API_URL = getApiUrl('api/auth');
  ```

**`client/src/store/slices/productSlice.js`**
- **Trước:** `const API_URL = '/api/products';`
- **Sau:**
  ```javascript
  import { getApiUrl } from '../../config/api';
  const API_URL = getApiUrl('api/products');
  ```

**`client/src/store/slices/orderSlice.js`**
- **Trước:** `const API_URL = '/api/orders';`
- **Sau:**
  ```javascript
  import { getApiUrl } from '../../config/api';
  const API_URL = getApiUrl('api/orders');
  ```

#### **3.2. Pages**

**`client/src/pages/Products.js`**
- Cập nhật `fetchCategories()` và `fetchBestSellers()`:
  ```javascript
  import { getApiUrl } from '../config/api';
  
  // Trong fetchCategories:
  const response = await axios.get(getApiUrl('api/products/categories/list'));
  
  // Trong fetchBestSellers:
  const response = await fetch(getApiUrl('api/products/best-sellers'));
  ```

**`client/src/pages/Wallet.js`**
- Cập nhật tất cả API calls:
  ```javascript
  import { getApiUrl } from '../config/api';
  
  // GET wallet
  const response = await axios.get(getApiUrl('api/wallet'), authHeader);
  
  // POST topup
  const response = await axios.post(getApiUrl('api/wallet/topup'), { amount }, authHeader);
  ```

**`client/src/pages/MyOrders.js`**
- Cập nhật:
  ```javascript
  import { getApiUrl } from '../config/api';
  const response = await axios.get(getApiUrl(`api/orders/${orderId}`), authHeader);
  ```

**`client/src/pages/ProductDetail.js`**
- Đã sửa để sử dụng `currentProduct.images` từ Redux (xem phần 8)

#### **3.3. Admin Pages**

**`client/src/pages/admin/Dashboard.js`**
- Cập nhật:
  ```javascript
  import { getApiUrl } from '../../config/api';
  
  // GET stats
  const response = await axios.get(getApiUrl('api/admin/stats'), { headers });
  
  // GET revenue chart
  const response = await axios.get(getApiUrl(`api/admin/revenue-chart?period=${chartPeriod}`), { headers });
  ```

**`client/src/pages/admin/Products.js`**
- Cập nhật:
  ```javascript
  import { getApiUrl } from '../../config/api';
  
  // GET categories
  const response = await axios.get(getApiUrl('api/admin/categories'), authHeader);
  
  // POST upload image
  const response = await axios.post(getApiUrl('api/upload/image'), formData, authHeader);
  ```

**`client/src/pages/admin/Users.js`**
- Cập nhật tất cả API calls:
  ```javascript
  import { getApiUrl } from '../../config/api';
  
  // GET users
  const response = await axios.get(getApiUrl('api/users'), authHeader);
  
  // POST create user
  await axios.post(getApiUrl('api/users'), submitData, authHeader);
  
  // GET pending topups
  const response = await axios.get(getApiUrl('api/wallet/admin/pending'), authHeader);
  
  // POST approve topup
  await axios.post(getApiUrl(`api/wallet/admin/${transactionId}/approve`), {}, authHeader);
  
  // POST reject topup
  await axios.post(getApiUrl(`api/wallet/admin/${transactionId}/reject`), { reason }, authHeader);
  
  // DELETE user
  await axios.delete(getApiUrl(`api/users/${id}`), authHeader);
  ```

**`client/src/pages/admin/Orders.js`**
- Cập nhật:
  ```javascript
  import { getApiUrl } from '../../config/api';
  const response = await axios.get(getApiUrl(`api/orders/admin/${orderId}`), authHeader);
  ```

**`client/src/pages/admin/Inventory.js`**
- Cập nhật:
  ```javascript
  import { getApiUrl } from '../../config/api';
  
  // GET inventory
  const response = await axios.get(getApiUrl('api/inventory'), authHeader);
  
  // PUT update
  await axios.put(getApiUrl(`api/inventory/${editingEntry.id}`), payload, authHeader);
  
  // POST create
  await axios.post(getApiUrl('api/inventory'), payload, authHeader);
  
  // DELETE
  await axios.delete(getApiUrl(`api/inventory/${entryId}`), authHeader);
  ```

#### **3.4. Components**

**`client/src/components/layout/Navbar.js`**
- Cập nhật:
  ```javascript
  import { getApiUrl } from '../../config/api';
  const response = await axios.get(getApiUrl('api/admin/stats'), authHeader);
  ```

**Tổng số file đã cập nhật:** 13 files

---

## 4. Sửa Lỗi Database Schema

### **File: `server/database/schema.sql`**

**Vấn đề:** Cột `price` trong bảng `products` là `DECIMAL(10, 2)`, chỉ hỗ trợ giá trị tối đa 99,999,999.99. Khi admin cập nhật giá >= 100 triệu sẽ bị lỗi.

**Thay đổi:**
```sql
-- Trước:
price DECIMAL(10, 2) NOT NULL,

-- Sau:
price DECIMAL(12, 2) NOT NULL,
```

**Các cột khác cũng được cập nhật:**
- `orders.total`: `DECIMAL(12, 2)` (thay vì `DECIMAL(10, 2)`)
- `users.balance`: `DECIMAL(12, 2)` (đã có sẵn)
- `wallet_transactions.amount`: `DECIMAL(12, 2)` (đã có sẵn)
- `inventory.total_cost`: `DECIMAL(12, 2)` (đã có sẵn)

**Migration SQL:**
```sql
ALTER TABLE products MODIFY COLUMN price DECIMAL(12, 2) NOT NULL;
ALTER TABLE order_items MODIFY COLUMN price DECIMAL(12, 2) NOT NULL;
```

**File migration:** `server/database/migration_fix_product_price.sql` (đã tạo nhưng có thể đã xóa)

---

## 5. Sửa Lỗi Orders - JSON Parsing

### **File: `server/routes/orders.js`**

**Vấn đề:** Khi lấy chi tiết đơn hàng, `JSON_ARRAYAGG` trả về string JSON thay vì array, khiến frontend không hiển thị được items.

**Thay đổi trong `router.get('/:id', ...)`:**
```javascript
// Trước: Không parse JSON
const order = orders[0];
res.json({ order });

// Sau: Parse JSON_ARRAYAGG từ string thành array
const order = orders[0];
// Parse JSON_ARRAYAGG từ string thành array
if (order.items && typeof order.items === 'string') {
  try {
    order.items = JSON.parse(order.items);
  } catch (e) {
    order.items = [];
  }
} else if (!order.items) {
  order.items = [];
}
res.json({ order });
```

**Tương tự cho `router.get('/admin/:id', ...)`:**
- Cũng thêm logic parse JSON tương tự

**Lý do:** MySQL `JSON_ARRAYAGG` trả về string JSON, cần parse thành JavaScript array.

---

## 6. Sửa Lỗi Products - Error Handling & Sorting

### **File: `server/routes/products.js`**

#### **6.1. Sắp Xếp Sản Phẩm**

**Thay đổi trong `buildProductQuery()`:**
```javascript
// Trước:
query += ' ORDER BY p.created_at DESC';

// Sau:
query += ' ORDER BY p.created_at ASC';
```

**Lý do:** User yêu cầu sắp xếp ngược lại (sản phẩm cũ nhất trước).

#### **6.2. Error Handling Khi Cập Nhật Sản Phẩm**

**Thay đổi trong `router.put('/:id', ...)`:**
```javascript
// Trước:
catch (error) {
  console.error('Lỗi cập nhật sản phẩm:', error);
  res.status(500).json({ message: 'Lỗi server' });
}

// Sau:
catch (error) {
  console.error('Lỗi cập nhật sản phẩm:', error);
  // Kiểm tra nếu lỗi do giá trị quá lớn
  if (error.message && error.message.includes('Out of range')) {
    return res.status(400).json({ message: 'Giá sản phẩm quá lớn. Giá tối đa là 9,999,999,999.99 ₫' });
  }
  res.status(500).json({ 
    message: error.message || 'Lỗi server',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
}
```

**Lý do:** Cung cấp thông báo lỗi rõ ràng hơn cho admin.

---

## 7. Thêm Endpoint Xóa User

### **File: `server/routes/users.js`**

**Vấn đề:** Admin không thể xóa user vì endpoint `DELETE /api/users/:id` chưa được implement (trả về 501 Not Implemented).

**Thêm endpoint mới:**
```javascript
// Xóa user (Admin)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (userId === req.user.userId) {
      return res.status(400).json({ message: 'Không thể tự xóa tài khoản của bạn' });
    }

    const [existing] = await db.execute('SELECT id FROM users WHERE id = ?', [userId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    await db.execute('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'Xóa user thành công' });
  } catch (error) {
    console.error('Lỗi xóa user:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});
```

**Cập nhật Frontend: `client/src/pages/admin/Users.js`**
- Đã cập nhật để sử dụng `getApiUrl()` cho delete API call

---

## 8. Sửa Lỗi Product Detail - Hiển Thị Nhiều Ảnh

### **File: `client/src/pages/ProductDetail.js`**

**Vấn đề:** Trang chi tiết sản phẩm chỉ hiển thị 1 ảnh, không hiển thị gallery images.

**Nguyên nhân:** 
- Frontend đang fetch gallery images bằng relative URL (`/api/products/${id}/images`)
- Backend đã trả về `images` array trong `currentProduct` object từ Redux

**Thay đổi:**

**Trước:**
```javascript
// Fetch images riêng
useEffect(() => {
  const fetchImages = async () => {
    try {
      const response = await fetch(`/api/products/${id}/images`);
      const data = await response.json();
      setGalleryImages(data.images || []);
    } catch (error) {
      console.error('Lỗi tải ảnh:', error);
    }
  };
  fetchImages();
}, [id]);
```

**Sau:**
```javascript
// Sử dụng images từ currentProduct (đã có trong Redux)
useEffect(() => {
  if (currentProduct) {
    // Sử dụng images từ product object (đã được backend trả về)
    const images = currentProduct.images || [];
    setGalleryImages(images);
    
    // Set ảnh đầu tiên làm ảnh được chọn
    if (images.length > 0) {
      setSelectedImage(images[0].url);
    } else if (currentProduct.image) {
      setSelectedImage(currentProduct.image);
    } else {
      setSelectedImage(null);
    }
  } else {
    // Clear images khi không có product
    setSelectedImage(null);
    setGalleryImages([]);
  }
}, [currentProduct]);
```

**Render gallery:**
```javascript
{currentProduct.images && currentProduct.images.length > 0 && (
  <div className="image-gallery">
    {currentProduct.image && (
      <div
        className={`gallery-thumb ${selectedImage === currentProduct.image ? 'active' : ''}`}
        onClick={() => setSelectedImage(currentProduct.image)}
      >
        <img src={currentProduct.image} alt="Thumbnail" />
      </div>
    )}
    {currentProduct.images.map((img) => (
      <div
        key={img.id}
        className={`gallery-thumb ${selectedImage === img.url ? 'active' : ''}`}
        onClick={() => setSelectedImage(img.url)}
      >
        <img src={img.url} alt={`Gallery ${img.id}`} />
      </div>
    ))}
  </div>
)}
```

**Lý do:** 
- Giảm số lượng API calls không cần thiết
- Sử dụng dữ liệu đã có sẵn từ Redux
- Đảm bảo hoạt động đúng với production API base URL

---

## 9. Sửa CSS Homepage

### **File: `client/src/pages/Home.css`**

**Vấn đề:** Background của homepage không sát với navbar.

**Thay đổi:**

**Trước:**
```css
.home-page {
  /* ... */
}

.hero-section {
  padding: var(--spacing-8) 0 var(--spacing-20);
  /* ... */
}
```

**Sau:**
```css
.home-page {
  padding-top: var(--spacing-4);
  min-height: auto;
  background: transparent;
  /* ... */
}

.hero-section {
  /* ... */
}
```

**File: `client/src/pages/Home.js`**
- Thêm class `home-page` vào main content div:
  ```javascript
  <div className="main-content home-page">
    {/* ... */}
  </div>
  ```

---

## 📊 Tổng Kết

### **Số Lượng File Đã Sửa:**

| Loại | Số File |
|------|---------|
| **Backend** | 4 files |
| - `server/index.js` | CORS config |
| - `server/routes/orders.js` | JSON parsing |
| - `server/routes/products.js` | Error handling, sorting |
| - `server/routes/users.js` | DELETE endpoint |
| - `server/database/schema.sql` | DECIMAL(12,2) |
| **Frontend** | 13 files |
| - `client/src/config/api.js` | **MỚI** - API helper |
| - Redux slices (3 files) | API base URL |
| - Pages (5 files) | API base URL |
| - Admin pages (4 files) | API base URL |
| - Components (1 file) | API base URL |
| - `client/src/pages/ProductDetail.js` | Images display |
| - `client/src/pages/Home.css` | CSS alignment |
| - `client/src/pages/Home.js` | CSS class |

**Tổng cộng:** ~17 files đã được chỉnh sửa/thêm mới

### **Các Vấn Đề Đã Fix:**

✅ API calls không hoạt động (CORS + API base URL)  
✅ Admin không thể duyệt top-up (API base URL)  
✅ Admin không thể xóa user (thiếu endpoint)  
✅ Admin không thể cập nhật giá >= 100 triệu (DECIMAL limit)  
✅ Không xem được chi tiết đơn hàng (JSON parsing)  
✅ Sản phẩm sắp xếp sai thứ tự (ORDER BY)  
✅ Product detail chỉ hiển thị 1 ảnh (images array)  
✅ Homepage background không sát navbar (CSS)  

---

## 🔄 Quy Trình Deploy

Sau khi chỉnh sửa code:

1. **Backend (Railway):**
   ```powershell
   git add .
   git commit -m "Update: [mô tả thay đổi]"
   git push
   # Railway tự động deploy
   ```

2. **Frontend (Spaceship):**
   ```powershell
   cd client
   $env:REACT_APP_API_BASE="https://fullshopweb-production.up.railway.app"
   npm run build
   # Nén build/ thành build.zip
   # Upload lên Spaceship → tuananh.surf/
   ```

---

**Cập nhật lần cuối:** [Ngày hiện tại]  
**Phiên bản:** Production v1.0

