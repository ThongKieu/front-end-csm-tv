import React from "react";
import { Phone, Clock, MapPin, Image } from "lucide-react";

const JobInfo = ({ 
  job, 
  showWorker = false, 
  showNote = true, 
  showImages = true,
  className = "",
  onClick = null 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(job);
    }
  };

  return (
    <div 
      className={`flex flex-col flex-1 min-w-0 space-y-0.5 ${className}`}
      onClick={handleClick}
    >
      {/* 1. Dòng 1: Mã code lịch */}
      {job.job_code && (
        <div className="flex items-center space-x-1">
          <span className="text-xs font-bold text-[#125d0d]">
            #{job.job_code}
          </span>
        </div>
      )}
      
      {/* 2. Dòng 2: Nội dung công việc, Tên, SĐT, Thời gian hẹn */}
      <div className="flex items-center space-x-1 text-xs text-gray-600 sm:space-x-2">
        {/* Nội dung công việc */}
        <div className="flex flex-1 items-center space-x-1 min-w-0">
          <span className="font-semibold text-gray-900 truncate max-w-32 sm:max-w-48 md:max-w-64">
            {job.job_content || job.work_content || "Không có nội dung"}
          </span>
        </div>
        
        {/* Tên khách hàng */}
        <div className="flex flex-shrink-0 items-center space-x-1 min-w-0">
          <span className="text-brand-green">👤</span>
          <span className="font-medium truncate max-w-16 sm:max-w-20">
            {job.job_customer_name || job.name_cus || ""}
          </span>
        </div>
        
        {/* Số điện thoại */}
        <div className="flex flex-shrink-0 items-center space-x-1 min-w-0">
          <Phone className="flex-shrink-0 w-3 h-3 text-brand-green" />
          <span className="font-medium truncate max-w-16 sm:max-w-20">
            {job.job_customer_phone || job.phone_number || ""}
          </span>
        </div>
        
        {/* Thời gian hẹn */}
        {(job.job_appointment_time || job.time_book) && (
          <div className="flex flex-shrink-0 items-center space-x-1 min-w-0">
            <Clock className="flex-shrink-0 w-3 h-3 text-brand-yellow" />
            <span className="font-medium text-brand-yellow">
              {job.job_appointment_time || job.time_book}
            </span>
          </div>
        )}
      </div>
      
      {/* 3. Dòng 3: Địa chỉ + Ghi chú + Hình ảnh + Thợ */}
      <div className="flex items-center space-x-1 text-xs text-gray-600 sm:space-x-2">
        {/* Địa chỉ */}
        <div className="flex flex-1 items-center space-x-1 min-w-0">
          <MapPin className="flex-shrink-0 w-3 h-3 text-brand-green" />
          <span className="text-gray-700 truncate max-w-24 sm:max-w-32 md:max-w-40">
            {job.job_customer_address || job.street || ""}
          </span>
        </div>
        
        {/* Ghi chú (nếu có) */}
        {showNote && (job.job_customer_note || job.work_note) && (
          <div className="flex flex-shrink-0 items-center space-x-1 min-w-0">
            <span className="text-brand-yellow">📝</span>
            <span className="text-gray-500 truncate max-w-16 sm:max-w-20" title={job.job_customer_note || job.work_note}>
              {(job.job_customer_note || job.work_note).length > 15 
                ? (job.job_customer_note || job.work_note).substring(0, 15) + "..." 
                : (job.job_customer_note || job.work_note)}
            </span>
          </div>
        )}
        
        {/* Hình ảnh */}
        {showImages && job.images_count > 0 && (
          <div className="flex flex-shrink-0 items-center space-x-1 min-w-0">
            <Image className="flex-shrink-0 w-3 h-3 text-brand-green" />
            <span className="font-medium text-brand-green">
              {job.images_count}
            </span>
          </div>
        )}
        
        {/* Thợ đã phân công */}
        {showWorker && (job.id_worker || job.worker_code) && (
          <div className="flex items-center space-x-1 min-w-0">
            <span className="text-brand-green">👷</span>
            <span className="font-medium text-brand-green">
              {job.worker_code || ""}
            </span>
            <span className="font-medium truncate text-gray-700 max-w-16">
              {job.worker_full_name || job.worker_name || ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobInfo;
