'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Menu,
  X,
  LogOut,
  Building2,
  FileText,
  BarChart3,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { UserMenu } from './UserMenu';
import { ROUTES } from '@/config/routes';

export const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const getMenuItems = () => {
    const baseMenuItems = [
      {
        title: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        href: ROUTES.ADMIN.DASHBOARD,
        roles: ['admin', 'manager', 'user'],
      },
      {
        title: 'Quản lý thợ',
        icon: <Users className="w-5 h-5" />,
        href: ROUTES.ADMIN.USERS,
        roles: ['admin', 'manager'],
      },
      {
        title: 'Lịch làm việc',
        icon: <Calendar className="w-5 h-5" />,
        href: ROUTES.ADMIN.SCHEDULE,
        roles: ['admin', 'manager', 'user'],
      },
      {
        title: 'Công ty',
        icon: <Building2 className="w-5 h-5" />,
        href: ROUTES.ADMIN.COMPANY,
        roles: ['admin'],
      },
      {
        title: 'Báo cáo',
        icon: <BarChart3 className="w-5 h-5" />,
        href: ROUTES.ADMIN.REPORTS,
        roles: ['admin'],
      },
      {
        title: 'Tài liệu',
        icon: <FileText className="w-5 h-5" />,
        href: ROUTES.ADMIN.DOCUMENTS,
        roles: ['admin'],
      },
      {
        title: 'Cài đặt',
        icon: <Settings className="w-5 h-5" />,
        href: ROUTES.ADMIN.SETTINGS,
        roles: ['admin'],
      },
    ];

    return baseMenuItems.filter(item => item.roles.includes(user?.role));
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href={ROUTES.ADMIN.DASHBOARD} className="text-xl font-bold text-gray-800">
              CSM TV
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md lg:hidden hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t">
            <UserMenu />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'lg:ml-64' : ''} transition-all duration-300`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md lg:hidden hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}; 