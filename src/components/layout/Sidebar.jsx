'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/config/routes'
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Home,
  MessageSquare,
  DollarSign,
  MapPin,
  Server
} from 'lucide-react'

const iconMap = {
  LayoutDashboard,
  Users,
  Building2,
  BarChart,
  FileText,
  Settings,
  Calendar,
  Home,
  MessageSquare,
  DollarSign,
  MapPin,
  Server
}

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useSelector((state) => state.auth)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    {
      id: 0,
      label: 'Trang chủ',
      icon: 'Home',
      route: '/dashboard',
      roles: ['admin', 'manager', 'office', 'accountant', 'user']
    },
    {
      id: 1,
      label: 'Dashboard Admin',
      icon: 'LayoutDashboard',
      route: '/admin/dashboard',
      roles: ['admin', 'manager', 'office']
    },
    {
      id: 2,
      label: 'Quản lý người dùng',
      icon: 'Users',
      route: '/admin/users',
      roles: ['admin', 'office']
    },
    {
      id: 3,
      label: 'Quản lý thợ',
      icon: 'Users',
      route: '/admin/workers',
      roles: ['admin', 'manager', 'office']
    },
    {
      id: 4,
      label: 'Lịch làm việc',
      icon: 'Calendar',
      route: ROUTES.WORKS,
      roles: ['admin', 'manager', 'office', 'user']
    },
    {
      id: 5,
      label: 'Báo giá',
      icon: 'DollarSign',
      route: ROUTES.QUOTES,
      roles: ['admin', 'manager', 'office', 'accountant', 'user']
    },
    {
      id: 6,
      label: 'Khách hàng',
      icon: 'Building2',
      route: '/customer',
      roles: ['admin', 'manager', 'office', 'accountant', 'user']
    },
    {
      id: 7,
      label: 'Phường/Xã',
      icon: 'MapPin',
      route: ROUTES.WARDS,
      roles: ['admin', 'manager', 'office', 'accountant', 'user']
    },
    {
      id: 8,
      label: 'Gửi ZNS',
      icon: 'MessageSquare',
      route: '/admin/zns',
      roles: ['admin', 'office']
    },
    {
      id: 9,
      label: 'Quản lý hệ thống',
      icon: 'Server',
      route: '/admin/system',
      roles: ['admin']
    },
    {
      id: 10,
      label: 'Cài đặt',
      icon: 'Settings',
      route: '/profile',
      roles: ['admin', 'manager', 'office', 'accountant', 'user']
    }
  ]

  // Lọc menu items dựa trên role của user
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role))

  if (!mounted) {
    return null
  }

  return (
    <aside className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Logo and Toggle button */}
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className={`text-brand-green font-bold text-xl ${isCollapsed ? 'hidden' : ''}`}>
            CSM TV
          </h1>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive = pathname.startsWith(item.route)

            return (
              <Link
                key={item.id}
                href={item.route}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-brand-green/10 text-brand-green'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {Icon && <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />}
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        {!isCollapsed && user && (
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Guest'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
} 