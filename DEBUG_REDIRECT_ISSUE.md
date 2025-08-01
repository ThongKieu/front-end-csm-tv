# Debug vấn đề redirect sau khi đăng nhập

## Vấn đề hiện tại
Đăng nhập thành công nhưng không vào được trang chủ, có thể bị redirect về login hoặc stuck ở trang loading.

## Các thay đổi đã thực hiện để debug

### 1. Sửa getRoleBasedRoute
- Thêm case cho `manager` role
- Thay đổi default route từ `ROUTES.HOME` thành `ROUTES.DASHBOARD`
- Đảm bảo tất cả roles đều có route hợp lệ

### 2. Thêm logging cho LoginPage
- Log auth state khi useEffect triggered
- Log route được redirect đến

### 3. Tăng delay trong AuthGuard và AuthProvider
- Tăng delay từ 100ms lên 200ms để tránh race condition
- Cho phép auth state được cập nhật đầy đủ trước khi redirect

### 4. Tạm thời bỏ AuthGuard trong DashboardLayout
- Bỏ AuthGuard để loại trừ vấn đề redirect quá nhanh
- Cho phép truy cập dashboard trực tiếp

### 5. Tạo trang test auth state
- Tạo `/test-auth` để kiểm tra auth state
- Hiển thị thông tin chi tiết về authentication

## Các bước debug tiếp theo

### Bước 1: Test trang /test-auth
1. Truy cập `http://localhost:3000/test-auth`
2. Kiểm tra auth state hiển thị
3. Thử đăng nhập và xem auth state thay đổi

### Bước 2: Test đăng nhập và redirect
1. Truy cập `http://localhost:3000/login`
2. Đăng nhập thành công
3. Xem console logs để kiểm tra redirect logic

### Bước 3: Test dashboard trực tiếp
1. Sau khi đăng nhập, truy cập `http://localhost:3000/dashboard`
2. Kiểm tra xem có vào được không
3. Xem console logs từ DashboardLayout

### Bước 4: Kiểm tra role-based routing
1. Kiểm tra user role trong response từ API
2. Kiểm tra route được redirect đến có đúng không
3. Đảm bảo route tồn tại và có thể truy cập

## Các nguyên nhân có thể

### 1. AuthGuard redirect quá nhanh
- AuthGuard redirect về login trước khi auth state được cập nhật
- Race condition giữa login success và auth state restoration

### 2. Role-based routing không đúng
- getRoleBasedRoute không trả về route hợp lệ
- Route được redirect đến không tồn tại hoặc có AuthGuard

### 3. Auth state không được cập nhật đúng
- Redux state không được cập nhật sau khi login
- localStorage không được lưu đúng cách

### 4. Login page redirect logic có vấn đề
- useEffect trong LoginPage không trigger đúng
- Router.push không hoạt động

## Cách khôi phục

### Nếu AuthGuard là nguyên nhân:
1. Tăng delay trong AuthGuard
2. Cải thiện logic kiểm tra auth state
3. Thêm more detailed logging

### Nếu role-based routing có vấn đề:
1. Kiểm tra user role từ API response
2. Cập nhật getRoleBasedRoute function
3. Đảm bảo route tồn tại

### Nếu auth state không được cập nhật:
1. Kiểm tra Redux devtools
2. Kiểm tra localStorage
3. Cải thiện authSlice logic

### Nếu login page redirect có vấn đề:
1. Kiểm tra useEffect dependencies
2. Thêm manual redirect button
3. Debug router.push

## Test cases

### Test Case 1: Auth State Check
```javascript
// Kiểm tra auth state trong Redux
console.log('Redux auth state:', store.getState().auth)

// Kiểm tra localStorage
console.log('localStorage auth_token:', localStorage.getItem('auth_token'))
console.log('localStorage auth_user:', localStorage.getItem('auth_user'))
```

### Test Case 2: Role-based Route
```javascript
// Test getRoleBasedRoute function
import { getRoleBasedRoute } from '@/config/routes'

console.log('admin route:', getRoleBasedRoute('admin'))
console.log('manager route:', getRoleBasedRoute('manager'))
console.log('user route:', getRoleBasedRoute('user'))
```

### Test Case 3: Manual Navigation
```javascript
// Test manual navigation
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/dashboard') // Test direct navigation
```

## Debugging Steps

1. **Clear localStorage và thử lại**
2. **Kiểm tra console logs từ tất cả components**
3. **Test từng route một cách riêng biệt**
4. **Sử dụng Redux devtools để kiểm tra state**
5. **Test với các user roles khác nhau** 