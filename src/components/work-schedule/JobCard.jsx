import React, { useState } from 'react';
import { Phone, Clock, MapPin, FileText, Image } from 'lucide-react';
import { getWorkTypeColor, getWorkTypeName, getStatusColor, getStatusName } from './WorkTable';
import JobDetailTooltip from './JobDetailTooltip';
import JobDetailModal from './JobDetailModal';

const JobCard = ({ job, index, onAssign, onEdit, onCopy, copiedWorkId }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className="relative flex items-center py-1.5 px-3 bg-gray-50 rounded border border-gray-100 hover:border-brand-green/30 transition-colors cursor-pointer text-xs"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => {
        setShowModal(true);
      }}
    >
      {/* Mã công việc */}
      <div className="w-20 text-center font-bold text-gray-600 text-xs">
        {job.job_code || "N/A"}
      </div>
      {/* Loại công việc */}
      <div className="w-16 flex-shrink-0">
        <span className={`px-1 py-0.5 text-xs font-medium rounded ${getWorkTypeColor(job.kind_work)}`}>{getWorkTypeName(job.kind_work)}</span>
      </div>
      {/* Nội dung công việc */}
      <div className="flex-1 min-w-0 px-2">
        <div className="truncate font-semibold text-gray-900 text-sm">{job.work_content || "Không có nội dung"}</div>
      </div>
      {/* Khách hàng */}
      <div className="w-20 flex-shrink-0 px-1">
        <div className="truncate text-gray-700 text-xs">{job.name_cus || "N/A"}</div>
      </div>
      {/* SĐT */}
      <div className="w-18 flex-shrink-0 px-1">
        <div className="truncate text-gray-600 text-xs">{job.phone_number || "N/A"}</div>
      </div>
      {/* Địa chỉ */}
      <div className="w-32 flex-shrink-0 px-1">
        <div className="truncate text-gray-700 text-xs flex items-center">
          <MapPin className="w-3 h-3 mr-0.5 text-gray-500" />
          {job.street || job.job_customer_address || "N/A"}
        </div>
      </div>
      {/* Trạng thái */}
      <div className="w-20 flex-shrink-0 px-1">
        <span className={`px-1 py-0.5 text-xs font-medium rounded ${getStatusColor(job.status_work)}`} title={getStatusName(job.status_work).replace(/[^\w\s]/g, '')}>{getStatusName(job.status_work)}</span>
      </div>
      {/* Ngày */}
      <div className="w-14 flex-shrink-0 px-1">
        <span className="text-gray-600 text-xs">{job.date_book}</span>
      </div>
      {/* Giờ */}
      <div className="w-10 flex-shrink-0 px-1">
        <span className="text-gray-600 text-xs">{job.time_book || "N/A"}</span>
      </div>
      
      {/* Hình ảnh */}
      <div className="w-8 flex-shrink-0 text-center">
        {job.images_count > 0 && (<span className="text-brand-green text-xs">📷{job.images_count}</span>)}
      </div>
             {/* Thợ đã phân công */}
       <div className="w-20 flex-shrink-0 px-1">
         {job.id_worker && (
           <span className="text-brand-green text-xs truncate block">{job.worker_full_name || job.worker_code || "N/A"}</span>
         )}
       </div>
      {/* Các nút hành động */}
      <div className="flex items-center space-x-0.5 ml-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onCopy(job)}
          className={`p-1 rounded transition-colors ${copiedWorkId === job.id ? "text-brand-green bg-brand-green/10" : "text-gray-500 hover:text-brand-green hover:bg-brand-green/10"}`}
          title="Sao chép lịch"
        >
          <FileText className="w-4 h-4" />
        </button>
        {job.id_worker ? (
          <>
            <button onClick={() => onAssign(job, true)} className="p-1 text-gray-500 hover:text-brand-green hover:bg-brand-green/10 cursor-pointer rounded transition-colors" title="Đổi thợ"><span className="text-xs">🔄</span></button>
            <button onClick={() => onEdit(job, true)} className="p-1 text-gray-500 hover:text-brand-green hover:bg-brand-green/10 rounded transition-colors" title="Nhập thu chi"><span className="text-xs">💰</span></button>
          </>
        ) : (
          <>
            <button onClick={() => onAssign(job, false)} className="p-1 text-gray-500 hover:text-brand-green hover:bg-brand-green/10 rounded transition-colors" title="Phân công thợ"><span className="text-xs">👤+</span></button>
            <button onClick={() => onEdit(job, false)} className="p-1 text-gray-500 hover:text-brand-green hover:bg-brand-green/10 rounded transition-colors" title="Chỉnh sửa"><span className="text-xs">⚙️</span></button>
          </>
        )}
      </div>
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 top-full left-0 mt-1">
          <JobDetailTooltip job={job} />
        </div>
      )}
      {/* Modal xem chi tiết */}
      <JobDetailModal job={job} open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default JobCard; 