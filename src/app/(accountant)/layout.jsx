'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { ROUTES } from '@/config/routes'
import { verifyToken } from '@/store/slices/authSlice'
import SidebarOnlyLayout from '@/components/layout/SidebarOnlyLayout'

export default function AccountantLayout({ children }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(verifyToken())
        .unwrap()
        .catch(() => {
          router.push(ROUTES.LOGIN)
        })
    } else if (user?.role !== 'accountant') {
      router.push(ROUTES.HOME)
    }
  }, [isAuthenticated, user, router, dispatch])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'accountant') {
    return null
  }

  return <SidebarOnlyLayout>{children}</SidebarOnlyLayout>
} 