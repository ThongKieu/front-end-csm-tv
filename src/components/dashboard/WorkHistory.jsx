"use client";

import { useState, useCallback, useMemo } from "react";
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
  History,
  AlertCircle,
} from "lucide-react";

export default function WorkHistory({ viewMode }) {
  const [expandedDates, setExpandedDates] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - trong thực tế sẽ lấy từ props hoặc API
  const mockHistoryData = useMemo(() => [
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
  ], []);

  const toggleDateExpansion = useCallback((date) => {
    setExpandedDates(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(date)) {
        newExpanded.delete(date);
      } else {
        newExpanded.add(date);
      }
      return newExpanded;
    });
  }, []);

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case "pending":
        return <AlertTriangle className="w-3 h-3 text-brand-yellow" />;
      case "completed":
        return <CheckCircle className="w-3 h-3 text-brand-green" />;
      default:
        return <Clock className="w-3 h-3 text-brand-green" />;
    }
  }, []);

  const getStatusText = useCallback((status) => {
    switch (status) {
      case "pending":
        return "Chưa xử lý";
      case "completed":
        return "Đã hoàn thành";
      default:
        return "Đang xử lý";
    }
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "pending":
        return "text-brand-yellow bg-brand-yellow/10 border-brand-yellow/20";
      case "completed":
        return "text-brand-green bg-brand-green/10 border-brand-green/20";
      default:
        return "text-brand-green bg-brand-green/10 border-brand-green/20";
    }
  }, []);

  const getServiceTypeColor = useCallback((serviceType) => {
    switch (serviceType) {
      case "Điện Nước":
        return "from-brand-green to-brand-green/80";
      case "Điện Lạnh":
        return "from-brand-green to-brand-green/80";
      case "Đồ gỗ":
        return "from-brand-yellow to-brand-yellow/80";
      default:
        return "from-gray-500 to-gray-600";
    }
  }, []);

  const formatDate = useCallback((dateString) => {
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
  }, []);

  const filteredData = useMemo(() => {
    return mockHistoryData.filter((item) => {
      if (filterStatus !== "all" && item.status !== filterStatus) {
        return false;
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const hasMatch = item.works.some(
          (work) =>
            work.customer.toLowerCase().includes(searchLower) ||
            work.phone.includes(searchTerm) ||
            work.work_content.toLowerCase().includes(searchLower)
        );
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [mockHistoryData, filterStatus, searchTerm]);

  const handleFilterChange = useCallback((e) => {
    setFilterStatus(e.target.value);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className="space-y-3">
      {/* Compact Filters */}
      <Card className="p-3 bg-white shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-gray-800">
              {viewMode === "history" ? "Lịch sử công việc" : "Công việc chưa xử lý"}
            </h3>
            
            <div className="flex items-center gap-2">
              <Filter className="w-3 h-3 text-gray-500" />
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chưa xử lý</option>
                <option value="completed">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green w-full md:w-48"
            />
          </div>
        </div>
      </Card>

      {/* Compact History List */}
      <div className="space-y-2">
        {filteredData.length === 0 ? (
          <Card className="p-6 text-center">
            <History className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Không có dữ liệu
            </h3>
            <p className="text-xs text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Không tìm thấy công việc nào phù hợp"
                : "Chưa có công việc nào trong khoảng thời gian này"}
            </p>
          </Card>
        ) : (
          filteredData.map((item) => (
            <Card key={item.date} className="bg-white shadow-sm">
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleDateExpansion(item.date)}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">
                      {formatDate(item.date)}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {item.works.length} công việc • {getStatusText(item.status)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">
                    {expandedDates.has(item.date) ? "Thu gọn" : "Mở rộng"}
                  </span>
                  {expandedDates.has(item.date) ? (
                    <ChevronUp className="w-3 h-3 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  )}
                </div>
              </div>

              {expandedDates.has(item.date) && (
                <div className="border-t border-gray-100">
                  {item.works.map((work) => (
                    <div
                      key={work.id}
                      className="p-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={`inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white rounded-full shadow-sm bg-gradient-to-r ${getServiceTypeColor(
                                work.service_type
                              )}`}
                            >
                              {work.service_type.charAt(0)}
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                              {work.customer}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-600">{work.service_type}</span>
                          </div>
                          
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <FileText className="w-3 h-3" />
                              <span className="truncate">{work.work_content}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{work.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{work.address}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 ml-3">
                          <div className="text-xs text-gray-500">
                            {new Date(work.created_at).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          {work.assigned_worker ? (
                            <div className="flex items-center gap-1 text-xs text-brand-green">
                              <User className="w-3 h-3" />
                              <span>{work.assigned_worker}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-brand-yellow">
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