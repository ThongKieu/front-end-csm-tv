import React, { useState, useEffect, useMemo } from "react";
import { X, User, UserPlus, Search, CheckCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useSchedule } from "@/contexts/ScheduleContext";
import { API_URLS } from "@/config/constants";

const AssignWorkerModal = ({
  work,
  workers = [],
  onClose,
  onAssign,
  isChanging = false,
}) => {
  const [selectedMainWorker, setSelectedMainWorker] = useState(null);
  const [selectedExtraWorker, setSelectedExtraWorker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { refreshData } = useSchedule();

  const filteredWorkers = useMemo(() => {
    if (!searchTerm.trim()) return workers;

    return workers.filter(
      (worker) =>
        worker.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.type_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.phone?.includes(searchTerm)
    );
  }, [workers, searchTerm]);

  useEffect(() => {
    if (work && workers.length > 0) {
      setSelectedMainWorker(
        work.id_worker ? workers.find((w) => w.id === work.id_worker) : null
      );
      setSelectedExtraWorker(
        work.id_phu ? workers.find((w) => w.id === work.id_phu) : null
      );
    }
  }, [work, workers]);

  // Không cần fetch workers nữa vì đã được load từ DashboardClient
  // Workers đã có sẵn từ props và Redux store

  // Hàm gọi API phân công thợ
  const assignWorkerAPI = async (assignData) => {
    try {
      const response = await fetch(API_URLS.JOB_ASSIGN_WORKER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: assignData.job_id,
          worker_id: assignData.worker_id,
          role: assignData.role,
          user_id: assignData.user_id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!selectedMainWorker || !user?.id || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Phân công thợ chính
      const mainWorkerData = {
        job_id: work.id || work.job_id,
        worker_id: selectedMainWorker.id,
        role: "main",
        user_id: user.id,
      };
      await assignWorkerAPI(mainWorkerData);
      
      // Nếu có thợ phụ, phân công thợ phụ
      if (selectedExtraWorker) {
        const extraWorkerData = {
          job_id: work.id || work.job_id,
          worker_id: selectedExtraWorker.id,
          role: "assistant",
          user_id: user.id,
        };
        await assignWorkerAPI(extraWorkerData);
      }
      
      // Đóng modal trước, sau đó refresh data
      onClose();
      
      // Refresh data sau khi đóng modal (không await để không block UI)
      refreshData().then(() => {
        console.log('✅ Data refreshed successfully after worker assignment');
      }).catch(error => {
        console.error('❌ Error refreshing data after worker assignment:', error);
      });
    } catch (error) {
      console.error('Error assigning worker:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWorkerSelect = (worker, role) => {
    if (role === "main") {
      setSelectedMainWorker(worker);
    } else if (role === "extra") {
      setSelectedExtraWorker(worker);
    }
  };

  // Reset form khi modal đóng
  const handleClose = () => {
    setSelectedMainWorker(null);
    setSelectedExtraWorker(null);
    setSearchTerm("");
    setIsSubmitting(false);
    onClose();
  };

  const handleRemoveWorker = (role) => {
    if (role === "main") {
      setSelectedMainWorker(null);
    } else if (role === "extra") {
      setSelectedExtraWorker(null);
    }
  };

  const isWorkerSelected = (workerId) => {
    return (
      selectedMainWorker?.id === workerId ||
      selectedExtraWorker?.id === workerId
    );
  };

  if (!work) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex justify-center items-start pt-4 sm:pt-8 md:pt-20 backdrop-blur-sm bg-black/25"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg mx-2 sm:mx-4 max-h-[85vh] sm:max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 px-3 py-2 bg-gradient-to-r rounded-t-lg border-b border-gray-200 from-brand-green/10 to-brand-yellow/10">
          <div className="flex justify-between items-center">
            <div className="flex flex-1 items-center space-x-2 min-w-0">
              <UserPlus className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-gray-900">
                  {isChanging ? "Đổi thợ" : "Phân công thợ"}
                </h2>
                <p className="text-xs text-gray-600 truncate">
                  {work.job_code || "N/A"} -{" "}
                  {work.job_content || "Không có nội dung"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 rounded-full transition-all duration-200 hover:text-brand-yellow hover:bg-brand-yellow/10"
              aria-label="Đóng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          {/* Thợ chính */}
          <div className="space-y-1.5">
            <h3 className="flex items-center text-xs font-semibold text-gray-900">
              <User className="mr-1 w-3 h-3 text-brand-green" />
              Thợ chính <span className="text-red-500">*</span>
            </h3>

            {selectedMainWorker ? (
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="flex justify-center items-center w-6 h-6 bg-blue-500 rounded-full">
                      <span className="text-xs font-bold text-white">
                        {selectedMainWorker.full_name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {selectedMainWorker.full_name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Mã: {selectedMainWorker.type_code}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveWorker("main")}
                    className="p-0.5 text-red-500 rounded transition-colors hover:text-red-700 hover:bg-red-50"
                    title="Bỏ chọn"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2 text-center rounded-lg border-2 border-gray-300 border-dashed">
                <User className="mx-auto mb-1 w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500">Chưa chọn thợ chính</p>
              </div>
            )}
          </div>

          {/* Thợ phụ */}
          <div className="space-y-1.5">
            <h3 className="flex items-center text-xs font-semibold text-gray-900">
              <UserPlus className="mr-1 w-3 h-3 text-brand-yellow" />
              Thợ phụ <span className="text-gray-500">(Tùy chọn)</span>
            </h3>

            {selectedExtraWorker ? (
              <div className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="flex justify-center items-center w-6 h-6 bg-orange-500 rounded-full">
                      <span className="text-xs font-bold text-white">
                        {selectedExtraWorker.full_name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {selectedExtraWorker.full_name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Mã: {selectedExtraWorker.type_code}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveWorker("extra")}
                    className="p-0.5 text-red-500 rounded transition-colors hover:text-red-700 hover:bg-red-50"
                    title="Bỏ chọn"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2 text-center rounded-lg border-2 border-gray-300 border-dashed">
                <UserPlus className="mx-auto mb-1 w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500">Chưa chọn thợ phụ</p>
              </div>
            )}
          </div>

          {/* Danh sách thợ */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-gray-900">
              Danh sách thợ
            </h3>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 w-3 h-3 text-gray-400 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm thợ theo tên, mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-1 pr-2 pl-6 w-full text-xs rounded-lg border border-gray-300 focus:ring-1 focus:ring-brand-green focus:border-transparent"
              />
            </div>

            {/* Workers list */}
            <div className="overflow-y-auto space-y-1 max-h-32 sm:max-h-40">
              {filteredWorkers.length === 0 ? (
                <div className="py-2 text-xs text-center text-gray-500">
                  {searchTerm ? "Không tìm thấy thợ nào" : "Không có thợ nào"}
                </div>
              ) : (
                filteredWorkers.map((worker) => {
                  const isSelected = isWorkerSelected(worker.id);
                  const isMainWorker = selectedMainWorker?.id === worker.id;
                  const isExtraWorker = selectedExtraWorker?.id === worker.id;

                  return (
                    <div
                      key={worker.id}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? isMainWorker
                            ? "bg-blue-50 border-blue-200"
                            : "bg-orange-50 border-orange-200"
                          : "bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                      }`}
                      onClick={() => {
                        if (isMainWorker) {
                          handleRemoveWorker("main");
                        } else if (isExtraWorker) {
                          handleRemoveWorker("extra");
                        } else if (!selectedMainWorker) {
                          handleWorkerSelect(worker, "main");
                        } else if (
                          !selectedExtraWorker &&
                          worker.id !== selectedMainWorker.id
                        ) {
                          handleWorkerSelect(worker, "extra");
                        }
                      }}
                    >
                      <div className="flex justify-between items-center min-w-0">
                        <div className="flex flex-1 items-center space-x-2 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isMainWorker
                                ? "bg-blue-500"
                                : isExtraWorker
                                ? "bg-orange-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <span className="text-xs font-bold text-white">
                              {worker.full_name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {worker.full_name}
                              </p>
                              {isMainWorker && (
                                <span className="px-1 py-0.5 text-xs text-white rounded-full bg-blue-500 flex-shrink-0">
                                  Chính
                                </span>
                              )}
                              {isExtraWorker && (
                                <span className="px-1 py-0.5 text-xs text-white rounded-full bg-orange-500 flex-shrink-0">
                                  Phụ
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                              Mã: {worker.type_code}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          {isSelected ? (
                            <CheckCircle className={`w-3 h-3 ${isMainWorker ? 'text-blue-500' : 'text-orange-500'}`} />
                          ) : (
                            <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
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
          <div className="p-2 bg-gray-50 rounded-lg">
            <h3 className="mb-1 text-xs font-semibold text-gray-900">
              Thông tin công việc
            </h3>
            <div className="space-y-0.5 text-xs text-gray-600">
              <p>
                <span className="font-medium">Mã:</span>{" "}
                {work.job_code || "N/A"}
              </p>
              <p>
                <span className="font-medium">Nội dung:</span>{" "}
                {work.job_content || work.work_content || "Không có nội dung"}
              </p>
              <p>
                <span className="font-medium">Khách hàng:</span>{" "}
                {work.job_customer_name || work.name_cus || "N/A"}
              </p>
              <p>
                <span className="font-medium">Địa chỉ:</span>{" "}
                {work.job_customer_address || work.street || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-3 py-2 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleClose}
              className="flex-shrink-0 px-3 py-1 text-xs text-gray-600 bg-white rounded-lg border border-gray-300 transition-colors duration-200 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedMainWorker || isSubmitting}
              className={`px-3 py-1 text-xs text-white bg-green-500 rounded-lg transition-colors duration-200 flex-shrink-0 ${
                !selectedMainWorker || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-brand-green hover:bg-green-700"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full border border-white animate-spin border-t-transparent"></div>
                  <span>Đang phân công...</span>
                </div>
              ) : (
                <span>{isChanging ? "Cập nhật" : "Phân công"}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignWorkerModal;