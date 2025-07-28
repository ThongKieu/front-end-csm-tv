'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, User, FileText, Briefcase, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function CreateScheduleModal({ isOpen, onClose, workers, onSuccess }) {
  const { showToast } = useToast();
  
  const defaultFormData = {
    job_content: '',
    job_appointment_date: '',
    job_appointment_time: '08:30',
    job_period: 'morning',
    job_customer_address: '',
    job_customer_phone: '',
    job_customer_name: '',
    job_customer_note: '',
    job_type_id: '',
    job_source: 'call_center',
    job_priority: 'medium',
    user_id: '1',
    job_images: []
  };

  const [scheduleData, setScheduleData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved data when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem('createScheduleFormData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setScheduleData({ ...defaultFormData, ...parsedData });
        } catch (error) {
          console.error('Error parsing saved form data:', error);
        }
      }
    }
  }, [isOpen]);

  // Save data to localStorage whenever form data changes
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem('createScheduleFormData', JSON.stringify(scheduleData));
    }
  }, [scheduleData, isOpen]);

  const clearSavedData = () => localStorage.removeItem('createScheduleFormData');
  const resetForm = () => setScheduleData({ ...defaultFormData });

  // Data options
  const jobPriorities = [
    { value: 'medium', label: 'Khách quen', color: 'text-green-600' },
    { value: 'high', label: 'Lịch ưu tiên', color: 'text-red-600' }
  ];

  const jobTypes = [
    { value: '1', label: 'Điện Nước' },
    { value: '2', label: 'Điện Lạnh' },
    { value: '3', label: 'Đồ gỗ' },
    { value: '4', label: 'Năng Lượng Mặt trời' },
    { value: '5', label: 'Xây Dựng' },
    { value: '6', label: 'Tài Xế' },
    { value: '7', label: 'Cơ Khí' },
    { value: '8', label: 'Điện - Điện Tử' },
    { value: '9', label: 'Văn Phòng' }
  ];

  const jobSources = [
    { value: 'call_center', label: 'Call Center' },
    { value: 'app_customer', label: 'App Khách hàng' },
    { value: 'app_worker', label: 'App Thợ' },
    { value: 'website', label: 'Website' },
    { value: 'zalo', label: 'Zalo' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'office', label: 'Văn phòng' },
    { value: 'other', label: 'Khác' }
  ];

  const timePeriods = [
    { value: 'morning', label: 'Buổi sáng (08:00 - 12:00)', defaultTime: '08:30' },
    { value: 'afternoon', label: 'Buổi chiều (13:00 - 17:00)', defaultTime: '14:00' },
    { value: 'custom', label: 'Tùy chỉnh thời gian', defaultTime: '' }
  ];

  // Handlers
  const handlePeriodChange = (period) => {
    const selectedPeriod = timePeriods.find(p => p.value === period);
    const newTime = selectedPeriod.defaultTime || scheduleData.job_appointment_time;
    
    setScheduleData({
      ...scheduleData,
      job_period: period,
      job_appointment_time: newTime
    });

    const messages = {
      morning: 'Đã chọn buổi sáng (08:00 - 12:00)',
      afternoon: 'Đã chọn buổi chiều (13:00 - 17:00)',
      custom: 'Đã chọn tùy chỉnh thời gian'
    };
    showToast(messages[period], 'info');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setScheduleData({ ...scheduleData, job_images: files });
    if (files.length > 0) {
      showToast(`Đã chọn ${files.length} file ảnh`, 'info');
    }
  };

  const validateTimeByPeriod = (time, period) => {
    const hour = parseInt(time.split(':')[0]);
    if (period === 'morning') return hour >= 8 && hour < 12;
    if (period === 'afternoon') return hour >= 13 && hour < 17;
    return true;
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = [
      { field: 'job_content', message: 'Vui lòng nhập nội dung công việc' },
      { field: 'job_appointment_date', message: 'Vui lòng chọn ngày hẹn' },
      { field: 'job_customer_address', message: 'Vui lòng nhập địa chỉ' },
      { field: 'job_customer_phone', message: 'Vui lòng nhập số điện thoại' },
      { field: 'job_type_id', message: 'Vui lòng chọn loại công việc' },
      { field: 'job_source', message: 'Vui lòng chọn nguồn' }
    ];

    for (const { field, message } of requiredFields) {
      if (!scheduleData[field] || !scheduleData[field].toString().trim()) {
        showToast(message, 'error');
        return;
      }
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(scheduleData.job_customer_phone.replace(/\s/g, ''))) {
      showToast('Số điện thoại không hợp lệ (10-11 số)', 'error');
      return;
    }

    if (!validateTimeByPeriod(scheduleData.job_appointment_time, scheduleData.job_period)) {
      const messages = {
        morning: 'Thời gian buổi sáng phải từ 08:00 đến 12:00',
        afternoon: 'Thời gian buổi chiều phải từ 13:00 đến 17:00'
      };
      showToast(messages[scheduleData.job_period], 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Chuẩn bị dữ liệu gửi đi với format chính xác
      const requestData = {
        job_content: scheduleData.job_content.trim(),
        job_appointment_date: scheduleData.job_appointment_date,
        job_appointment_time: scheduleData.job_appointment_time,
        job_customer_address: scheduleData.job_customer_address.trim(),
        job_customer_phone: scheduleData.job_customer_phone.trim().replace(/\s/g, ''),
        job_customer_name: scheduleData.job_customer_name.trim() || 'Khách hàng',
        job_customer_note: scheduleData.job_customer_note.trim() || '',
        job_type_id: parseInt(scheduleData.job_type_id), // Đảm bảo là số
        job_source: scheduleData.job_source,
        job_priority: scheduleData.job_priority,
        user_id: parseInt(scheduleData.user_id) || 1, // Đảm bảo là số
        // Thêm các field có thể cần thiết
        job_status: 'pending', // Trạng thái mặc định
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Sending data to API:', requestData);

      const formData = new FormData();
      
      // Thêm các field text
      Object.keys(requestData).forEach(key => {
        if (requestData[key] !== null && requestData[key] !== undefined) {
          formData.append(key, requestData[key]);
        }
      });

      // Thêm files nếu có
      if (scheduleData.job_images && scheduleData.job_images.length > 0) {
        scheduleData.job_images.forEach(file => {
          formData.append('job_images[]', file);
        });
      }

      // Log FormData để debug
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post('http://192.168.1.27/api/web/job/create', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 30000 // 30 giây timeout
      });

      console.log('API Response:', response);

      if (response.status === 200 || response.status === 201) {
        showToast('Tạo công việc thành công!', 'success');
        clearSavedData();
        
        // Gọi callback để refresh data
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
        
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error('Error creating job:', error);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      
      let errorMessage = 'Có lỗi xảy ra khi tạo công việc';
      
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        
        console.error('Response data:', responseData);
        
        const messages = {
          400: 'Dữ liệu không hợp lệ',
          401: 'Không có quyền truy cập',
          403: 'Truy cập bị từ chối',
          404: 'API không tồn tại',
          422: 'Dữ liệu không hợp lệ (422) - Vui lòng kiểm tra lại thông tin',
          500: 'Lỗi server, vui lòng thử lại sau'
        };
        
        // Xử lý lỗi 422 chi tiết hơn
        if (status === 422 && responseData && responseData.errors) {
          const validationErrors = Object.values(responseData.errors).flat();
          errorMessage = `Lỗi validation: ${validationErrors.join(', ')}`;
        } else if (responseData && responseData.message) {
          errorMessage = responseData.message;
        } else {
          errorMessage = messages[status] || `Lỗi server (${status})`;
        }
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server, vui lòng kiểm tra kết nối mạng';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout, vui lòng thử lại';
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    resetForm();
    showToast('Đã xóa dữ liệu form', 'info');
  };

  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-end items-start p-4 bg-black/0" onClick={onClose}>
      <div className="flex overflow-hidden flex-col w-full max-w-2xl h-full max-h-screen bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Tạo công việc mới
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Điền thông tin để tạo công việc mới</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full transition-colors hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleCreateSchedule} className="p-6 space-y-6">
            {/* Thông tin chính */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Nội dung công việc <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={scheduleData.job_content}
                  onChange={(e) => setScheduleData({ ...scheduleData, job_content: e.target.value })}
                  className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors resize-none"
                  rows="4"
                  placeholder="Mô tả công việc cần làm"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={scheduleData.job_customer_address}
                  onChange={(e) => setScheduleData({ ...scheduleData, job_customer_address: e.target.value })}
                  className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                  placeholder="Nhập địa chỉ chi tiết"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={scheduleData.job_customer_phone}
                  onChange={(e) => setScheduleData({ ...scheduleData, job_customer_phone: e.target.value })}
                  className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                  placeholder="Nhập số điện thoại"
                  required
                />
                <input
                  type="text"
                  value={scheduleData.job_customer_name}
                  onChange={(e) => setScheduleData({ ...scheduleData, job_customer_name: e.target.value })}
                  className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                  placeholder="Tên khách hàng"
                />
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Thông tin khách hàng */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex justify-center items-center w-8 h-8 bg-blue-100 rounded-lg">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Thông tin khách hàng</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block mb-2 text-xs font-medium text-gray-700">Mức độ ưu tiên</label>
                    <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {jobPriorities.map((priority) => (
                        <label key={priority.value} className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${scheduleData.job_priority === priority.value ? 'bg-blue-50 border border-blue-200' : ''}`}>
                          <input
                            type="radio"
                            name="job_priority"
                            value={priority.value}
                            checked={scheduleData.job_priority === priority.value}
                            onChange={(e) => setScheduleData({ ...scheduleData, job_priority: e.target.value })}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className={`text-sm ${priority.color} font-medium`}>{priority.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin công việc */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex justify-center items-center w-8 h-8 bg-indigo-100 rounded-lg">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Thông tin công việc</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Loại công việc <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={scheduleData.job_type_id}
                      onChange={(e) => setScheduleData({ ...scheduleData, job_type_id: e.target.value })}
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                      required
                    >
                      <option value="">Chọn loại công việc</option>
                      {jobTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Nguồn <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={scheduleData.job_source}
                      onChange={(e) => setScheduleData({ ...scheduleData, job_source: e.target.value })}
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                      required
                    >
                      <option value="">Chọn nguồn</option>
                      {jobSources.map((source) => (
                        <option key={source.value} value={source.value}>{source.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Ngày hẹn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={scheduleData.job_appointment_date}
                      onChange={(e) => setScheduleData({ ...scheduleData, job_appointment_date: e.target.value })}
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Buổi thời gian</label>
                    <select
                      value={scheduleData.job_period}
                      onChange={(e) => handlePeriodChange(e.target.value)}
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                    >
                      {timePeriods.map((period) => (
                        <option key={period.value} value={period.value}>{period.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Giờ hẹn</label>
                    <input
                      type="time"
                      value={scheduleData.job_appointment_time}
                      onChange={(e) => setScheduleData({ ...scheduleData, job_appointment_time: e.target.value })}
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                      min={scheduleData.job_period === 'morning' ? '08:00' : scheduleData.job_period === 'afternoon' ? '13:00' : '00:00'}
                      max={scheduleData.job_period === 'morning' ? '12:00' : scheduleData.job_period === 'afternoon' ? '17:00' : '23:59'}
                    />
                    {scheduleData.job_period !== 'custom' && (
                      <p className="mt-1 text-xs text-gray-500">
                        Khung giờ: {scheduleData.job_period === 'morning' ? '08:00 - 12:00' : '13:00 - 17:00'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ghi chú và ảnh */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex justify-center items-center w-8 h-8 bg-amber-100 rounded-lg">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Ghi chú & Hình ảnh</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Ghi chú thêm</label>
                  <textarea
                    value={scheduleData.job_customer_note}
                    onChange={(e) => setScheduleData({ ...scheduleData, job_customer_note: e.target.value })}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors resize-none"
                    rows="3"
                    placeholder="Nhập ghi chú bổ sung (không bắt buộc)"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Chọn ảnh</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                  />
                  {scheduleData.job_images && scheduleData.job_images.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">Đã chọn {scheduleData.job_images.length} file(s)</div>
                  )}
                </div>
              </div>
            </div>

            {/* Nút điều khiển */}
            <div className="flex-shrink-0 px-6 pt-4 bg-white border-t border-gray-100">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors font-medium border border-orange-200"
                >
                  Xóa form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg transition-all font-medium flex items-center justify-center shadow-lg ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1.5"></div>
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Tạo công việc
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 