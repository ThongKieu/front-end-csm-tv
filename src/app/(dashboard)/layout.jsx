'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { ROUTES, getRoleBasedRoute } from '@/config/routes'
import AuthLoading from '@/components/AuthLoading'
import SidebarOnlyLayout from '@/components/layout/SidebarOnlyLayout'
import HeaderOnlyLayout from '@/components/layout/HeaderOnlyLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }) {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth)

  console.log('DashboardLayout: Render', { 
    isLoading, 
    isAuthenticated, 
    user: user?.role,
    userData: user 
  })

  // Hiển thị loading khi đang khôi phục authentication
  if (isLoading) {
    return <AuthLoading />
  }

  // Nếu chưa đăng nhập, redirect to login
  if (!isAuthenticated || !user) {
    return null // Sẽ được redirect bởi AuthGuard
  }

  // Nếu đã đăng nhập, hiển thị layout tương ứng với role
  if (user?.role === 'admin') {
    return <AdminLayout>{children}</AdminLayout>
  } else if (user?.role === 'accountant') {
    return <SidebarOnlyLayout>{children}</SidebarOnlyLayout>
  } else {
    return <HeaderOnlyLayout>{children}</HeaderOnlyLayout>
  }
} 