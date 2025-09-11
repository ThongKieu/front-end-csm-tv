import React from 'react';
import { X, Phone, MapPin, Clock, Image, User, Calendar, FileText } from 'lucide-react';

const JobDetailModal = ({ job, open, onClose }) => {
  if (!open || !job) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center backdrop-blur-sm bg-black/25" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 px-4 py-3 bg-gradient-to-r rounded-t-lg border-b border-gray-200 from-brand-green/10 to-brand-yellow/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-brand-green" />
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Chi tiết công việc
                </h2>
                <p className="text-sm text-gray-600">
                  {job.job_code || 'N/A'} - {job.job_content || job.work_content || 'Không có nội dung'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 rounded-full transition-all duration-200 hover:text-brand-yellow hover:bg-brand-yellow/10"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Thông tin cơ bản */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">
              Thông tin cơ bản
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Mã công việc */}
              {job.job_code && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600 w-24">Mã:</span>
                  <span className="text-sm font-bold text-brand-green">{job.job_code}</span>
                </div>
              )}

              {/* Nội dung công việc */}
              <div className="flex items-start space-x-2">
                <span className="text-sm font-medium text-gray-600 w-24">Nội dung:</span>
                <span className="text-sm text-gray-900 flex-1">
                  {job.job_content || job.work_content || 'Không có nội dung'}
                </span>
              </div>

              {/* Thời gian hẹn */}
              {(job.job_appointment_time || job.time_book) && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-brand-yellow" />
                  <span className="text-sm font-medium text-gray-600 w-24">Thời gian:</span>
                  <span className="text-sm text-brand-yellow font-medium">
                    {job.job_appointment_time || job.time_book}
                  </span>
                </div>
              )}

              {/* Ngày hẹn */}
              {(job.job_appointment_date || job.date_book) && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-brand-green" />
                  <span className="text-sm font-medium text-gray-600 w-24">Ngày:</span>
                  <span className="text-sm text-gray-900">
                    {job.job_appointment_date || job.date_book}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Thông tin khách hàng */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">
              Thông tin khách hàng
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Tên khách hàng */}
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-brand-green" />
                <span className="text-sm font-medium text-gray-600 w-24">Tên:</span>
                <span className="text-sm text-gray-900">
                  {job.job_customer_name || job.name_cus || 'Chưa có thông tin'}
                </span>
              </div>

              {/* Số điện thoại */}
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-green" />
                <span className="text-sm font-medium text-gray-600 w-24">SĐT:</span>
                <span className="text-sm text-gray-900">
                  {job.job_customer_phone || job.phone_number || 'Chưa có thông tin'}
                </span>
              </div>

              {/* Địa chỉ */}
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brand-green" />
                <span className="text-sm font-medium text-gray-600 w-24">Địa chỉ:</span>
                <span className="text-sm text-gray-900 flex-1">
                  {job.job_customer_address || job.street || 'Chưa có thông tin'}
                </span>
              </div>

              {/* Ghi chú */}
              {(job.job_customer_note || job.work_note) && (
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-brand-yellow" />
                  <span className="text-sm font-medium text-gray-600 w-24">Ghi chú:</span>
                  <span className="text-sm text-gray-700 flex-1">
                    {job.job_customer_note || job.work_note}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Thông tin thợ */}
          {(job.worker_full_name || job.worker_name || job.worker_code) && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">
                Thông tin thợ
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-brand-green" />
                  <span className="text-sm font-medium text-gray-600 w-24">Thợ:</span>
                  <span className="text-sm text-brand-green font-medium">
                    {job.worker_full_name || job.worker_name} ({job.worker_code})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hình ảnh đính kèm */}
          {job.images_count > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">
                Hình ảnh đính kèm
              </h3>
              
              <div className="flex items-center space-x-2">
                <Image className="w-4 h-4 text-brand-green" />
                <span className="text-sm text-brand-green font-medium">
                  {job.images_count} hình ảnh
                </span>
              </div>
            </div>
          )}

          {/* Trạng thái */}
          {job.status_work && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">
                Trạng thái
              </h3>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600 w-24">Trạng thái:</span>
                <span className="text-sm text-gray-900">
                  {job.status_work === 6 ? 'Đã phân công' : 'Chưa phân công'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-4 py-3 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-300 transition-colors duration-200 hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;