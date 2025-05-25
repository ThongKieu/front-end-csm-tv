'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/config/routes'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const iconMap = {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart,
  UserCog,
  Settings
}

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useSelector((state) => state.auth)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      id: 1,
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      route: ROUTES.HOME,
      roles: ['admin', 'manager', 'user']
    },
    {
      id: 2,
      label: 'Quản lý thợ',
      icon: 'Users',
      route: ROUTES.ADMIN.USERS,
      roles: ['admin', 'manager']
    },
    {
      id: 3,
      label: 'Lịch làm việc',
      icon: 'Calendar',
      route: ROUTES.ADMIN.SCHEDULE,
      roles: ['admin', 'manager', 'user']
    },
    {
      id: 4,
      label: 'Công ty',
      icon: 'Building2',
      route: ROUTES.ADMIN.COMPANY,
      roles: ['admin']
    },
    {
      id: 5,
      label: 'Báo cáo',
      icon: 'BarChart',
      route: ROUTES.ADMIN.REPORTS,
      roles: ['admin']
    },
    {
      id: 6,
      label: 'Tài liệu',
      icon: 'FileText',
      route: ROUTES.ADMIN.DOCUMENTS,
      roles: ['admin']
    },
    {
      id: 7,
      label: 'Cài đặt',
      icon: 'Settings',
      route: ROUTES.ADMIN.SETTINGS,
      roles: ['admin']
    }
  ]

  // Lọc menu items dựa trên role của user
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  )

  return (
    <aside className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-4 hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-6 h-6 text-gray-600" />
          ) : (
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {/* Menu items */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive = pathname === item.route

            return (
              <Link
                key={item.id}
                href={item.route}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        {!isCollapsed && (
          <div className="p-4 border-t">
            <div className="flex items-center">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
} 