'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, Clock, User, Phone, MapPin, FileText, Building2, Tag, Briefcase, CheckCircle2, AlertCircle, Star } from 'lucide-react';
import wardsData from '@/data/tphcm-wards-complete.json';

export default function CreateScheduleModal({ isOpen, onClose, workers }) {
  const [scheduleData, setScheduleData] = useState({
    workerId: '',
    date_book: '',
    district: '',
    phone_number: '',
    kind_work: '',
    status_cus: '17', // Mặc định là "Khách hàng mới"
    work_content: '', // Nội dung công việc
    work_note: '', // Ghi chú bổ sung
    flag_status: '1',
    from_cus: '1',
    name_cus: '',
    street: '',
    id_keyword_kind: '',
    id_key_location: '',
    id_keyword_action: '',
    member_read: ''
  });

  // Hàm tìm quận cũ tương ứng với phường/xã
  const getOldDistrict = (wardName) => {
    if (!wardName) return '';
    
    // Mapping phường/xã mới với quận cũ
    const wardToDistrictMap = {
      // Quận 1 cũ
      'Phường Sài Gòn': 'Quận 1',
      'Phường Tân Định': 'Quận 1',
      'Phường Bến Thành': 'Quận 1',
      'Phường Cầu Ông Lãnh': 'Quận 1',
      
      // Quận 3 cũ
      'Phường Bàn Cờ': 'Quận 3',
      'Phường Xuân Hòa': 'Quận 3',
      'Phường Nhiêu Lộc': 'Quận 3',
      
      // Quận 4 cũ
      'Phường Xóm Chiếu': 'Quận 4',
      'Phường Khánh Hội': 'Quận 4',
      'Phường Vĩnh Hội': 'Quận 4',
      
      // Quận 5 cũ
      'Phường Chợ Quán': 'Quận 5',
      'Phường An Đông': 'Quận 5',
      'Phường Chợ Lớn': 'Quận 5',
      
      // Quận 6 cũ
      'Phường Bình Tây': 'Quận 6',
      'Phường Bình Tiên': 'Quận 6',
      'Phường Bình Phú': 'Quận 6',
      'Phường Phú Lâm': 'Quận 6',
      
      // Quận 7 cũ
      'Phường Tân Thuận': 'Quận 7',
      'Phường Phú Thuận': 'Quận 7',
      'Phường Tân Mỹ': 'Quận 7',
      'Phường Tân Hưng': 'Quận 7',
      
      // Quận 8 cũ
      'Phường Chánh Hưng': 'Quận 8',
      'Phường Phú Định': 'Quận 8',
      'Phường Bình Đông': 'Quận 8',
      
      // Quận 10 cũ
      'Phường Diên Hồng': 'Quận 10',
      'Phường Vườn Lài': 'Quận 10',
      'Phường Hòa Hưng': 'Quận 10',
      
      // Quận 11 cũ
      'Phường Minh Phụng': 'Quận 11',
      'Phường Bình Thới': 'Quận 11',
      'Phường Hòa Bình': 'Quận 11',
      'Phường Phú Thọ': 'Quận 11',
      
      // Quận 12 cũ
      'Phường Đông Hưng Thuận': 'Quận 12',
      'Phường Trung Mỹ Tây': 'Quận 12',
      'Phường Tân Thới Hiệp': 'Quận 12',
      'Phường Thới An': 'Quận 12',
      'Phường An Phú Đông': 'Quận 12',
      
      // Quận Bình Tân cũ
      'Phường An Lạc': 'Quận Bình Tân',
      'Phường Bình Tân': 'Quận Bình Tân',
      'Phường Tân Tạo': 'Quận Bình Tân',
      'Phường Bình Trị Đông': 'Quận Bình Tân',
      'Phường Bình Hưng Hòa': 'Quận Bình Tân',
      
      // Quận Bình Thạnh cũ
      'Phường Gia Định': 'Quận Bình Thạnh',
      'Phường Bình Thạnh': 'Quận Bình Thạnh',
      'Phường Bình Lợi Trung': 'Quận Bình Thạnh',
      'Phường Thạnh Mỹ Tây': 'Quận Bình Thạnh',
      'Phường Bình Quới': 'Quận Bình Thạnh',
      
      // Quận Gò Vấp cũ
      'Phường Hạnh Thông': 'Quận Gò Vấp',
      'Phường An Nhơn': 'Quận Gò Vấp',
      'Phường Gò Vấp': 'Quận Gò Vấp',
      'Phường An Hội Đông': 'Quận Gò Vấp',
      'Phường Thông Tây Hội': 'Quận Gò Vấp',
      'Phường An Hội Tây': 'Quận Gò Vấp',
      
      // Quận Phú Nhuận cũ
      'Phường Đức Nhuận': 'Quận Phú Nhuận',
      'Phường Cầu Kiệu': 'Quận Phú Nhuận',
      'Phường Phú Nhuận': 'Quận Phú Nhuận',
      
      // Quận Tân Bình cũ
      'Phường Tân Sơn Hòa': 'Quận Tân Bình',
      'Phường Tân Sơn Nhất': 'Quận Tân Bình',
      'Phường Tân Hòa': 'Quận Tân Bình',
      'Phường Bảy Hiền': 'Quận Tân Bình',
      'Phường Tân Bình': 'Quận Tân Bình',
      'Phường Tân Sơn': 'Quận Tân Bình',
      
      // Quận Tân Phú cũ
      'Phường Tây Thạnh': 'Quận Tân Phú',
      'Phường Tân Sơn Nhì': 'Quận Tân Phú',
      'Phường Phú Thọ Hòa': 'Quận Tân Phú',
      'Phường Tân Phú': 'Quận Tân Phú',
      'Phường Phú Thạnh': 'Quận Tân Phú',
      
      // Thành phố Thủ Đức cũ
      'Phường Hiệp Bình': 'Thành phố Thủ Đức',
      'Phường Thủ Đức': 'Thành phố Thủ Đức',
      'Phường Tam Bình': 'Thành phố Thủ Đức',
      'Phường Linh Xuân': 'Thành phố Thủ Đức',
      'Phường Tăng Nhơn Phú': 'Thành phố Thủ Đức',
      'Phường Long Bình': 'Thành phố Thủ Đức',
      'Phường Long Phước': 'Thành phố Thủ Đức',
      'Phường Long Trường': 'Thành phố Thủ Đức',
      'Phường Cát Lái': 'Thành phố Thủ Đức',
      'Phường Bình Trưng': 'Thành phố Thủ Đức',
      'Phường Phước Long': 'Thành phố Thủ Đức',
      'Phường An Khánh': 'Thành phố Thủ Đức',
      'Phường Đông Hòa': 'Thành phố Thủ Đức',
      
      // Các phường/xã khác
      'Phường Dĩ An': 'Thành phố Dĩ An',
      'Phường Tân Đông Hiệp': 'Thành phố Dĩ An',
      'Phường An Phú': 'Thành phố Thuận An',
      'Phường Bình Hòa': 'Thành phố Thuận An',
      'Phường Lái Thiêu': 'Thành phố Thuận An',
      'Phường Thuận An': 'Thành phố Thuận An',
      'Phường Thuận Giao': 'Thành phố Thuận An',
      'Phường Thủ Dầu Một': 'Thành phố Thủ Dầu Một',
      'Phường Phú Lợi': 'Thành phố Thủ Dầu Một',
      'Phường Chánh Hiệp': 'Thành phố Thủ Dầu Một',
      'Phường Bình Dương': 'Thành phố Thủ Dầu Một',
      'Phường Hòa Lợi': 'Thành phố Bến Cát',
      'Phường Phú An': 'Thành phố Bến Cát',
      'Phường Tây Nam': 'Thành phố Bến Cát',
      'Phường Long Nguyên': 'Thành phố Bến Cát',
      'Phường Bến Cát': 'Thành phố Bến Cát',
      'Phường Chánh Phú Hòa': 'Thành phố Bến Cát',
      'Phường Vĩnh Tân': 'Thành phố Tân Uyên',
      'Phường Bình Cơ': 'Thành phố Tân Uyên',
      'Phường Tân Uyên': 'Thành phố Tân Uyên',
      'Phường Tân Hiệp': 'Thành phố Tân Uyên',
      'Phường Tân Khánh': 'Thành phố Tân Uyên',
      'Phường Vũng Tàu': 'Thành phố Vũng Tàu',
      'Phường Tam Thắng': 'Thành phố Vũng Tàu',
      'Phường Rạch Dừa': 'Thành phố Vũng Tàu',
      'Phường Phước Thắng': 'Thành phố Vũng Tàu',
      'Phường Long Hương': 'Thành phố Bà Rịa',
      'Phường Bà Rịa': 'Thành phố Bà Rịa',
      'Phường Tam Long': 'Thành phố Bà Rịa',
      'Phường Tân Hải': 'Thành phố Bà Rịa',
      'Phường Tân Phước': 'Thành phố Bà Rịa',
      'Phường Phú Mỹ': 'Thành phố Phú Mỹ',
      'Phường Tân Thành': 'Thành phố Phú Mỹ',
    };
    
    return wardToDistrictMap[wardName] || '';
  };

  // Load saved data when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem('createScheduleFormData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setScheduleData(parsedData);
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

  // Clear saved data when form is successfully submitted
  const clearSavedData = () => {
    localStorage.removeItem('createScheduleFormData');
  };

  const scheduleStatuses = [
    { value: '1', label: 'Lịch ưu tiên 1', color: 'text-red-600' },
    { value: '2', label: 'Lịch ưu tiên 2', color: 'text-orange-600' },
    { value: '3', label: 'Lịch ưu tiên 3', color: 'text-yellow-600' },
    { value: '13', label: 'Chờ', color: 'text-yellow-600' },
    { value: '16', label: 'Lịch bảo hành', color: 'text-green-600' },
    { value: '17', label: 'Khách hàng mới', color: 'text-blue-600' },
    { value: '18', label: 'Khách hàng quen', color: 'text-green-600' }
  ];

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/schedules', scheduleData);
      clearSavedData(); // Clear saved data after successful submission
      onClose();
      setScheduleData({
        workerId: '',
        date_book: '',
        district: '',
        phone_number: '',
        kind_work: '',
        status_cus: '17', // Mặc định là "Khách hàng mới"
        work_content: '', // Nội dung công việc
        work_note: '', // Ghi chú bổ sung
        flag_status: '1',
        from_cus: '1',
        name_cus: '',
        street: '',
        id_keyword_kind: '',
        id_key_location: '',
        id_keyword_action: '',
        member_read: ''
      });
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handleClose = () => {
    // Don't clear saved data when closing, so user can continue later
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-end items-start p-4 bg-black/0" onClick={handleClose}>
      <div className="flex overflow-hidden flex-col w-full max-w-2xl h-full max-h-screen bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Tạo lịch làm việc
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Điền thông tin để tạo lịch mới</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full transition-colors hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleCreateSchedule} className="p-6 space-y-6">
            {/* Thông tin chính - 3 cột */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Nội dung công việc */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Nội dung công việc <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={scheduleData.work_content}
                  onChange={(e) => setScheduleData({ ...scheduleData, work_content: e.target.value })}
                  className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors resize-none"
                  rows="4"
                  placeholder="Mô tả công việc cần làm"
                  required
                />
              </div>
              
              {/* Địa chỉ */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={scheduleData.street}
                  onChange={(e) => setScheduleData({ ...scheduleData, street: e.target.value })}
                  className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                  placeholder="Nhập địa chỉ chi tiết"
                  required
                />
                <select
                  value={scheduleData.district}
                  onChange={(e) => setScheduleData({ ...scheduleData, district: e.target.value })}
                  className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                  required
                >
                  <option value="">Chọn phường/xã</option>
                  {wardsData.wards.map((ward) => {
                    const oldDistrict = getOldDistrict(ward.name);
                    return (
                      <option key={ward.code} value={ward.name}>
                        {ward.name} {oldDistrict && `(${oldDistrict})`}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              {/* Số điện thoại */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={scheduleData.phone_number}
                  onChange={(e) => setScheduleData({ ...scheduleData, phone_number: e.target.value })}
                  className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                  placeholder="Nhập số điện thoại"
                  required
                />
                <input
                  type="text"
                  value={scheduleData.name_cus}
                  onChange={(e) => setScheduleData({ ...scheduleData, name_cus: e.target.value })}
                  className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                  placeholder="Tên khách hàng"
                  required
                />
              </div>
            </div>

            {/* Thông tin chi tiết - 2 cột */}
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
                    <label className="block mb-2 text-xs font-medium text-gray-700">
                      Trạng thái khách hàng <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {scheduleStatuses.map((status) => (
                        <label
                          key={status.value}
                          className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                            scheduleData.status_cus === status.value ? 'bg-blue-50 border border-blue-200' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="status_cus"
                            value={status.value}
                            checked={scheduleData.status_cus === status.value}
                            onChange={(e) => setScheduleData({ ...scheduleData, status_cus: e.target.value })}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            required
                          />
                          <span className={`text-sm ${status.color} font-medium`}>
                            {status.label}
                          </span>
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
                      value={scheduleData.kind_work}
                      onChange={(e) => setScheduleData({ ...scheduleData, kind_work: e.target.value })}
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                      required
                    >
                      <option value="">Chọn loại công việc</option>
                      <option value="1">Điện Nước</option>
                      <option value="2">Điện Lạnh</option>
                      <option value="3">Đồ gỗ</option>
                      <option value="4">Năng Lượng Mặt trời</option>
                      <option value="5">Xây Dựng</option>
                      <option value="6">Tài Xế</option>
                      <option value="7">Cơ Khí</option>
                      <option value="8">Điện - Điện Tử</option>
                      <option value="9">Văn Phòng</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Chọn thợ <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={scheduleData.workerId}
                      onChange={(e) => setScheduleData({ ...scheduleData, workerId: e.target.value })}
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                      required
                    >
                      <option value="">Chọn thợ</option>
                      {workers?.map((worker) => (
                        <option key={worker.id} value={worker.id}>
                          {worker.worker_full_name} ({worker.worker_code})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Ngày hẹn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={scheduleData.date_book}
                      onChange={(e) => setScheduleData({ ...scheduleData, date_book: e.target.value })}
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ghi chú bổ sung */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex justify-center items-center w-8 h-8 bg-amber-100 rounded-lg">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Ghi chú bổ sung</h3>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Ghi chú thêm
                </label>
                <textarea
                  value={scheduleData.work_note}
                  onChange={(e) => setScheduleData({ ...scheduleData, work_note: e.target.value })}
                  className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2.5 transition-colors resize-none"
                  rows="3"
                  placeholder="Nhập ghi chú bổ sung (không bắt buộc)"
                />
              </div>
            </div>

          {/* Nút điều khiển */}
          <div className="flex-shrink-0 px-6 pt-4 bg-white border-t border-gray-100">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium flex items-center justify-center shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Tạo lịch
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
} 