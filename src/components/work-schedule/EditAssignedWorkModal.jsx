import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const EditAssignedWorkModal = ({ work, onClose, onSave }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    job_id: '',
    job_content: '',
    job_customer_name: '',
    job_customer_address: '',
    job_customer_phone: '',
    job_customer_note: '',
    job_appointment_date: '',
    job_type_id: '',
    job_source: '',
    job_appointment_time: '',
    job_priority: '',
    status_cus: '',
    income_total: 0,
    spending_total: 0,
    debt: 0,
    vat: 0,
    info_vat: '',
    real_note: '',
    status_work: 0,
    flag_check: 0,
    check_in: 0,
    admin_check: 0,
    status_admin_check: 0,
    work_ass_tip: 0,
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (work) {
      const initialData = {
        job_id: work.id,
        job_content: work.job_content || work.work_content || '',
        job_customer_name: work.job_customer_name || work.name_cus || '',
        job_customer_address: work.job_customer_address || work.street || '',
        job_customer_phone: work.job_customer_phone || work.phone_number || '',
        job_customer_note: work.job_customer_note || work.work_note || '',
        job_appointment_date: work.job_appointment_date || work.date_book || '',
        job_type_id: work.job_type_id || work.kind_work || '',
        job_source: work.job_source || '',
        job_appointment_time: work.job_appointment_time || '',
        job_priority: work.job_priority || '',
        status_cus: work.status_cus || 0,
        income_total: work.income_total || 0,
        spending_total: work.spending_total || 0,
        debt: work.debt || 0,
        vat: work.vat || 0,
        info_vat: work.info_vat || '',
        real_note: work.real_note || '',
        status_work: work.status_work || 0,
        flag_check: work.flag_check || 0,
        check_in: work.check_in || 0,
        admin_check: work.admin_check || 0,
        status_admin_check: work.status_admin_check || 0,
        work_ass_tip: work.work_ass_tip || 0,
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [work]);

  // Function to get only changed fields
  const getChangedFields = () => {
    const changedFields = {};
    
    Object.keys(formData).forEach(key => {
      if (key === 'id') return; // Skip ID field
      
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

      // Prepare data for API
      const updateData = {
        job_id: formData.job_id,
        ...changedFields
      };

      // Save work details và load API
      console.log('🔄 EditAssignedWorkModal: Calling onSave with data:', updateData);
      await onSave(updateData);
      console.log('✅ EditAssignedWorkModal: onSave completed successfully');
      onClose();
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật công việc');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const getStatusOptions = () => [
    { value: 0, label: 'Chưa Phân' },
    { value: 1, label: 'Thuê Bao / Không nghe' },
    { value: 2, label: 'Khách Nhắc 1 lần' },
    { value: 3, label: 'Khách nhắc nhiều lần' },
    { value: 4, label: 'Lịch Gấp/Ưu tiên' },
    { value: 5, label: 'Đang xử lý' },
    { value: 6, label: 'Lịch đã phân' },
    { value: 7, label: 'Lịch Hủy' },
    { value: 8, label: 'KXL' },
  ];

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-start pt-16 bg-black/25">
      <div className="bg-white rounded-lg p-4 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Chỉnh sửa lịch đã phân công
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
                Nội dung công việc
              </label>
              <textarea
                name="work_content"
                value={formData.work_content}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                rows="2"
                readOnly
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Trạng thái
              </label>
              <select
                name="status_cus"
                value={formData.status_cus}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              >
                {getStatusOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
                name="name_cus"
                value={formData.name_cus}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                readOnly
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Đường
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                readOnly
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Quận/Huyện
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Thu nhập
              </label>
              <input
                type="number"
                name="income_total"
                value={formData.income_total}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                min="0"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Chi phí
              </label>
              <input
                type="number"
                name="spending_total"
                value={formData.spending_total}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                VAT
              </label>
              <input
                type="number"
                name="vat"
                value={formData.vat}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                min="0"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Thông tin VAT
              </label>
              <input
                type="text"
                name="info_vat"
                value={formData.info_vat}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Công nợ
              </label>
              <select
                name="debt"
                value={formData.debt}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              >
                <option value={0}>Không có công nợ</option>
                <option value={1}>Có công nợ</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Trạng thái công việc
              </label>
              <select
                name="status_work"
                value={formData.status_work}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              >
                <option value={0}>Chưa hoàn thành</option>
                <option value={1}>Đã hoàn thành</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Ghi chú thực tế
            </label>
            <textarea
              name="real_note"
              value={formData.real_note}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              rows="2"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-brand-green to-brand-yellow rounded-md hover:from-green-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssignedWorkModal; 