import React, { useState } from "react";
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

  // Debug: Log job data
  console.log("JobCard - Job data:", job);
  console.log("JobCard - Priority:", job.priority);
  console.log("JobCard - Category:", job.category);
  console.log("JobCard - Content fields:", {
    job_content: job.job_content,
    job_customer_name: job.job_customer_name,
    job_customer_phone: job.job_customer_phone,
    job_customer_address: job.job_customer_address,
    job_customer_note: job.job_customer_note,
    job_appointment_time: job.job_appointment_time,
  });

  return (
    <div
      className="flex relative items-center px-2 py-1 text-xs bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:border-brand-green/300 hover:shadow-md"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Phần nội dung chính - có thể click để mở modal chi tiết */}
      <div 
        className="flex flex-1 items-center space-x-1 rounded transition-colors cursor-pointer hover:bg-gray-100/50"
        onClick={() => setShowModal(true)}
      >
        {/* Mã công việc - Compact */}
        <div className="flex-shrink-0 w-16 text-center">
          <div className="px-1.5 py-0.5 text-xs font-bold rounded bg-brand-green/10 text-brand-green">
            {job.job_code || "N/A"}
          </div>
        </div>
        
        {/* Nội dung công việc + Thông tin khách hàng - Gộp gọn */}
        <div className="flex-1 ml-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {job.job_content || "Không có nội dung"}
          </div>
          {/* Thông tin khách hàng gọn gàng - 1 dòng compact */}
          <div className="flex items-center space-x-2 mt-0.5 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <span className="text-brand-green">👤</span>
              <span className="font-medium truncate max-w-16">
                {job.job_customer_name || "N/A"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3 text-brand-green" />
              <span className="font-medium truncate max-w-20">
                {job.job_customer_phone || "N/A"} 
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="flex-shrink-0 w-3 h-3 text-brand-green" />
              <span className="text-gray-700 truncate max-w-20">
                {job.job_customer_address || "N/A"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Trạng thái + Thời gian + Hình ảnh - Gộp gọn */}
        <div className="flex-shrink-0 w-20">
          <div className="flex items-center space-x-1">
            {/* Trạng thái */}
            <span
              className={`px-1 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
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
            {/* Thời gian */}
            <div className="px-1 py-0.5 text-xs font-medium rounded bg-brand-yellow/10 text-brand-yellow">
              {job.job_appointment_time || "N/A"}
            </div>
            {/* Hình ảnh */}
            {job.images_count > 0 && (
              <div className="px-1 py-0.5 text-xs font-medium rounded bg-brand-green/20 text-brand-green">
                📷{job.images_count}
              </div>
            )}
          </div>
        </div>
        
        {/* Thợ đã phân công - Compact */}
        <div className="flex-shrink-0 w-16">
          {job.id_worker && (
            <div className="px-1.5 py-0.5 text-xs font-medium text-center rounded bg-brand-green/10 text-brand-green">
              <div className="truncate">
                {job.worker_full_name || job.worker_code || "N/A"}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Các nút hành động - Hoàn toàn tách biệt, không ảnh hưởng đến modal chi tiết */}
      <div
        className="flex flex-shrink-0 items-center ml-1 space-x-0.5"
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
          className={`p-1.5 rounded transition-all duration-200 ${
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
              className="p-1.5 text-gray-500 rounded transition-all duration-200 cursor-pointer hover:text-brand-green hover:bg-brand-green/10 hover:shadow-sm"
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
                onEdit(job, true);
              }}
              className="p-1.5 text-gray-500 rounded transition-all duration-200 hover:text-brand-green hover:bg-brand-green/10 hover:shadow-sm"
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
              className="p-1.5 text-gray-500 rounded transition-all duration-200 hover:text-brand-green hover:bg-brand-green/10 hover:shadow-sm"
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
              className="p-1.5 text-gray-500 rounded transition-all duration-200 hover:text-brand-green hover:bg-brand-green/10 hover:shadow-sm"
              title="Chỉnh sửa"
            >
              <span className="text-sm">⚙️</span>
            </button>
          </>
        )}
      </div>
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute left-0 top-full z-50 mt-1">
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
