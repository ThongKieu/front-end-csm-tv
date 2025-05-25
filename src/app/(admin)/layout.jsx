'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/config/routes'
import SidebarOnlyLayout from '@/components/layout/SidebarOnlyLayout'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN)
    } else if (user?.role !== 'admin') {
      router.push(ROUTES.HOME)
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return <SidebarOnlyLayout>{children}</SidebarOnlyLayout>
} 