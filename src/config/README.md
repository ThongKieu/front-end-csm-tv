# Hướng dẫn cấu hình API động

## Tổng quan
Hệ thống này cho phép bạn thay đổi tên miền API từ một vị trí duy nhất mà không cần sửa code. **Tất cả đường dẫn cứng đã được thay thế bằng hệ thống cấu hình động.**

## Cách thay đổi tên miền

### 1. Thay đổi từ file environment.js
Mở file `src/config/environment.js` và sửa giá trị `API_BASE_URL`:

```javascript
export const ENV_CONFIG = {
  // Thay đổi tên miền ở đây
  API_BASE_URL: 'https://your-new-domain.com',
  // ...
};
```

### 2. Sử dụng biến môi trường (Khuyến nghị)
Tạo file `.env.local` trong thư mục gốc của dự án:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://your-new-domain.com
NEXT_PUBLIC_API_PORT=3000
```

**Hoặc copy file `env.example` thành `.env.local` và sửa giá trị.**

### 3. Thay đổi động trong code
```javascript
import { setBackendUrl, switchEnvironment } from '@/config/constants';

// Thay đổi tên miền tùy ý
setBackendUrl('https://new-domain.com');

// Hoặc chuyển đổi môi trường
switchEnvironment('PRODUCTION');
```

## Cách sử dụng API URLs

### Sử dụng URLs có sẵn
```javascript
import { API_URLS } from '@/config/constants';

// Sử dụng trực tiếp
fetch(API_URLS.JOB_GET_BY_DATE)
  .then(response => response.json())
  .then(data => console.log(data));

// Hoặc với axios
const response = await axios.post(API_URLS.JOB_CREATE, formData);
```

### Tạo URL động
```javascript
import { getApiUrl } from '@/config/constants';

// Lấy URL với môi trường hiện tại
const url = getApiUrl('/api/web/job/get-by-date');

// Lấy URL với môi trường cụ thể
const productionUrl = getApiUrl('/api/web/job/get-by-date', 'PRODUCTION');
```

### Lấy tất cả URLs của một môi trường
```javascript
import { getEnvironmentApiUrls } from '@/config/constants';

// Lấy tất cả URLs của môi trường production
const productionUrls = getEnvironmentApiUrls('PRODUCTION');
console.log(productionUrls.JOB.GET_BY_DATE);
```

## Các môi trường có sẵn
- `DEVELOPMENT`: http://192.168.1.46
- `STAGING`: https://staging-api.yourdomain.com
- `PRODUCTION`: https://api.yourdomain.com
- `LOCAL`: http://localhost:3000

## Files đã được cập nhật
✅ `src/components/layout/CreateScheduleModal.jsx` - Thay thế `http://192.168.1.46/api/web/job/create` bằng `API_URLS.JOB_CREATE`
✅ `src/app/api/jobs/route.js` - Thay thế `http://192.168.1.46/api/web/job/get-by-date` bằng `API_URLS.JOB_GET_BY_DATE`

## Lưu ý
- Khi thay đổi tên miền, tất cả API calls sẽ tự động sử dụng tên miền mới
- Không cần sửa code ở các component khác
- Hệ thống hỗ trợ cả HTTP và HTTPS
- Có thể thêm port nếu cần thiết
- **Tất cả đường dẫn cứng đã được loại bỏ khỏi code**
