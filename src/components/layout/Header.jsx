'use client'

import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '@/store/slices/authSlice'
import { ROUTES } from '@/config/routes'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  const menus = [
    { label: 'Trang chủ', route: ROUTES.HOME },
    { label: 'Khách hàng cũ', route: ROUTES.CUSTOMER },
  ]

  if (user?.role === 'admin') {
    menus.push({ label: 'Quản lý người dùng', route: ROUTES.ADMIN.USERS })
  }
  if (user?.role === 'accountant') {
    menus.push({ label: 'Giao dịch', route: ROUTES.ACCOUNTANT.TRANSACTIONS })
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 mx-auto max-w-[90%] sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-6">
            <Link href={ROUTES.HOME} className="text-lg font-semibold text-gray-900">
              CSM TV
            </Link>
            <nav className="flex space-x-4">
              {menus.map(({ label, route }) => (
                <Link
                  key={route}
                  href={route}
                  className="px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 