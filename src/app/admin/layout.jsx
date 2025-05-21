'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Sidebar from '@/components/layout/Sidebar'
import { defaultMetadata } from '../metadata'

export const metadata = {
  ...defaultMetadata,
  title: 'CSM TV - Quản trị hệ thống',
  description: 'Trang quản trị hệ thống CSM TV - Quản lý người dùng và cài đặt',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({ children }) {
  const router = useRouter()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
} 