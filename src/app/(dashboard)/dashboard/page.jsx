// src/app/dashboard/page.jsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Button from '@/components/ui/Button'
import Header from '@/components/layout/Header'
import { ROUTES, getRoleBasedRoute } from '@/config/routes'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useSelector((state) => state.auth)

  // Chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!user) {
      router.push(ROUTES.LOGIN)
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Chào mừng, {user.name}!
              </h1>
              <p className="text-gray-600 mb-6">
                Đây là trang tổng quan của hệ thống. Bạn có thể truy cập các tính năng dựa trên vai trò của mình.
              </p>

              {/* Role-based Navigation */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Admin Section */}
                {user.role === 'admin' && (
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold text-indigo-900 mb-2">
                      Quản trị hệ thống
                    </h2>
                    <p className="text-indigo-700 mb-4">
                      Truy cập vào trang quản trị để quản lý người dùng và cài đặt hệ thống.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => router.push(ROUTES.ADMIN.ROOT)}
                    >
                      Vào trang quản trị
                    </Button>
                  </div>
                )}

                {/* Accountant Section */}
                {user.role === 'accountant' && (
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold text-green-900 mb-2">
                      Quản lý tài chính
                    </h2>
                    <p className="text-green-700 mb-4">
                      Truy cập vào trang kế toán để quản lý các giao dịch và báo cáo tài chính.
                    </p>
                    <Button
                      variant="success"
                      onClick={() => router.push(ROUTES.ACCOUNTANT.ROOT)}
                    >
                      Vào trang kế toán
                    </Button>
                  </div>
                )}

                {/* User Section */}
                {user.role === 'user' && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">
                      Trang người dùng
                    </h2>
                    <p className="text-blue-700 mb-4">
                      Truy cập vào trang người dùng để xem thông tin và thực hiện các thao tác.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => router.push(ROUTES.USER.ROOT)}
                    >
                      Vào trang người dùng
                    </Button>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Thống kê nhanh
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm font-medium text-gray-500">Vai trò</p>
                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {user.role === 'admin' ? 'Quản trị viên' : 
                       user.role === 'accountant' ? 'Kế toán' : 'Người dùng'}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}