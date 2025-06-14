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
  ChevronRight,
  ChevronLeft,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
          // Nếu có số điện thoại tìm kiếm, lọc theo số điện thoại
          worksData = getWorksByCustomerPhone(searchPhone);
        } else {
          // Nếu không có số điện thoại tìm kiếm, lấy theo ngày
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Lịch làm việc
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý và theo dõi công việc theo ngày
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDay}
            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-blue-200 shadow-sm hover:border-blue-300 transition-colors">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <input
              type="date"
              value={format(date, "yyyy-MM-dd")}
              onChange={handleDateChange}
              className="bg-transparent border-none focus:ring-0 text-blue-900 font-medium"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            Hôm nay
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Tìm kiếm theo số điện thoại..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="pl-10 pr-10 h-9 text-sm"
        />
        {searchPhone && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Work List */}
      <Card className="p-4 border border-blue-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-100">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nội dung công việc
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : works.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8">
                    <div className="flex flex-col items-center text-gray-500">
                      <CalendarIcon className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-sm font-medium">
                        {searchPhone
                          ? "Không tìm thấy công việc nào với số điện thoại này"
                          : "Không có công việc nào"}
                      </p>
                      <p className="text-xs mt-1">
                        {searchPhone
                          ? "Hãy thử tìm kiếm với số điện thoại khác"
                          : "Hãy chọn ngày khác hoặc thêm công việc mới"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                works.map((work) => (
                  <tr
                    key={work.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {work.customer.name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center mt-0.5">
                            <Phone className="w-3.5 h-3.5 mr-1" />
                            {work.customer.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {work.work_content}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {format(new Date(work.created_at), "HH:mm")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-600 truncate max-w-[200px]">
                          {work.address.address}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                            ${
                              work.status_work === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : work.status_work === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                      >
                        {work.status_work === "pending"
                          ? "Chờ xử lý"
                          : work.status_work === "in_progress"
                          ? "Đang thực hiện"
                          : "Hoàn thành"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
