# Debug vấn đề không thể đăng nhập

## Vấn đề hiện tại
Sau khi sửa lỗi F5 redirect về login, người dùng không thể đăng nhập vào được.

## Các thay đổi đã thực hiện để debug

### 1. Tạm thời vô hiệu hóa Middleware
- Đã comment middleware trong `src/middleware.js` để loại trừ middleware khỏi nguyên nhân
- Middleware có thể chặn API calls hoặc redirect quá nghiêm ngặt

### 2. Sửa lỗi trong AuthProvider
- Có 2 return statements trong useEffect gây ra cleanup function không hoạt động
- Đã sửa để chỉ có 1 return statement với cleanup function đúng

### 3. Thêm delay trong AuthGuard
- Thêm setTimeout 100ms trước khi redirect để tránh redirect quá nhanh
- Có thể có race condition giữa việc khôi phục auth state và redirect

### 4. Tạo trang test đăng nhập
- Tạo `/test-login` để debug riêng biệt
- Hiển thị auth state và response từ API
- Không sử dụng AuthGuard để loại trừ vấn đề

## Các bước debug tiếp theo

### Bước 1: Test trang /test-login
1. Truy cập `http://localhost:3000/test-login`
2. Kiểm tra auth state hiển thị
3. Thử đăng nhập và xem response

### Bước 2: Kiểm tra Console
1. Mở Developer Tools
2. Xem console logs từ:
   - AuthProvider
   - AuthGuard
   - TestLogin component
   - API response

### Bước 3: Kiểm tra Network
1. Xem Network tab trong Developer Tools
2. Kiểm tra request đến `/api/user/login`
3. Xem response từ backend

### Bước 4: Kiểm tra Backend
1. Đảm bảo backend server đang chạy
2. Test API endpoint trực tiếp
3. Kiểm tra CORS settings

## Các nguyên nhân có thể

### 1. Backend không hoạt động
- Server backend không chạy
- IP/port không đúng
- CORS issues

### 2. API response format không đúng
- Backend trả về format khác với expected
- Missing token hoặc user data

### 3. AuthProvider/AuthGuard issues
- Race condition trong việc khôi phục auth state
- Redirect quá nhanh trước khi auth state được khôi phục

### 4. localStorage issues
- localStorage không sẵn sàng khi component mount
- Data corruption trong localStorage

## Cách khôi phục

### Nếu backend không hoạt động:
1. Start backend server
2. Kiểm tra IP/port trong `src/config/constants.js`
3. Test connection bằng `/api/test-connection`

### Nếu API response format khác:
1. Kiểm tra response format từ backend
2. Cập nhật logic xử lý trong `LoginClient.jsx`
3. Cập nhật `authSlice.js` nếu cần

### Nếu AuthProvider/AuthGuard issues:
1. Tăng delay trong AuthProvider
2. Cải thiện logic khôi phục auth state
3. Thêm more detailed logging

### Nếu localStorage issues:
1. Clear localStorage và thử lại
2. Kiểm tra localStorage availability
3. Thêm error handling cho localStorage operations

## Test cases

### Test Case 1: Backend Connection
```bash
curl -X POST http://192.168.1.27/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"user_name":"test","password":"test"}'
```

### Test Case 2: Frontend API
```javascript
fetch('/api/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_name: 'test', password: 'test' })
})
.then(res => res.json())
.then(data => console.log(data))
```

### Test Case 3: localStorage
```javascript
// Kiểm tra localStorage
console.log('localStorage available:', typeof window !== 'undefined' && window.localStorage)
console.log('auth_token:', localStorage.getItem('auth_token'))
console.log('auth_user:', localStorage.getItem('auth_user'))
``` 