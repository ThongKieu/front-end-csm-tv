import React from 'react';
import { Phone, MapPin, FileText, Image } from 'lucide-react';

const JobDetailTooltip = ({ job }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-sm">
      {/* Header */}
      <div className="border-b border-gray-100 pb-2 mb-2">
        <h4 className="font-semibold text-gray-900 text-sm mb-1">
          Chi tiết công việc
        </h4>
        <p className="text-gray-600 text-xs">
          Mã: {job.job_code || 'N/A'}
        </p>
      </div>
      
      {/* Nội dung công việc */}
      <div className="mb-2">
        <p className="text-gray-900 text-sm font-medium">
          {job.work_content || "Không có nội dung"}
        </p>
      </div>
      
      {/* Thông tin khách hàng */}
      <div className="space-y-1 mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 text-xs">Khách hàng:</span>
          <span className="text-gray-900 text-xs font-medium">
            {job.name_cus || "Chưa có thông tin"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-3 h-3 text-gray-500" />
          <span className="text-gray-600 text-xs">SĐT:</span>
          <span className="text-gray-900 text-xs">
            {job.phone_number || "Chưa có thông tin"}
          </span>
        </div>
      </div>
      
      {/* Địa chỉ */}
      <div className="mb-2">
        <div className="flex items-start space-x-2">
          <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="text-gray-600 text-xs">
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
            <div className="text-gray-600 text-xs">
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
            <span className="text-gray-600 text-xs">Hình ảnh:</span>
            <span className="text-blue-600 text-xs font-medium">
              {job.images_count} ảnh
            </span>
          </div>
        </div>
      )}
      
      {/* Thợ đã phân công */}
      {job.id_worker && (
        <div className="border-t border-gray-100 pt-2">
          <div className="text-gray-600 text-xs">
            <span className="font-medium">Thợ đã phân công:</span>
            <div className="mt-1">
              <p className="text-blue-600 font-medium">
                {job.worker_full_name} ({job.worker_code})
              </p>
              <div className="flex items-center space-x-2 mt-1">
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