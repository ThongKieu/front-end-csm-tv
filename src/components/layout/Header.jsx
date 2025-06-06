'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '@/store/slices/authSlice'
import { ROUTES } from '@/config/routes'
import Link from 'next/link'
import { LogOut, User, Home, Users, DollarSign, Calendar, Settings, UserCog, LayoutDashboard, Bell, MessageSquare } from 'lucide-react'
import { UserMenu } from './UserMenu'
import { NotificationMenu } from './NotificationMenu'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push(ROUTES.LOGIN)
  }
  console.log("ROUTES", ROUTES);
  
  const isActive = (route) => {
    if (route === ROUTES.HOME) {
      return pathname === route
    }
    if (route === ROUTES.ADMIN.DASHBOARD) {
      return pathname === route || pathname.startsWith('/admin/')
    }
    return pathname.startsWith(route)
  }

  const getMenuItems = () => {
    const baseMenus = [
      { 
        id: 'home',
        label: 'Trang chủ', 
        route: '/dashboard',
        icon: <Home className="w-4 h-4" />
      },
      { 
        id: 'works',
        label: 'Lịch làm việc', 
        route: '/works',
        icon: <Calendar className="w-4 h-4" />
      },
      { 
        id: 'customers',
        label: 'Khách hàng', 
        route: '/customer',
        icon: <Users className="w-4 h-4" />
      }
    ]

    // Menu cho admin
    if (user?.role === 'admin') {
      return [
        ...baseMenus,
        { 
          id: 'dashboard',
          label: 'Dashboard', 
          route: '/admin/dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />
        },
        { 
          id: 'workers',
          label: 'Quản lý thợ', 
          route: '/admin/workers',
          icon: <UserCog className="w-4 h-4" />
        },
        { 
          id: 'zns',
          label: 'Gửi ZNS', 
          route: '/admin/zns',
          icon: <MessageSquare className="w-4 h-4" />
        },
        { 
          id: 'settings',
          label: 'Cài đặt', 
          route: '/profile',
          icon: <Settings className="w-4 h-4" />
        }
      ]
    }

    // Menu cho manager
    if (user?.role === 'manager') {
      return [
        ...baseMenus,
        { 
          id: 'dashboard',
          label: 'Dashboard', 
          route: '/admin/dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />
        },
        { 
          id: 'workers',
          label: 'Quản lý thợ', 
          route: '/admin/workers',
          icon: <UserCog className="w-4 h-4" />
        },
        { 
          id: 'settings',
          label: 'Cài đặt', 
          route: '/profile',
          icon: <Settings className="w-4 h-4" />
        }
      ]
    }

    // Menu cho accountant
    if (user?.role === 'accountant') {
      return [
        ...baseMenus,
        { 
          id: 'settings',
          label: 'Cài đặt', 
          route: '/profile',
          icon: <Settings className="w-4 h-4" />
        }
      ]
    }

    // Menu cho user
    return [
      ...baseMenus,
      { 
        id: 'settings',
        label: 'Cài đặt', 
        route: '/profile',
        icon: <Settings className="w-4 h-4" />
      }
    ]
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 mx-auto max-w-[90%] sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-6">
            <Link 
              href={ROUTES.HOME} 
              className={`text-lg font-semibold ${
                isActive(ROUTES.HOME) ? 'text-blue-600' : 'text-gray-900'
              }`}
            >
              CSM TV
            </Link>
            <nav className="flex space-x-4">
              {getMenuItems().map(({ id, label, route, icon }) => (
                <Link
                  key={id}
                  href={route}
                  className={`flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    isActive(route)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {icon}
                  <span className="ml-2">{label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user?.role !== 'accountant' && (
              <NotificationMenu />
            )}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
} 