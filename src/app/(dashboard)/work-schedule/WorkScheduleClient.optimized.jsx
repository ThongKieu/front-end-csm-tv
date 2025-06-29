"use client";

import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { getWorksByDate, getWorksByCustomerPhone } from "@/data/demoWorks";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  User,
  FileText,
  Search,
  X,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DateNavigator from "@/components/ui/DateNavigator";

export default function WorkScheduleClient() {
  const [date, setDate] = useState(new Date());
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState("");

  useEffect(() => {
    const fetchWorks = () => {
      setLoading(true);
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        let worksData;

        if (searchPhone) {
          worksData = getWorksByCustomerPhone(searchPhone);
        } else {
          worksData = getWorksByDate(formattedDate);
        }

        setWorks(worksData);
      } catch (error) {
        console.error("Error fetching works:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, [date, searchPhone]);

  const handlePreviousDay = () => {
    setDate((prevDate) => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setDate((prevDate) => addDays(prevDate, 1));
  };

  const handleToday = () => {
    setDate(new Date());
  };

  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
  };

  const handleClearSearch = () => {
    setSearchPhone("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "in_progress":
        return "Đang thực hiện";
      case "completed":
        return "Hoàn thành";
      default:
        return "Không xác định";
    }
  };

  // Tính toán stats
  const stats = {
    total: works.length,
    pending: works.filter(w => w.status_work === "pending").length,
    completed: works.filter(w => w.status_work === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 mx-auto space-y-4 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lịch làm việc</h1>
            <p className="text-sm text-gray-600">Ngày {format(date, "dd/MM/yyyy")}</p>
          </div>
          
          <div className="flex gap-3 items-center">
            <DateNavigator
              selectedDate={format(date, "yyyy-MM-dd")}
              onDateChange={handleDateChange}
              onPreviousDay={handlePreviousDay}
              onNextDay={handleNextDay}
              onToday={handleToday}
              className="bg-white shadow-sm"
            />
            
            <button className="flex gap-2 items-center px-3 py-2 text-sm text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Thêm
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-gray-500">Tổng</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          
          <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-gray-500">Chờ xử lý</p>
                <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          
          <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-gray-500">Hoàn thành</p>
                <p className="text-xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CalendarIcon className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo số điện thoại..."
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="pr-10 pl-10 h-10 text-sm"
                />
                {searchPhone && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <button className="flex gap-2 items-center px-3 py-2 text-gray-600 bg-gray-50 rounded-lg border border-gray-200 transition-colors hover:bg-gray-100">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Lọc</span>
              </button>
            </div>
          </div>

          {/* Work List */}
          <Card className="bg-white border border-gray-100 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Danh sách công việc</h2>
                <span className="text-sm text-gray-500">{stats.total} công việc</span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-200 animate-spin border-t-blue-600"></div>
                    <p className="text-sm text-gray-600">Đang tải...</p>
                  </div>
                </div>
              ) : works.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-12 text-center">
                  <CalendarIcon className="mb-3 w-12 h-12 text-gray-300" />
                  <h3 className="mb-1 text-base font-medium text-gray-800">
                    {searchPhone ? "Không tìm thấy công việc" : "Không có công việc nào"}
                  </h3>
                  <p className="max-w-sm text-sm text-gray-600">
                    {searchPhone
                      ? "Thử tìm kiếm với số điện thoại khác"
                      : "Thêm công việc mới hoặc chọn ngày khác"}
                  </p>
                </div>
              ) : (
                works.map((work, index) => (
                  <div key={work.id} className="p-4 transition-colors hover:bg-gray-50">
                    <div className="flex gap-4 items-start">
                      {/* Customer Avatar */}
                      <div className="flex-shrink-0">
                        <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      
                      {/* Work Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-3 justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex gap-2 items-center mb-1">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {work.customer.name}
                              </h3>
                              <span className="text-xs text-gray-500">#{index + 1}</span>
                            </div>
                            
                            <div className="flex gap-2 items-center mb-2 text-xs text-gray-500">
                              <Phone className="w-3 h-3" />
                              <span>{work.customer.phone}</span>
                            </div>
                            
                            <p className="mb-2 text-sm text-gray-700 line-clamp-2">
                              {work.work_content}
                            </p>
                            
                            <div className="flex gap-4 items-center text-xs text-gray-500">
                              <div className="flex gap-1 items-center">
                                <Clock className="w-3 h-3" />
                                <span>{format(new Date(work.created_at), "HH:mm")}</span>
                              </div>
                              <div className="flex gap-1 items-center">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">{work.address.address}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Status & Actions */}
                          <div className="flex flex-col gap-2 items-end">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(work.status_work)}`}>
                              {getStatusText(work.status_work)}
                            </span>
                            
                            <div className="flex gap-1 items-center">
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 