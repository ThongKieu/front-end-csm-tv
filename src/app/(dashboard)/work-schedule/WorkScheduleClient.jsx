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
      <div className="flex flex-col items-start justify-between gap-4 p-4 bg-white border border-blue-100 rounded-lg shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
            Lịch làm việc
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý và theo dõi công việc theo ngày
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDay}
            className="transition-colors hover:bg-blue-50 hover:text-blue-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-blue-200 shadow-sm hover:border-blue-300 transition-colors">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <input
              type="date"
              value={format(date, "yyyy-MM-dd")}
              onChange={handleDateChange}
              className="font-medium text-blue-900 bg-transparent border-none focus:ring-0"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            className="transition-colors hover:bg-blue-50 hover:text-blue-600"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="transition-colors hover:bg-blue-50 hover:text-blue-600"
          >
            Hôm nay
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Tìm kiếm theo số điện thoại..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="pl-10 pr-10 text-sm h-9"
        />
        {searchPhone && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Work List */}
      <Card className="p-4 border border-blue-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-100">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Nội dung công việc
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Địa chỉ
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : works.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center">
                    <div className="flex flex-col items-center text-gray-500">
                      <CalendarIcon className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-sm font-medium">
                        {searchPhone
                          ? "Không tìm thấy công việc nào với số điện thoại này"
                          : "Không có công việc nào"}
                      </p>
                      <p className="mt-1 text-xs">
                        {searchPhone
                          ? "Hãy thử tìm kiếm với số điện thoại khác"
                          : "Hãy chọn ngày khác hoặc thêm công việc mới"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                works.map((work, index) => (
                  <tr
                    key={work.id}
                    className="transition-colors hover:bg-blue-50/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
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
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-900">
                            <span className="inline-flex items-center justify-center w-5 h-5 mr-2 text-xs font-bold text-white rounded-full shadow-sm bg-gradient-to-r from-blue-500 to-blue-600">
                              {index + 1}
                            </span>
                            {work.work_content}
                          </div>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {format(new Date(work.created_at), "HH:mm")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="flex-shrink-0 w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600 truncate max-w-[200px]">
                          {work.address.address}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
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
