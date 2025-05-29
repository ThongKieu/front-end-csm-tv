"use client";

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/config/routes'
import SidebarOnlyLayout from '@/components/layout/SidebarOnlyLayout'

// import { SidebarOnlyLayout } from "@/components/SidebarOnlyLayout";

export default function AdminLayout({ children }) {
  const router = useRouter()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Chỉ chuyển hướng khi đã có thông tin user và không có quyền truy cập
    if (user && !['admin', 'manager'].includes(user.role)) {
      router.push('/dashboard')
    }
  }, [user, router])

  // Hiển thị loading khi đang kiểm tra quyền
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  // Chỉ render layout khi user có quyền
  if (!['admin', 'manager'].includes(user.role)) {
    return null
  }

  return <SidebarOnlyLayout>{children}</SidebarOnlyLayout>
} 