"use client";

import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Clock, 
  MapPin, 
  Download,
  Filter,
  Search,
  Eye,
  FileText,
  PieChart,
  Activity,
  Target,
  Award
} from "lucide-react";

export default function ReportsClient() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const stats = [
    {
      title: "Tổng doanh thu",
      value: "2,450,000",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "bg-green-500"
    },
    {
      title: "Dịch vụ hoàn thành",
      value: "1,234",
      change: "+8.2%",
      changeType: "positive",
      icon: Award,
      color: "bg-blue-500"
    },
    {
      title: "Khách hàng mới",
      value: "89",
      change: "+15.3%",
      changeType: "positive",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      title: "Thời gian trung bình",
      value: "2.4h",
      change: "-5.1%",
      changeType: "negative",
      icon: Clock,
      color: "bg-orange-500"
    }
  ];

  const reportTypes = [
    {
      id: 'overview',
      title: 'Tổng quan',
      description: 'Báo cáo tổng hợp tình hình kinh doanh',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      id: 'revenue',
      title: 'Doanh thu',
      description: 'Phân tích chi tiết doanh thu theo thời gian',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      id: 'services',
      title: 'Dịch vụ',
      description: 'Thống kê dịch vụ và hiệu suất',
      icon: Activity,
      color: 'bg-purple-500'
    },
    {
      id: 'customers',
      title: 'Khách hàng',
      description: 'Phân tích hành vi và sự hài lòng',
      icon: Users,
      color: 'bg-orange-500'
    },
    {
      id: 'workers',
      title: 'Nhân viên',
      description: 'Hiệu suất và phân công công việc',
      icon: Target,
      color: 'bg-red-500'
    },
    {
      id: 'locations',
      title: 'Khu vực',
      description: 'Phân tích theo địa lý và vùng miền',
      icon: MapPin,
      color: 'bg-indigo-500'
    }
  ];

  const recentReports = [
    {
      id: 1,
      title: 'Báo cáo tháng 12/2024',
      type: 'Tổng quan',
      date: '2024-12-01',
      status: 'completed',
      size: '2.4 MB'
    },
    {
      id: 2,
      title: 'Phân tích doanh thu Q4',
      type: 'Doanh thu',
      date: '2024-11-30',
      status: 'completed',
      size: '1.8 MB'
    },
    {
      id: 3,
      title: 'Báo cáo khách hàng VIP',
      type: 'Khách hàng',
      date: '2024-11-28',
      status: 'processing',
      size: '3.2 MB'
    }
  ];

  return (
    <>
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
            <p className="mt-0.5 text-sm text-gray-600">
              Phân tích dữ liệu và tạo báo cáo chi tiết
            </p>
          </div>
          
          <div className="flex gap-2 items-center">
            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-2 py-1.5 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm nay</option>
            </select>

            {/* Export Button */}
            <button className="inline-flex gap-1.5 items-center px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700">
              <Download className="w-3.5 h-3.5" />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex overflow-hidden flex-1">
        {/* Sidebar - Report Types */}
        <div className="overflow-y-auto flex-shrink-0 w-64 bg-gray-50 border-r border-gray-200">
          <div className="p-3">
            <div className="flex gap-2 items-center mb-3 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4" />
              Loại báo cáo
            </div>
            
            <div className="space-y-1.5">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full text-left p-3 rounded-md transition-all duration-200 ${
                    selectedReport === report.id
                      ? 'bg-white shadow-sm border border-gray-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${report.color}`}>
                      <report.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{report.title}</h3>
                      <p className="mt-0.5 text-xs text-gray-600">{report.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Recent Reports */}
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium text-gray-700">Báo cáo gần đây</h3>
              <div className="space-y-1.5">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-2.5 bg-white rounded-md border border-gray-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <h4 className="text-sm font-medium text-gray-900">{report.title}</h4>
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                        report.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {report.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{report.type}</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="overflow-y-auto flex-1 bg-white">
          <div className="p-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-3 mb-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 transition-shadow hover:shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600">{stat.title}</p>
                      <p className="mt-1 text-lg font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex gap-1 items-center mt-2">
                    <span className={`text-xs font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">so với tháng trước</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Report Content */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  {reportTypes.find(r => r.id === selectedReport)?.title}
                </h2>
                <div className="flex gap-1.5 items-center">
                  <button className="inline-flex gap-1.5 items-center px-2.5 py-1.5 text-sm rounded-md border border-gray-200 hover:bg-gray-50">
                    <Filter className="w-3.5 h-3.5" />
                    Lọc
                  </button>
                  <button className="inline-flex gap-1.5 items-center px-2.5 py-1.5 text-sm rounded-md border border-gray-200 hover:bg-gray-50">
                    <Download className="w-3.5 h-3.5" />
                    Tải xuống
                  </button>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="p-6 text-center bg-gray-50 rounded-lg">
                <BarChart3 className="mx-auto mb-3 w-12 h-12 text-gray-400" />
                <h3 className="mb-1.5 text-base font-medium text-gray-900">
                  Biểu đồ {reportTypes.find(r => r.id === selectedReport)?.title}
                </h3>
                <p className="mb-3 text-sm text-gray-600">
                  Dữ liệu thống kê và phân tích chi tiết sẽ được hiển thị tại đây
                </p>
                
                {/* Sample Data Table */}
                <div className="overflow-hidden bg-white rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Chỉ số</th>
                        <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Giá trị</th>
                        <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Thay đổi</th>
                        <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Xu hướng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-3 py-2 text-sm text-gray-900">Tổng đơn hàng</td>
                        <td className="px-3 py-2 text-sm font-medium text-gray-900">1,234</td>
                        <td className="px-3 py-2 text-sm text-green-600">+12.5%</td>
                        <td className="px-3 py-2">
                          <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-sm text-gray-900">Doanh thu trung bình</td>
                        <td className="px-3 py-2 text-sm font-medium text-gray-900">2,450,000 VNĐ</td>
                        <td className="px-3 py-2 text-sm text-green-600">+8.2%</td>
                        <td className="px-3 py-2">
                          <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-sm text-gray-900">Tỷ lệ hoàn thành</td>
                        <td className="px-3 py-2 text-sm font-medium text-gray-900">94.2%</td>
                        <td className="px-3 py-2 text-sm text-red-600">-2.1%</td>
                        <td className="px-3 py-2">
                          <TrendingUp className="w-3.5 h-3.5 text-red-500 rotate-180" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Insights */}
              <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-2">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="mb-1.5 font-medium text-blue-900 text-sm">💡 Insight</h4>
                  <p className="text-xs text-blue-800">
                    Doanh thu tăng 12.5% so với tháng trước, chủ yếu nhờ vào dịch vụ dọn dẹp văn phòng và bảo trì hệ thống.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="mb-1.5 font-medium text-green-900 text-sm">🎯 Khuyến nghị</h4>
                  <p className="text-xs text-green-800">
                    Tăng cường marketing cho dịch vụ bảo trì định kỳ và mở rộng dịch vụ sang khu vực mới.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 