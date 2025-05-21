"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { ROUTES } from "@/config/routes";
import Link from "next/link";
import { LogOut, UserCircleIcon } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push(ROUTES.LOGIN);
  };

  const menus = [
    { label: "Tổng quan", route: ROUTES.HOME },
    { label: "Khách hàng cũ", route: ROUTES.CUSTOMER },
    { label: "Vị trí thợ", route: ROUTES.LOCAL_WORKER },
  ];

  if (user?.role === "admin")
    menus.push({ label: "Quản lý người dùng", route: ROUTES.ADMIN.USERS });
  if (user?.role === "accountant")
    menus.push({ label: "Giao dịch", route: ROUTES.ACCOUNTANT.TRANSACTIONS });

  return (
    <header className="bg-white shadow">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Nav */}
          <div className="flex items-center space-x-6">
            <Link href={ROUTES.HOME} className="text-xl font-bold text-indigo-600">
              CSM TV
            </Link>
            <nav className="flex space-x-4 text-sm font-medium text-gray-900">
              {menus.map(({ label, route }) => (
                <Link key={route} href={route} className="px-1 hover:text-gray-700">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* User info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              <LogOut  className="h-5 w-5 text-red-500 cursor-pointer"/>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
