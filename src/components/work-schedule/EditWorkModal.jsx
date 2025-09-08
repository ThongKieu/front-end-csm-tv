import { useState, useEffect } from 'react';
import { X, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { assignWorker, updateWorkInList } from '@/store/slices/workSlice';
import Select from 'react-select';
import AddressAutocomplete from '@/components/ui/AddressAutocomplete';
import keywordsData from '../../data/keywords.json';
import actionsData from '../../data/actions.json';
import materialServicesData from '../../data/material_services.json';

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
    // Thêm các field cho dropdown chọn nội dung
    selected_keyword: '',
    selected_action: '',
    selected_material_service: '',
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm phân tích nội dung hiện tại để tách thành các phần
  const parseExistingContent = (content) => {
    if (!content) return { keyword: '', material: '', action: '' };
    
    const words = content.split(' ');
    let keyword = '';
    let material = '';
    let action = '';
    
    // Tìm keyword (hành động chính)
    for (const kw of keywordsData.keywords) {
      if (content.includes(kw.name)) {
        keyword = kw.name;
        break;
      }
    }
    
    // Tìm material/service
    for (const mat of materialServicesData.material_services) {
      if (content.includes(mat.name)) {
        material = mat.name;
        break;
      }
    }
    
    // Tìm action (đối tượng)
    for (const act of actionsData.actions) {
      if (content.includes(act.name)) {
        action = act.name;
        break;
      }
    }
    
    return { keyword, material, action };
  };

  // Hàm tự động cập nhật job_content khi 3 dropdown thay đổi
  const updateJobContent = (keyword, materialService, action) => {
    const parts = [];
    if (keyword) parts.push(keyword);
    if (materialService) parts.push(materialService);
    if (action) parts.push(action);
    
    const combinedContent = parts.join(" ");
    setFormData(prev => ({
      ...prev,
      job_content: combinedContent
    }));
  };

  useEffect(() => {
    if (work) {
      // Try to get ID from multiple possible fields
      const workId = work.id || work.job_id || work.work_id || work.job_code;
      
      if (!workId) {
        console.error('Work object:', work);
        throw new Error('Work object does not contain a valid ID');
      }

      // Get today's date for default
      const today = new Date().toISOString().split('T')[0];
      
      // Format date properly if it exists
      const formatDate = (dateStr) => {
        if (!dateStr) return today;
        if (dateStr.includes('T')) {
          return dateStr.split('T')[0];
        }
        return dateStr;
      };

      // Format time properly if it exists
      const formatTime = (timeStr) => {
        if (!timeStr) return '';
        if (timeStr.includes(':')) {
          return timeStr.substring(0, 5); // HH:MM format
        }
        return '';
      };

      // Phân tích nội dung hiện tại
      const existingContent = work.job_content || work.work_content || work.content || '';
      const parsedContent = parseExistingContent(existingContent);

      const initialData = {
        job_id: workId,
        job_content: existingContent,
        job_customer_name: work.job_customer_name || work.name_cus || work.customer_name || '',
        job_customer_address: work.job_customer_address || work.street || work.address || '',
        job_customer_phone: work.job_customer_phone || work.phone_number || work.phone || '',
        job_customer_note: work.job_customer_note || work.work_note || work.note || '',
        job_appointment_date: formatDate(work.job_appointment_date || work.date_book || work.appointment_date),
        job_type_id: work.job_type_id || work.kind_work || work.type_id || '1',
        job_source: work.job_source || work.source || 'call_center',
        job_appointment_time: formatTime(work.job_appointment_time || work.appointment_time),
        job_priority: work.job_priority || work.priority || work.priority_level || '',
        // Thêm các field đã phân tích
        selected_keyword: parsedContent.keyword,
        selected_action: parsedContent.action,
        selected_material_service: parsedContent.material,
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
      
      // Compare values (handle different data types and empty strings)
      const isChanged = currentValue !== originalValue && 
                       !(currentValue === '' && (originalValue === null || originalValue === undefined)) &&
                       !(originalValue === '' && (currentValue === null || currentValue === undefined));
      
      if (isChanged) {
        changedFields[key] = currentValue;
      }
    });
    
    return changedFields;
  };

  // Validate form data
  const validateForm = () => {
    const errors = [];
    
    if (!formData.job_content?.trim()) {
      errors.push('Nội dung công việc là bắt buộc');
    }
    
    if (!formData.job_customer_phone?.trim()) {
      errors.push('Số điện thoại khách hàng là bắt buộc');
    }
    
    if (!formData.job_customer_address?.trim()) {
      errors.push('Địa chỉ khách hàng là bắt buộc');
    }
    
    if (!formData.job_appointment_date) {
      errors.push('Ngày hẹn là bắt buộc');
    }
    
    if (formData.job_customer_phone && !/^[0-9]{10,11}$/.test(formData.job_customer_phone)) {
      errors.push('Số điện thoại phải có 10-11 chữ số');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form first
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        setLoading(false);
        return;
      }

      // Get only changed fields
      const changedFields = getChangedFields();
      
      if (Object.keys(changedFields).length === 0) {
        onClose();
        return;
      }
      
      if (!formData.job_id || formData.job_id === null || formData.job_id === undefined) {
        throw new Error('Job ID is required but not found');
      }

      // Prepare data for API - only send changed fields to avoid overwriting with empty values
      const updateData = {
        job_id: parseInt(formData.job_id),
        user_id: 1, // TODO: Get from auth context
        ...changedFields, // Only include changed fields
      };

      // Ensure proper data types
      if (updateData.job_type_id) {
        updateData.job_type_id = parseInt(updateData.job_type_id);
      }


      // Call our API route
      const response = await fetch('/api/works/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Cập nhật dữ liệu trong Redux store ngay lập tức
      const updatedWorkData = {
        // Chỉ cập nhật các trường đã thay đổi để tránh ghi đè dữ liệu không cần thiết
        ...changedFields,
        // Đảm bảo tất cả các trường quan trọng được cập nhật với giá trị mới nhất
        job_content: formData.job_content,
        job_customer_name: formData.job_customer_name,
        job_customer_address: formData.job_customer_address,
        job_customer_phone: formData.job_customer_phone,
        job_customer_note: formData.job_customer_note,
        job_appointment_date: formData.job_appointment_date,
        job_type_id: formData.job_type_id,
        job_source: formData.job_source,
        job_appointment_time: formData.job_appointment_time,
        job_priority: formData.job_priority,
        
        // Cập nhật các field để tương thích với JobCard
        priority: formData.job_priority, // Để tương thích với JobCard
        status: formData.job_priority === "cancelled" ? "cancelled" : 
               formData.job_priority === "no_answer" ? "no_answer" :
               formData.job_priority === "worker_return" ? "worker_return" : "pending",
        
        // Cập nhật thời gian
        updated_at: new Date().toISOString(),
      };

      // Cập nhật Redux store để UI phản ánh thay đổi ngay lập tức
      let reduxUpdateSuccess = false;
      try {
        
        dispatch(updateWorkInList({
          workId: parseInt(formData.job_id),
          updatedData: updatedWorkData
        }));
        reduxUpdateSuccess = true;
      } catch (error) {
        console.error('❌ Redux update failed:', error);
        reduxUpdateSuccess = false;
      }

      // Gọi onSave để trigger UI re-render và load dữ liệu từ API
      if (onSave && typeof onSave === 'function') {
        try {
          await onSave(true); // Luôn force server refresh
        } catch (error) {
          console.error('❌ EditWorkModal: Error loading server API data:', error);
          // Không throw error vì job đã được cập nhật thành công
        }
      }

      // Close modal after successful update
      onClose();
    } catch (err) {
      console.error('Update error:', err);
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
    <div className="flex fixed inset-0 z-50 justify-center items-start pt-16 bg-black/25" onClick={onClose}>
      <div className="bg-white rounded-lg p-4 w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
            {/* 3 dropdown để chọn nội dung */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">
                Nội dung công việc <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                {/* Keyword dropdown */}
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-gray-600">
                    Hành động chính
                  </label>
                  <select
                    value={formData.selected_keyword}
                    onChange={(e) => {
                      const selectedKeyword = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        selected_keyword: selectedKeyword
                      }));
                      updateJobContent(
                        selectedKeyword,
                        formData.selected_material_service,
                        formData.selected_action
                      );
                    }}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                  >
                    <option value="">Chọn hành động</option>
                    {keywordsData.keywords.map((keyword) => (
                      <option key={keyword.id} value={keyword.name}>
                        {keyword.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Material/Service dropdown */}
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-gray-600">
                    Vật liệu/Dịch vụ
                  </label>
                  <select
                    value={formData.selected_material_service}
                    onChange={(e) => {
                      const selectedMaterial = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        selected_material_service: selectedMaterial
                      }));
                      updateJobContent(
                        formData.selected_keyword,
                        selectedMaterial,
                        formData.selected_action
                      );
                    }}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                  >
                    <option value="">Chọn vật liệu</option>
                    {materialServicesData.material_services.map((material) => (
                      <option key={material.id} value={material.name}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action dropdown */}
                <div>
                  <label className="block mb-1.5 text-xs font-medium text-gray-600">
                    Đối tượng
                  </label>
                  <select
                    value={formData.selected_action}
                    onChange={(e) => {
                      const selectedAction = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        selected_action: selectedAction
                      }));
                      updateJobContent(
                        formData.selected_keyword,
                        formData.selected_material_service,
                        selectedAction
                      );
                    }}
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                  >
                    <option value="">Chọn đối tượng</option>
                    {actionsData.actions.map((action) => (
                      <option key={action.id} value={action.name}>
                        {action.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hiển thị nội dung đã ghép */}
              <div className="p-3 mt-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-medium text-gray-600">
                    Nội dung đã ghép:
                  </label>
                  {formData.job_content && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          selected_keyword: "",
                          selected_action: "",
                          selected_material_service: "",
                          job_content: ""
                        }));
                      }}
                      className="text-xs text-red-500 transition-colors hover:text-red-600"
                      title="Xóa tất cả"
                    >
                      × Xóa
                    </button>
                  )}
                </div>
                <div className="mt-1.5 p-2 bg-white rounded border border-gray-200 min-h-[2.5rem] flex items-center">
                  {formData.job_content ? (
                    <span className="text-sm font-medium text-gray-800">
                      {formData.job_content}
                    </span>
                  ) : (
                    <span className="text-sm italic text-gray-400">
                      Chọn từ 3 dropdown trên để tạo nội dung công việc
                    </span>
                  )}
                </div>
              </div>
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
                  { value: "", label: "KH Bình Thường", color: "text-gray-500" },
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
                      {priority.value === "" ? "Bình Thường" : 
                       priority.value === "medium" ? "Khách Quen" : 
                       priority.value === "high" ? "Lịch Ưu Tiên" : priority.label}
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