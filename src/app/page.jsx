'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/config/routes'

export default function Home() {
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      if (isAuthenticated && user) {
        // Tất cả các role đều vào dashboard
        router.push('/dashboard')
      } else if (!isAuthenticated) {
        router.push(ROUTES.LOGIN)
      }
    }
  }, [isClient, isAuthenticated, user, router])

  // Hiển thị loading state
  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return null
} 