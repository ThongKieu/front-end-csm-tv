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
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    console.log('DashboardLayout: useEffect triggered', { 
      isLoading, 
      isAuthenticated, 
      user: user?.role,
      userData: user 
    })
    
    // Chỉ redirect khi đã hoàn tất quá trình loading và đã đăng nhập
    if (!isLoading && isAuthenticated && user) {
      const roleBasedRoute = getRoleBasedRoute(user.role)
      console.log('DashboardLayout: Redirecting to role-based route:', roleBasedRoute)
      router.push(roleBasedRoute)
    }
  }, [isAuthenticated, isLoading, user, router])

  // Hiển thị loading khi đang khôi phục authentication
  if (isLoading) {
    return <AuthLoading />
  }

  // Nếu đã đăng nhập, không hiển thị gì (sẽ redirect)
  if (isAuthenticated && user) {
    return null
  }

  // Nếu chưa đăng nhập, hiển thị layout tương ứng với role
  if (user?.role === 'admin') {
    return <AdminLayout>{children}</AdminLayout>
  } else if (user?.role === 'accountant') {
    return <SidebarOnlyLayout>{children}</SidebarOnlyLayout>
  } else {
    return <HeaderOnlyLayout>{children}</HeaderOnlyLayout>
  }
} 