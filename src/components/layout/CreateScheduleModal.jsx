'use client';

import { useState } from 'react';
import axios from 'axios';
import { X, Calendar, Clock, User, Phone, MapPin, FileText, Building2, Tag, Briefcase, CheckCircle2, AlertCircle, Star } from 'lucide-react';

export default function CreateScheduleModal({ isOpen, onClose, workers }) {
  const [scheduleData, setScheduleData] = useState({
    workerId: '',
    date_book: '',
    district: '',
    phone_number: '',
    kind_work: '',
    status_cus: '0',
    work_note: '',
    flag_status: '1',
    from_cus: '1',
    name_cus: '',
    street: '',
    id_keyword_kind: '',
    id_key_location: '',
    id_keyword_action: '',
    member_read: ''
  });

  const scheduleStatuses = [
    { value: '1', label: 'Lịch ưu tiên 1', color: 'text-red-600' },
    { value: '2', label: 'Lịch ưu tiên 2', color: 'text-orange-600' },
    { value: '3', label: 'Lịch ưu tiên 3', color: 'text-yellow-600' },
    // { value: '4', label: 'Ko nghe', color: 'text-gray-600' },
    // { value: '5', label: 'Khách làm rồi', color: 'text-green-600' },
    // { value: '6', label: 'Khách hẹn mai', color: 'text-blue-600' },
    // { value: '7', label: 'Hẹn hôm khác', color: 'text-blue-600' },
    // { value: '8', label: 'Sai số', color: 'text-red-600' },
    // { value: '9', label: 'Khách báo có thợ gọi rồi', color: 'text-purple-600' },
    // { value: '10', label: 'Trùng lịch A BC', color: 'text-red-600' },
    // { value: '11', label: 'Thợ A trả', color: 'text-orange-600' },
    // { value: '12', label: 'Kh báo không gọi', color: 'text-red-600' },
    { value: '13', label: 'Chờ', color: 'text-yellow-600' },
    // { value: '14', label: 'Mai làm tiếp', color: 'text-blue-600' },
    // { value: '15', label: 'Ngưng chờ làm tiếp', color: 'text-gray-600' },
    { value: '16', label: 'Lịch bảo hành', color: 'text-green-600' },
    { value: '17', label: 'Khách hàng mới', color: 'text-blue-600' },
    { value: '18', label: 'Khách hàng quen', color: 'text-green-600' }
  ];

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/schedules', scheduleData);
      onClose();
      setScheduleData({
        workerId: '',
        date_book: '',
        district: '',
        phone_number: '',
        kind_work: '',
        status_cus: '0',
        work_note: '',
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tạo lịch làm việc
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Điền thông tin để tạo lịch làm việc mới</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleCreateSchedule} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Cột trái - Thông tin cơ bản */}
            <div className="space-y-4">
              {/* Thông tin khách hàng */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-lg p-4 border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-1.5" />
                  Thông tin khách hàng
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tên khách hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={scheduleData.name_cus}
                      onChange={(e) => setScheduleData({ ...scheduleData, name_cus: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2"
                      placeholder="Nhập tên khách hàng"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={scheduleData.phone_number}
                      onChange={(e) => setScheduleData({ ...scheduleData, phone_number: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Trạng thái khách hàng <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
                      {scheduleStatuses.map((status) => (
                        <label
                          key={status.value}
                          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                            scheduleData.status_cus === status.value ? 'bg-blue-50' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="status_cus"
                            value={status.value}
                            checked={scheduleData.status_cus === status.value}
                            onChange={(e) => setScheduleData({ ...scheduleData, status_cus: e.target.value })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            required
                          />
                          <span className={`text-sm ${status.color}`}>
                            {status.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin công việc */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-50/50 rounded-lg p-4 border border-indigo-100">
                <h3 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center">
                  <Briefcase className="w-4 h-4 mr-1.5" />
                  Thông tin công việc
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Loại công việc <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={scheduleData.kind_work}
                      onChange={(e) => setScheduleData({ ...scheduleData, kind_work: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2"
                      required
                    >
                      <option value="">Chọn loại công việc</option>
                      <option value="1">Thi công trần</option>
                      <option value="2">Sửa chữa</option>
                      <option value="3">Bảo trì</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Chọn thợ <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={scheduleData.workerId}
                      onChange={(e) => setScheduleData({ ...scheduleData, workerId: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2"
                      required
                    >
                      <option value="">Chọn thợ</option>
                      {workers?.map((worker) => (
                        <option key={worker.id} value={worker.id}>
                          {worker.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải - Thời gian và địa điểm */}
            <div className="space-y-4">
              {/* Thời gian và địa điểm */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 rounded-lg p-4 border border-emerald-100">
                <h3 className="text-sm font-semibold text-emerald-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Thời gian & Địa điểm
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ngày hẹn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={scheduleData.date_book}
                      onChange={(e) => setScheduleData({ ...scheduleData, date_book: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={scheduleData.district}
                      onChange={(e) => setScheduleData({ ...scheduleData, district: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2"
                      placeholder="Nhập quận/huyện"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Địa chỉ chi tiết <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={scheduleData.street}
                      onChange={(e) => setScheduleData({ ...scheduleData, street: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2"
                      placeholder="Nhập địa chỉ chi tiết"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-50/50 rounded-lg p-4 border border-amber-100">
                <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-1.5" />
                  Ghi chú
                </h3>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Ghi chú công việc <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={scheduleData.work_note}
                    onChange={(e) => setScheduleData({ ...scheduleData, work_note: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm px-3 py-2"
                    rows="2"
                    placeholder="Nhập ghi chú công việc"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Nút điều khiển */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Tạo lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 