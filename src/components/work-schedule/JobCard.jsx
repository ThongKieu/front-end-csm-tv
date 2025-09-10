import React, { useState, useRef, useEffect } from "react";
import { Phone, Clock, MapPin, Image } from "lucide-react";
import { getStatusColor, getStatusName } from "./WorkTable";
import JobDetailTooltip from "./JobDetailTooltip";
// import JobDetailModal from "./JobDetailModal";
import AssignWorkerModal from "./AssignWorkerModal";

const JobCard = ({ job, index, onAssign, onEdit, workers = [] }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false); // kept for compatibility, but we will open Edit instead
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isChangingWorker, setIsChangingWorker] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState("bottom");
  const cardRef = useRef(null);
  // Kiểm tra vị trí của card để quyết định hiển thị tooltip lên trên hay xuống dưới
  useEffect(() => {
    const checkTooltipPosition = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const tooltipHeight = 200; // Ước tính chiều cao của tooltip

        // Nếu card ở gần cuối viewport, hiển thị tooltip lên trên
        if (rect.bottom + tooltipHeight > viewportHeight - 20) {
          setTooltipPosition("top");
        } else {
          setTooltipPosition("bottom");
        }
      }
    };

    if (showTooltip) {
      checkTooltipPosition();
    }
  }, [showTooltip]);

  return (
    <div
      ref={cardRef}
      className="flex relative items-center text-xs bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:border-brand-green/300 hover:shadow-md"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Phần bên trái - Chứa tất cả nội dung với background */}
      <div
        className="flex flex-1 gap-2 items-center px-2 py-1 min-w-0 rounded-l-lg transition-colors cursor-pointer hover:bg-blue-50/30"
        onClick={() => onEdit(job, false)}
      >

        {/* Nội dung công việc + Thông tin khách hàng - Flexible */}
        <div className="flex flex-col flex-1 min-w-0 space-y-0.5">
          {/* 1. Dòng 1: Mã code lịch */}
          {job.job_code && (
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-[#125d0d]">
                #{job.job_code}
              </span>
            </div>
          )}
          
          {/* 2. Dòng 2: Nội dung công việc, Tên, SĐT, Thời gian hẹn */}
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            {/* Nội dung công việc */}
            <div className="flex items-center space-x-1 min-w-0">
              <span className="font-semibold text-gray-900 truncate">
                {job.job_content || "Không có nội dung"}
              </span>
            </div>
            
            {/* Tên khách hàng */}
            <div className="flex items-center space-x-1 min-w-0">
              <span className="text-brand-green">👤</span>
              <span className="font-medium truncate max-w-20">
                {job.job_customer_name || ""}
              </span>
            </div>
            
            {/* Số điện thoại */}
            <div className="flex items-center space-x-1 min-w-0">
              <Phone className="flex-shrink-0 w-3 h-3 text-brand-green" />
              <span className="font-medium truncate max-w-20">
                {job.job_customer_phone || ""}
              </span>
            </div>
            
            {/* Thời gian hẹn */}
            {job.job_appointment_time && (
              <div className="flex items-center space-x-1 min-w-0">
                <Clock className="flex-shrink-0 w-3 h-3 text-brand-yellow" />
                <span className="font-medium text-brand-yellow">
                  {job.job_appointment_time}
                </span>
              </div>
            )}
          </div>
          
          {/* 3. Dòng 3: Địa chỉ + Ghi chú + Hình ảnh + Thợ */}
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            {/* Địa chỉ */}
            <div className="flex flex-1 items-center space-x-1 min-w-0">
              <MapPin className="flex-shrink-0 w-3 h-3 text-brand-green" />
              <span className="text-gray-700 truncate">
                {job.job_customer_address || ""}
              </span>
            </div>
            
            {/* Ghi chú (nếu có) */}
            {job.job_customer_note && (
              <div className="flex items-center space-x-1 min-w-0">
                <span className="text-brand-yellow">📝</span>
                <span className="text-gray-500 truncate max-w-20" title={job.job_customer_note}>
                  {job.job_customer_note.length > 15 
                    ? job.job_customer_note.substring(0, 15) + "..." 
                    : job.job_customer_note}
                </span>
              </div>
            )}
            
            {/* Hình ảnh */}
            {job.images_count > 0 && (
              <div className="flex items-center space-x-1 min-w-0">
                <Image className="flex-shrink-0 w-3 h-3 text-brand-green" />
                <span className="font-medium text-brand-green">
                  {job.images_count}
                </span>
              </div>
            )}
            
            {/* Thợ đã phân công */}
            {job.id_worker && (
              <div className="flex items-center space-x-1 min-w-0">
                <span className="text-brand-green">👷</span>
                <span className="font-medium truncate text-brand-green max-w-16">
                  {job.worker_full_name || job.worker_code || ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phần bên phải - Chứa các nút hành động - Cố định vị trí */}
      <div
        className="flex flex-shrink-0 items-center px-2 py-1 space-x-0.5 w-auto rounded-r-lg border-l border-gray-200 bg-gray-100/50"
        onClick={(e) => e.stopPropagation()}
      >
        {job.id_worker ? (
          <>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsChangingWorker(true);
                setIsAssignModalOpen(true);
              }}
              className="p-1 text-gray-500 rounded transition-all duration-200 cursor-pointer hover:text-brand-green hover:bg-brand-green/10 hover:shadow-sm"
              title="Đổi thợ"
            >
              <span className="text-xs">🔄</span>
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(job, false);
              }}
              className="p-1 text-gray-500 rounded transition-all duration-200 hover:text-brand-green hover:bg-brand-green/10 hover:shadow-sm"
              title="Chỉnh sửa thông tin"
            >
              <span className="text-xs">✏️</span>
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(job, true);
              }}
              className="p-1 text-gray-500 rounded transition-all duration-200 hover:text-brand-green hover:bg-brand-green/10 hover:shadow-sm"
              title="Nhập thu chi"
            >
              <span className="text-xs">💰</span>
            </button>
          </>
        ) : (
          <>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsChangingWorker(false);
                setIsAssignModalOpen(true);
              }}
              className="p-1 text-gray-500 rounded transition-all duration-200 hover:text-brand-green hover:bg-brand-green/10 hover:shadow-sm"
              title="Phân công thợ"
            >
              <span className="text-xs">👤+</span>
            </button>
          </>
        )}
      </div>
      {/* Tooltip */}
      {showTooltip && (
        <div
          className={`absolute left-0 z-50 ${
            tooltipPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <JobDetailTooltip job={job} />
        </div>
      )}
      {/* Modal xem chi tiết (đã thay bằng mở modal chỉnh sửa) */}
      {/* <JobDetailModal job={job} open={showModal} onClose={() => setShowModal(false)} /> */}

      {/* Assign Worker Modal */}
      {isAssignModalOpen && (
        <AssignWorkerModal
          work={job}
          workers={workers}
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={onAssign}
          isChanging={isChangingWorker}
        />
      )}
    </div>
  );
};

export default JobCard;
