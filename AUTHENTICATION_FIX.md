# Sửa lỗi F5 redirect về trang login

## Vấn đề
Khi người dùng nhấn F5 (refresh trang), ứng dụng sẽ redirect về trang login mặc dù đã đăng nhập thành công.

## Nguyên nhân
1. **Middleware bị vô hiệu hóa**: Trong `src/middleware.js`, có dòng `return NextResponse.next()` khiến middleware không hoạt động.
2. **Race condition**: Khi F5, Redux store bị reset và cần thời gian để khôi phục authentication state từ localStorage.
3. **Authentication chỉ được kiểm tra ở client-side**: Các layout components kiểm tra authentication bằng `useEffect`, nhưng khi F5, component render trước khi `AuthProvider` kịp khôi phục state.

## Giải pháp đã thực hiện

### 1. Kích hoạt Middleware
- Bỏ comment dòng `return NextResponse.next()` trong `src/middleware.js`
- Middleware sẽ kiểm tra token trong cookie và redirect về login nếu không hợp lệ

### 2. Cải thiện AuthProvider
- Thêm delay 100ms trong `AuthProvider` để đảm bảo localStorage đã sẵn sàng
- Cải thiện việc khôi phục authentication state

### 3. Tạo AuthGuard Component
- Tạo component `src/components/AuthGuard.jsx` để bảo vệ các route cần authentication
- Hỗ trợ kiểm tra role (single role hoặc array of roles)
- Xử lý loading state và redirect tự động

### 4. Cập nhật các Layout Components
- Thay thế logic authentication trong các layout bằng `AuthGuard`
- Đơn giản hóa code và tránh duplicate logic

### 5. Cải thiện auth utils
- Thêm kiểm tra localStorage availability trong `restoreAuthState`
- Cải thiện error handling

## Các file đã thay đổi

### 1. `src/middleware.js`
```javascript
// Bỏ comment để kích hoạt middleware
// return NextResponse.next()
```

### 2. `src/providers/AuthProvider.jsx`
```javascript
// Thêm delay để đảm bảo localStorage sẵn sàng
const timer = setTimeout(() => {
  const authState = restoreAuthState()
  // ... logic khôi phục
}, 100)
```

### 3. `src/components/AuthGuard.jsx` (mới)
```javascript
export default function AuthGuard({ children, requiredRole = null }) {
  // Kiểm tra authentication và role
  // Hỗ trợ single role hoặc array of roles
}
```

### 4. `src/app/(dashboard)/layout.jsx`
```javascript
// Thay thế logic authentication bằng AuthGuard
return (
  <AuthGuard>
    <HeaderOnlyLayout>{children}</HeaderOnlyLayout>
  </AuthGuard>
)
```

### 5. `src/app/(admin)/layout.jsx`
```javascript
// Sử dụng AuthGuard với role requirement
return (
  <AuthGuard requiredRole="admin">
    <SidebarOnlyLayout>{children}</SidebarOnlyLayout>
  </AuthGuard>
)
```

### 6. `src/app/(accountant)/layout.jsx`
```javascript
// Sử dụng AuthGuard với role requirement
return (
  <AuthGuard requiredRole="accountant">
    <SidebarOnlyLayout>{children}</SidebarOnlyLayout>
  </AuthGuard>
)
```

### 7. `src/app/admin/layout.jsx`
```javascript
// Sử dụng AuthGuard với multiple roles
return (
  <AuthGuard requiredRole={['admin', 'manager']}>
    <SidebarOnlyLayout>{children}</SidebarOnlyLayout>
  </AuthGuard>
)
```

### 8. `src/utils/auth.js`
```javascript
// Thêm kiểm tra localStorage availability
if (typeof window === 'undefined' || !window.localStorage) {
  return null;
}
```

## Kết quả
- ✅ F5 không còn redirect về login khi đã đăng nhập
- ✅ Authentication state được khôi phục đúng cách từ localStorage
- ✅ Middleware hoạt động để bảo vệ routes
- ✅ Code được tối ưu và dễ maintain hơn
- ✅ Hỗ trợ kiểm tra role linh hoạt

## Lưu ý
- Đảm bảo token được lưu vào cả localStorage và cookie
- Cookie được sử dụng cho middleware (server-side)
- localStorage được sử dụng cho client-side authentication
- AuthGuard component có thể được sử dụng cho bất kỳ route nào cần bảo vệ 