# 🚀 Hướng Dẫn Build và Deploy

## 📦 Build Frontend (React)

### **Lệnh Build Cơ Bản:**

```powershell
cd client
npm run build
```

### **Lệnh Build Với API Base (Production):**

```powershell
cd client
$env:REACT_APP_API_BASE="https://fullshopweb-production.up.railway.app"
npm run build
```

**Giải thích:**
- `$env:REACT_APP_API_BASE` - Set biến môi trường cho API base URL
- `npm run build` - Build React app thành static files trong thư mục `build/`

**Kết quả:**
- Thư mục `client/build/` chứa các file static đã được build
- File chính: `build/index.html`, `build/static/js/`, `build/static/css/`

---

## 📤 Deploy Frontend Lên Spaceship Hosting

### **Bước 1: Build Frontend**

```powershell
# Vào thư mục client
cd client

# Set API base URL (quan trọng!)
$env:REACT_APP_API_BASE="https://fullshopweb-production.up.railway.app"

# Build
npm run build
```

### **Bước 2: Nén Thư Mục Build**

1. Vào thư mục `client/build/`
2. Chọn tất cả file và folder bên trong:
   - `index.html`
   - `static/` (folder)
   - `asset-manifest.json`
   - `.htaccess` (nếu có)
3. Nén thành `build.zip`

### **Bước 3: Upload Lên Spaceship**

1. Đăng nhập vào Spaceship hosting
2. Vào **File Manager**
3. Vào thư mục `tuananh.surf/` (document root)
4. **Xóa tất cả file cũ** (nếu có)
5. **Upload** file `build.zip`
6. **Giải nén** vào thư mục `tuananh.surf/`
7. Đảm bảo file `.htaccess` có trong thư mục

### **Bước 4: Kiểm Tra**

1. Mở trình duyệt: `https://tuananh.surf`
2. Hard reload: `Ctrl + Shift + R` (hoặc `Ctrl + F5`)
3. Kiểm tra console (F12) xem có lỗi không

---

## 🔧 Deploy Backend Lên Railway

### **Cách 1: Deploy Từ Git (Tự Động)**

1. **Commit và Push Code:**
```powershell
git add .
git commit -m "Update code"
git push
```

2. **Railway Tự Động Deploy:**
   - Railway sẽ tự động detect code mới
   - Tự động chạy `npm install` và `npm start`
   - Xem log trong Railway Dashboard → Deployments

### **Cách 2: Redeploy Thủ Công**

1. Vào Railway Dashboard: https://railway.app
2. Chọn service backend
3. Vào tab **"Deployments"**
4. Bấm nút **"Redeploy"**

---

## 📝 Scripts Có Sẵn

### **Frontend (client/package.json):**

```json
{
  "scripts": {
    "start": "react-scripts start",      // Chạy dev server (localhost:3000)
    "build": "react-scripts build",      // Build production
    "test": "react-scripts test",        // Chạy tests
    "eject": "react-scripts eject"       // Eject config (không nên dùng)
  }
}
```

**Sử dụng:**
```powershell
npm start    # Chạy dev server
npm run build  # Build production
```

### **Backend (server/package.json):**

```json
{
  "scripts": {
    "start": "node index.js",                    // Chạy production
    "dev": "nodemon index.js",                   // Chạy dev với auto-reload
    "seed": "node scripts/insertSampleData.js",  // Insert sample data
    "create-admin": "node scripts/createAdmin.js", // Tạo admin account
    "setup": "node scripts/setup.js"            // Setup database
  }
}
```

**Sử dụng:**
```powershell
npm start        # Chạy production
npm run dev      # Chạy dev với nodemon
npm run seed     # Insert sample data
```

---

## 🔄 Quy Trình Deploy Hoàn Chỉnh

### **1. Deploy Backend (Railway):**

```powershell
# Commit và push code
cd server
git add .
git commit -m "Update backend"
git push

# Railway tự động deploy
# Hoặc vào Railway Dashboard → Redeploy
```

### **2. Deploy Frontend (Spaceship):**

```powershell
# Build với API base đúng
cd client
$env:REACT_APP_API_BASE="https://fullshopweb-production.up.railway.app"
npm run build

# Nén build folder
# Upload build.zip lên Spaceship
# Giải nén vào tuananh.surf/
```

---

## ⚙️ Biến Môi Trường

### **Frontend (.env hoặc set trực tiếp):**

```powershell
# Windows PowerShell
$env:REACT_APP_API_BASE="https://fullshopweb-production.up.railway.app"

# Windows CMD
set REACT_APP_API_BASE=https://fullshopweb-production.up.railway.app

# Linux/Mac
export REACT_APP_API_BASE=https://fullshopweb-production.up.railway.app
```

### **Backend (.env trong server/):**

```env
PORT=5000
DB_HOST=nozomi.proxy.rlwy.net
DB_PORT=29905
DB_USER=root
DB_PASSWORD=qdVKzspGTdxILjIvhJGlevMVygYHXOqH
DB_NAME=railway
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
ALLOWED_ORIGINS=https://tuananh.surf,http://tuananh.surf
```

---

## 🐛 Troubleshooting

### **Lỗi: "Lỗi tải sản phẩm"**
- **Nguyên nhân:** API base URL sai hoặc chưa set
- **Giải pháp:** Rebuild với `REACT_APP_API_BASE` đúng

### **Lỗi: "Hello World" (WordPress)**
- **Nguyên nhân:** File WordPress còn trong document root
- **Giải pháp:** Xóa tất cả file WordPress, chỉ để file React build

### **Lỗi: "404 Not Found" khi refresh trang**
- **Nguyên nhân:** Thiếu file `.htaccess` cho React Router
- **Giải pháp:** Đảm bảo file `.htaccess` có trong `build/`

### **Lỗi: "CORS"**
- **Nguyên nhân:** Backend chưa cho phép origin từ frontend
- **Giải pháp:** Kiểm tra `ALLOWED_ORIGINS` trong backend `.env`

---

## 📋 Checklist Deploy

### **Backend:**
- [ ] Code đã commit và push lên Git
- [ ] Railway đã kết nối với GitHub repo
- [ ] Biến môi trường đã set đúng trong Railway
- [ ] Database đã được import schema và sample data
- [ ] Backend đang chạy (check Railway Dashboard)

### **Frontend:**
- [ ] Đã set `REACT_APP_API_BASE` đúng
- [ ] Đã chạy `npm run build`
- [ ] Thư mục `build/` đã được nén thành `build.zip`
- [ ] Đã upload và giải nén vào `tuananh.surf/`
- [ ] File `.htaccess` có trong thư mục
- [ ] Đã test trên browser

---

## 🎯 Lệnh Nhanh (Copy & Paste)

### **Build Frontend:**
```powershell
cd client
$env:REACT_APP_API_BASE="https://fullshopweb-production.up.railway.app"
npm run build
```

### **Deploy Backend (Git):**
```powershell
git add .
git commit -m "Deploy update"
git push
```

### **Kiểm Tra Backend:**
```powershell
curl https://fullshopweb-production.up.railway.app/api/products
```

---

**Lưu ý:** Luôn nhớ set `REACT_APP_API_BASE` trước khi build frontend!

