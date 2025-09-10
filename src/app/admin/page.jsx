"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Users, 
  Server, 
  MessageSquare, 
  Settings, 
  Crown,
  Building2,
  DollarSign,
  MapPin,
  Activity,
  Shield
} from "lucide-react";

export default function AdminPage() {
  const [stats] = useState({
    totalUsers: 45,
    activeUsers: 23,
    totalWorks: 156,
    pendingWorks: 12,
    systemHealth: "excellent"
  });

  const adminFeatures = [
    {
      id: 1,
      title: "Dashboard Admin",
      description: "Tổng quan thống kê và báo cáo hệ thống",
      icon: LayoutDashboard,
      route: "/admin/dashboard",
      color: "from-brand-green to-brand-yellow",
      bgColor: "bg-gradient-to-r from-brand-green/10 to-brand-yellow/10"
    },
    {
      id: 2,
      title: "Quản lý người dùng",
      description: "Tạo và quản lý tài khoản người dùng",
      icon: Users,
      route: "/admin/users",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-gradient-to-r from-blue-500/10 to-purple-600/10"
    },
    {
      id: 3,
      title: "Quản lý thợ",
      description: "Quản lý danh sách thợ và phân công công việc",
      icon: Users,
      route: "/admin/workers",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-gradient-to-r from-green-500/10 to-emerald-600/10"
    },
    {
      id: 4,
      title: "Quản lý hệ thống",
      description: "Theo dõi trạng thái và tài nguyên hệ thống",
      icon: Server,
      route: "/admin/system",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-r from-orange-500/10 to-red-600/10"
    },
    {
      id: 5,
      title: "Gửi ZNS",
      description: "Gửi thông báo qua Zalo Notification Service",
      icon: MessageSquare,
      route: "/admin/zns",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-gradient-to-r from-purple-500/10 to-pink-600/10"
    },
    {
      id: 7,
      title: "Báo giá",
      description: "Quản lý báo giá và hợp đồng",
      icon: DollarSign,
      route: "/quotes",
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-gradient-to-r from-yellow-500/10 to-orange-600/10"
    },
    {
      id: 8,
      title: "Khách hàng",
      description: "Quản lý thông tin khách hàng",
      icon: Building2,
      route: "/customer",
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-gradient-to-r from-teal-500/10 to-cyan-600/10"
    },
    {
      id: 9,
      title: "Phường/Xã",
      description: "Quản lý dữ liệu phường xã TP.HCM",
      icon: MapPin,
      route: "/wards",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-gradient-to-r from-pink-500/10 to-rose-600/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-green/5 to-brand-yellow/5">
      <div className="flex flex-col p-6 h-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-brand-green" />
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-yellow">
                  Admin Panel
                </h1>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Trung tâm quản lý hệ thống CSM TV
              </p>
            </div>
            <div className="px-4 py-2 text-sm text-brand-green bg-white rounded-lg border border-brand-green/20 shadow-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Quyền Admin</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="bg-white border-brand-green/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                    <p className="text-2xl font-bold text-brand-green">{stats.totalUsers}</p>
                  </div>
                  <div className="p-2 bg-brand-green/10 rounded-lg">
                    <Users className="w-5 h-5 text-brand-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-brand-green/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                    <p className="text-2xl font-bold text-brand-green">{stats.activeUsers}</p>
                  </div>
                  <div className="p-2 bg-brand-green/10 rounded-lg">
                    <Activity className="w-5 h-5 text-brand-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-brand-green/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng công việc</p>
                    <p className="text-2xl font-bold text-brand-green">{stats.totalWorks}</p>
                  </div>
                  <div className="p-2 bg-brand-green/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-brand-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-brand-green/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
                    <p className="text-2xl font-bold text-brand-green">{stats.pendingWorks}</p>
                  </div>
                  <div className="p-2 bg-brand-green/10 rounded-lg">
                    <Activity className="w-5 h-5 text-brand-green" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Features Grid */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Chức năng quản lý</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {adminFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link key={feature.id} href={feature.route}>
                    <Card className="bg-white border-gray-200 hover:border-brand-green/30 transition-all duration-200 hover:shadow-lg cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${feature.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                            <Icon className={`w-6 h-6 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-brand-green transition-colors">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white border-brand-green/20">
            <CardHeader>
              <CardTitle className="text-xl text-brand-green">Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Link href="/admin/users">
                  <button className="w-full p-4 text-left bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 rounded-lg border border-brand-green/20 hover:border-brand-green/40 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-brand-green" />
                      <div>
                        <p className="font-medium text-gray-900">Tạo tài khoản mới</p>
                        <p className="text-sm text-gray-600">Thêm người dùng vào hệ thống</p>
                      </div>
                    </div>
                  </button>
                </Link>

                <Link href="/admin/system">
                  <button className="w-full p-4 text-left bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 rounded-lg border border-brand-green/20 hover:border-brand-green/40 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Server className="w-5 h-5 text-brand-green" />
                      <div>
                        <p className="font-medium text-gray-900">Kiểm tra hệ thống</p>
                        <p className="text-sm text-gray-600">Theo dõi trạng thái dịch vụ</p>
                      </div>
                    </div>
                  </button>
                </Link>

                <Link href="/admin/zns">
                  <button className="w-full p-4 text-left bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 rounded-lg border border-brand-green/20 hover:border-brand-green/40 transition-colors">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-brand-green" />
                      <div>
                        <p className="font-medium text-gray-900">Gửi thông báo</p>
                        <p className="text-sm text-gray-600">Gửi ZNS cho khách hàng</p>
                      </div>
                    </div>
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 