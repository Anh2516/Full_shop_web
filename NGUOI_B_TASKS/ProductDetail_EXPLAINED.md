# 📦 ProductDetail.js - Giải Thích Chi Tiết

## 📍 File: `src/pages/ProductDetail.js` + `ProductDetail.css`

## 🎯 Mục Đích

Trang hiển thị **chi tiết sản phẩm** với:
- Gallery hình ảnh (nhiều ảnh)
- Thông tin sản phẩm (tên, giá, mô tả, tồn kho)
- Chọn số lượng
- **Thêm vào giỏ hàng** (logic quan trọng của Người B)

---

## 📝 Code Chi Tiết - Phần 1: Imports & Setup

```javascript
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrentProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import BackButton from '../components/common/BackButton';
import './ProductDetail.css';
import { formatCurrency } from '../utils/currency';
```

**Giải thích:**
- `useParams`: Lấy `id` từ URL (`/products/:id`)
- `useNavigate`: Điều hướng (ví dụ: đến trang login)
- `useDispatch`, `useSelector`: Redux hooks
- `fetchProductById`: Action để lấy thông tin sản phẩm
- `addToCart`: **Action quan trọng** - thêm sản phẩm vào giỏ hàng
- `BackButton`: Component quay lại
- `formatCurrency`: Format giá tiền

---

## 📝 Code Chi Tiết - Phần 2: Component Setup

```javascript
const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, loading, error } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
```

**Giải thích:**
- `id`: ID sản phẩm từ URL
- `currentProduct`: Sản phẩm hiện tại từ Redux
- `loading`, `error`: Trạng thái loading và lỗi
- `isAuthenticated`: Kiểm tra đã đăng nhập chưa
- `quantity`: Số lượng muốn mua (mặc định: 1)
- `selectedImage`: Ảnh đang được chọn để hiển thị lớn
- `galleryImages`: Danh sách ảnh gallery

---

## 📝 Code Chi Tiết - Phần 3: Fetch Product Data

```javascript
useEffect(() => {
  // Clear current product và error khi ID thay đổi
  dispatch(clearCurrentProduct());
  setSelectedImage(null);
  setGalleryImages([]);
  // Fetch sản phẩm mới
  dispatch(fetchProductById(id));
}, [dispatch, id]);
```

**Giải thích:**
- Khi `id` thay đổi (người dùng xem sản phẩm khác):
  1. Clear sản phẩm cũ
  2. Reset ảnh
  3. Fetch sản phẩm mới

---

## 📝 Code Chi Tiết - Phần 4: Fetch Product Images

```javascript
useEffect(() => {
  if (currentProduct) {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/products/${id}/images`);
        if (!response.ok) {
          throw new Error('Không thể lấy ảnh');
        }
        const data = await response.json();
        setGalleryImages(data.images || []);
        // Set ảnh đầu tiên làm ảnh được chọn
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].url);
        } else if (currentProduct.image) {
          setSelectedImage(currentProduct.image);
        }
      } catch (error) {
        console.error('Lỗi lấy ảnh:', error);
        // Fallback: dùng ảnh đại diện
        if (currentProduct.image) {
          setSelectedImage(currentProduct.image);
        }
        setGalleryImages([]);
      }
    };
    fetchImages();
  }
}, [currentProduct, id]);
```

**Giải thích:**
- Khi có `currentProduct`:
  1. Fetch danh sách ảnh từ API `/api/products/${id}/images`
  2. Set `galleryImages` với danh sách ảnh
  3. Chọn ảnh đầu tiên làm `selectedImage`
  4. Nếu không có gallery, dùng ảnh đại diện (`currentProduct.image`)

---

## 📝 Code Chi Tiết - Phần 5: Handle Add To Cart (QUAN TRỌNG)

```javascript
const handleAddToCart = () => {
  if (!isAuthenticated) {
    alert('Vui lòng đăng nhập để mua hàng');
    navigate('/login');
    return;
  }

  if (currentProduct) {
    dispatch(addToCart({ product: currentProduct, quantity }));
    alert('Đã thêm vào giỏ hàng!');
  }
};
```

**Giải thích:**
- **Bước 1:** Kiểm tra đã đăng nhập chưa
  - Nếu chưa: Alert và redirect đến `/login`
- **Bước 2:** Nếu đã đăng nhập:
  - Dispatch `addToCart` với `product` và `quantity`
  - Hiển thị thông báo thành công

**Đây là logic chính của Người B:** Thêm sản phẩm vào giỏ hàng!

---

## 📝 Code Chi Tiết - Phần 6: Loading & Error States

```javascript
if (loading) {
  return <div className="main-content"><div className="loading">Đang tải...</div></div>;
}

