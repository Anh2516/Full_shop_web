-- Migration: Fix total column size in orders table
-- Chạy file này để sửa lỗi "Out of range value for column 'total'"

USE shopweb_db;

-- Tăng kích thước cột total từ DECIMAL(10,2) lên DECIMAL(12,2)
-- DECIMAL(12,2) hỗ trợ giá trị lên đến 9,999,999,999.99 (gần 10 tỷ)
ALTER TABLE orders 
MODIFY COLUMN total DECIMAL(12, 2) NOT NULL;

SELECT 'Migration completed: total column updated to DECIMAL(12,2)' AS Status;

