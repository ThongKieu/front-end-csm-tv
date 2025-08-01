import { NextResponse } from 'next/server'
import { ROUTES } from '@/config/routes'

// Các route không cần authentication
const publicRoutes = [
  ROUTES.LOGIN, 
  '/register', 
  '/forgot-password',
  '/api/user/login',
  '/api/auth/login',
  '/api/auth/check',
  '/api/auth/verify',
  '/api/test-connection'
]

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
    ROUTES.QUOTES,
    '/quotes/create',
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
    ROUTES.QUOTES,
    '/quotes/create',
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
    ROUTES.QUOTES,
    '/quotes/create',
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
    ROUTES.QUOTES,
    '/quotes/create',
    '/workers'
  ]
}

// Helper function để kiểm tra token hợp lệ
function isTokenValid(token) {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Kiểm tra thời gian hết hạn
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

export function middleware(request) {
  // Tạm thời vô hiệu hóa middleware để test
  return NextResponse.next()
  
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  console.log('Middleware: Checking pathname:', pathname)
  console.log('Middleware: Token exists:', !!token)

  // Cho phép truy cập các route công khai
  if (publicRoutes.includes(pathname)) {
    console.log('Middleware: Public route, allowing access')
    return NextResponse.next()
  }

  // Kiểm tra token
  if (!token || !isTokenValid(token)) {
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