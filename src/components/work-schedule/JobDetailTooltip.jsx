import React from 'react';
import { Phone, MapPin, FileText, Image } from 'lucide-react';

const JobDetailTooltip = ({ job }) => {
  return (
    <div className="p-3 max-w-sm bg-white rounded-lg border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="pb-2 mb-2 border-b border-gray-100">
        <h4 className="mb-1 text-sm font-semibold text-gray-900">
          Chi tiết công việc
        </h4>
        <p className="text-xs text-gray-600">
          Mã: {job.job_code || 'N/A'}
        </p>
      </div>
      
      {/* Nội dung công việc */}
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-900">
          {job.work_content || "Không có nội dung"}
        </p>
      </div>
      
      {/* Thông tin khách hàng */}
      <div className="mb-2 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">Khách hàng:</span>
          <span className="text-xs font-medium text-gray-900">
            {job.name_cus || "Chưa có thông tin"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-600">SĐT:</span>
          <span className="text-xs text-gray-900">
            {job.phone_number || "Chưa có thông tin"}
          </span>
        </div>
      </div>
      
      {/* Địa chỉ */}
      <div className="mb-2">
        <div className="flex items-start space-x-2">
          <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-600">
            <span className="font-medium">Địa chỉ:</span>
            <p className="text-gray-900">
              {job.street
                ? `${job.street}${job.district ? `, ${job.district}` : ''}`
                : "Chưa có thông tin"}
            </p>
          </div>
        </div>
      </div>
      
      {/* Ghi chú */}
      {job.work_note && (
        <div className="mb-2">
          <div className="flex items-start space-x-2">
            <FileText className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-600">
              <span className="font-medium">Ghi chú:</span>
              <p className="text-gray-900">
                {job.work_note}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Hình ảnh */}
      {job.images_count > 0 && (
        <div className="mb-2">
          <div className="flex items-center space-x-2">
            <Image className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-600">Hình ảnh:</span>
            <span className="text-xs font-medium text-blue-600">
              {job.images_count} ảnh
            </span>
          </div>
        </div>
      )}
      
      {/* Thợ đã phân công */}
      {job.id_worker && (
        <div className="pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-600">
            <span className="font-medium">Thợ đã phân công:</span>
            <div className="mt-1">
              <p className="font-medium text-blue-600">
                {job.worker_full_name} ({job.worker_code})
              </p>
              <div className="flex items-center mt-1 space-x-2">
                <Phone className="w-3 h-3 text-blue-500" />
                <span className="text-blue-600">
                  {job.worker_phone_company || "Chưa có thông tin"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailTooltip; 