'use client';

import { Fragment } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';

export const UserMenu = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      label: 'Thông tin cá nhân',
      icon: <User className="w-5 h-5" />,
      href: ROUTES.PROFILE,
    },
    {
      label: 'Đổi mật khẩu',
      icon: <Settings className="w-5 h-5" />,
      href: ROUTES.CHANGE_PASSWORD,
    },
  ];

  if (user?.role === 'admin') {
    menuItems.push({
      label: 'Dashboard Admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: ROUTES.ADMIN.DASHBOARD,
    });
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center cursor-pointer space-x-2 text-gray-700 hover:text-gray-900">
        <User className="w-5 h-5" />
        <span className="text-sm font-medium">{user?.name}</span>
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {menuItems.map((item) => (
              <MenuItem key={item.label}>
                {({ active }) => (
                  <button
                    onClick={() => router.push(item.href)}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } flex w-full items-center px-4 py-2 text-sm`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </button>
                )}
              </MenuItem>
            ))}

            <MenuItem>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-3">Đăng xuất</span>
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}; 