if (error) {
  return (
    <div className="main-content">
      <div className="container">
        <BackButton fallback="/products" />
        <div className="error">
          <p>{error}</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}

if (!currentProduct && !loading) {
  return (
    <div className="main-content">
      <div className="container">
        <BackButton fallback="/products" />
        <div className="error">
          <p>Không tìm thấy sản phẩm</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Giải thích:**
- **Loading state:** Hiển thị "Đang tải..."
- **Error state:** Hiển thị lỗi và nút quay lại
- **Not found:** Hiển thị "Không tìm thấy sản phẩm"

---

## 📝 Code Chi Tiết - Phần 7: Main Render

```javascript
return (
  <div className="main-content">
    <div className="container">
      <BackButton fallback="/products" />
      <div className="product-detail">
        {/* Image Gallery */}
        <div className="product-image">
          <div className="main-image">
            <img src={selectedImage || currentProduct.image || '/placeholder.jpg'} alt={currentProduct.name} />
          </div>
          {galleryImages.length > 0 && (
            <div className="image-gallery">
              {/* Ảnh đại diện */}
              {currentProduct.image && (
                <div
                  className={`gallery-thumb ${selectedImage === currentProduct.image ? 'active' : ''}`}
                  onClick={() => setSelectedImage(currentProduct.image)}
                >
                  <img src={currentProduct.image} alt="Thumbnail" />
                </div>
              )}
              {/* Gallery images */}
              {galleryImages.map((img) => (
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
        </div>

        {/* Product Details */}
        <div className="product-details">
          <h1>{currentProduct.name}</h1>
          <p className="product-price">{formatCurrency(currentProduct.price)}</p>
          <p className="product-description">{currentProduct.description}</p>
          <p className="product-stock">Còn lại: {currentProduct.stock} sản phẩm</p>
          
          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label>Số lượng:</label>
            <input
              type="number"
              min="1"
              max={currentProduct.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>

          {/* Add to Cart Button */}
          <div className="product-actions">
            <button
              onClick={handleAddToCart}
              disabled={currentProduct.stock === 0}
              className="btn btn-primary"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
```

**Giải thích:**

### **Image Gallery:**
- **Main image:** Ảnh lớn hiển thị (`selectedImage`)
- **Thumbnails:** Danh sách ảnh nhỏ, click để chọn
- **Active state:** Ảnh được chọn có class `active`

### **Product Details:**
- **Tên, giá, mô tả, tồn kho:** Hiển thị thông tin sản phẩm
- **Quantity selector:** Input số lượng (min: 1, max: stock)
- **Add to Cart button:**
  - Disabled nếu `stock === 0`
  - Click gọi `handleAddToCart`

---

## 🎨 CSS (ProductDetail.css)

### **Layout:**
```css
.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 2 cột: ảnh | thông tin */
  gap: 40px;
}
```

### **Image Gallery:**
```css
.main-image {
  aspect-ratio: 1;  /* Vuông */
  overflow: hidden;
}

.gallery-thumb {
  width: 80px;
  height: 80px;
  cursor: pointer;
  border: 2px solid #ddd;
}

.gallery-thumb.active {
  border-color: #007bff;  /* Xanh khi được chọn */
}
```

### **Responsive:**
```css
@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;  /* 1 cột trên mobile */
  }
}
```

---

## 💡 Flow Hoạt Động

1. **User vào trang:** `/products/123`
2. **Component mount:** Fetch product với ID = 123
3. **Fetch images:** Lấy danh sách ảnh gallery
4. **User chọn số lượng:** Thay đổi `quantity`
5. **User click "Thêm vào giỏ hàng":**
   - Kiểm tra đăng nhập
   - Dispatch `addToCart` với product + quantity
   - Alert thành công

---

## 🔗 Dependencies

- **Redux:** `productSlice`, `cartSlice`
- **React Router:** `useParams`, `useNavigate`
- **Utils:** `formatCurrency`
- **Components:** `BackButton`

---

## ⚠️ Lưu Ý

1. **Authentication Check:** Phải đăng nhập mới thêm vào giỏ được
2. **Stock Check:** Disable button nếu hết hàng
3. **Image Fallback:** Có placeholder nếu không có ảnh
4. **Quantity Validation:** Min = 1, Max = stock

---

## ✅ Checklist Implementation

- [ ] Fetch product by ID
- [ ] Fetch product images gallery
- [ ] Display main image + thumbnails
- [ ] Quantity selector
- [ ] Add to cart logic (với auth check)
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design

