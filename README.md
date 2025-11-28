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

3. Tạo file `.env` trong thư mục `server`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shopweb_db
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

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

