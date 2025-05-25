import { NextResponse } from 'next/server'
import { ROUTES } from '@/config/routes'

// Các route không cần authentication
const publicRoutes = [ROUTES.LOGIN, '/register', '/forgot-password']

// Các route theo role
const roleRoutes = {
  admin: [ROUTES.ADMIN.DASHBOARD, ROUTES.CUSTOMER],
  accountant: [ROUTES.ACCOUNTANT.TRANSACTIONS, ROUTES.CUSTOMER],
  user: [ROUTES.CUSTOMER]
}

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Cho phép truy cập các route công khai
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Kiểm tra token
  if (!token) {
    const url = new URL(ROUTES.LOGIN, request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // Kiểm tra quyền truy cập
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const userRole = payload.role

    // Kiểm tra quyền truy cập theo role
    const hasAccess = roleRoutes[userRole]?.some(route => pathname.startsWith(route))
    if (!hasAccess && !pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Token không hợp lệ
    const url = new URL(ROUTES.LOGIN, request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 