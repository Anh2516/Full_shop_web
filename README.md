# ShopWeb - Hệ thống website bán hàng

Hệ thống website bán hàng đầy đủ với React, Redux, Node.js, Express và MySQL.

## Tính năng

### Người dùng
- Đăng ký và đăng nhập
- Xem danh sách sản phẩm
- Tìm kiếm sản phẩm
- Xem chi tiết sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng

### Admin
- Dashboard với thống kê tổng quan
- Quản lý sản phẩm (thêm, sửa, xóa)
- Quản lý đơn hàng (xem, cập nhật trạng thái)
- Quản lý người dùng
- Quản lý danh mục sản phẩm

## Công nghệ sử dụng

### Frontend
- React 18
- Redux Toolkit
- React Router
- Axios

### Backend
- Node.js
- Express
- MySQL
- JWT Authentication
- bcryptjs

## Cài đặt

### 1. Cài đặt dependencies

```bash
# Cài đặt tất cả dependencies
npm run install-all

# Hoặc cài đặt riêng từng phần
cd server && npm install
cd ../client && npm install
```

### 2. Thiết lập Database

1. Tạo database MySQL
2. Chạy file SQL để tạo schema:
```bash
mysql -u root -p < server/database/schema.sql
```

3. **Setup tự động (Khuyến nghị):**
```bash
# Từ thư mục root, chạy script setup tự động
npm run setup
```

Script này sẽ tự động:
- ✅ Kiểm tra kết nối database
- ✅ Kiểm tra các bảng đã tồn tại
- ✅ Tạo tài khoản admin (Email: `manager@shop.com`, Password: `manager123`)

**Hoặc setup thủ công:**
```bash
cd server
npm run create-admin # Tạo admin
```

4. Tạo file `.env` trong thư mục `server`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shopweb_db
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d

# Chọn provider upload ảnh (imgbb, imgur, cloudinary, imagekit)
IMAGE_UPLOAD_PROVIDER=imgbb

# Cấu hình ImgBB (miễn phí, dễ dùng)
IMGBB_API_KEY=your_imgbb_api_key_here

# Cấu hình Imgur (miễn phí, không cần API key cho public)
IMGUR_CLIENT_ID=your_imgur_client_id_here

# Cấu hình Cloudinary (free tier: 25GB storage, 25GB bandwidth/tháng)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=ml_default

# Cấu hình ImageKit (free tier: 20GB storage)
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

**Cách lấy API Key cho từng provider:**

**1. ImgBB (Khuyến nghị - đơn giản nhất):**
- Truy cập [https://api.imgbb.com/](https://api.imgbb.com/)
- Đăng ký/đăng nhập → Vào phần "API" → Copy API key
- Giới hạn: 32MB/file, không giới hạn số lượng

**2. Imgur:**
- Truy cập [https://api.imgur.com/oauth2/addclient](https://api.imgur.com/oauth2/addclient)
- Tạo ứng dụng → Copy Client ID
- Giới hạn: 10MB/file, không giới hạn số lượng

**3. Cloudinary (Tốt nhất cho production):**
- Truy cập [https://cloudinary.com/](https://cloudinary.com/)
- Đăng ký miễn phí → Dashboard → Copy Cloud Name, API Key, API Secret
- Tạo Upload Preset (Settings → Upload → Upload presets)
- Free tier: 25GB storage, 25GB bandwidth/tháng

**4. ImageKit:**
- Truy cập [https://imagekit.io/](https://imagekit.io/)
- Đăng ký miễn phí → Dashboard → Copy Public Key, Private Key, URL Endpoint
- Free tier: 20GB storage, 20GB bandwidth/tháng

### 3. Chạy ứng dụng

```bash
# Chạy cả backend và frontend
npm run dev

# Hoặc chạy riêng từng phần
npm run server  # Backend tại http://localhost:5000
npm run client  # Frontend tại http://localhost:3000
```

## Tài khoản Admin và Dữ liệu mẫu

### Tạo tài khoản Admin

```bash
cd server
node scripts/createAdmin.js
```

Tài khoản admin:
- Email: admin@shop.com
- Password: admin123

### Thêm dữ liệu mẫu

Để thêm dữ liệu mẫu (categories, products, users, orders):

```bash
cd server
npm run seed
```

Hoặc:

```bash
cd server
node scripts/insertSampleData.js
```

**Dữ liệu mẫu bao gồm:**
- 6 categories (Điện thoại, Laptop, Phụ kiện, Đồ gia dụng, Thời trang, Sách)
- 4 users (1 admin + 3 users)
- 24 products (điện thoại, laptop, phụ kiện, đồ gia dụng, thời trang, sách)
- 5 orders mẫu

**Tài khoản đăng nhập:**
- Admin: admin@shop.com / password123
- User: user1@example.com / password123
- User: user2@example.com / password123
- User: user3@example.com / password123

**Lưu ý:** Đổi mật khẩu sau khi đăng nhập lần đầu!

## Setup tự động

Khi clone project từ GitHub, bạn có thể sử dụng script setup tự động:

```bash
# Từ thư mục root
npm run setup
```

Script này sẽ tự động:
- ✅ Kiểm tra kết nối database
- ✅ Kiểm tra các bảng đã tồn tại
- ✅ Tạo tài khoản admin

**Hoặc setup thủ công:**
```bash
# Tạo database
mysql -u root -p < server/database/schema.sql

# Tạo tài khoản admin
cd server
npm run create-admin
```

## Cấu trúc dự án

```
ShopWeb_cs/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Pages
│   │   ├── store/          # Redux store và slices
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Database và auth config
│   ├── routes/             # API routes
│   ├── database/           # SQL schema
│   └── index.js
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/my-orders` - Lấy đơn hàng của user
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `GET /api/orders/admin/all` - Lấy tất cả đơn hàng (Admin)
- `PUT /api/orders/:id/status` - Cập nhật trạng thái (Admin)

### Admin
- `GET /api/admin/stats` - Thống kê tổng quan
- `GET /api/admin/categories` - Lấy danh mục
- `POST /api/admin/categories` - Tạo danh mục
- `PUT /api/admin/categories/:id` - Cập nhật danh mục
- `DELETE /api/admin/categories/:id` - Xóa danh mục

## Lưu ý

- Đảm bảo MySQL đang chạy trước khi start server
- Thay đổi JWT_SECRET trong production
- Cấu hình CORS nếu cần thiết
- Thêm validation và error handling đầy đủ cho production

