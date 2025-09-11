"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings, 
  Database, 
  Server, 
  Shield, 
  Activity, 
  Clock, 
  Users, 
  HardDrive,
  Wifi,
  Cpu,
  MemoryStick,
  HardDriveIcon,
  Network,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

export default function SystemPage() {
  const [systemInfo, setSystemInfo] = useState({
    version: "1.0.0",
    uptime: "5 ngày 12 giờ",
    lastBackup: "2024-03-20 15:30:00",
    totalUsers: 45,
    activeUsers: 23,
    totalWorks: 156,
    pendingWorks: 12,
    systemHealth: "excellent",
    databaseSize: "2.5 GB",
    serverLoad: "15%",
    memoryUsage: "45%",
    diskUsage: "60%"
  });

  const [services, setServices] = useState([
    { name: "Database", status: "online", uptime: "99.9%" },
    { name: "API Server", status: "online", uptime: "99.8%" },
    { name: "File Storage", status: "online", uptime: "99.7%" },
    { name: "Email Service", status: "online", uptime: "99.5%" },
    { name: "SMS Gateway", status: "online", uptime: "99.2%" }
  ]);

  const [recentLogs, setRecentLogs] = useState([
    { level: "info", message: "Hệ thống khởi động thành công", timestamp: "2024-03-20 15:30:00" },
    { level: "info", message: "Backup database hoàn thành", timestamp: "2024-03-20 15:00:00" },
    { level: "warning", message: "Cảnh báo: Sử dụng bộ nhớ cao", timestamp: "2024-03-20 14:45:00" },
    { level: "info", message: "Cập nhật cấu hình hệ thống", timestamp: "2024-03-20 14:30:00" },
    { level: "error", message: "Lỗi kết nối database", timestamp: "2024-03-20 14:15:00" }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "text-brand-green";
      case "offline":
        return "text-red-500";
      case "warning":
        return "text-brand-yellow";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "online":
        return "bg-brand-green/10";
      case "offline":
        return "bg-red-100";
      case "warning":
        return "bg-brand-yellow/10";
      default:
        return "bg-gray-100";
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case "error":
        return "text-red-600 bg-red-50";
      case "warning":
        return "text-brand-yellow bg-brand-yellow/10";
      case "info":
        return "text-brand-green bg-brand-green/10";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getLogIcon = (level) => {
    switch (level) {
      case "error":
        return <AlertTriangle className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "info":
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-green/5 to-brand-yellow/5">
      <div className="flex flex-col p-6 h-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-brand-green" />
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-yellow">
                  Quản lý hệ thống
                </h1>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Theo dõi và quản lý trạng thái hệ thống
              </p>
            </div>
            <div className="px-4 py-2 text-sm text-brand-green bg-white rounded-lg border border-brand-green/20 shadow-sm">
              Phiên bản: {systemInfo.version}
            </div>
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white border-brand-green/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tổng người dùng</CardTitle>
                <Users className="w-4 h-4 text-brand-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-green">{systemInfo.totalUsers}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {systemInfo.activeUsers} đang hoạt động
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-brand-green/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Công việc</CardTitle>
                <Activity className="w-4 h-4 text-brand-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-green">{systemInfo.totalWorks}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {systemInfo.pendingWorks} đang chờ xử lý
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-brand-green/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Thời gian hoạt động</CardTitle>
                <Clock className="w-4 h-4 text-brand-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-green">{systemInfo.uptime}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Hệ thống ổn định
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-brand-green/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Trạng thái hệ thống</CardTitle>
                <Shield className="w-4 h-4 text-brand-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-green capitalize">{systemInfo.systemHealth}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Tất cả dịch vụ hoạt động bình thường
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Resources */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="bg-white border-brand-green/20">
              <CardHeader>
                <CardTitle className="text-xl text-brand-green">Tài nguyên hệ thống</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-brand-green" />
                      <span className="text-sm text-gray-600">CPU Usage</span>
                    </div>
                    <span className="text-sm font-medium text-brand-green">{systemInfo.serverLoad}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-brand-green to-brand-yellow h-2 rounded-full" 
                      style={{ width: systemInfo.serverLoad }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MemoryStick className="w-4 h-4 text-brand-green" />
                      <span className="text-sm text-gray-600">Memory Usage</span>
                    </div>
                    <span className="text-sm font-medium text-brand-green">{systemInfo.memoryUsage}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-brand-green to-brand-yellow h-2 rounded-full" 
                      style={{ width: systemInfo.memoryUsage }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-brand-green" />
                      <span className="text-sm text-gray-600">Disk Usage</span>
                    </div>
                    <span className="text-sm font-medium text-brand-green">{systemInfo.diskUsage}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-brand-green to-brand-yellow h-2 rounded-full" 
                      style={{ width: systemInfo.diskUsage }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Database Size:</span>
                    <span className="font-medium text-brand-green">{systemInfo.databaseSize}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-brand-green/20">
              <CardHeader>
                <CardTitle className="text-xl text-brand-green">Trạng thái dịch vụ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getStatusBg(service.status)}`}>
                          {service.status === "online" ? (
                            <CheckCircle className="w-4 h-4 text-brand-green" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-500">Uptime: {service.uptime}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBg(service.status)} ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Logs */}
          <Card className="bg-white border-brand-green/20">
            <CardHeader>
              <CardTitle className="text-xl text-brand-green">Nhật ký hệ thống gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLogs.map((log, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${getLogLevelColor(log.level)}`}>
                      {getLogIcon(log.level)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{log.message}</p>
                      <p className="text-xs text-gray-500">{log.timestamp}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getLogLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 