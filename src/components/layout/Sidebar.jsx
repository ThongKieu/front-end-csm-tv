'use client'

import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/store/slices/authSlice'
import Button from '@/components/ui/Button'

export default function Sidebar() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  const menuItems = {
    admin: [
      { label: 'Tổng quan', href: '/admin', icon: '📊' },
      { label: 'Quản lý người dùng', href: '/admin/users', icon: '👥' },
      { label: 'Cài đặt hệ thống', href: '/admin/settings', icon: '⚙️' },
    ],
    accountant: [
      { label: 'Tổng quan', href: '/accountant', icon: '📊' },
      { label: 'Quản lý giao dịch', href: '/accountant/transactions', icon: '💰' },
      { label: 'Báo cáo tài chính', href: '/accountant/reports', icon: '📈' },
    ]
  }

  const currentMenu = menuItems[user?.role] || []

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white w-64">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <span className="text-xl font-bold">LOGO</span>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            className="h-10 w-10 rounded-full"
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff`}
            alt={user?.name}
          />
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {currentMenu.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="outline"
          className="w-full justify-start text-white border-gray-600 hover:bg-gray-700"
          onClick={handleLogout}
        >
          <span className="mr-2">🚪</span>
          Đăng xuất
        </Button>
      </div>
    </div>
  )
} 