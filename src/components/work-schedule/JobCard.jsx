import React, { useState, useRef, useEffect } from "react";
import { Phone, Clock, MapPin, FileText, Image } from "lucide-react";
import {
  getStatusColor,
  getStatusName,
} from "./WorkTable";
import JobDetailTooltip from "./JobDetailTooltip";
import JobDetailModal from "./JobDetailModal";
import AssignWorkerModal from "./AssignWorkerModal";

const JobCard = ({
  job,
  index,
  onAssign,
  onEdit,
  onCopy,
  copiedWorkId,
  workers = [],
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isChangingWorker, setIsChangingWorker] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState('bottom');
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
          setTooltipPosition('top');
        } else {
          setTooltipPosition('bottom');
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
      className="flex relative items-center px-2 py-0.5 text-xs bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:border-brand-green/300 hover:shadow-md"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Phần nội dung chính - có thể click để mở modal chi tiết */}
      <div 
        className="flex flex-row items-center rounded transition-colors cursor-pointer hover:bg-gray-100/50"
        onClick={() => setShowModal(true)}
      >
        {/* Mã công việc - Fixed width */}
        <div className="flex-shrink-0 px-2 w-16">
          <div className="px-1 py-0.5 text-xs font-bold rounded bg-brand-green/10 text-brand-green text-center">
            {job.job_code || "N/A"}
          </div>
        </div>
        
        {/* Nội dung công việc + Thông tin khách hàng - Flexible */}
        <div className="flex-1 px-2 min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {job.job_content || "Không có nội dung"}
          </div>
          {/* Thông tin khách hàng gọn gàng - 1 dòng compact */}
          <div className="flex items-center space-x-2 mt-0.5 text-xs text-gray-600">
            <div className="flex items-center space-x-1 min-w-0">
              <span className="text-brand-green">👤</span>
              <span className="font-medium truncate max-w-16">
                {job.job_customer_name || "N/A"}
              </span>
            </div>
            <div className="flex items-center space-x-1 min-w-0">
              <Phone className="flex-shrink-0 w-3 h-3 text-brand-green" />
              <span className="font-medium truncate max-w-20">
                {job.job_customer_phone || "N/A"} 
              </span>
            </div>
            <div className="flex items-center space-x-1 min-w-0">
              <MapPin className="flex-shrink-0 w-3 h-3 text-brand-green" />
              <span className="text-gray-700 truncate max-w-28">
                {job.job_customer_address || "N/A"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Trạng thái + Thời gian + Hình ảnh - Fixed width */}
        <div className="flex-shrink-0 px-2 w-24">
          <div className="flex flex-col space-y-0.5">
            {/* Trạng thái */}
            <span
              className={`px-1 py-0.5 text-xs font-medium rounded-full text-center ${getStatusColor(
                job.priority === "high"
                  ? 4
                  : job.priority === "normal"
                  ? 9
                  : job.priority === "cancelled"
                  ? 3
                  : job.priority === "no_answer"
                  ? 2
                  : job.priority === "worker_return"
                  ? 1
                  : 0
              )}`}
              title={getStatusName(
                job.priority === "high"
                  ? 4
                  : job.priority === "normal"
                  ? 9
                  : job.priority === "cancelled"
                  ? 3
                  : job.priority === "no_answer"
                  ? 2
                  : job.priority === "worker_return"
                  ? 1
                  : 0
              ).replace(/[^\w\s]/g, "")}
            >
              {job.priority === "high"
                ? "🔥 Gấp"
                : job.priority === "normal"
                ? "🏠 Thường"
                : job.priority === "cancelled"
                ? "❌ Hủy"
                : job.priority === "no_answer"
                ? "📞 Không nghe"
                : job.priority === "worker_return"
                ? "🔄 Thợ về"
                : "⏳ Chưa phân"}
            </span>
            {/* Thời gian và hình ảnh */}
            <div className="flex items-center space-x-1">
              <div className="px-1 py-0.5 text-xs font-medium rounded bg-brand-yellow/10 text-brand-yellow">
                {job.job_appointment_time || "N/A"}
              </div>
              {job.images_count > 0 && (
                <div className="px-1 py-0.5 text-xs font-medium rounded bg-brand-green/20 text-brand-green">
                  📷{job.images_count}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Thợ đã phân công - Fixed width */}
        <div className="flex-shrink-0 px-2 w-20">
          {job.id_worker && (
            <div className="px-1 py-0.5 text-xs font-medium text-center rounded bg-brand-green/10 text-brand-green">
              <div className="truncate">
                {job.worker_full_name || job.worker_code || "N/A"}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Các nút hành động - Hoàn toàn tách biệt, không ảnh hưởng đến modal chi tiết */}
      <div
        className="flex flex-shrink-0 items-center ml-2 space-x-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Tạo định dạng copy theo yêu cầu: mã | nội dung | tên khách | địa chỉ | quận | sđt
            const copyContent = [
              job.job_code || "",
              job.job_content || "",
              job.job_customer_name || "",
              job.job_customer_address || "",
              job.job_customer_district ||
                job.district?.name ||
                job.district?.district_name ||
                "",
              job.job_customer_phone || "",
            ].join("\t"); // Sử dụng tab để tạo khoảng cách như định dạng yêu cầu

            // Fallback method using textarea nếu clipboard API không khả dụng
            const fallbackCopy = (text) => {
              const textArea = document.createElement("textarea");
              textArea.value = text;
              textArea.style.position = "fixed";
              textArea.style.left = "-999999px";
              textArea.style.top = "-999999px";
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();

              try {
                const successful = document.execCommand("copy");
                textArea.remove();
                return successful;
              } catch (err) {
                console.error("Fallback copy failed:", err);
                textArea.remove();
                return false;
              }
            };

            // Try using Clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
              navigator.clipboard
                .writeText(copyContent)
                .then(() => {
                  onCopy(job);
                })
                .catch((err) => {
                  console.error("Clipboard API failed, using fallback:", err);
                  fallbackCopy(copyContent);
                  onCopy(job);
                });
            } else {
              // Use fallback for non-secure contexts or when clipboard API is not available
              fallbackCopy(copyContent);
              onCopy(job);
            }
          }}
          className={`p-1 rounded transition-all duration-200 ${
            copiedWorkId === job.id
              ? "text-brand-green bg-brand-green/20 shadow-md"
              : "text-gray-500 hover:text-brand-green hover:bg-brand-green/10 hover:shadow-sm"
          }`}
          title="Sao chép lịch theo định dạng: Mã | Nội dung | Tên | Địa chỉ | Quận | SĐT"
        >
          <FileText className="w-4 h-4" />
        </button>
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
              <span className="text-sm">🔄</span>
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
              <span className="text-sm">✏️</span>
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
              <span className="text-sm">💰</span>
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
              <span className="text-sm">👤+</span>
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
              <span className="text-sm">✏️</span>
            </button>
          </>
        )}
      </div>
      {/* Tooltip */}
      {showTooltip && (
        <div className={`absolute left-0 z-50 ${
          tooltipPosition === 'top' 
            ? 'bottom-full mb-1' 
            : 'top-full mt-1'
        }`}>
          <JobDetailTooltip job={job} />
        </div>
      )}
      {/* Modal xem chi tiết */}
      <JobDetailModal
        job={job}
        open={showModal}
        onClose={() => setShowModal(false)}
      />

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
