import { useState, useEffect } from 'react';
import { X, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { assignWorker } from '@/store/slices/workSlice';
import Select from 'react-select';
import AddressAutocomplete from '@/components/ui/AddressAutocomplete';

const EditWorkModal = ({ work, onClose, onSave }) => {
  const dispatch = useDispatch();
  const workers = useSelector((state) => state.work.workers);
  const [formData, setFormData] = useState({
    job_id: '',
    job_content: '',
    job_customer_name: '',
    job_customer_address: '',
    job_customer_phone: '',
    job_customer_note: '',
    job_appointment_date: '',
    job_type_id: '1', // Default to Điện Nước
    job_source: 'call_center', // Default value same as CreateScheduleModal
    job_appointment_time: '',
    job_priority: '', // Default to empty (normal schedule)
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (work) {
      // Try to get ID from multiple possible fields
      const workId = work.id || work.job_id || work.work_id || work.job_code;
      
      if (!workId) {
        throw new Error('Work object does not contain a valid ID');
      }

      // Get today's date for default
      const today = new Date().toISOString().split('T')[0];
      
      const initialData = {
        job_id: workId,
        job_content: work.job_content || work.work_content || '',
        job_customer_name: work.job_customer_name || work.name_cus || '',
        job_customer_address: work.job_customer_address || work.street || '',
        job_customer_phone: work.job_customer_phone || work.phone_number || '',
        job_customer_note: work.job_customer_note || work.work_note || '',
        job_appointment_date: work.job_appointment_date || work.date_book || today, // Default to existing date or today
        job_type_id: work.job_type_id || work.kind_work || '1', // Default to Điện Nước
        job_source: work.job_source || 'call_center', // Default to call_center if not set
        job_appointment_time: work.job_appointment_time || '', // Only show if exists
        job_priority: work.job_priority || work.priority || '', // Get existing priority or default to empty
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [work]);

  // Function to get only changed fields
  const getChangedFields = () => {
    const changedFields = {};
    
    Object.keys(formData).forEach(key => {
      if (key === 'id' || key === 'job_id') return; // Skip ID fields
      
      const currentValue = formData[key];
      const originalValue = originalData[key];
      
      // Compare values (handle different data types)
      if (currentValue !== originalValue) {
        changedFields[key] = currentValue;
      }
    });
    
    return changedFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get only changed fields
      const changedFields = getChangedFields();
      
      if (Object.keys(changedFields).length === 0) {
        onClose();
        return;
      }
      if (!formData.job_id || formData.job_id === null || formData.job_id === undefined) {
        throw new Error('Job ID is required but not found');
      }

      // Prepare data for API with proper validation and data types
      const updateData = {
        job_id: parseInt(formData.job_id), // Must be integer
        user_id: 1, // TODO: Get from auth context - needed for job_log_logged_by_id
        ...(changedFields.job_content && { job_content: changedFields.job_content }),
        ...(changedFields.job_appointment_date && { job_appointment_date: changedFields.job_appointment_date }),
        ...(changedFields.job_customer_address && { job_customer_address: changedFields.job_customer_address }),
        ...(changedFields.job_customer_phone && { job_customer_phone: changedFields.job_customer_phone }),
        ...(changedFields.job_type_id && { job_type_id: parseInt(changedFields.job_type_id) }), // Must be integer
        ...(changedFields.job_source && { job_source: changedFields.job_source }),
        ...(changedFields.job_appointment_time && { job_appointment_time: changedFields.job_appointment_time }),
        ...(changedFields.job_customer_name && { job_customer_name: changedFields.job_customer_name }),
        ...(changedFields.job_customer_note && { job_customer_note: changedFields.job_customer_note }),
        ...(changedFields.job_priority && { job_priority: changedFields.job_priority }),
      };

      // Call our API route instead of direct backend call
      const response = await fetch('/api/works/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // If worker is assigned, also assign the worker
      if (formData.id_worker) {
        await dispatch(assignWorker({
          work: { id: formData.id },
          worker: formData.id_worker,
          extraWorker: formData.id_phu,
          dateCheck: formData.date_book,
          authId: 1, // TODO: Get from auth context
        })).unwrap();
      }

      // Call onSave callback to refresh data
      if (onSave && typeof onSave === 'function') {
        await onSave();
      }

      // Close modal after successful update
      onClose();
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật công việc');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number - only allow numbers
    if (name === 'job_customer_phone') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleWorkerChange = (selectedOption, { name }) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : ''
    }));
  };

  const workerOptions = workers.map(worker => ({
    value: worker.id,
    label: `${worker.full_name} (${worker.type_code})`,
    phone: worker.phone
  }));

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '42px',
      borderColor: '#D1D5DB',
      '&:hover': {
        borderColor: '#9CA3AF'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#2563EB' : state.isFocused ? '#EFF6FF' : 'white',
      color: state.isSelected ? 'white' : '#1F2937',
      '&:hover': {
        backgroundColor: state.isSelected ? '#2563EB' : '#EFF6FF'
      }
    })
  };

  // Job sources options (same as CreateScheduleModal)
  const jobSources = [
    { value: "call_center", label: "Tổng đài" },
    { value: "app_customer", label: "App Khách hàng" },
    { value: "app_worker", label: "App Thợ" },
    { value: "website", label: "Website" },
    { value: "zalo", label: "Zalo" },
    { value: "facebook", label: "Facebook" },
    { value: "tiktok", label: "TikTok" },
    { value: "office", label: "Văn phòng" },
    { value: "other", label: "Khác" },
  ];

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/25" onClick={onClose}>
      <div className="bg-white rounded-lg p-4 w-full max-w-xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Chỉnh sửa công việc
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Nội dung công việc <span className="text-red-500">*</span>
              </label>
              <textarea
                name="job_content"
                value={formData.job_content}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                rows="2"
                maxLength="500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Loại công việc <span className="text-red-500">*</span>
              </label>
              <select
                name="job_type_id"
                value={formData.job_type_id}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Tên khách hàng
              </label>
              <input
                type="text"
                name="job_customer_name"
                value={formData.job_customer_name}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                maxLength="255"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="job_customer_phone"
                value={formData.job_customer_phone}
                maxLength="20"
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <AddressAutocomplete
                value={formData.job_customer_address}
                onChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    job_customer_address: value,
                  }));
                }}
                onSelect={(address) => {
                  setFormData(prev => ({
                    ...prev,
                    job_customer_address: address.description,
                  }));
                }}
                placeholder="Nhập địa chỉ để tìm kiếm tự động..."
                required={true}
                label="Địa chỉ"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Nguồn công việc <span className="text-red-500">*</span>
              </label>
              <select
                name="job_source"
                value={formData.job_source}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                required
              >
                <option value="">Chọn nguồn</option>
                {jobSources.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Ngày hẹn <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="job_appointment_date"
              value={formData.job_appointment_date}
              onChange={handleChange}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Only show time input if there's existing time or user wants to add time */}
            {(formData.job_appointment_time || originalData.job_appointment_time) && (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Giờ hẹn
                </label>
                <input
                  type="time"
                  name="job_appointment_time"
                  value={formData.job_appointment_time}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>
            )}

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Mức độ ưu tiên
              </label>
              <div className="flex gap-1.5">
                {[
                  { value: "", label: "Không chọn", color: "text-gray-500" },
                  { value: "medium", label: "Khách quen", color: "text-brand-green" },
                  { value: "high", label: "Lịch ưu tiên", color: "text-brand-yellow" },
                ].map((priority) => (
                  <label
                    key={priority.value}
                    className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-all duration-200 text-xs font-medium border ${
                      formData.job_priority === priority.value
                        ? priority.value === ""
                          ? "bg-gray-600 text-white border-gray-600 shadow-sm"
                          : priority.value === "medium"
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-red-600 text-white border-red-600 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="job_priority"
                      value={priority.value}
                      checked={formData.job_priority === priority.value}
                      onChange={(e) => {
                        const newPriority = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          job_priority: newPriority,
                        }));
                      }}
                      className="w-3 h-3 border-gray-300 text-brand-green focus:ring-brand-green"
                    />
                    <span className={formData.job_priority === priority.value ? "text-white" : priority.color}>
                      {priority.value === "" ? "Không chọn" : 
                       priority.value === "medium" ? "Khách quen" : 
                       priority.value === "high" ? "Lịch ưu tiên" : priority.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Ghi chú khách hàng
            </label>
            <textarea
              name="job_customer_note"
              value={formData.job_customer_note}
              onChange={handleChange}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              rows="2"
              maxLength="500"
              placeholder="Nhập ghi chú khách hàng"
            />
          </div>

          {error && (
            <div className="p-2.5 text-sm text-red-600 border border-red-200 rounded-md bg-red-50">
              {error}
            </div>
          )}

          {/* Nút điều khiển - Di chuyển lên trên */}
          <div className="pt-4 pb-2 border-t border-gray-200">
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="mr-2 -ml-1 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang lưu...
                  </span>
                ) : (
                  'Lưu thay đổi'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkModal; 