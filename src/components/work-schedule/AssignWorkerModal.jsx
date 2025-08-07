import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignWorker, changeWorker, selectSelectedDate } from '@/store/slices/workSlice';
import { X, Phone } from 'lucide-react';
import Select from 'react-select';

const AssignWorkerModal = ({ work, workers = [], onClose, onAssign, isChanging = false }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedExtraWorker, setSelectedExtraWorker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const formatOptionLabel = (option) => (
    <div>
      <div>{option.label}</div>
      <div className="text-sm text-gray-500 flex items-center space-x-1">
        <Phone className="w-3 h-3" />
        <span>SĐT: {option.phone || 'Chưa có thông tin'}</span>
      </div>
    </div>
  );

  useEffect(() => {
    if (isChanging && work) {
      const mainWorker = workers.find(w => w.id === work.id_worker);
      const extraWorker = workers.find(w => w.id === work.id_phu);
      
      setSelectedWorker(mainWorker ? {
        value: mainWorker.id,
        label: `${mainWorker.worker_full_name} (${mainWorker.worker_code})`,
        phone: mainWorker.worker_phone_company
      } : null);
      
      setSelectedExtraWorker(extraWorker ? {
        value: extraWorker.id,
        label: `${extraWorker.worker_full_name} (${extraWorker.worker_code})`,
        phone: extraWorker.worker_phone_company
      } : null);
    }
  }, [work, isChanging, workers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isChanging) {
        await dispatch(changeWorker({
          workAssignment: work,
          worker: selectedWorker?.value || '',
          extraWorker: selectedExtraWorker?.value || '',
          authId: 1, // TODO: Get from auth context
        })).unwrap();
      } else {
        await dispatch(assignWorker({
          work,
          worker: selectedWorker?.value || '',
          extraWorker: selectedExtraWorker?.value || '',
          dateCheck: selectedDate,
          authId: 1, // TODO: Get from auth context
        })).unwrap();
      }
      onAssign(work);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi phân công thợ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50" onClick={onClose} >
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isChanging ? 'Đổi thợ' : 'Phân công thợ'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400  hover:text-gray-500 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Work Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin công việc</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">Nội dung:</span> {work.work_content}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Khách hàng:</span> {work.name_cus}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Địa chỉ:</span> {work.street}, {work.district}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">SĐT:</span> {work.phone_number}
            </p>
            {work.work_note && (
              <p className="text-gray-600">
                <span className="font-medium">Ghi chú:</span> {work.work_note}
              </p>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Thợ chính <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedWorker}
              onChange={setSelectedWorker}
              options={workerOptions}
              placeholder="Chọn thợ chính"
              isClearable
              isSearchable
              required
              className="react-select-container text-black"
              classNamePrefix="react-select"
              styles={customSelectStyles}
              formatOptionLabel={formatOptionLabel}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Thợ phụ
            </label>
            <Select
              value={selectedExtraWorker}
              onChange={setSelectedExtraWorker}
              options={workerOptions}
              placeholder="Chọn thợ phụ (không bắt buộc)"
              isClearable
              isSearchable
              className="react-select-container text-black"
              classNamePrefix="react-select"
              styles={customSelectStyles}
              formatOptionLabel={formatOptionLabel}
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
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-green to-brand-yellow rounded-md hover:from-green-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : isChanging ? 'Đổi thợ' : 'Phân công'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignWorkerModal;
