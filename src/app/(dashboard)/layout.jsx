'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/config/routes'
import HeaderOnlyLayout from '@/components/layout/HeaderOnlyLayout'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN)
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return <HeaderOnlyLayout>{children}</HeaderOnlyLayout>
} 