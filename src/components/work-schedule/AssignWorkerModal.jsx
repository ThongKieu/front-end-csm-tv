import React, { useState, useEffect, useMemo } from 'react';
import { X, User, UserPlus, Search, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

const AssignWorkerModal = ({ work, workers = [], onClose, onAssign, isChanging = false }) => {
  const [selectedMainWorker, setSelectedMainWorker] = useState(null);
  const [selectedExtraWorker, setSelectedExtraWorker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useSelector((state) => state.auth);

  const filteredWorkers = useMemo(() => {
    if (!searchTerm.trim()) return workers;
    
    return workers.filter(worker => 
      worker.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.type_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.id?.toString().includes(searchTerm)
    );
  }, [workers, searchTerm]);
  
  useEffect(() => {
    if (work && workers.length > 0) {
      setSelectedMainWorker(work.id_worker ? workers.find(w => w.id === work.id_worker) : null);
      setSelectedExtraWorker(work.id_phu ? workers.find(w => w.id === work.id_phu) : null);
    }
  }, [work, workers]);

  const handleSubmit = async () => {
    if (!selectedMainWorker || !user?.id) {
      alert('Vui lòng chọn thợ chính và đảm bảo đã đăng nhập');
      return;
    }

    setIsSubmitting(true);
    try {
      const jobId = work.job_id || work.id;
      const today = new Date().toISOString().split('T')[0];
      
      // Chuẩn bị dữ liệu để gửi
      const workData = {
        work: work,
        worker: selectedMainWorker.id,
        extraWorker: selectedExtraWorker?.id || null,
        dateCheck: today,
        authId: user.id,
        // Priority sẽ được truyền từ NewJobsList thông qua onAssign
      };

      // Gọi callback để parent component xử lý
      await onAssign(workData);
      
      // Đóng modal
      onClose();
    } catch (error) {
      console.error('Error assigning worker:', error);
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
    <div className="fixed inset-0 z-[9999] flex justify-center items-center backdrop-blur-sm bg-black/25" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 px-6 py-4 bg-gradient-to-r rounded-t-xl border-b border-gray-200 from-brand-green/10 to-brand-yellow/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-brand-green/20">
                <UserPlus className="w-5 h-5 text-brand-green" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {isChanging ? 'Đổi thợ' : 'Phân công thợ'}
                </h2>
                <p className="text-sm text-gray-600">
                  Mã: {work.job_code || 'N/A'} - {work.job_content || 'Không có nội dung'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 rounded-full transition-all duration-200 hover:text-brand-yellow hover:bg-brand-yellow/10"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Thợ chính */}
          <div className="space-y-3">
            <h3 className="flex items-center text-sm font-semibold text-gray-900">
              <User className="mr-2 w-4 h-4 text-brand-green" />
              Thợ chính <span className="text-red-500">*</span>
            </h3>
            
            {selectedMainWorker ? (
              <div className="p-3 rounded-lg border bg-brand-green/10 border-brand-green/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-brand-green">
                      <span className="text-sm font-bold text-white">
                        {selectedMainWorker.full_name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedMainWorker.full_name}</p>
                      <p className="text-sm text-gray-600">Mã: {selectedMainWorker.type_code}</p>
                      <p className="text-sm text-gray-600">ID: {selectedMainWorker.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveWorker('main')}
                    className="p-1 text-red-500 rounded transition-colors hover:text-red-700 hover:bg-red-50"
                    title="Bỏ chọn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center rounded-lg border-2 border-gray-300 border-dashed">
                <User className="mx-auto mb-2 w-8 h-8 text-gray-400" />
                <p className="text-gray-500">Chưa chọn thợ chính</p>
              </div>
            )}
          </div>

          {/* Thợ phụ */}
          <div className="space-y-3">
            <h3 className="flex items-center text-sm font-semibold text-gray-900">
              <UserPlus className="mr-2 w-4 h-4 text-brand-yellow" />
              Thợ phụ <span className="text-gray-500">(Tùy chọn)</span>
            </h3>
            
            {selectedExtraWorker ? (
              <div className="p-3 rounded-lg border bg-brand-yellow/10 border-brand-yellow/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-brand-yellow">
                      <span className="text-sm font-bold text-white">
                        {selectedExtraWorker.full_name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedExtraWorker.full_name}</p>
                      <p className="text-sm text-gray-600">Mã: {selectedExtraWorker.type_code}</p>
                      <p className="text-sm text-gray-600">ID: {selectedExtraWorker.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveWorker('extra')}
                    className="p-1 text-red-500 rounded transition-colors hover:text-red-700 hover:bg-red-50"
                    title="Bỏ chọn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center rounded-lg border-2 border-gray-300 border-dashed">
                <UserPlus className="mx-auto mb-2 w-8 h-8 text-gray-400" />
                <p className="text-gray-500">Chưa chọn thợ phụ</p>
              </div>
            )}
          </div>

          {/* Danh sách thợ */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Danh sách thợ</h3>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm thợ theo tên, mã hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>

            {/* Workers list */}
            <div className="overflow-y-auto space-y-2 max-h-60">
              {filteredWorkers.length === 0 ? (
                <div className="py-4 text-center text-gray-500">
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
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
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
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isMainWorker ? 'bg-brand-green' : isExtraWorker ? 'bg-brand-yellow' : 'bg-gray-300'
                          }`}>
                            <span className="text-sm font-bold text-white">
                              {worker.full_name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900">{worker.full_name}</p>
                              {isMainWorker && (
                                <span className="px-2 py-1 text-xs text-white rounded-full bg-brand-green">
                                  Chính
                                </span>
                              )}
                              {isExtraWorker && (
                                <span className="px-2 py-1 text-xs text-white rounded-full bg-brand-yellow">
                                  Phụ
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">Mã: {worker.type_code}</p>
                            <p className="text-sm text-gray-600">ID: {worker.id}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {isSelected ? (
                            <CheckCircle className="w-5 h-5 text-brand-green" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
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
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Thông tin công việc</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Mã:</span> {work.job_code || 'N/A'}</p>
              <p><span className="font-medium">Nội dung:</span> {work.job_content || work.work_content || 'Không có nội dung'}</p>
              <p><span className="font-medium">Khách hàng:</span> {work.job_customer_name || work.name_cus || 'N/A'}</p>
              <p><span className="font-medium">Địa chỉ:</span> {work.job_customer_address || work.street || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-white rounded-lg border border-gray-300 transition-colors duration-200 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedMainWorker || isSubmitting}
              className={`px-6 py-2 text-white rounded-lg transition-colors duration-200 ${
                !selectedMainWorker || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-brand-green hover:bg-green-700'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
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