'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { ROUTES, getRoleBasedRoute } from '@/config/routes'
import HeaderOnlyLayout from '@/components/layout/HeaderOnlyLayout'
import AuthGuard from '@/components/AuthGuard'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Chỉ kiểm tra role routing khi đã authenticated
    if (isAuthenticated && user) {
      console.log('DashboardLayout: Đã authenticated, kiểm tra role routing')
      // Nếu đang ở trang chủ, chuyển hướng dựa vào role
      if (pathname === ROUTES.HOME) {
        const roleBasedRoute = getRoleBasedRoute(user?.role)
        if (roleBasedRoute !== ROUTES.HOME) {
          console.log('DashboardLayout: Redirect to role-based route:', roleBasedRoute)
          router.push(roleBasedRoute)
        }
      }
    }
  }, [isAuthenticated, user, router, pathname])

  return (
    <HeaderOnlyLayout>{children}</HeaderOnlyLayout>
  )
} 