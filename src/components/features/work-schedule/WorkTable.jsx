import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import JobItem from "./JobItem";
import AssignWorkerModal from "./AssignWorkerModal";
import EditAssignedWorkModal from "./EditAssignedWorkModal";
import EditWorkModal from "./EditWorkModal";
import JobDetailModal from "./JobDetailModal";
import { selectSelectedDate } from "@/store/slices/workSlice";
import { clearCacheForDate } from "@/store/slices/workSlice";
import { useSchedule } from "@/contexts/ScheduleContext";
import { useJobOperations } from "@/hooks/useJobOperations";

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
  const { isRefreshing, refreshData, updateJob } = useJobOperations();
  
  const [selectedWork, setSelectedWork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangingWorker, setIsChangingWorker] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditAssignedModalOpen, setIsEditAssignedModalOpen] = useState(false);
  const [selectedAssignedWork, setSelectedAssignedWork] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailWork, setSelectedDetailWork] = useState(null);


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
      await refreshData();
      setIsModalOpen(false);
      setSelectedWork(null);
      setIsChangingWorker(false);
    } catch (error) {
      console.error("Error refreshing data after assignment:", error);
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

  const handleEditSuccess = async () => {
    try {
      await refreshData();
    } catch (error) {
      console.error("Error refreshing data after edit:", error);
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
      await updateJob(formData);
      handleCloseEditAssignedModal();
    } catch (error) {
      console.error("Error updating assigned work:", error);
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

      <div className="overflow-y-auto flex-1">
        <div className="space-y-2">
          {transformedWorks.map((work, index) => (
            <JobItem
              key={`${work.id || work.job_code}-${index}`}
              job={work}
              index={index}
              onAssign={handleAssignWorker}
              onEdit={handleEditWork}
              onEditAssigned={handleEditAssignedWork}
              onChangeWorker={handleChangeWorker}
              showWorker={!!(work.worker_code || work.worker_full_name || work.worker_name || work.id_worker)}
              showTooltip={false}
              onClick={handleViewDetail}
              className="bg-gray-50 rounded-lg border border-gray-100 transition-colors hover:border-brand-green/30"
              actionsMode="full"
            />
          ))}
        </div>
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
