# Hướng dẫn đẩy code lên Git/GitHub

## Bước 1: Khởi tạo Git repository

```bash
# Khởi tạo git repository
git init

# Thêm tất cả files vào staging
git add .

# Commit lần đầu
git commit -m "Initial commit: ShopWeb - Hệ thống bán hàng với React, Redux và MySQL"
```

## Bước 2: Tạo repository trên GitHub

1. Đăng nhập vào [GitHub](https://github.com)
2. Click vào dấu **+** ở góc trên bên phải → **New repository**
3. Đặt tên repository (ví dụ: `shopweb-cs`)
4. Chọn **Public** hoặc **Private**
5. **KHÔNG** tích vào "Initialize with README" (vì đã có code rồi)
6. Click **Create repository**

## Bước 3: Kết nối local repository với GitHub

```bash
# Thêm remote repository (thay YOUR_USERNAME và YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Hoặc nếu dùng SSH:
# git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# Kiểm tra remote đã được thêm chưa
git remote -v
```

## Bước 4: Đẩy code lên GitHub

```bash
# Đẩy code lên branch main
git branch -M main
git push -u origin main
```

Nếu lần đầu push, GitHub sẽ yêu cầu đăng nhập:
- Username: tên GitHub của bạn
- Password: sử dụng Personal Access Token (không phải mật khẩu GitHub)

## Tạo Personal Access Token (nếu cần)

1. Vào GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Đặt tên token, chọn quyền: `repo` (full control)
4. Click **Generate token**
5. Copy token và dùng làm password khi push

## Các lệnh Git thường dùng

### Xem trạng thái
```bash
git status
```

### Thêm file vào staging
```bash
git add .                    # Thêm tất cả
git add filename.js          # Thêm file cụ thể
```

### Commit thay đổi
```bash
git commit -m "Mô tả thay đổi"
```

### Đẩy code lên GitHub
```bash
git push origin main
```

### Lấy code mới nhất
```bash
git pull origin main
```

### Xem lịch sử commit
```bash
git log
```

### Tạo branch mới
```bash
git checkout -b feature-name
```

### Chuyển branch
```bash
git checkout main
```

## Lưu ý quan trọng

⚠️ **File `.env` đã được thêm vào `.gitignore`** - không được commit file chứa mật khẩu!

⚠️ **File `node_modules/` cũng đã được ignore** - không cần commit

✅ **Nên commit:**
- Source code (.js, .jsx, .css, .sql)
- Configuration files (package.json, README.md)
- Documentation

## Troubleshooting

### Lỗi: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Lỗi: "failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### Xóa file đã commit nhầm
```bash
git rm --cached filename
git commit -m "Remove file"
```

