import React, { useEffect, useRef } from 'react';
import { X, Phone, MapPin, FileText, Image, Calendar, Clock, User } from 'lucide-react';
import { getStatusColor, getStatusName, getWorkTypeColor, getWorkTypeName } from './WorkTable';

const JobDetailModal = ({ job, open, onClose }) => {
  const modalRef = useRef(null);

    // Tự động copy thông tin khi modal mở
  useEffect(() => {
    if (open && job) {
      const copyJobInfo = async () => {
        try {
          // Lấy thông tin địa chỉ
          const street = typeof job.street === 'string' ? job.street : 
                        (job.street?.name || job.street?.street_name || '');
          const district = typeof job.district === 'string' ? job.district : 
                          (job.district?.name || job.district?.district_name || '');
          const address = job.job_customer_address || street || '';

          // Tạo nội dung copy theo định dạng yêu cầu: mã | nội dung | tên khách | địa chỉ | quận | sđt
          const copyContent = [
            job.job_code || '',
            job.job_content || job.work_content || '',
            job.job_customer_name || job.name_cus || '',
            address || '',
            district || '',
            job.job_customer_phone || job.phone_number || ''
          ].join('\t'); // Sử dụng tab để tạo khoảng cách như định dạng yêu cầu

                     // Copy vào clipboard với fallback
           try {
             if (navigator.clipboard && window.isSecureContext) {
               await navigator.clipboard.writeText(copyContent);
             } else {
               // Fallback method cho các trình duyệt cũ hoặc non-secure contexts
               const textArea = document.createElement('textarea');
               textArea.value = copyContent;
               textArea.style.position = 'fixed';
               textArea.style.left = '-999999px';
               textArea.style.top = '-999999px';
               document.body.appendChild(textArea);
               textArea.focus();
               textArea.select();
               document.execCommand('copy');
               document.body.removeChild(textArea);
             }
           } catch (error) {
             console.error('Lỗi khi copy, sử dụng fallback:', error);
             // Fallback method nếu cả hai cách đều thất bại
             const textArea = document.createElement('textarea');
             textArea.value = copyContent;
             textArea.style.position = 'fixed';
             textArea.style.left = '-999999px';
             textArea.style.top = '-999999px';
             document.body.appendChild(textArea);
             textArea.focus();
             textArea.select();
             document.execCommand('copy');
             document.body.removeChild(textArea);
           }
        } catch (error) {
          console.error('Lỗi khi copy:', error);
        }
      };

      copyJobInfo();
    }
  }, [open, job]);

  // Xử lý phím ESC và click outside để đóng modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Ngăn scroll body khi modal mở
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex justify-center items-center backdrop-blur-sm bg-black/25"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 px-6 py-4 bg-gradient-to-r rounded-t-xl border-b border-gray-200 from-brand-green/10 to-brand-yellow/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getWorkTypeColor(job.kind_work)}`}>
                <span className="text-sm font-bold">{getWorkTypeName(job.kind_work)}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Chi tiết công việc</h2>
                <p className="text-sm text-gray-600">Mã: {job.job_code || 'N/A'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 rounded-full transition-all duration-200 hover:text-brand-yellow hover:bg-brand-yellow/10"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Nội dung công việc */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="flex items-center mb-2 text-sm font-semibold text-gray-700">
              <FileText className="mr-2 w-4 h-4" />
              Nội dung công việc
            </h3>
            <p className="text-base leading-relaxed text-gray-900">
              {job.job_content || job.work_content || "Không có nội dung"}
            </p>
          </div>

          {/* Thông tin khách hàng */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-brand-green/10">
              <h3 className="flex items-center mb-3 text-sm font-semibold text-brand-green">
                <User className="mr-2 w-4 h-4" />
                Thông tin khách hàng
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Tên:</span>
                  <span className="font-medium text-gray-900">
                    {job.job_customer_name || job.name_cus || "Chưa có thông tin"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">SĐT:</span>
                  <span className="font-medium text-gray-900">
                    {job.job_customer_phone || job.phone_number || "Chưa có thông tin"}
                  </span>
                </div>
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="p-4 rounded-lg bg-brand-green/10">
              <h3 className="flex items-center mb-3 text-sm font-semibold text-brand-green">
                <MapPin className="mr-2 w-4 h-4" />
                Địa chỉ
              </h3>
              <p className="text-gray-900">
                {job.job_customer_address || (() => {
                  const street = typeof job.street === 'string' ? job.street : 
                                (job.street?.name || job.street?.street_name || '');
                  const district = typeof job.district === 'string' ? job.district : 
                                  (job.district?.name || job.district?.district_name || '');
                  
                  if (street || district) {
                    return `${street || ''}${district ? (street ? ', ' : '') + district : ''}`;
                  }
                  return "Chưa có thông tin";
                })()}
              </p>
            </div>
          </div>

          {/* Thời gian và trạng thái */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-brand-yellow/10">
              <h3 className="flex items-center mb-3 text-sm font-semibold text-brand-yellow">
                <Calendar className="mr-2 w-4 h-4" />
                Ngày hẹn
              </h3>
              <p className="font-medium text-gray-900">{job.date_book || new Date().toISOString().split('T')[0]}</p>
            </div>
            
            <div className="p-4 rounded-lg bg-brand-yellow/10">
              <h3 className="flex items-center mb-3 text-sm font-semibold text-brand-yellow">
                <Clock className="mr-2 w-4 h-4" />
                Giờ hẹn
              </h3>
              <p className="font-medium text-gray-900">{job.job_appointment_time || job.time_book || "Chưa có"}</p>
            </div>

            <div className="p-4 rounded-lg bg-brand-green/10">
              <h3 className="mb-3 text-sm font-semibold text-brand-green">Trạng thái</h3>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(job.priority === 'high' ? 4 : job.priority === 'normal' ? 9 : job.priority === 'cancelled' ? 3 : job.priority === 'no_answer' ? 2 : job.priority === 'worker_return' ? 1 : 0)}`}>
                                 {job.priority === 'high' ? '🔥 Lịch gấp' : 
                  job.priority === 'normal' ? '🏠 Thường' : 
                  job.priority === 'cancelled' ? '❌ Đã hủy' :
                  job.priority === 'no_answer' ? '📞 Không nghe' :
                  job.priority === 'worker_return' ? '🔄 Thợ về' : '⏳ Chưa phân'}
              </span>
            </div>
          </div>

          {/* Ghi chú */}
          {(job.job_customer_note || job.work_note) && (
            <div className="p-4 rounded-lg bg-brand-yellow/10">
              <h3 className="flex items-center mb-3 text-sm font-semibold text-brand-yellow">
                <FileText className="mr-2 w-4 h-4" />
                Ghi chú
              </h3>
              <p className="leading-relaxed text-gray-900">{job.job_customer_note || job.work_note}</p>
            </div>
          )}

          {/* Hình ảnh */}
          {job.images_count > 0 && (
            <div className="p-4 rounded-lg bg-brand-green/10">
              <h3 className="flex items-center mb-3 text-sm font-semibold text-brand-green">
                <Image className="mr-2 w-4 h-4" />
                Hình ảnh
              </h3>
              <span className="font-medium text-brand-green">
                {job.images_count} ảnh đính kèm
              </span>
            </div>
          )}

          {/* Thợ đã phân công */}
          {job.id_worker && (
            <div className="p-4 rounded-lg border-l-4 bg-brand-green/10 border-brand-green">
              <h3 className="flex items-center mb-3 text-sm font-semibold text-brand-green">
                <User className="mr-2 w-4 h-4" />
                Thợ đã phân công
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-brand-green">
                  {job.worker_full_name} ({job.worker_code})
                </p>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-brand-green" />
                  <span className="text-brand-green">
                    {job.worker_phone_company || "Chưa có thông tin"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-white rounded-lg border border-gray-300 transition-colors duration-200 hover:bg-gray-50"
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