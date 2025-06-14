'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { User, Bell, Palette, Shield, Key, Globe, Sun, Moon, Monitor, Save, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { useToast } from '@/components/ui/toast'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { showToast } = useToast()
  const {
    theme,
    language,
    fontSize,
    notifications,
    updateTheme,
    updateLanguage,
    updateFontSize,
    updateNotifications
  } = useSettings()

  const handleThemeChange = (newTheme) => {
    updateTheme(newTheme)
    showToast('Đã cập nhật giao diện', 'success')
  }

  const handleLanguageChange = (newLanguage) => {
    updateLanguage(newLanguage)
    showToast('Đã cập nhật ngôn ngữ', 'success')
  }

  const handleFontSizeChange = (newSize) => {
    updateFontSize(newSize)
    showToast('Đã cập nhật kích thước chữ', 'success')
  }

  const handleNotificationChange = (type, value) => {
    updateNotifications({
      ...notifications,
      [type]: value
    })
    showToast('Đã cập nhật cài đặt thông báo', 'success')
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-foreground/90">Cài đặt</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Quản lý tài khoản và tùy chỉnh trải nghiệm</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/90 text-primary-foreground rounded-md hover:bg-primary transition-colors text-xs font-medium"
          onClick={() => showToast('Đã lưu tất cả thay đổi', 'success')}
        >
          <Save className="w-3.5 h-3.5" />
          <span>Lưu tất cả</span>
        </button>
      </div>
      
      <Tabs defaultIndex={0} onChange={setActiveTab} className="space-y-5">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-1.5 p-1 bg-muted/20 rounded-md">
          <TabsTrigger className="flex items-center gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-colors text-xs">
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Thông tin cá nhân</span>
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-colors text-xs">
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Thông báo</span>
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-colors text-xs">
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Giao diện</span>
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-colors text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Bảo mật</span>
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-colors text-xs">
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ngôn ngữ</span>
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-colors text-xs">
            <Key className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mật khẩu</span>
          </TabsTrigger>
        </TabsList>

        <div className="space-y-5">
          <TabsContent>
            <Card className="p-5 border-muted/50">
              <h2 className="text-base font-medium mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-primary/90" />
                Thông tin cá nhân
              </h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground/90">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground/90">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-1.5 bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                      placeholder="Nhập email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground/90">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-1.5 bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground/90">
                      Chức vụ
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 bg-muted/50 border rounded-md cursor-not-allowed text-xs"
                      placeholder="Nhập chức vụ"
                      disabled
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-primary/90 text-primary-foreground rounded-md hover:bg-primary transition-colors text-xs font-medium"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </Card>
          </TabsContent>

          <TabsContent>
            <Card className="p-5 border-muted/50">
              <h2 className="text-base font-medium mb-5 flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary/90" />
                Cài đặt thông báo
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-muted/20 rounded-md hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-primary/10 rounded-md">
                      <Mail className="w-3.5 h-3.5 text-primary/90" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-medium text-xs">Thông báo email</h3>
                      <p className="text-[10px] text-muted-foreground">Nhận thông báo qua email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.email}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    />
                    <div className="w-8 h-4 bg-muted-foreground/20 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary/90"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-muted/20 rounded-md hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-primary/10 rounded-md">
                      <MessageSquare className="w-3.5 h-3.5 text-primary/90" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-medium text-xs">Thông báo ZNS</h3>
                      <p className="text-[10px] text-muted-foreground">Nhận thông báo qua Zalo</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.zns}
                      onChange={(e) => handleNotificationChange('zns', e.target.checked)}
                    />
                    <div className="w-8 h-4 bg-muted-foreground/20 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary/90"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-muted/20 rounded-md hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-primary/10 rounded-md">
                      <Smartphone className="w-3.5 h-3.5 text-primary/90" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-medium text-xs">Thông báo đẩy</h3>
                      <p className="text-[10px] text-muted-foreground">Nhận thông báo trực tiếp trên trình duyệt</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.push}
                      onChange={(e) => handleNotificationChange('push', e.target.checked)}
                    />
                    <div className="w-8 h-4 bg-muted-foreground/20 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary/90"></div>
                  </label>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent>
            <Card className="p-5 border-muted/50">
              <h2 className="text-base font-medium mb-5 flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary/90" />
                Cài đặt giao diện
              </h2>
              <div className="space-y-5">
                <div className="p-3.5 bg-muted/20 rounded-md">
                  <h3 className="font-medium mb-3.5 text-xs">Chế độ hiển thị</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    <label className="relative flex items-center p-2.5 bg-background border rounded-md cursor-pointer hover:bg-muted/30 transition-colors group">
                      <input
                        type="radio"
                        name="theme"
                        className="sr-only peer"
                        checked={theme === 'light'}
                        onChange={() => handleThemeChange('light')}
                      />
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                          <Sun className="w-3.5 h-3.5 text-primary/90" />
                        </div>
                        <span className="text-xs">Sáng</span>
                      </div>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-primary/90 rounded-full peer-checked:bg-primary/90 peer-checked:border-primary/90 transition-colors"></div>
                    </label>
                    <label className="relative flex items-center p-2.5 bg-background border rounded-md cursor-pointer hover:bg-muted/30 transition-colors group">
                      <input
                        type="radio"
                        name="theme"
                        className="sr-only peer"
                        checked={theme === 'dark'}
                        onChange={() => handleThemeChange('dark')}
                      />
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                          <Moon className="w-3.5 h-3.5 text-primary/90" />
                        </div>
                        <span className="text-xs">Tối</span>
                      </div>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-primary/90 rounded-full peer-checked:bg-primary/90 peer-checked:border-primary/90 transition-colors"></div>
                    </label>
                    <label className="relative flex items-center p-2.5 bg-background border rounded-md cursor-pointer hover:bg-muted/30 transition-colors group">
                      <input
                        type="radio"
                        name="theme"
                        className="sr-only peer"
                        checked={theme === 'system'}
                        onChange={() => handleThemeChange('system')}
                      />
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                          <Monitor className="w-3.5 h-3.5 text-primary/90" />
                        </div>
                        <span className="text-xs">Theo hệ thống</span>
                      </div>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-primary/90 rounded-full peer-checked:bg-primary/90 peer-checked:border-primary/90 transition-colors"></div>
                    </label>
                  </div>
                </div>
                <div className="p-3.5 bg-muted/20 rounded-md">
                  <h3 className="font-medium mb-3.5 text-xs">Kích thước font chữ</h3>
                  <select
                    className="w-full px-3 py-1.5 bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                  >
                    <option value="small">Nhỏ</option>
                    <option value="medium">Vừa</option>
                    <option value="large">Lớn</option>
                  </select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent>
            <Card className="p-5 border-muted/50">
              <h2 className="text-base font-medium mb-5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary/90" />
                Bảo mật
              </h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between p-3.5 bg-muted/20 rounded-md hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-primary/10 rounded-md">
                      <Shield className="w-3.5 h-3.5 text-primary/90" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-medium text-xs">Xác thực 2 yếu tố (2FA)</h3>
                      <p className="text-[10px] text-muted-foreground">Bảo vệ tài khoản của bạn bằng xác thực 2 yếu tố</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-8 h-4 bg-muted-foreground/20 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary/90"></div>
                  </label>
                </div>
                <div className="p-3.5 bg-muted/20 rounded-md">
                  <h3 className="font-medium mb-3.5 text-xs">Lịch sử đăng nhập</h3>
                  <div className="space-y-2.5">
                    <div className="p-2.5 bg-background border rounded-md hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <p className="font-medium text-xs">Windows 10 - Chrome</p>
                          <p className="text-[10px] text-muted-foreground">192.168.1.1 - Hà Nội, Việt Nam</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Hôm nay, 10:30</p>
                      </div>
                    </div>
                    <div className="p-2.5 bg-background border rounded-md hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <p className="font-medium text-xs">iPhone 12 - Safari</p>
                          <p className="text-[10px] text-muted-foreground">192.168.1.2 - Hà Nội, Việt Nam</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Hôm qua, 15:45</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent>
            <Card className="p-5 border-muted/50">
              <h2 className="text-base font-medium mb-5 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary/90" />
                Ngôn ngữ
              </h2>
              <div className="space-y-5">
                <div className="p-3.5 bg-muted/20 rounded-md">
                  <h3 className="font-medium mb-3.5 text-xs">Ngôn ngữ hiển thị</h3>
                  <select
                    className="w-full px-3 py-1.5 bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="p-3.5 bg-muted/20 rounded-md">
                  <h3 className="font-medium mb-3.5 text-xs">Định dạng thời gian</h3>
                  <select
                    className="w-full px-3 py-1.5 bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    <option value="vi">DD/MM/YYYY</option>
                    <option value="en">MM/DD/YYYY</option>
                  </select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent>
            <Card className="p-5 border-muted/50">
              <h2 className="text-base font-medium mb-5 flex items-center gap-2">
                <Key className="w-4 h-4 text-primary/90" />
                Đổi mật khẩu
              </h2>
              <form className="space-y-5">
                <div className="p-3.5 bg-muted/20 rounded-md space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground/90">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-1.5 bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground/90">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-1.5 bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground/90">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-1.5 bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-primary/90 text-primary-foreground rounded-md hover:bg-primary transition-colors text-xs font-medium"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
} 