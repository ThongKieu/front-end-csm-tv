import React, { useState, useEffect, useMemo } from 'react';
import { X, User, UserPlus, Search, CheckCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkers } from '@/store/slices/workSlice';

const AssignWorkerModal = ({ work, workers = [], onClose, onAssign, isChanging = false }) => {
  const [selectedMainWorker, setSelectedMainWorker] = useState(null);
  const [selectedExtraWorker, setSelectedExtraWorker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const filteredWorkers = useMemo(() => {
    if (!searchTerm.trim()) return workers;
    
    return workers.filter(worker => 
      worker.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.type_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.phone?.includes(searchTerm)
    );
  }, [workers, searchTerm]);
  
  useEffect(() => {
    if (work && workers.length > 0) {
      console.log('🔄 AssignWorkerModal: Setting selected workers for work:', work);
      setSelectedMainWorker(work.id_worker ? workers.find(w => w.id === work.id_worker) : null);
      setSelectedExtraWorker(work.id_phu ? workers.find(w => w.id === work.id_phu) : null);
      console.log('🔄 AssignWorkerModal: Selected main worker:', work.id_worker ? workers.find(w => w.id === work.id_worker) : null);
      console.log('🔄 AssignWorkerModal: Selected extra worker:', work.id_phu ? workers.find(w => w.id === work.id_phu) : null);
    }
  }, [work, workers]);

  // Chỉ fetch workers khi thực sự cần thiết
  useEffect(() => {
    // Chỉ fetch nếu không có workers hoặc workers rỗng
    if (!workers || workers.length === 0) {
      // Chuẩn bị job data để gửi nếu có work
      const jobData = work ? {
        job_content: work.job_content || work.work_content,
        job_appointment_date: work.job_appointment_date || work.appointment_date,
        job_appointment_time: work.job_appointment_time || work.appointment_time,
      } : null;
      
      // Chỉ fetch nếu có đủ thông tin hoặc không có job data
      if (jobData && (jobData.job_content || jobData.job_appointment_date)) {
        dispatch(fetchWorkers(jobData));
      } else {
        dispatch(fetchWorkers());
      }
    } 
  }, [work, workers, dispatch]);

  // Hàm gọi API phân công thợ
  const assignWorkerAPI = async (assignData) => {
    try {
      console.log('🔄 AssignWorkerModal: Calling assign worker API with data:', assignData);
      
      const response = await fetch('/api/works/assign-worker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          work: {
            id: assignData.job_id
          },
          worker: assignData.worker_id,
          role: assignData.role,
          authId: assignData.user_id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ AssignWorkerModal: API response:', result);
      return result;
    } catch (error) {
      console.error('❌ AssignWorkerModal: API error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!selectedMainWorker || !user?.id) {
      alert('Vui lòng chọn thợ chính và đảm bảo đã đăng nhập');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('🔄 AssignWorkerModal: Starting worker assignment process');
      
      // Phân công thợ chính
      const mainWorkerData = {
        job_id: work.id || work.job_id,
        worker_id: selectedMainWorker.id,
        role: 'main',
        user_id: user.id,
      };
      await assignWorkerAPI(mainWorkerData);
      console.log('✅ AssignWorkerModal: Main worker assigned successfully');
      
      // Nếu có thợ phụ, phân công thợ phụ
      if (selectedExtraWorker) {
        const extraWorkerData = {
          job_id: work.id || work.job_id,
          worker_id: selectedExtraWorker.id,
          role: 'assistant',
          user_id: user.id,
        };
        await assignWorkerAPI(extraWorkerData);
        console.log('✅ AssignWorkerModal: Extra worker assigned successfully');
      }
      
      console.log('✅ AssignWorkerModal: All workers assigned successfully');
      
      // Đóng modal trước
      console.log('🔄 AssignWorkerModal: Closing modal');
      onClose();
      
      // Gọi callback để parent component load data từ server
      if (onAssign) {
        console.log('🔄 AssignWorkerModal: Calling onAssign callback');
        await onAssign({
          work: work,
          mainWorker: selectedMainWorker,
          extraWorker: selectedExtraWorker,
        });
        console.log('✅ AssignWorkerModal: onAssign callback completed');
      }
      
    } catch (error) {
      console.error('❌ AssignWorkerModal: Error assigning worker:', error);
      alert('Có lỗi xảy ra khi phân công thợ. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWorkerSelect = (worker, role) => {
    if (role === 'main') {
      setSelectedMainWorker(worker);
    } else if (role === 'extra') {
      setSelectedExtraWorker(worker);
    }
  };

  // Reset form khi modal đóng
  const handleClose = () => {
    setSelectedMainWorker(null);
    setSelectedExtraWorker(null);
    setSearchTerm('');
    setIsSubmitting(false);
    onClose();
  };

  const handleRemoveWorker = (role) => {
    if (role === 'main') {
      setSelectedMainWorker(null);
    } else if (role === 'extra') {
      setSelectedExtraWorker(null);
    }
  };

  const isWorkerSelected = (workerId) => {
    return selectedMainWorker?.id === workerId || selectedExtraWorker?.id === workerId;
  };

  if (!work) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-start pt-16 backdrop-blur-sm bg-black/25" onClick={handleClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 px-4 py-3 bg-gradient-to-r rounded-t-lg border-b border-gray-200 from-brand-green/10 to-brand-yellow/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-brand-green" />
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {isChanging ? 'Đổi thợ' : 'Phân công thợ'}
                </h2>
                <p className="text-xs text-gray-600 truncate max-w-64">
                  {work.job_code || 'N/A'} - {work.job_content || 'Không có nội dung'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 text-gray-400 rounded-full transition-all duration-200 hover:text-brand-yellow hover:bg-brand-yellow/10"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Thợ chính */}
          <div className="space-y-2">
            <h3 className="flex items-center text-sm font-semibold text-gray-900">
              <User className="mr-1.5 w-3.5 h-3.5 text-brand-green" />
              Thợ chính <span className="text-red-500">*</span>
            </h3>
            
            {selectedMainWorker ? (
              <div className="p-2.5 rounded-lg border bg-brand-green/10 border-brand-green/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex justify-center items-center w-8 h-8 rounded-full bg-brand-green">
                      <span className="text-xs font-bold text-white">
                        {selectedMainWorker.full_name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedMainWorker.full_name}</p>
                      <p className="text-xs text-gray-600">Mã: {selectedMainWorker.type_code}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveWorker('main')}
                    className="p-1 text-red-500 rounded transition-colors hover:text-red-700 hover:bg-red-50"
                    title="Bỏ chọn"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 text-center rounded-lg border-2 border-gray-300 border-dashed">
                <User className="mx-auto mb-1.5 w-6 h-6 text-gray-400" />
                <p className="text-sm text-gray-500">Chưa chọn thợ chính</p>
              </div>
            )}
          </div>

          {/* Thợ phụ */}
          <div className="space-y-2">
            <h3 className="flex items-center text-sm font-semibold text-gray-900">
              <UserPlus className="mr-1.5 w-3.5 h-3.5 text-brand-yellow" />
              Thợ phụ <span className="text-gray-500">(Tùy chọn)</span>
            </h3>
            
            {selectedExtraWorker ? (
              <div className="p-2.5 rounded-lg border bg-brand-yellow/10 border-brand-yellow/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex justify-center items-center w-8 h-8 rounded-full bg-brand-yellow">
                      <span className="text-xs font-bold text-white">
                        {selectedExtraWorker.full_name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedExtraWorker.full_name}</p>
                      <p className="text-xs text-gray-600">Mã: {selectedExtraWorker.type_code}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveWorker('extra')}
                    className="p-1 text-red-500 rounded transition-colors hover:text-red-700 hover:bg-red-50"
                    title="Bỏ chọn"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 text-center rounded-lg border-2 border-gray-300 border-dashed">
                <UserPlus className="mx-auto mb-1.5 w-6 h-6 text-gray-400" />
                <p className="text-sm text-gray-500">Chưa chọn thợ phụ</p>
              </div>
            )}
          </div>

          {/* Danh sách thợ */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Danh sách thợ</h3>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 w-3.5 h-3.5 text-gray-400 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm thợ theo tên, mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-1.5 pr-3 pl-8 w-full text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>

            {/* Workers list */}
            <div className="overflow-y-auto space-y-1.5 max-h-48">
              {filteredWorkers.length === 0 ? (
                <div className="py-3 text-sm text-center text-gray-500">
                  {searchTerm ? 'Không tìm thấy thợ nào' : 'Không có thợ nào'}
                </div>
              ) : (
                filteredWorkers.map((worker) => {
                  const isSelected = isWorkerSelected(worker.id);
                  const isMainWorker = selectedMainWorker?.id === worker.id;
                  const isExtraWorker = selectedExtraWorker?.id === worker.id;
                  
                  return (
                    <div
                      key={worker.id}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? isMainWorker
                            ? 'bg-brand-green/10 border-brand-green/30'
                            : 'bg-brand-yellow/10 border-brand-yellow/30'
                          : 'bg-gray-50 border-gray-200 hover:border-brand-green/30 hover:bg-brand-green/5'
                      }`}
                      onClick={() => {
                        if (isMainWorker) {
                          handleRemoveWorker('main');
                        } else if (isExtraWorker) {
                          handleRemoveWorker('extra');
                        } else if (!selectedMainWorker) {
                          handleWorkerSelect(worker, 'main');
                        } else if (!selectedExtraWorker && worker.id !== selectedMainWorker.id) {
                          handleWorkerSelect(worker, 'extra');
                        }
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isMainWorker ? 'bg-brand-green' : isExtraWorker ? 'bg-brand-yellow' : 'bg-gray-300'
                          }`}>
                            <span className="text-xs font-bold text-white">
                              {worker.full_name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-1.5">
                              <p className="text-sm font-medium text-gray-900">{worker.full_name}</p>
                              {isMainWorker && (
                                <span className="px-1.5 py-0.5 text-xs text-white rounded-full bg-brand-green">
                                  Chính
                                </span>
                              )}
                              {isExtraWorker && (
                                <span className="px-1.5 py-0.5 text-xs text-white rounded-full bg-brand-yellow">
                                  Phụ
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">Mã: {worker.type_code}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {isSelected ? (
                            <CheckCircle className="w-4 h-4 text-brand-green" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Thông tin công việc */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="mb-1.5 text-sm font-semibold text-gray-900">Thông tin công việc</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">Mã:</span> {work.job_code || 'N/A'}</p>
              <p><span className="font-medium">Nội dung:</span> {work.job_content || work.work_content || 'Không có nội dung'}</p>
              <p><span className="font-medium">Khách hàng:</span> {work.job_customer_name || work.name_cus || 'N/A'}</p>
              <p><span className="font-medium">Địa chỉ:</span> {work.job_customer_address || work.street || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-4 py-3 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleClose}
              className="px-3 py-1.5 text-sm text-gray-600 bg-white rounded-lg border border-gray-300 transition-colors duration-200 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedMainWorker || isSubmitting}
              className={`px-4 py-1.5 text-sm text-white rounded-lg transition-colors duration-200 ${
                !selectedMainWorker || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-brand-green hover:bg-green-700'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <span>{isChanging ? 'Cập nhật' : 'Phân công'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignWorkerModal;