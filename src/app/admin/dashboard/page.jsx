"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Phone, Users, TrendingUp, Clock, CheckCircle, ArrowUpRight, ArrowDownRight, DollarSign, Briefcase, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

// Mock data for the chart
const chartData = [
  { name: "T2", appointments: 24, calls: 33, sources: 12, revenue: 1200000 },
  { name: "T3", appointments: 33, calls: 44, sources: 23, revenue: 1500000 },
  { name: "T4", appointments: 45, calls: 22, sources: 34, revenue: 1800000 },
  { name: "T5", appointments: 22, calls: 55, sources: 23, revenue: 1400000 },
  { name: "T6", appointments: 34, calls: 33, sources: 22, revenue: 1600000 },
  { name: "T7", appointments: 23, calls: 44, sources: 33, revenue: 1300000 },
  { name: "CN", appointments: 12, calls: 23, sources: 12, revenue: 900000 },
];

// Mock data for stats
const initialStats = {
  totalAppointments: 156,
  totalCalls: 243,
  totalSources: 5,
  successRate: 85,
  averageResponseTime: 12,
  totalRevenue: 9700000,
  totalProjects: 45,
  recentActivity: [
    {
      title: "Tạo lịch hẹn mới",
      description: "Đã tạo lịch hẹn tư vấn dịch vụ",
      timestamp: "2024-03-20T09:00:00Z",
      type: "appointment"
    },
    {
      title: "Cuộc gọi thành công",
      description: "Đã hoàn thành cuộc gọi tư vấn",
      timestamp: "2024-03-20T10:30:00Z",
      type: "call"
    },
    {
      title: "Cập nhật trạng thái",
      description: "Đã cập nhật trạng thái lịch hẹn",
      timestamp: "2024-03-20T11:15:00Z",
      type: "update"
    },
    {
      title: "Thêm nguồn mới",
      description: "Đã thêm nguồn khách hàng từ Facebook",
      timestamp: "2024-03-20T14:20:00Z",
      type: "source"
    },
    {
      title: "Tạo lịch hẹn mới",
      description: "Đã tạo lịch hẹn khảo sát công trình",
      timestamp: "2024-03-20T15:45:00Z",
      type: "appointment"
    },
  ],
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, trendType, description }) => (
  <Card className="bg-white transition-all duration-200 hover:shadow-lg">
    <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      <div className="p-2 bg-gray-50 rounded-lg">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="flex items-center mt-2">
        {trendType === "up" ? (
          <ArrowUpRight className="mr-1 w-4 h-4 text-green-500" />
        ) : (
          <ArrowDownRight className="mr-1 w-4 h-4 text-red-500" />
        )}
        <p className="text-xs text-gray-500">
          {trendValue} {trend}
        </p>
      </div>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </CardContent>
  </Card>
);

const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'appointment':
      return <Calendar className="w-4 h-4 text-blue-500" />;
    case 'call':
      return <Phone className="w-4 h-4 text-green-500" />;
    case 'update':
      return <CheckCircle className="w-4 h-4 text-yellow-500" />;
    case 'source':
      return <Users className="w-4 h-4 text-purple-500" />;
    case 'feedback':
      return <MessageSquare className="w-4 h-4 text-yellow-500" />;
    default:
      return <Calendar className="w-4 h-4 text-gray-500" />;
  }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(initialStats);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        setStats(data);
        setLastUpdated(format(new Date(), "HH:mm:ss dd/MM/yyyy", { locale: vi }));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
    const interval = setInterval(() => {
      setLastUpdated(format(new Date(), "HH:mm:ss dd/MM/yyyy", { locale: vi }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "HH:mm:ss dd/MM/yyyy", { locale: vi });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col p-6 h-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Tổng quan về hoạt động của hệ thống
              </p>
            </div>
            <div className="px-4 py-2 text-sm text-gray-500 bg-white rounded-lg border border-gray-100 shadow-sm">
              Cập nhật lần cuối: {lastUpdated}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Tổng số lịch hẹn"
              value={stats.totalAppointments}
              icon={Calendar}
              trend="so với tuần trước"
              trendValue="+20%"
              trendType="up"
              description="Tăng 20% so với tuần trước"
            />
            <StatCard
              title="Tổng số cuộc gọi"
              value={stats.totalCalls}
              icon={Phone}
              trend="so với tuần trước"
              trendValue="+15%"
              trendType="up"
              description="Tăng 15% so với tuần trước"
            />
            <StatCard
              title="Doanh thu"
              value={formatCurrency(stats.totalRevenue)}
              icon={DollarSign}
              trend="so với tuần trước"
              trendValue="+25%"
              trendType="up"
              description="Tăng 25% so với tuần trước"
            />
            <StatCard
              title="Dự án đang thực hiện"
              value={stats.totalProjects}
              icon={Briefcase}
              trend="so với tuần trước"
              trendValue="+5"
              trendType="up"
              description="Tăng 5 dự án so với tuần trước"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-black">Doanh thu tuần</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                      <XAxis 
                        dataKey="name" 
                        className="text-sm"
                        tick={{ fill: '#6B7280' }}
                      />
                      <YAxis 
                        className="text-sm"
                        tick={{ fill: '#6B7280' }}
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Activity Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-black">Hoạt động tuần</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                      <XAxis 
                        dataKey="name" 
                        className="text-sm"
                        tick={{ fill: '#6B7280' }}
                      />
                      <YAxis 
                        className="text-sm"
                        tick={{ fill: '#6B7280' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="appointments"
                        stroke="#3b82f6"
                        name="Lịch hẹn"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="calls"
                        stroke="#22c55e"
                        name="Cuộc gọi"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sources"
                        stroke="#a855f7"
                        name="Nguồn"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-black">Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-100 transition-colors duration-200 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-50 rounded-full">
                        <ActivityIcon type={activity.type} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 text-sm text-gray-500 bg-gray-50 rounded-full">
                      {formatDate(activity.timestamp)}
                    </div>
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