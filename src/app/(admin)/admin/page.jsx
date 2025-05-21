'use client'

import { useSelector } from 'react-redux'

export default function AdminPage() {
  const { user } = useSelector((state) => state.auth)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Trang quản trị
      </h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">
          Chào mừng đến với trang quản trị, {user?.name}!
        </p>
      </div>
    </div>
  )
} 