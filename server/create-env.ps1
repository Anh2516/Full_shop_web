# Script tạo file .env
$envPath = Join-Path $PSScriptRoot ".env"

if (Test-Path $envPath) {
    Write-Host "File .env đã tồn tại!" -ForegroundColor Yellow
    Write-Host "Nội dung hiện tại:" -ForegroundColor Cyan
    Get-Content $envPath
    Write-Host "`nBạn có muốn ghi đè không? (y/n): " -NoNewline
    $response = Read-Host
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Đã hủy." -ForegroundColor Red
        exit
    }
}

Write-Host "`nTạo file .env..." -ForegroundColor Green
Write-Host "Nhập mật khẩu MySQL (nhấn Enter nếu không có mật khẩu): " -NoNewline
$password = Read-Host

$envContent = @"
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=$password
DB_NAME=shopweb_db
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
"@

$envContent | Out-File -FilePath $envPath -Encoding utf8

Write-Host "`n✅ Đã tạo file .env thành công!" -ForegroundColor Green
Write-Host "`nNội dung file:" -ForegroundColor Cyan
Get-Content $envPath

