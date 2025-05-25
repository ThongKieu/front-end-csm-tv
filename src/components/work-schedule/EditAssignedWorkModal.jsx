import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const EditAssignedWorkModal = ({ work, onClose, onSave }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: '',
    work_content: '',
    name_cus: '',
    street: '',
    district: '',
    phone_number: '',
    work_note: '',
    date_book: '',
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (work) {
      setFormData({
        id: work.id,
        work_content: work.work_content || '',
        name_cus: work.name_cus || '',
        street: work.street || '',
        district: work.district || '',
        phone_number: work.phone_number || '',
        work_note: work.work_note || '',
        date_book: work.date_book || '',
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
      });
    }
  }, [work]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement API call to update work
      await onSave(formData);
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
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Chỉnh sửa lịch đã phân công
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung công việc
              </label>
              <textarea
                name="work_content"
                value={formData.work_content}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="status_cus"
                value={formData.status_cus}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getStatusOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên khách hàng
              </label>
              <input
                type="text"
                name="name_cus"
                value={formData.name_cus}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đường
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quận/Huyện
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thu nhập
              </label>
              <input
                type="number"
                name="income_total"
                value={formData.income_total}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chi phí
              </label>
              <input
                type="number"
                name="spending_total"
                value={formData.spending_total}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                VAT
              </label>
              <input
                type="number"
                name="vat"
                value={formData.vat}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thông tin VAT
              </label>
              <input
                type="text"
                name="info_vat"
                value={formData.info_vat}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Công nợ
              </label>
              <select
                name="debt"
                value={formData.debt}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Không có công nợ</option>
                <option value={1}>Có công nợ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái công việc
              </label>
              <select
                name="status_work"
                value={formData.status_work}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Chưa hoàn thành</option>
                <option value={1}>Đã hoàn thành</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú thực tế
            </label>
            <textarea
              name="real_note"
              value={formData.real_note}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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