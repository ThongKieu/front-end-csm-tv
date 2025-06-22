import { useState, useEffect } from 'react';
import { X, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { assignWorker } from '@/store/slices/workSlice';
import Select from 'react-select';

const EditWorkModal = ({ work, onClose, onSave }) => {
  const dispatch = useDispatch();
  const workers = useSelector((state) => state.work.workers);
  const [formData, setFormData] = useState({
    id: '',
    work_content: '',
    name_cus: '',
    street: '',
    district: '',
    phone_number: '',
    work_note: '',
    date_book: '',
    kind_work: '',
    id_worker: '',
    id_phu: '',
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
        kind_work: work.kind_work || '',
        id_worker: work.id_worker || '',
        id_phu: work.id_phu || '',
      });
    }
  }, [work]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Save work details
      await onSave(formData);

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
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật công việc');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWorkerChange = (selectedOption, { name }) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : ''
    }));
  };

  const workerOptions = workers.map(worker => ({
    value: worker.id,
    label: `${worker.worker_full_name} (${worker.worker_code})`,
    phone: worker.worker_phone_company
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Chỉnh sửa công việc
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
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Nội dung công việc <span className="text-red-500">*</span>
              </label>
              <textarea
                name="work_content"
                value={formData.work_content}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Loại công việc <span className="text-red-500">*</span>
              </label>
              <select
                name="kind_work"
                value={formData.kind_work}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Tên khách hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name_cus"
                value={formData.name_cus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Đường <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Ngày đặt <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date_book"
              value={formData.date_book}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Thợ chính
              </label>
              <Select
                name="id_worker"
                value={workerOptions.find(option => option.value === formData.id_worker)}
                onChange={(option) => handleWorkerChange(option, { name: 'id_worker' })}
                options={workerOptions}
                isClearable
                placeholder="Tìm kiếm thợ chính..."
                styles={customSelectStyles}
                formatOptionLabel={option => (
                  <div>
                    <div>{option.label}</div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Phone className="w-3 h-3" />
                      <span>SĐT: {option.phone || 'Chưa có thông tin'}</span>
                    </div>
                  </div>
                )}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Thợ phụ
              </label>
              <Select
                name="id_phu"
                value={workerOptions.find(option => option.value === formData.id_phu)}
                onChange={(option) => handleWorkerChange(option, { name: 'id_phu' })}
                options={workerOptions}
                isClearable
                placeholder="Tìm kiếm thợ phụ..."
                styles={customSelectStyles}
                formatOptionLabel={option => (
                  <div>
                    <div>{option.label}</div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Phone className="w-3 h-3" />
                      <span>SĐT: {option.phone || 'Chưa có thông tin'}</span>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Ghi chú
            </label>
            <textarea
              name="work_note"
              value={formData.work_note}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 border border-red-200 rounded-md bg-red-50">
              {error}
            </div>
          )}

          <div className="flex justify-end mt-6 space-x-3">
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

export default EditWorkModal; 