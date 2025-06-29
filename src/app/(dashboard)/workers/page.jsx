"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  DollarSign,
  Star,
  Award,
  TrendingUp,
  UserCheck,
  UserX,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Download,
  RefreshCw,
  X
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWorkers, selectWorkers, selectLoading } from "@/store/slices/workSlice";

export default function WorkersPage() {
  const dispatch = useDispatch();
  const workers = useSelector(selectWorkers);
  const loading = useSelector(selectLoading);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("name"); // name, performance, status
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  // Filter and sort workers
  const filteredWorkers = workers
    .filter(worker => {
      const matchesSearch = 
        worker.worker_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.worker_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.worker_phone_company?.includes(searchTerm);

      if (selectedFilter === "all") return matchesSearch;
      if (selectedFilter === "active") return matchesSearch && worker.worker_status === 1;
      if (selectedFilter === "inactive") return matchesSearch && worker.worker_status === 0;
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.worker_full_name.localeCompare(b.worker_full_name);
        case "performance":
          return (b.worker_daily_sales || 0) - (a.worker_daily_sales || 0);
        case "status":
          return b.worker_status - a.worker_status;
        default:
          return 0;
      }
    });

  const stats = [
    {
      title: "Tổng nhân viên",
      value: workers.length,
      change: "+2",
      changeType: "positive",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Đang hoạt động",
      value: workers.filter(w => w.worker_status === 1).length,
      change: "+1",
      changeType: "positive",
      icon: UserCheck,
      color: "bg-green-500"
    },
    {
      title: "Tạm nghỉ",
      value: workers.filter(w => w.worker_status === 0).length,
      change: "0",
      changeType: "neutral",
      icon: UserX,
      color: "bg-orange-500"
    },
    {
      title: "Hiệu suất TB",
      value: `${Math.round(workers.reduce((acc, w) => acc + (w.worker_daily_sales || 0), 0) / workers.length).toLocaleString()} VNĐ`,
      change: "+5.2%",
      changeType: "positive",
      icon: TrendingUp,
      color: "bg-purple-500"
    }
  ];

  const handleViewDetails = (worker) => {
    setSelectedWorker(worker);
    setIsDetailModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const getPerformanceColor = (sales) => {
    if (sales >= 5000000) return "text-green-600";
    if (sales >= 3000000) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500">Đang tải danh sách nhân viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Quản lý nhân viên</h1>
            <p className="mt-0.5 text-sm text-gray-600">
              Quản lý thông tin và hiệu suất nhân viên
            </p>
          </div>
          
          <div className="flex gap-2 items-center">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-all ${
                  viewMode === "grid" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-all ${
                  viewMode === "list" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="w-4 h-4 flex flex-col gap-0.5">
                  <div className="w-full h-1 bg-current rounded-sm"></div>
                  <div className="w-full h-1 bg-current rounded-sm"></div>
                  <div className="w-full h-1 bg-current rounded-sm"></div>
                </div>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Add Worker Button */}
            <button className="inline-flex gap-1.5 items-center px-3 py-2 text-sm text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Thêm nhân viên
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Filters */}
        <div className="overflow-y-auto flex-shrink-0 w-64 bg-gray-50 border-r border-gray-200">
          <div className="p-3">
            <div className="flex gap-2 items-center mb-3 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4" />
              Bộ lọc
            </div>
            
            {/* Status Filter */}
            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-600 mb-2">Trạng thái</h3>
              <div className="space-y-1">
                {[
                  { id: "all", label: "Tất cả", count: workers.length },
                  { id: "active", label: "Đang hoạt động", count: workers.filter(w => w.worker_status === 1).length },
                  { id: "inactive", label: "Tạm nghỉ", count: workers.filter(w => w.worker_status === 0).length }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-all duration-200 ${
                      selectedFilter === filter.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{filter.label}</span>
                      <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                        {filter.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-600 mb-2">Sắp xếp</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Theo tên</option>
                <option value="performance">Theo hiệu suất</option>
                <option value="status">Theo trạng thái</option>
              </select>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <h3 className="text-xs font-medium text-gray-600 mb-2">Thống kê nhanh</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tổng nhân viên:</span>
                  <span className="font-medium">{workers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Đang hoạt động:</span>
                  <span className="font-medium text-green-600">{workers.filter(w => w.worker_status === 1).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tạm nghỉ:</span>
                  <span className="font-medium text-orange-600">{workers.filter(w => w.worker_status === 0).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white overflow-y-auto">
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
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">so với tháng trước</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Workers Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{worker.worker_full_name}</h3>
                          <p className="text-xs text-gray-500">#{worker.worker_code}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        worker.worker_status === 1 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {worker.worker_status === 1 ? 'Hoạt động' : 'Tạm nghỉ'}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span>{worker.worker_phone_company}</span>
                      </div>
                      {worker.worker_address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{worker.worker_address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3 h-3" />
                        <span className={getPerformanceColor(worker.worker_daily_sales)}>
                          {formatCurrency(worker.worker_daily_sales)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleViewDetails(worker)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Xem chi tiết
                      </button>
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mã số</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hiệu suất</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredWorkers.map((worker) => (
                      <tr key={worker.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{worker.worker_full_name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500">#{worker.worker_code}</td>
                        <td className="px-3 py-3 text-sm text-gray-500">{worker.worker_phone_company}</td>
                        <td className="px-3 py-3">
                          <span className={`text-sm font-medium ${getPerformanceColor(worker.worker_daily_sales)}`}>
                            {formatCurrency(worker.worker_daily_sales)}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            worker.worker_status === 1 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {worker.worker_status === 1 ? 'Hoạt động' : 'Tạm nghỉ'}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleViewDetails(worker)}
                              className="p-1 text-gray-400 hover:text-blue-600"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {filteredWorkers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy nhân viên</h3>
                <p className="text-gray-500">
                  {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Chưa có nhân viên nào trong hệ thống"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Worker Detail Modal */}
      {isDetailModalOpen && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Chi tiết nhân viên</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedWorker.worker_full_name}</h3>
                  <p className="text-sm text-gray-500">#{selectedWorker.worker_code}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{selectedWorker.worker_phone_company}</span>
                </div>
                {selectedWorker.worker_phone_personal && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedWorker.worker_phone_personal} (Cá nhân)</span>
                  </div>
                )}
                {selectedWorker.worker_address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedWorker.worker_address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className={getPerformanceColor(selectedWorker.worker_daily_sales)}>
                    {formatCurrency(selectedWorker.worker_daily_sales)} / ngày
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{selectedWorker.worker_daily_o_t_by_hour || 0} giờ OT / ngày</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedWorker.worker_status === 1 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {selectedWorker.worker_status === 1 ? 'Đang hoạt động' : 'Tạm nghỉ'}
                </span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50">
                    Chỉnh sửa
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Xem lịch sử
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 