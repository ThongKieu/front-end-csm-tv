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
  Eye,
  Edit,
  Trash2,
  UserPlus,
  UserMinus,
  Copy,
  UserCog,
  Settings,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AssignWorkerModal from "./AssignWorkerModal";
import EditAssignedWorkModal from "./EditAssignedWorkModal";
import EditWorkModal from "./EditWorkModal";
import JobDetailModal from "./JobDetailModal";
import { selectAssignedWorks, selectUnassignedWorks, selectSelectedDate } from "@/store/slices/workSlice";
import { fetchAssignedWorks, fetchUnassignedWorks } from "@/store/slices/workSlice";
import axios from "axios";
import { getClientApiUrl, CONFIG } from "@/config/constants";

// Export các function để sử dụng ở component khác
export const getWorkTypeColor = (kindWork) => {
  // Xử lý cả số và string
  if (typeof kindWork === 'string') {
    // Xử lý tên công việc dạng string
    if (kindWork.includes('máy lạnh') || kindWork.includes('điện lạnh')) {
      return 'bg-brand-green/20 text-brand-green';
    } else if (kindWork.includes('điện nước') || kindWork.includes('nước')) {
      return 'bg-brand-green/20 text-brand-green';
    } else if (kindWork.includes('xây dựng') || kindWork.includes('thi công')) {
      return 'bg-brand-green/20 text-brand-green';
    } else if (kindWork.includes('lắp đặt')) {
      return 'bg-brand-yellow/20 text-brand-yellow';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Xử lý số như cũ
  switch (kindWork) {
    case 1:
      return 'bg-brand-green/20 text-brand-green'; // Điện Nước
    case 2:
      return 'bg-brand-green/20 text-brand-green'; // Điện Lạnh
    case 3:
      return 'bg-brand-yellow/20 text-brand-yellow'; // Đồ gỗ
    case 4:
      return 'bg-brand-yellow/20 text-brand-yellow'; // Năng Lượng Mặt trời
    case 5:
      return 'bg-brand-green/20 text-brand-green'; // Xây Dựng
    case 6:
      return 'bg-brand-yellow/20 text-brand-yellow'; // Tài Xế
    case 7:
      return 'bg-brand-green/20 text-brand-green'; // Cơ Khí
    case 8:
      return 'bg-brand-yellow/20 text-brand-yellow'; // Điện - Điện Tử
    case 9:
      return 'bg-gray-100 text-gray-800'; // Văn Phòng
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getWorkTypeName = (kindWork) => {
  // Xử lý cả số và string
  if (typeof kindWork === 'string') {
    // Xử lý tên công việc dạng string
    if (kindWork.includes('máy lạnh') || kindWork.includes('điện lạnh')) {
      return 'ĐL';
    } else if (kindWork.includes('điện nước') || kindWork.includes('nước')) {
      return 'ĐN';
    } else if (kindWork.includes('xây dựng') || kindWork.includes('thi công')) {
      return 'XD';
    } else if (kindWork.includes('lắp đặt')) {
      return 'LĐ';
    } else {
      return kindWork.substring(0, 3).toUpperCase();
    }
  }
  
  // Xử lý số như cũ
  switch (kindWork) {
    case 1:
      return 'ĐN'; // Điện Nước
    case 2:
      return 'ĐL'; // Điện Lạnh
    case 3:
      return 'ĐG'; // Đồ gỗ
    case 4:
      return 'NLMT'; // Năng Lượng Mặt trời
    case 5:
      return 'XD'; // Xây Dựng
    case 6:
      return 'TX'; // Tài Xế
    case 7:
      return 'CK'; // Cơ Khí
    case 8:
      return 'ĐĐT'; // Điện - Điện Tử
    case 9:
      return 'VP'; // Văn Phòng
    default:
      return 'CPL'; // Chưa phân loại
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 0:
      return 'bg-gray-100 text-gray-800 border border-gray-300'; // Chưa Phân
    case 1:
      return 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30'; // Thuê Bao / Không nghe
    case 2:
      return 'bg-brand-yellow/30 text-brand-yellow border border-brand-yellow/40'; // Khách Nhắc 1 lần
    case 3:
      return 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30'; // Khách nhắc nhiều lần
    case 4:
      return 'bg-brand-green/30 text-brand-green border border-brand-green/40 font-semibold'; // Lịch Gấp/Ưu tiên
    case 5:
      return 'bg-brand-green/20 text-brand-green border border-brand-green/30'; // Đang xử lý
    case 6:
      return 'bg-brand-green/30 text-brand-green border border-brand-green/40'; // Lịch đã phân
    case 7:
      return 'bg-brand-yellow/30 text-brand-yellow border border-brand-yellow/40'; // Lịch Hủy
    case 8:
      return 'bg-gray-200 text-gray-900 border border-gray-400'; // KXL
    case 9:
      return 'bg-brand-yellow/30 text-brand-yellow border border-brand-yellow/40 font-semibold'; // Khách quen
    case 10:
      return 'bg-brand-green/40 text-brand-green border border-brand-green/50 font-semibold'; // Lịch ưu tiên
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};

export const getStatusName = (status) => {
  switch (status) {
    case 0:
      return '⏳ Chưa Phân';
    case 1:
      return '📞 Thuê Bao / Không nghe';
    case 2:
      return '⚠️ Khách Nhắc 1 lần';
    case 3:
      return '🚨 Khách nhắc nhiều lần';
    case 4:
      return '🔥 Lịch Gấp/Ưu tiên';
    case 5:
      return '⚡ Đang xử lý';
    case 6:
      return '✅ Lịch đã phân';
    case 7:
      return '❌ Lịch Hủy';
    case 8:
      return '⏸️ KXL';
    case 9:
      return '👥 Khách quen';
    case 10:
      return '⭐ Lịch ưu tiên';
    default:
      return '❓ Chưa xác định';
  }
};

const WorkTable = ({ works = [], workers = [] }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangingWorker, setIsChangingWorker] = useState(false);
  const [copiedWorkId, setCopiedWorkId] = useState(null);
  const [selectedWorkerType, setSelectedWorkerType] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [isEditAssignedModalOpen, setIsEditAssignedModalOpen] = useState(false);
  const [selectedAssignedWork, setSelectedAssignedWork] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Transform the new API data structure to flat list for table
  const transformedWorks = useMemo(() => {
    if (!works || works.length === 0) return [];
    
    // Check if this is the new API structure (grouped by worker)
    if (works[0]?.worker_code && works[0]?.jobs) {
      // New structure: [{ worker_code, worker_name, jobs: [...] }]
      return works.flatMap(workerGroup => 
        workerGroup.jobs.map(job => ({
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
          status_work: 6, // Lịch đã phân
          // Add assigned worker info
          worker_full_name: workerGroup.worker_name,
          worker_code: workerGroup.worker_code,
          // Add job status
          job_main_status: job.job_main_status || 'assigned'
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
      // Refresh cả hai bảng để cập nhật dữ liệu
      await Promise.all([
        dispatch(fetchAssignedWorks(selectedDate)),
        dispatch(fetchUnassignedWorks(selectedDate))
      ]);
    } catch (error) {
      console.error('Error refreshing data after assignment:', error);
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

  const handleCopy = async (work) => {
    try {
      if (!work) {
        console.error("No work data provided to copy");
        return;
      }

      // Tạo nội dung để copy
      const copyContent = `Công việc: ${work.work_content || work.job_content || 'Không có nội dung'}
Khách hàng: ${work.name_cus || work.job_customer_name || 'Chưa có thông tin'}
SĐT: ${work.phone_number || work.job_customer_phone || 'Chưa có thông tin'}
Địa chỉ: ${work.street || work.job_customer_address || 'Chưa có thông tin'}
Ngày: ${work.date_book || work.job_appointment_date || 'Chưa có thông tin'}
Ghi chú: ${work.work_note || work.job_customer_note || 'Không có'}`;

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
      await Promise.all([
        dispatch(fetchAssignedWorks(selectedDate)),
        dispatch(fetchUnassignedWorks(selectedDate))
      ]);

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
        return 'bg-gradient-to-r from-brand-green to-brand-green/80'; // Điện Nước
      case 2:
        return 'bg-gradient-to-r from-brand-green to-brand-green/80'; // Điện Lạnh
      case 3:
        return 'bg-gradient-to-r from-brand-yellow to-brand-yellow/80'; // Đồ gỗ
      case 4:
        return 'bg-gradient-to-r from-brand-yellow to-brand-yellow/80'; // Năng Lượng Mặt trời
      case 5:
        return 'bg-gradient-to-r from-brand-green to-brand-green/80'; // Xây Dựng
      case 6:
        return 'bg-gradient-to-r from-brand-yellow to-brand-yellow/80'; // Tài Xế
      case 7:
        return 'bg-gradient-to-r from-brand-green to-brand-green/80'; // Cơ Khí
      case 8:
        return 'bg-gradient-to-r from-brand-yellow to-brand-yellow/80'; // Điện - Điện Tử
      case 9:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'; // Văn Phòng
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const handleWorkerTypeChange = (type) => {
    setSelectedWorkerType(type);
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

  const columns = useMemo(
    () => [
      {
                 header: "Nội Dung",
         accessorKey: "data",
                   cell: (info) => {
            const work = info.row.original;
            const rowIndex = info.row.index;
            const assignedWorker = work.worker_code || work.worker_full_name || work.worker_name || work.id_worker;
            
            return (
              <div
                key={`${work.id || work.job_code}-${rowIndex}`}
                className="flex items-start p-3 space-x-3 bg-gray-50 rounded-lg border border-gray-100 transition-colors hover:border-brand-green/30"
              >
                {/* Phần nội dung chính - có thể click để mở modal chi tiết */}
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    // TODO: Mở modal chi tiết công việc
                    console.log('Opening work detail modal for:', work);
                  }}
                >
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-6 items-center space-x-2">
                      <div className="flex col-span-1 items-center space-x-1">
                        <span className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full shadow-sm ${getWorkTypeGradient(
                          work.kind_work || work.job_type_id || 1
                        )}`}>
                          {rowIndex + 1}
                        </span>
                        <span
                          className={`px-2 py-1 text-center text-xs font-medium rounded-full ${getWorkTypeColor(
                            work.kind_work || work.job_type_id || 1
                          )}`}
                        >
                          {getWorkTypeName(work.kind_work || work.job_type_id || 1)}
                        </span>
                      </div>
                      <p className="col-span-5 font-medium text-gray-900 whitespace-pre-line break-words">
                        {work.work_content || "Không có nội dung"}
                      </p>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex flex-row justify-between items-center space-x-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-gray-700">Khách hàng:</span>
                            <span className="text-gray-600 truncate">
                              {work.name_cus || work.job_customer_name || "Chưa có thông tin"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <span className="font-medium text-gray-700">SĐT:</span>
                            <span className="text-gray-600 truncate">
                              {work.phone_number || work.job_customer_phone || "Chưa có thông tin"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              work.status_work
                            )}`}
                          >
                            {getStatusName(work.status_work)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <p className="p-1 text-xs truncate rounded-md border text-brand-green border-brand-green">
                              {work.date_book}
                            </p>
                            {(work.time_book || work.job_appointment_time) && (
                              <p className="p-1 text-xs truncate rounded-md border text-brand-yellow border-brand-yellow">
                                {work.time_book || work.job_appointment_time}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-700">📍 Địa chỉ:</span>
                        <span 
                          className="text-gray-600 truncate cursor-pointer hover:text-brand-green hover:bg-brand-green/10 px-1 py-0.5 rounded text-sm relative group"
                          title="Click để copy địa chỉ"
                          onMouseEnter={(e) => {
                            const address = (() => {
                              const street = typeof work.street === 'string' ? work.street : 
                                            (work.street?.name || work.street?.street_name || work.job_customer_address || '');
                              const district = typeof work.district === 'string' ? work.district : 
                                            (work.district?.name || work.district?.district_name || '');
                              
                              if (street || district) {
                                return `${street || ''}${district ? (street ? ', ' : '') + district : ''}`;
                              }
                              return "Chưa có thông tin";
                            })();
                            
                            if (address !== "Chưa có thông tin") {
                              e.target.title = address;
                            }
                          }}
                          onClick={(e) => {
                            try {
                              e.stopPropagation(); // Ngăn mở modal chi tiết
                              const address = (() => {
                                const street = typeof work.street === 'string' ? work.street : 
                                              (work.street?.name || work.street?.street_name || work.job_customer_address || '');
                                const district = typeof work.district === 'string' ? work.district : 
                                              (work.district?.name || work.district?.district_name || '');
                                
                                if (street || district) {
                                  return `${street || ''}${district ? (street ? ', ' : '') + district : ''}`;
                                }
                                return "Chưa có thông tin";
                              })();
                              
                              if (address !== "Chưa có thông tin" && navigator.clipboard) {
                                navigator.clipboard.writeText(address).catch(err => {
                                  console.error("Failed to copy address:", err);
                                });
                              }
                            } catch (error) {
                              console.error("Error in address click handler:", error);
                            }
                          }}
                        >
                          {(() => {
                            const street = typeof work.street === 'string' ? work.street : 
                                          (work.street?.name || work.street?.street_name || work.job_customer_address || '');
                            const district = typeof work.district === 'string' ? work.district : 
                                          (work.district?.name || work.district?.district_name || '');
                            
                            if (street || district) {
                              return `${street || ''}${district ? (street ? ', ' : '') + district : ''}`;
                            }
                            return "Chưa có thông tin";
                          })()}
                        </span>
                      </div>

                      {(work.work_note || work.job_customer_note) && (
                        <p className="font-medium text-gray-900 whitespace-pre-line break-words">
                          {work.work_note || work.job_customer_note}
                        </p>
                      )}
                      
                      {(work.job_code || work.job_code) && (
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Mã công việc:</span> {work.job_code}
                        </p>
                      )}
                      
                      {(work.images_count > 0) && (
                        <p className="text-xs text-brand-yellow">
                          <span className="font-medium">Hình ảnh:</span> {work.images_count} ảnh
                        </p>
                      )}
                    </div>
                    
                    {assignedWorker && (
                      <div className="p-2 mt-2 rounded-md border bg-brand-green/10 border-brand-green/20">
                        <p className="mb-1 text-sm font-medium text-brand-green">
                          Thợ đã phân công:
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm truncate text-brand-green">
                            {work.worker_full_name || work.worker_name} ({work.worker_code})
                          </p>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-brand-green" />
                            <span className="text-sm truncate text-brand-green">
                              SĐT: {work.worker_phone_company || "Chưa có thông tin"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

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
                            console.error("Error in change worker button handler:", error);
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
                            console.error("Error in edit assigned work button handler:", error);
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
                            console.error("Error in assign worker button handler:", error);
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
                            console.error("Error in edit work button handler:", error);
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

  const filteredData = useMemo(
    () => transformedWorks,
    [transformedWorks]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-1 justify-end items-center mb-2">
        {/* Loading indicator when refreshing */}
        {isRefreshing && (
          <div className="flex items-center space-x-2 text-xs text-brand-green mr-2">
            <div className="w-3 h-3 rounded-full border-2 animate-spin border-brand-green border-t-transparent"></div>
            <span>Đang cập nhật...</span>
          </div>
        )}
        
        <button
          onClick={() => handleWorkerTypeChange("all")}
          className={`px-1.5 py-0.5 text-xs font-medium rounded-full transition-all duration-200 ${
            selectedWorkerType === "all"
              ? "bg-brand-green text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tất cả
        </button>
      </div>

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
          onSave={handleEdit}
        />
      )}

      {isEditAssignedModalOpen && (
        <EditAssignedWorkModal
          work={selectedAssignedWork}
          onClose={handleCloseEditAssignedModal}
          onSave={handleSaveAssignedWork}
        />
      )}
    </div>
  );
};

export default WorkTable;