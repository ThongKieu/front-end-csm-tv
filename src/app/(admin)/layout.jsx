'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import SidebarOnlyLayout from '@/components/layout/SidebarOnlyLayout'
import AuthLoading from '@/components/AuthLoading'

export default function AdminLayout({ children }) {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    // Nếu đã hoàn tất loading và chưa đăng nhập hoặc không phải admin, redirect
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, user, router])

  // Hiển thị loading khi đang khôi phục authentication
  if (isLoading) {
    return <AuthLoading />
  }

  // Nếu chưa đăng nhập hoặc không phải admin, không hiển thị gì
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null
  }

  return <SidebarOnlyLayout>{children}</SidebarOnlyLayout>
} 