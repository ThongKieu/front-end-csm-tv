import { NextResponse } from 'next/server'
import { ROUTES } from '@/config/routes'

// Các route không cần authentication
const publicRoutes = [ROUTES.LOGIN, '/register', '/forgot-password']

// Các route theo role
const roleRoutes = {
  admin: [
    ROUTES.HOME,
    ROUTES.DASHBOARD,
    ROUTES.ADMIN.DASHBOARD,
    ROUTES.ADMIN.USERS,
    ROUTES.ADMIN.SCHEDULE,
    ROUTES.ADMIN.COMPANY,
    ROUTES.ADMIN.REPORTS,
    ROUTES.ADMIN.DOCUMENTS,
    ROUTES.ADMIN.SETTINGS,
    ROUTES.ADMIN.ZNS,
    ROUTES.CUSTOMER,
    ROUTES.WORK_SCHEDULE,
    ROUTES.SERVICES,
    ROUTES.REPORTS,
    ROUTES.SETTINGS,
    ROUTES.PROFILE,
    ROUTES.CHANGE_PASSWORD,
    '/workers'
  ],
  manager: [
    ROUTES.HOME,
    ROUTES.DASHBOARD,
    ROUTES.ADMIN.DASHBOARD,
    ROUTES.ADMIN.USERS,
    ROUTES.ADMIN.SCHEDULE,
    ROUTES.CUSTOMER,
    ROUTES.WORK_SCHEDULE,
    ROUTES.SERVICES,
    ROUTES.REPORTS,
    ROUTES.SETTINGS,
    ROUTES.PROFILE,
    ROUTES.CHANGE_PASSWORD,
    '/workers'
  ],
  accountant: [
    ROUTES.HOME,
    ROUTES.DASHBOARD,
    ROUTES.ACCOUNTANT.TRANSACTIONS,
    ROUTES.CUSTOMER,
    ROUTES.WORK_SCHEDULE,
    ROUTES.SERVICES,
    ROUTES.REPORTS,
    ROUTES.SETTINGS,
    ROUTES.PROFILE,
    ROUTES.CHANGE_PASSWORD,
    '/workers'
  ],
  user: [
    ROUTES.HOME,
    ROUTES.DASHBOARD,
    ROUTES.CUSTOMER,
    ROUTES.WORK_SCHEDULE,
    ROUTES.SERVICES,
    ROUTES.REPORTS,
    ROUTES.SETTINGS,
    ROUTES.PROFILE,
    ROUTES.CHANGE_PASSWORD,
    '/workers'
  ]
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
    const hasAccess = roleRoutes[userRole]?.some(route => {
      // Kiểm tra chính xác route hoặc route con
      return pathname === route || pathname.startsWith(route + '/')
    })
    
    if (!hasAccess) {
      // Nếu không có quyền, chuyển hướng về dashboard
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

// Helper function để lấy route dựa vào role
function getRoleBasedRoute(role) {
  switch (role) {
    case 'admin':
      return ROUTES.ADMIN.DASHBOARD;
    case 'manager':
      return ROUTES.ADMIN.DASHBOARD;
    case 'accountant':
      return ROUTES.ACCOUNTANT.TRANSACTIONS;
    case 'user':
      return ROUTES.HOME;
    default:
      return ROUTES.HOME;
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