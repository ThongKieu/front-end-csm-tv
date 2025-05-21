import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Các route không cần authentication
const publicRoutes = ['/login', '/register', '/forgot-password']

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Bỏ qua các route public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Lấy token từ cookie
  const token = request.cookies.get('token')?.value

  // Nếu không có token, chuyển về trang login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    )
    const { payload } = await jwtVerify(token, secret)

    // Kiểm tra role cho các route được bảo vệ
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (pathname.startsWith('/accountant') && payload.role !== 'accountant') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Thêm user info vào headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-role', payload.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // Token không hợp lệ, chuyển về trang login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Chỉ áp dụng middleware cho các route cần bảo vệ
export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/accountant/:path*',
    '/login',
    '/register',
    '/forgot-password'
  ],
} 