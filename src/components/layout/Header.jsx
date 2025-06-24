"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { ROUTES } from "@/config/routes";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Wrench,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  User,
  Lock,
  Shield,
  Crown,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path) => {
    return pathname === path;
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      route: ROUTES.DASHBOARD,
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "works",
      label: "Lịch làm việc",
      route: ROUTES.WORK_SCHEDULE,
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "customers",
      label: "Khách hàng",
      route: ROUTES.CUSTOMERS,
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "workers",
      label: "Nhân viên",
      route: ROUTES.WORKERS,
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "services",
      label: "Dịch vụ",
      route: ROUTES.SERVICES,
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      id: "reports",
      label: "Báo cáo",
      route: ROUTES.REPORTS,
      icon: <BarChart className="w-4 h-4" />,
    },
    {
      id: "settings",
      label: "Cài đặt",
      route: ROUTES.SETTINGS,
      icon: <Settings className="w-4 h-4" />,
    },
    ...(user?.role === 'admin' ? [{
      id: "admin",
      label: "Admin",
      route: ROUTES.ADMIN.DASHBOARD,
      icon: <Crown className="w-4 h-4" />,
    }] : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-white"
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="https://thoviet.com.vn/wp-content/uploads/2025/05/logo-thoviet.png"
              alt="CSM TV Logo"
              className="w-auto h-8"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-1 md:flex">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.route}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.route)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="items-center hidden space-x-4 md:flex">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 transition-colors rounded-full hover:text-gray-900 hover:bg-gray-100"
              >
                <Search className="w-5 h-5" />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 p-2 mt-2 bg-white border rounded-lg shadow-lg w-72" onClick={() => setIsSearchOpen(false)}>
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="flex-1 text-sm outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 transition-colors rounded-full hover:text-gray-900 hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center px-3 py-2 space-x-2 text-gray-600 transition-colors rounded-md hover:text-gray-900 hover:bg-gray-50"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-600">
                    {user?.name?.[0] || "U"}
                  </span>
                </div>
                <span className="text-sm font-medium">{user?.name || "User"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 w-48 mt-2 overflow-hidden bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      href={ROUTES.PROFILE}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Thông tin cá nhân
                    </Link>
                    <Link
                      href={ROUTES.SETTINGS}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Cài đặt
                    </Link>
                    <Link
                      href={ROUTES.CHANGE_PASSWORD}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Đổi mật khẩu
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        href={ROUTES.ADMIN.SETTINGS}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Cài đặt hệ thống
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-gray-600 rounded-md md:hidden hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.route}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.route)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <span className="text-lg font-medium text-blue-600">
                        {user?.name?.[0] || "U"}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.name || "User"}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="px-2 mt-3 space-y-1">
                  <Link
                    href={ROUTES.PROFILE}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Hồ sơ
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 