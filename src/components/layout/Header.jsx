'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '@/store/slices/authSlice'
import { ROUTES } from '@/config/routes'
import Link from 'next/link'
import { LogOut, User, Home, Users, DollarSign, Calendar, Settings, UserCog, LayoutDashboard, Bell } from 'lucide-react'
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
        route: ROUTES.HOME,
        icon: <Home className="w-4 h-4" />
      },
      { 
        id: 'schedule',
        label: 'Lịch làm việc', 
        route: ROUTES.WORK_SCHEDULE,
        icon: <Calendar className="w-4 h-4" />
      }
    ]

    // Menu cho admin
    if (user?.role === 'admin') {
      return [
        ...baseMenus,
        { 
          id: 'dashboard',
          label: 'Dashboard', 
          route: ROUTES.ADMIN.DASHBOARD,
          icon: <LayoutDashboard className="w-4 h-4" />
        },
        { 
          id: 'customers',
          label: 'Khách hàng cũ', 
          route: ROUTES.CUSTOMER,
          icon: <Users className="w-4 h-4" />
        },
        { 
          id: 'users',
          label: 'Quản lý người dùng', 
          route: ROUTES.ADMIN.USERS,
          icon: <UserCog className="w-4 h-4" />
        },
        { 
          id: 'transactions',
          label: 'Giao dịch', 
          route: ROUTES.ACCOUNTANT.TRANSACTIONS,
          icon: <DollarSign className="w-4 h-4" />
        },
        { 
          id: 'settings',
          label: 'Cài đặt', 
          route: ROUTES.ADMIN.SETTINGS,
          icon: <Settings className="w-4 h-4" />
        }
      ]
    }

    // Menu cho kế toán
    if (user?.role === 'accountant') {
      return [
        ...baseMenus,
        { 
          id: 'transactions',
          label: 'Giao dịch', 
          route: ROUTES.ACCOUNTANT.TRANSACTIONS,
          icon: <DollarSign className="w-4 h-4" />
        }
      ]
    }

    // Menu cho thợ
    if (user?.role === 'worker') {
      return [
        ...baseMenus,
        { 
          id: 'my-works',
          label: 'Công việc của tôi', 
          route: ROUTES.WORKER.MY_WORKS,
          icon: <Calendar className="w-4 h-4" />
        }
      ]
    }

    // Menu mặc định cho các role khác
    return baseMenus
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