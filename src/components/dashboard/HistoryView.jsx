"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
  Phone,
  FileText,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  CalendarDays,
  History,
  AlertCircle,
} from "lucide-react";

export default function HistoryView({ viewMode, dateRange }) {
  const [expandedDates, setExpandedDates] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "pending", "completed"
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - trong thực tế sẽ lấy từ API
  const mockHistoryData = [
    {
      date: "2024-01-15",
      status: "pending",
      works: [
        {
          id: 1,
          customer: "Nguyễn Văn A",
          phone: "0123456789",
          address: "123 Đường ABC, Quận 1, TP.HCM",
          work_content: "Sửa chữa điện nước",
          service_type: "Điện Nước",
          created_at: "2024-01-15T08:00:00",
          assigned_worker: null,
        },
        {
          id: 2,
          customer: "Trần Thị B",
          phone: "0987654321",
          address: "456 Đường XYZ, Quận 2, TP.HCM",
          work_content: "Bảo trì điều hòa",
          service_type: "Điện Lạnh",
          created_at: "2024-01-15T09:30:00",
          assigned_worker: "Nguyễn Văn Công",
        },
      ],
    },
    {
      date: "2024-01-14",
      status: "completed",
      works: [
        {
          id: 3,
          customer: "Lê Văn C",
          phone: "0111222333",
          address: "789 Đường DEF, Quận 3, TP.HCM",
          work_content: "Lắp đặt đồ gỗ",
          service_type: "Đồ gỗ",
          created_at: "2024-01-14T10:00:00",
          assigned_worker: "Trần Văn Thợ",
        },
      ],
    },
    {
      date: "2024-01-13",
      status: "pending",
      works: [
        {
          id: 4,
          customer: "Phạm Thị D",
          phone: "0444555666",
          address: "321 Đường GHI, Quận 4, TP.HCM",
          work_content: "Sửa chữa điện",
          service_type: "Điện Nước",
          created_at: "2024-01-13T14:00:00",
          assigned_worker: null,
        },
      ],
    },
  ];

  const toggleDateExpansion = (date) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chưa xử lý";
      case "completed":
        return "Đã hoàn thành";
      default:
        return "Đang xử lý";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case "Điện Nước":
        return "from-blue-500 to-blue-600";
      case "Điện Lạnh":
        return "from-green-500 to-green-600";
      case "Đồ gỗ":
        return "from-yellow-500 to-yellow-600";
      case "Vệ sinh":
        return "from-purple-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const filteredData = mockHistoryData.filter((item) => {
    // Filter by status
    if (filterStatus !== "all" && item.status !== filterStatus) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const hasMatch = item.works.some(
        (work) =>
          work.customer.toLowerCase().includes(searchLower) ||
          work.phone.includes(searchTerm) ||
          work.work_content.toLowerCase().includes(searchLower) ||
          work.address.toLowerCase().includes(searchLower)
      );
      if (!hasMatch) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {viewMode === "history" ? "Lịch sử công việc" : "Công việc chưa xử lý"}
            </h3>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chưa xử lý</option>
                <option value="completed">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
        </div>
      </Card>

      {/* History List */}
      <div className="space-y-3">
        {filteredData.length === 0 ? (
          <Card className="p-8 text-center">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Không có dữ liệu
            </h3>
            <p className="text-sm text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Không tìm thấy công việc nào phù hợp với bộ lọc"
                : "Chưa có công việc nào trong khoảng thời gian này"}
            </p>
          </Card>
        ) : (
          filteredData.map((item) => (
            <Card key={item.date} className="bg-white shadow-sm">
              {/* Date Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleDateExpansion(item.date)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {formatDate(item.date)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {item.works.length} công việc • {getStatusText(item.status)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {expandedDates.has(item.date) ? "Thu gọn" : "Mở rộng"}
                  </span>
                  {expandedDates.has(item.date) ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Works List */}
              {expandedDates.has(item.date) && (
                <div className="border-t border-gray-100">
                  {item.works.map((work) => (
                    <div
                      key={work.id}
                      className="p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full shadow-sm bg-gradient-to-r ${getServiceTypeColor(
                                work.service_type
                              )}`}
                            >
                              {work.service_type.charAt(0)}
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                              {work.customer}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-sm text-gray-600">{work.service_type}</span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FileText className="w-3.5 h-3.5" />
                              <span>{work.work_content}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{work.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="truncate">{work.address}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 ml-4">
                          <div className="text-xs text-gray-500">
                            {new Date(work.created_at).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          {work.assigned_worker ? (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <User className="w-3 h-3" />
                              <span>{work.assigned_worker}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-orange-600">
                              <AlertCircle className="w-3 h-3" />
                              <span>Chưa phân công</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 