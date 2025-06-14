'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { ROUTES, getRoleBasedRoute } from '@/config/routes'
import HeaderOnlyLayout from '@/components/layout/HeaderOnlyLayout'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN)
      return
    }

    // Nếu đang ở trang chủ, chuyển hướng dựa vào role
    if (pathname === ROUTES.HOME) {
      const roleBasedRoute = getRoleBasedRoute(user?.role)
      if (roleBasedRoute !== ROUTES.HOME) {
        router.push(roleBasedRoute)
      }
    }
  }, [isAuthenticated, router, pathname, user?.role])

  if (!isAuthenticated) {
    return null
  }

  return <HeaderOnlyLayout>{children}</HeaderOnlyLayout>
} 