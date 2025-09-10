import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  UserPlus,
  Copy,
  UserCog,
  Settings,
  DollarSign,
  Phone,
} from "lucide-react";
import AssignWorkerModal from "./AssignWorkerModal";
import EditAssignedWorkModal from "./EditAssignedWorkModal";
import EditWorkModal from "./EditWorkModal";
import JobDetailModal from "./JobDetailModal";
import JobDetailTooltip from "./JobDetailTooltip";
import { selectSelectedDate } from "@/store/slices/workSlice";
import { clearCacheForDate } from "@/store/slices/workSlice";
import { useSchedule } from "@/contexts/ScheduleContext";
import axios from "axios";
import { getClientApiUrl, CONFIG } from "@/config/constants";

// Export các function để sử dụng ở component khác
export const getWorkTypeColor = (kindWork) => {
  // Xử lý cả số và string
  if (typeof kindWork === "string") {
    // Xử lý tên công việc dạng string
    if (kindWork.includes("máy lạnh") || kindWork.includes("điện lạnh")) {
      return "bg-brand-green/20 text-brand-green";
    } else if (kindWork.includes("điện nước") || kindWork.includes("nước")) {
      return "bg-brand-green/20 text-brand-green";
    } else if (kindWork.includes("xây dựng") || kindWork.includes("thi công")) {
      return "bg-brand-green/20 text-brand-green";
    } else if (kindWork.includes("lắp đặt")) {
      return "bg-brand-yellow/20 text-brand-yellow";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  }

  // Xử lý số như cũ
  switch (kindWork) {
    case 1:
      return "bg-brand-green/20 text-brand-green"; // Điện Nước
    case 2:
      return "bg-brand-green/20 text-brand-green"; // Điện Lạnh
    case 3:
      return "bg-brand-yellow/20 text-brand-yellow"; // Đồ gỗ
    case 4:
      return "bg-brand-yellow/20 text-brand-yellow"; // Năng Lượng Mặt trời
    case 5:
      return "bg-brand-green/20 text-brand-green"; // Xây Dựng
    case 6:
      return "bg-brand-yellow/20 text-brand-yellow"; // Tài Xế
    case 7:
      return "bg-brand-green/20 text-brand-green"; // Cơ Khí
    case 8:
      return "bg-brand-yellow/20 text-brand-yellow"; // Điện - Điện Tử
    case 9:
      return "bg-gray-100 text-gray-800"; // Văn Phòng
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getWorkTypeName = (kindWork) => {
  // Xử lý cả số và string
  if (typeof kindWork === "string") {
    // Xử lý tên công việc dạng string
    if (kindWork.includes("máy lạnh") || kindWork.includes("điện lạnh")) {
      return "ĐL";
    } else if (kindWork.includes("điện nước") || kindWork.includes("nước")) {
      return "ĐN";
    } else if (kindWork.includes("xây dựng") || kindWork.includes("thi công")) {
      return "XD";
    } else if (kindWork.includes("lắp đặt")) {
      return "LĐ";
    } else {
      return kindWork.substring(0, 3).toUpperCase();
    }
  }

  // Xử lý số như cũ
  switch (kindWork) {
    case 1:
      return "ĐN"; // Điện Nước
    case 2:
      return "ĐL"; // Điện Lạnh
    case 3:
      return "ĐG"; // Đồ gỗ
    case 4:
      return "NLMT"; // Năng Lượng Mặt trời
    case 5:
      return "XD"; // Xây Dựng
    case 6:
      return "TX"; // Tài Xế
    case 7:
      return "CK"; // Cơ Khí
    case 8:
      return "ĐĐT"; // Điện - Điện Tử
    case 9:
      return "VP"; // Văn Phòng
    default:
      return "CPL"; // Chưa phân loại
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30"; // Thuê Bao / Không nghe
    case 2:
      return "bg-brand-yellow/30 text-brand-yellow border border-brand-yellow/40"; // Khách Nhắc 1 lần
    case 3:
      return "bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30"; // Khách nhắc nhiều lần
    case 4:
      return "bg-brand-green/30 text-brand-green border border-brand-green/40 font-semibold"; // Lịch Gấp/Ưu tiên
    case 5:
      return "bg-brand-green/20 text-brand-green border border-brand-green/30"; // Đang xử lý
    case 6:
      return "bg-brand-green/30 text-brand-green border border-brand-green/40"; // Lịch đã phân
    case 7:
      return "bg-brand-yellow/30 text-brand-yellow border border-brand-yellow/40"; // Lịch Hủy
    case 8:
      return "bg-gray-200 text-gray-900 border border-gray-400"; // KXL
    case 9:
      return "bg-brand-yellow/30 text-brand-yellow border border-brand-yellow/40 font-semibold"; // Khách quen
    case 10:
      return "bg-brand-green/40 text-brand-green border border-brand-green/50 font-semibold"; // Lịch ưu tiên
    default:
      return "bg-brand-green/30 text-brand-green border border-brand-green/40"; // Mặc định là đã phân
  }
};

export const getStatusName = (status) => {
  switch (status) {
    case 1:
      return "📞 Thuê Bao / Không nghe";
    case 2:
      return "⚠️ Khách Nhắc 1 lần";
    case 3:
      return "🚨 Khách nhắc nhiều lần";
    case 4:
      return "🔥 Lịch Gấp/Ưu tiên";
    case 5:
      return "⚡ Đang xử lý";
    case 6:
      return "✅ Lịch đã phân";
    case 7:
      return "❌ Lịch Hủy";
    case 8:
      return "⏸️ KXL";
    case 9:
      return "👥 Khách quen";
    case 10:
      return "⭐ Lịch ưu tiên";
    default:
      return "✅ Lịch đã phân"; // Mặc định là đã phân
  }
};

const WorkTable = ({ works = [], workers = [] }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const { refreshData: scheduleRefreshData } = useSchedule();
  const [selectedWork, setSelectedWork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangingWorker, setIsChangingWorker] = useState(false);
  const [copiedWorkId, setCopiedWorkId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [isEditAssignedModalOpen, setIsEditAssignedModalOpen] = useState(false);
  const [selectedAssignedWork, setSelectedAssignedWork] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipWork, setTooltipWork] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState("bottom");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailWork, setSelectedDetailWork] = useState(null);

  // Kiểm tra vị trí của tooltip để quyết định hiển thị lên trên hay xuống dưới
  useEffect(() => {
    const checkTooltipPosition = () => {
      if (showTooltip) {
        const tooltipElement = document.querySelector(".job-tooltip");
        if (tooltipElement) {
          const rect = tooltipElement.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const tooltipHeight = 200; // Ước tính chiều cao của tooltip

          // Nếu tooltip ở gần cuối viewport, hiển thị lên trên
          if (rect.bottom + tooltipHeight > viewportHeight - 20) {
            setTooltipPosition("top");
          } else {
            setTooltipPosition("bottom");
          }
        }
      }
    };

    if (showTooltip) {
      checkTooltipPosition();
    }
  }, [showTooltip]);

  // Transform the new API data structure to flat list for table
  const transformedWorks = useMemo(() => {
    if (!works || works.length === 0) return [];

    // Check if this is the new API structure (grouped by worker)
    if (works[0]?.worker_code && works[0]?.jobs) {
      // New structure: [{ worker_code, worker_name, jobs: [...] }]
      return works.flatMap((workerGroup) =>
        workerGroup.jobs.map((job) => ({
          ...job,
          // Add worker information to each job
          worker_code: workerGroup.worker_code,
          worker_name: workerGroup.worker_name,
          // Map old field names to new ones for compatibility
          id: job.job_id,
          name_cus: job.job_customer_name,
          phone_number: job.job_customer_phone,
          street: job.job_customer_address,
          time_book: job.job_appointment_time,
          work_note: job.job_customer_note,
          work_content: job.job_content,
          status_work: 6, // Lịch đã phân
          // Add assigned worker info
          worker_full_name: workerGroup.worker_name,
          worker_code: workerGroup.worker_code,
          // Add job status
          job_main_status: job.job_main_status || "assigned",
          // Add job code for display
          job_code: job.job_code,
        }))
      );
    }

    // Old structure: direct array of works
    return works;
  }, [works]);

  const handleAssignWorker = (work) => {
    setSelectedWork(work);
    setIsChangingWorker(false);
    setIsModalOpen(true);
  };

  const handleAssignSubmit = async (updatedWork) => {
    try {
      if (!selectedDate) {
        console.error("No selected date for refreshing data");
        return;
      }

      setIsRefreshing(true);

      // Sử dụng ScheduleContext để gọi API
      await scheduleRefreshData(selectedDate);

      // Clear cache cho unassigned works để đảm bảo dữ liệu mới
      dispatch(clearCacheForDate(selectedDate));
    } catch (error) {
      console.error("Error refreshing data after assignment:", error);
    } finally {
      setIsRefreshing(false);
      // Luôn đóng modal
      setIsModalOpen(false);
      setSelectedWork(null);
      setIsChangingWorker(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
    setIsChangingWorker(false);
  };

  const handleChangeWorker = (work) => {
    setSelectedWork(work);
    setIsChangingWorker(true);
    setIsModalOpen(true);
  };

  const handleEditWork = (work) => {
    setSelectedWork(work);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedWork(null);
  };

  // Function to refresh data after edit success
  const handleEditSuccess = async () => {
    try {
      setIsRefreshing(true);
      // Sử dụng ScheduleContext để gọi API
      await scheduleRefreshData(selectedDate);

      // Clear cache để đảm bảo dữ liệu mới
      dispatch(clearCacheForDate(selectedDate));
    } catch (error) {
      console.error("Error refreshing data after edit:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopy = async (work) => {
    try {
      if (!work) {
        console.error("No work data provided to copy");
        return;
      }

      // Tạo nội dung để copy
      const copyContent = `Công việc: ${
        work.work_content || work.job_content || "Không có nội dung"
      }
Khách hàng: ${work.name_cus || work.job_customer_name || "Chưa có thông tin"}
SĐT: ${work.phone_number || work.job_customer_phone || "Chưa có thông tin"}
Địa chỉ: ${work.street || work.job_customer_address || "Chưa có thông tin"}
Ngày: ${work.date_book || work.job_appointment_date || "Chưa có thông tin"}
Ghi chú: ${work.work_note || work.job_customer_note || "Không có"}`;

      // Copy vào clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(copyContent);
        setCopiedWorkId(work.id);
        setTimeout(() => setCopiedWorkId(null), 2000);
      } else {
        console.error("Clipboard API not available");
      }
    } catch (error) {
      console.error("Failed to copy:", error);
      // Có thể thêm thông báo lỗi cho user ở đây
    }
  };

  const handleEdit = async (editValue) => {
    try {
      setIsRefreshing(true);
      const data = {
        ...editValue,
        auth_id: auth.user.id,
        date_book: selectedDate,
        from_cus: editValue.from_cus || 0,
        status_cus: editValue.status_cus || 0,
        kind_work: editValue.kind_work || 0,
      };
      // Call API to update server
      await axios.post(getClientApiUrl("/api/web/update/work"), data);

      // Refresh data after successful edit
      // Chỉ gọi 1 API duy nhất dựa vào loại work
      if (editValue.is_assigned) {
        await dispatch(fetchAssignedWorks(selectedDate));
      } else {
        await dispatch(fetchUnassignedWorks(selectedDate));
      }

      // Clear cache để đảm bảo dữ liệu mới
      dispatch(clearCacheForDate(selectedDate));

      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating work:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getWorkTypeGradient = (kindWork) => {
    switch (kindWork) {
      case 1:
        return "bg-gradient-to-r from-brand-green to-brand-green/80"; // Điện Nước
      case 2:
        return "bg-gradient-to-r from-brand-green to-brand-green/80"; // Điện Lạnh
      case 3:
        return "bg-gradient-to-r from-brand-yellow to-brand-yellow/80"; // Đồ gỗ
      case 4:
        return "bg-gradient-to-r from-brand-yellow to-brand-yellow/80"; // Năng Lượng Mặt trời
      case 5:
        return "bg-gradient-to-r from-brand-green to-brand-green/80"; // Xây Dựng
      case 6:
        return "bg-gradient-to-r from-brand-yellow to-brand-yellow/80"; // Tài Xế
      case 7:
        return "bg-gradient-to-r from-brand-green to-brand-green/80"; // Cơ Khí
      case 8:
        return "bg-gradient-to-r from-brand-yellow to-brand-yellow/80"; // Điện - Điện Tử
      case 9:
        return "bg-gradient-to-r from-gray-500 to-gray-600"; // Văn Phòng
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const handleEditAssignedWork = (work) => {
    setSelectedAssignedWork(work);
    setIsEditAssignedModalOpen(true);
  };

  const handleCloseEditAssignedModal = () => {
    setIsEditAssignedModalOpen(false);
    setSelectedAssignedWork(null);
  };

  const handleSaveAssignedWork = async (formData) => {
    try {
      setIsRefreshing(true);
      // Call API to update server
      await axios.post(getClientApiUrl("/api/web/update/work_ass"), formData);

      // Refresh data after successful save
      await dispatch(fetchAssignedWorks(selectedDate));

      handleCloseEditAssignedModal();
    } catch (error) {
      console.error("Error updating assigned work:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewDetail = (work) => {
    setSelectedDetailWork(work);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDetailWork(null);
  };

  const columns = useMemo(
    () => [
      {
        header: "Nội Dung",
        accessorKey: "data",
        cell: (info) => {
          const work = info.row.original;
          const rowIndex = info.row.index;
          const assignedWorker =
            work.worker_code ||
            work.worker_full_name ||
            work.worker_name ||
            work.id_worker;

          return (
            <div
              key={`${work.id || work.job_code}-${rowIndex}`}
              className="flex flex-row items-center space-x-3 bg-gray-50 rounded-lg border border-gray-100 transition-colors hover:border-brand-green/30"
            >
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => handleViewDetail(work)}
              >
                <div className="flex flex-col space-y-0.5 text-xs">
                  {/* Dòng 1: Mã code lịch */}
                  {work.job_code && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-bold text-[#125d0d]">
                        #{work.job_code}
                      </span>
                    </div>
                  )}
                  
                  {/* Dòng 2: Nội dung công việc + Tên KH + SĐT + Thời gian hẹn */}
                  <div className="flex items-center space-x-2">
                    {/* Nội dung công việc */}
                    <div className="flex items-center space-x-1 min-w-0">
                      <span className="font-medium text-gray-900 truncate max-w-40">
                        {work.work_content || work.job_content || "Không có nội dung"}
                      </span>
                    </div>
                    
                    {/* Tên khách hàng */}
                    <div className="flex items-center space-x-1 min-w-0">
                      <span className="text-xs font-medium text-gray-600 truncate max-w-24">
                        {work.name_cus || work.job_customer_name || ""}
                      </span>
                    </div>
                    
                    {/* Số điện thoại */}
                    <div className="flex items-center space-x-1 min-w-0">
                      <span className="text-xs font-medium text-gray-600 truncate max-w-20">
                        {work.phone_number || work.job_customer_phone || ""}
                      </span>
                    </div>
                    
                    {/* Thời gian hẹn */}
                    {(work.time_book || work.job_appointment_time) && (
                      <div className="flex items-center space-x-1 min-w-0">
                        <span className="text-xs font-medium text-brand-yellow">
                          {work.time_book || work.job_appointment_time}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dòng 3: Địa chỉ + Ghi chú + Hình ảnh */}
                  <div className="flex items-center space-x-2">
                    {/* Địa chỉ */}
                    <div className="flex flex-1 items-center space-x-1 min-w-0">
                      <span className="text-xs text-gray-700 truncate">
                        {work.street || work.job_customer_address || ""}
                      </span>
                    </div>
                    
                    {/* Ghi chú */}
                    {(work.work_note || work.job_customer_note) && (
                      <div className="flex items-center space-x-1 min-w-0">
                        <span className="text-xs text-gray-500 truncate max-w-32" title={work.work_note || work.job_customer_note}>
                          {(work.work_note || work.job_customer_note).length > 20 
                            ? (work.work_note || work.job_customer_note).substring(0, 20) + "..." 
                            : (work.work_note || work.job_customer_note)}
                        </span>
                      </div>
                    )}
                    
                    {/* Hình ảnh */}
                    {work.images_count > 0 && (
                      <div className="flex items-center space-x-1 min-w-0">
                        <span className="text-xs font-medium text-brand-green">
                          {work.images_count} ảnh
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin thợ đã phân công */}
              {assignedWorker && (
                <div className="flex-shrink-0 mr-3 min-w-0 max-w-32">
                  <div className="flex items-center">
                    <span className="text-xs font-medium truncate text-brand-green">
                      {work.worker_full_name || work.worker_name} ({work.worker_code})
                    </span>
                  </div>
                </div>
              )}

              {/* Phần nút - hoàn toàn tách biệt, không ảnh hưởng đến modal chi tiết */}
              <div className="flex flex-shrink-0 items-center space-x-2">
                <button
                  onClick={(e) => {
                    try {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCopy(work);
                    } catch (error) {
                      console.error("Error in copy button handler:", error);
                    }
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    copiedWorkId === work.id
                      ? "text-brand-green bg-brand-green/10"
                      : "text-gray-500 hover:text-brand-green hover:bg-brand-green/10"
                  }`}
                  title="Sao chép lịch"
                >
                  <Copy className="w-5 h-5" />
                </button>
                {assignedWorker ? (
                  <>
                    <button
                      onClick={(e) => {
                        try {
                          e.preventDefault();
                          e.stopPropagation();
                          handleChangeWorker(work);
                        } catch (error) {
                          console.error(
                            "Error in change worker button handler:",
                            error
                          );
                        }
                      }}
                      className="p-2 text-gray-500 rounded-full transition-colors cursor-pointer hover:text-brand-green hover:bg-brand-green/10"
                      title="Đổi thợ"
                    >
                      <UserCog className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        try {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditAssignedWork(work);
                        } catch (error) {
                          console.error(
                            "Error in edit assigned work button handler:",
                            error
                          );
                        }
                      }}
                      className="p-2 text-gray-500 rounded-full transition-colors hover:text-brand-green hover:bg-brand-green/10"
                      title="Nhập thu chi"
                    >
                      <DollarSign className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        try {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAssignWorker(work);
                        } catch (error) {
                          console.error(
                            "Error in assign worker button handler:",
                            error
                          );
                        }
                      }}
                      className="p-2 text-gray-500 rounded-full transition-colors hover:text-brand-green hover:bg-brand-green/10"
                      title="Phân công thợ"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        try {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditWork(work);
                        } catch (error) {
                          console.error(
                            "Error in edit work button handler:",
                            error
                          );
                        }
                      }}
                      className="p-2 text-gray-500 rounded-full transition-colors hover:text-brand-green hover:bg-brand-green/10"
                      title="Chỉnh sửa"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        },
      },
    ],
    [copiedWorkId, workers]
  );

  const filteredData = useMemo(() => transformedWorks, [transformedWorks]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div className="flex flex-col h-full">
      {/* Loading indicator when refreshing */}
      {isRefreshing && (
        <div className="flex justify-end items-center mb-2">
          <div className="flex items-center space-x-2 text-xs text-brand-green">
            <div className="w-3 h-3 rounded-full border-2 animate-spin border-brand-green border-t-transparent"></div>
            <span>Đang cập nhật...</span>
          </div>
        </div>
      )}

      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="sticky top-0 z-10 bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors bg-gray-50"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() &&
                        (header.column.getIsSorted() === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-2 py-1">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AssignWorkerModal
          work={selectedWork}
          onClose={handleCloseModal}
          onAssign={handleAssignSubmit}
          isChanging={isChangingWorker}
        />
      )}

      {isEditModalOpen && (
        <EditWorkModal
          work={selectedWork}
          onClose={handleCloseEditModal}
          onSave={handleEditSuccess}
        />
      )}

      {isEditAssignedModalOpen && (
        <EditAssignedWorkModal
          work={selectedAssignedWork}
          onClose={handleCloseEditAssignedModal}
          onSave={handleSaveAssignedWork}
        />
      )}

      {isDetailModalOpen && (
        <JobDetailModal
          job={selectedDetailWork}
          open={isDetailModalOpen}
          onClose={handleCloseDetailModal}
        />
      )}
    </div>
  );
};

export default WorkTable;
