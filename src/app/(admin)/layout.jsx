'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Sidebar from '@/components/layout/Sidebar'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (user.role !== 'admin' && user.role !== 'accountant') {
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