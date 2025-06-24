"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  User,
  Bell,
  Palette,
  Shield,
  Key,
  Globe,
  Sun,
  Moon,
  Monitor,
  Save,
  Mail,
  MessageSquare,
  Smartphone,
  Settings as SettingsIcon,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/components/ui/toast";

export default function SettingClient() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showToast } = useToast();
  const {
    theme,
    language,
    fontSize,
    notifications,
    updateTheme,
    updateLanguage,
    updateFontSize,
    updateNotifications,
  } = useSettings();

  const handleThemeChange = (newTheme) => {
    updateTheme(newTheme);
    showToast("Đã cập nhật giao diện", "success");
  };

  const handleLanguageChange = (newLanguage) => {
    updateLanguage(newLanguage);
    showToast("Đã cập nhật ngôn ngữ", "success");
  };

  const handleFontSizeChange = (newSize) => {
    updateFontSize(newSize);
    showToast("Đã cập nhật kích thước chữ", "success");
  };

  const handleNotificationChange = (type, value) => {
    updateNotifications({
      ...notifications,
      [type]: value,
    });
    showToast("Đã cập nhật cài đặt thông báo", "success");
  };

  const tabs = [
    { id: "profile", icon: User, label: "Thông tin cá nhân", desc: "Cập nhật thông tin tài khoản", color: "from-blue-500 to-indigo-600" },
    { id: "notifications", icon: Bell, label: "Thông báo", desc: "Cài đặt thông báo", color: "from-green-500 to-emerald-600" },
    { id: "appearance", icon: Palette, label: "Giao diện", desc: "Tùy chỉnh giao diện", color: "from-purple-500 to-pink-600" },
    { id: "security", icon: Shield, label: "Bảo mật", desc: "Bảo vệ tài khoản", color: "from-red-500 to-orange-600" },
    { id: "language", icon: Globe, label: "Ngôn ngữ", desc: "Cài đặt ngôn ngữ", color: "from-indigo-500 to-purple-600" },
    { id: "password", icon: Key, label: "Mật khẩu", desc: "Đổi mật khẩu", color: "from-yellow-500 to-orange-600" },
  ];

  return (
    <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 lg:p-4 overflow-hidden">
      <div className="flex flex-col mx-auto max-w-5xl h-full">
        {/* Header */}
        <div className="flex-shrink-0 mb-4 lg:mb-6">
          <div className="flex gap-3 items-center mb-3 lg:mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg lg:p-3 lg:rounded-xl">
              <SettingsIcon className="w-5 h-5 text-white lg:w-6 lg:h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 lg:text-2xl xl:text-3xl">
                Cài đặt hệ thống
              </h1>
              <p className="text-sm text-gray-600 lg:text-base">
                Tùy chỉnh trải nghiệm và quản lý tài khoản của bạn
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg shadow-md backdrop-blur-sm lg:p-4 lg:rounded-xl bg-white/60">
            <div className="flex gap-2 items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-medium">Tất cả thay đổi được lưu tự động</span>
            </div>
            <button
              className="flex gap-2 items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md transition-all duration-200 lg:px-4 lg:rounded-xl hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:scale-105 lg:text-base"
              onClick={() => showToast("Đã lưu tất cả thay đổi", "success")}
            >
              <Save className="w-4 h-4" />
              <span>Lưu tất cả</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid flex-1 grid-cols-1 gap-3 min-h-0 lg:grid-cols-4 lg:gap-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="overflow-y-auto p-3 h-full border-0 shadow-lg backdrop-blur-sm lg:p-4 bg-white/80">
              <nav className="space-y-2 lg:space-y-3">
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full p-2 lg:p-3 rounded-lg lg:rounded-xl text-left transition-all duration-200 group ${
                      activeTab === item.id
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md"
                    }`}
                  >
                    <div className="flex gap-2 items-center lg:gap-3">
                      <div className={`p-1.5 lg:p-2 rounded-md lg:rounded-lg ${
                        activeTab === item.id
                          ? "bg-white/20"
                          : "bg-white shadow-sm group-hover:bg-blue-50"
                      }`}>
                        <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${
                          activeTab === item.id ? "text-white" : "text-blue-600"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate">{item.label}</h3>
                        <p className={`text-xs mt-0.5 ${
                          activeTab === item.id ? "text-white/90" : "text-gray-500"
                        }`}>
                          {item.desc}
                        </p>
                      </div>
                      <ChevronRight className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform flex-shrink-0 ${
                        activeTab === item.id ? "text-white" : "text-gray-400"
                      }`} />
                    </div>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <Card className="overflow-y-auto p-4 h-full border-0 shadow-lg backdrop-blur-sm lg:p-6 bg-white/80">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex gap-3 items-center mb-4 lg:mb-6">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg lg:p-3 lg:rounded-xl">
                      <User className="w-5 h-5 text-white lg:w-6 lg:h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 lg:text-xl xl:text-2xl">Thông tin cá nhân</h2>
                      <p className="text-sm text-gray-600 lg:text-base">Cập nhật thông tin tài khoản của bạn</p>
                    </div>
                  </div>
                  
                  <form className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2.5 lg:py-3 text-sm lg:text-base bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2.5 lg:py-3 text-sm lg:text-base bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Nhập email"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2.5 lg:py-3 text-sm lg:text-base bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Chức vụ
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2.5 lg:py-3 text-sm lg:text-base text-gray-500 bg-gray-100 rounded-lg border border-gray-200 cursor-not-allowed"
                          placeholder="Nhập chức vụ"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-3 lg:pt-4">
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md transition-all duration-200 lg:px-6 lg:py-3 lg:text-base hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:scale-105"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex gap-3 items-center mb-4 lg:mb-6">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg lg:p-3 lg:rounded-xl">
                      <Bell className="w-5 h-5 text-white lg:w-6 lg:h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 lg:text-xl xl:text-2xl">Cài đặt thông báo</h2>
                      <p className="text-sm text-gray-600 lg:text-base">Quản lý cách bạn nhận thông báo</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 lg:space-y-4">
                    {[
                      {
                        icon: Mail,
                        title: "Thông báo email",
                        desc: "Nhận thông báo qua email",
                        key: "email",
                        color: "from-blue-500 to-blue-600"
                      },
                      {
                        icon: MessageSquare,
                        title: "Thông báo ZNS",
                        desc: "Nhận thông báo qua Zalo",
                        key: "zns",
                        color: "from-green-500 to-green-600"
                      },
                      {
                        icon: Smartphone,
                        title: "Thông báo đẩy",
                        desc: "Nhận thông báo trực tiếp trên trình duyệt",
                        key: "push",
                        color: "from-purple-500 to-purple-600"
                      }
                    ].map((item) => (
                      <div key={item.key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg transition-all duration-200 lg:p-4 lg:rounded-xl hover:bg-gray-100 group">
                        <div className="flex gap-3 items-center lg:gap-4">
                          <div className={`p-2 lg:p-3 bg-gradient-to-r ${item.color} rounded-lg lg:rounded-xl shadow-md`}>
                            <item.icon className="w-4 h-4 text-white lg:w-5 lg:h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800 lg:text-base">{item.title}</h3>
                            <p className="text-xs lg:text-sm text-gray-600 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notifications[item.key]}
                            onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                          />
                          <div className="w-10 lg:w-12 h-5 lg:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 lg:after:h-5 after:w-4 lg:after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex gap-3 items-center mb-4 lg:mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg lg:p-3 lg:rounded-xl">
                      <Palette className="w-5 h-5 text-white lg:w-6 lg:h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 lg:text-xl xl:text-2xl">Cài đặt giao diện</h2>
                      <p className="text-sm text-gray-600 lg:text-base">Tùy chỉnh giao diện theo ý thích</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 lg:space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg lg:p-6 lg:rounded-xl">
                      <h3 className="mb-3 text-base font-semibold text-gray-800 lg:mb-4 lg:text-lg">Chế độ hiển thị</h3>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:gap-4">
                        {[
                          { value: "light", icon: Sun, label: "Sáng", desc: "Giao diện sáng" },
                          { value: "dark", icon: Moon, label: "Tối", desc: "Giao diện tối" },
                          { value: "system", icon: Monitor, label: "Theo hệ thống", desc: "Tự động theo hệ thống" }
                        ].map((item) => (
                          <label key={item.value} className="flex relative items-center p-3 bg-white rounded-lg border-2 border-gray-200 transition-all duration-200 cursor-pointer lg:p-4 lg:rounded-xl hover:border-blue-300 group">
                            <input
                              type="radio"
                              name="theme"
                              className="sr-only peer"
                              checked={theme === item.value}
                              onChange={() => handleThemeChange(item.value)}
                            />
                            <div className="flex gap-2 items-center lg:gap-3">
                              <div className="p-1.5 lg:p-2 bg-gray-100 rounded-md lg:rounded-lg group-hover:bg-blue-50 transition-colors">
                                <item.icon className="w-4 h-4 text-gray-600 lg:w-5 lg:h-5" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-800 lg:text-base">{item.label}</div>
                                <div className="text-xs text-gray-500 lg:text-sm">{item.desc}</div>
                              </div>
                            </div>
                            <div className="absolute right-3 top-1/2 w-3 h-3 rounded-full border-2 border-gray-300 transition-all -translate-y-1/2 lg:right-4 lg:w-4 lg:h-4 peer-checked:bg-blue-500 peer-checked:border-blue-500"></div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg lg:p-6 lg:rounded-xl">
                      <h3 className="mb-3 text-base font-semibold text-gray-800 lg:mb-4 lg:text-lg">Kích thước font chữ</h3>
                      <select
                        className="w-full px-3 py-2.5 lg:py-3 text-sm lg:text-base bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={fontSize}
                        onChange={(e) => handleFontSizeChange(e.target.value)}
                      >
                        <option value="small">Nhỏ</option>
                        <option value="medium">Vừa</option>
                        <option value="large">Lớn</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex gap-3 items-center mb-4 lg:mb-6">
                    <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg lg:p-3 lg:rounded-xl">
                      <Shield className="w-5 h-5 text-white lg:w-6 lg:h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 lg:text-xl xl:text-2xl">Bảo mật</h2>
                      <p className="text-sm text-gray-600 lg:text-base">Bảo vệ tài khoản của bạn</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 lg:space-y-6">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg lg:p-4 lg:rounded-xl">
                      <div className="flex gap-3 items-center lg:gap-4">
                        <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg lg:p-3 lg:rounded-xl">
                          <Shield className="w-4 h-4 text-white lg:w-5 lg:h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800 lg:text-base">Xác thực 2 yếu tố (2FA)</h3>
                          <p className="text-xs lg:text-sm text-gray-600 mt-0.5">Bảo vệ tài khoản của bạn bằng xác thực 2 yếu tố</p>
                        </div>
                      </div>
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-10 lg:w-12 h-5 lg:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 lg:after:h-5 after:w-4 lg:after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-red-500 to-orange-600"></div>
                      </label>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg lg:p-6 lg:rounded-xl">
                      <h3 className="mb-3 text-base font-semibold text-gray-800 lg:mb-4 lg:text-lg">Lịch sử đăng nhập</h3>
                      <div className="space-y-2 lg:space-y-3">
                        {[
                          { device: "Windows 10 - Chrome", location: "192.168.1.1 - Hà Nội, Việt Nam", time: "Hôm nay, 10:30" },
                          { device: "iPhone 12 - Safari", location: "192.168.1.2 - Hà Nội, Việt Nam", time: "Hôm qua, 15:45" }
                        ].map((session, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 transition-colors lg:p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-semibold text-gray-800 lg:text-base">{session.device}</p>
                                <p className="text-xs lg:text-sm text-gray-600 mt-0.5">{session.location}</p>
                              </div>
                              <p className="text-xs font-medium text-gray-500 lg:text-sm">{session.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Language Tab */}
              {activeTab === "language" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex gap-3 items-center mb-4 lg:mb-6">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg lg:p-3 lg:rounded-xl">
                      <Globe className="w-5 h-5 text-white lg:w-6 lg:h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 lg:text-xl xl:text-2xl">Ngôn ngữ</h2>
                      <p className="text-sm text-gray-600 lg:text-base">Cài đặt ngôn ngữ và định dạng</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 lg:space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg lg:p-6 lg:rounded-xl">
                      <h3 className="mb-3 text-base font-semibold text-gray-800 lg:mb-4 lg:text-lg">Ngôn ngữ hiển thị</h3>
                      <select
                        className="w-full px-3 py-2.5 lg:py-3 text-sm lg:text-base bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg lg:p-6 lg:rounded-xl">
                      <h3 className="mb-3 text-base font-semibold text-gray-800 lg:mb-4 lg:text-lg">Định dạng thời gian</h3>
                      <select
                        className="w-full px-3 py-2.5 lg:py-3 text-sm lg:text-base bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                      >
                        <option value="vi">DD/MM/YYYY</option>
                        <option value="en">MM/DD/YYYY</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === "password" && (
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex gap-3 items-center mb-4 lg:mb-6">
                    <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg lg:p-3 lg:rounded-xl">
                      <Key className="w-5 h-5 text-white lg:w-6 lg:h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 lg:text-xl xl:text-2xl">Đổi mật khẩu</h2>
                      <p className="text-sm text-gray-600 lg:text-base">Cập nhật mật khẩu tài khoản</p>
                    </div>
                  </div>
                  
                  <form className="space-y-4 lg:space-y-6">
                    <div className="p-4 space-y-3 bg-gray-50 rounded-lg lg:p-6 lg:space-y-4 lg:rounded-xl">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Mật khẩu hiện tại</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-3 py-2.5 lg:py-3 pr-10 lg:pr-12 text-sm lg:text-base bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập mật khẩu hiện tại"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 text-gray-400 -translate-y-1/2 lg:right-3 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Mật khẩu mới</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            className="w-full px-3 py-2.5 lg:py-3 pr-10 lg:pr-12 text-sm lg:text-base bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập mật khẩu mới"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2 top-1/2 text-gray-400 -translate-y-1/2 lg:right-3 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Xác nhận mật khẩu mới</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full px-3 py-2.5 lg:py-3 pr-10 lg:pr-12 text-sm lg:text-base bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập lại mật khẩu mới"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-1/2 text-gray-400 -translate-y-1/2 lg:right-3 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-3 lg:pt-4">
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg shadow-md transition-all duration-200 lg:px-6 lg:py-3 lg:text-base hover:from-yellow-600 hover:to-orange-700 hover:shadow-lg hover:scale-105"
                      >
                        Đổi mật khẩu
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
