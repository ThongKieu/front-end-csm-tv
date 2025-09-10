"use client";

import { useEffect, useCallback, useState, useMemo, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import WorkTable from "@/components/work-schedule/WorkTable";
import NewJobsList from "@/components/work-schedule/NewJobsList";
import DateNavigator from "@/components/ui/DateNavigator";
import { useSchedule } from '@/contexts/ScheduleContext';
import AssignWorkerModal from "@/components/work-schedule/AssignWorkerModal";
import EditWorkModal from "@/components/work-schedule/EditWorkModal";
import EditAssignedWorkModal from "@/components/work-schedule/EditAssignedWorkModal";
import { AlertCircle, Crown } from "lucide-react";
import {
  fetchWorkers,
  setSelectedDate,
  selectSelectedDate,
  selectAssignedWorks,
  selectUnassignedWorks,
  selectWorkers,
  selectLoading,
} from "@/store/slices/workSlice";
import { ROUTES } from "@/config/routes";

// Memoized components để tránh re-renders không cần thiết
const MemoizedWorkTable = memo(WorkTable);
const MemoizedNewJobsList = memo(NewJobsList);
const MemoizedAssignWorkerModal = memo(AssignWorkerModal);

export default function DashboardClient() {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const assignedWorks = useSelector(selectAssignedWorks);
  const unassignedWorks = useSelector(selectUnassignedWorks);
  // Sử dụng workers từ Redux thay vì ScheduleContext
  const workers = useSelector(selectWorkers);
  const loading = useSelector(selectLoading);
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  
  // Sử dụng ScheduleContext để gọi API thay vì gọi trực tiếp
  const { refreshData: scheduleRefreshData } = useSchedule();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isChangingWorker, setIsChangingWorker] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditAssignedModalOpen, setIsEditAssignedModalOpen] = useState(false);
  const [selectedWorkForEdit, setSelectedWorkForEdit] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Không cần fetchDataRef nữa vì sử dụng ScheduleContext

  // Function chung để refresh data cho tất cả modals - sử dụng ScheduleContext
  const refreshData = useCallback(async (showError = false) => {
    try {
      // Sử dụng ScheduleContext để gọi API
      await scheduleRefreshData(selectedDate);
      
      // Force re-render sau khi load data từ API
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('❌ refreshData: Error loading server API data:', error);
      if (showError) {
        alert('Lỗi tải dữ liệu từ server. Vui lòng thử lại.');
      }
    }
  }, [selectedDate, scheduleRefreshData]);
  
  // Không cần callback handleJobCreated nữa vì đã được xử lý trong ScheduleContext

  // Khôi phục ngày từ localStorage ngay khi component mount
  useEffect(() => {
    const savedDate = localStorage.getItem("selectedWorkDate");
    if (savedDate && savedDate !== selectedDate) {
      dispatch(setSelectedDate(savedDate));
    }
  }, []); // Chỉ chạy một lần khi component mount

  // Không cần tạo fetchDataRef nữa vì sử dụng ScheduleContext

  // Memoized handler functions để tránh re-renders
  const handleAssign = useCallback((work, isChanging = false) => {
    setSelectedWork(work);
    setIsChangingWorker(isChanging);
    setIsAssignModalOpen(true);
  }, []);

  const handleAssignSubmit = useCallback(
    async (updatedWork) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
          await scheduleRefreshData(selectedDate);
          // Force re-render sau khi load data từ API
          setRefreshTrigger(prev => {
            return prev + 1;
          });
        } catch (error) {
          console.error('❌ handleAssignSubmit: Error loading server API data:', error);
          window.location.reload();
        }
        
      } catch (error) {
        console.error('❌ handleAssignSubmit: Worker assignment failed:', error);
        alert(`Lỗi phân công thợ: ${error.message}`);
      }
    },
    [selectedDate, scheduleRefreshData, isAssignModalOpen]
  );

  const handleCloseAssignModal = useCallback(() => {
    setIsAssignModalOpen(false);
    setSelectedWork(null);
    setIsChangingWorker(false);
  }, []);

  const handleEdit = useCallback((work, isAssigned = false) => {
    setSelectedWorkForEdit(work);
    if (isAssigned) {
      setIsEditAssignedModalOpen(true);
    } else {
      setIsEditModalOpen(true);
    }
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedWorkForEdit(null);
  }, []);

  const handleCloseEditAssignedModal = useCallback(() => {
    setIsEditAssignedModalOpen(false);
    setSelectedWorkForEdit(null);
  }, []);

  // Function to refresh data after edit success - ALWAYS LOAD FROM SERVER API
  const handleEditSuccess = useCallback(async (forceServerRefresh = false) => {
    await refreshData(false);
  }, [refreshData]);

  const handleEditSubmit = useCallback(
    async (formData) => {
      try {
        // Validate job_id first
        if (
          !formData.job_id ||
          formData.job_id === null ||
          formData.job_id === undefined
        ) {
          throw new Error("Job ID is required but not found in form data");
        }

        // Prepare data with proper validation and data types
        const updateData = {
          job_id: parseInt(formData.job_id), // Must be integer
          user_id: 1, // TODO: Get from auth context - needed for job_log_logged_by_id
          ...(formData.job_content && { job_content: formData.job_content }),
          ...(formData.job_appointment_date && {
            job_appointment_date: formData.job_appointment_date,
          }),
          ...(formData.job_customer_address && {
            job_customer_address: formData.job_customer_address,
          }),
          ...(formData.job_customer_phone && {
            job_customer_phone: formData.job_customer_phone,
          }),
          ...(formData.job_type_id && {
            job_type_id: parseInt(formData.job_type_id),
          }), // Must be integer
          ...(formData.job_source && { job_source: formData.job_source }),
          ...(formData.job_appointment_time && {
            job_appointment_time: formData.job_appointment_time,
          }),
          ...(formData.job_customer_name && {
            job_customer_name: formData.job_customer_name,
          }),
          ...(formData.job_customer_note && {
            job_customer_note: formData.job_customer_note,
          }),
          ...(formData.job_priority && { job_priority: formData.job_priority }),
        };

        // Call API to update work
        const response = await fetch("/api/works/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const result = await response.json();
        // Refresh data after successful edit
        await scheduleRefreshData(selectedDate);

        handleCloseEditModal();
      } catch (error) {
        alert(`Lỗi lưu chỉnh sửa: ${error.message}`);
      }
    },
    [selectedDate, handleCloseEditModal]
  );

  const handleEditAssignedSubmit = useCallback(
    async (formData) => {
      try {
        // Call API to update assigned work
        const response = await fetch("/api/web/job/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Sử dụng function chung để refresh data
        await refreshData(false);
        
        handleCloseEditAssignedModal();
      } catch (error) {
        console.error('❌ handleEditAssignedSubmit: Assigned work update failed:', error);
        alert(`Lỗi lưu chỉnh sửa: ${error.message}`);
      }
    },
    [refreshData, handleCloseEditAssignedModal]
  );


  // Đảm bảo selectedDate luôn có giá trị
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date().toLocaleDateString("en-CA");
      dispatch(setSelectedDate(today));
    }
  }, [selectedDate, dispatch]);

  // Load workers nếu chưa có - chỉ load một lần
  useEffect(() => {
    if (!workers || workers.length === 0) {
      dispatch(fetchWorkers());
    }
  }, [dispatch]); // Loại bỏ workers khỏi dependencies để tránh gọi API liên tục

  // Fetch data khi selectedDate thay đổi hoặc chưa initialized
  useEffect(() => {
    if (selectedDate && !isInitialized) {
      const initializeData = async () => {
        try {
          setError(null);
          await scheduleRefreshData(selectedDate);
          setIsInitialized(true);
        } catch (err) {
          setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        }
      };

      initializeData();
    }
  }, [selectedDate, isInitialized, scheduleRefreshData]); // Sử dụng scheduleRefreshData thay vì fetchDataRef

  // Memoize date change handler với debounce
  const handleDateChange = useCallback(
    async (e) => {
      const newDate = e.target.value;
      // Clear cache cho ngày cũ trước khi thay đổi
      const { clearCacheForDate } = await import("@/store/slices/workSlice");
      dispatch(clearCacheForDate(selectedDate));

      dispatch(setSelectedDate(newDate));
      // Lưu ngày đã chọn vào localStorage
      localStorage.setItem("selectedWorkDate", newDate);

      // Reset initialization để fetch data mới
      setIsInitialized(false);
    },
    [dispatch, selectedDate]
  );


  // Memoize navigation handlers
  const handlePreviousDay = useCallback(async () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const newDate = prevDate.toISOString().split("T")[0];
    // Clear cache cho ngày cũ trước khi thay đổi
    const { clearCacheForDate } = await import("@/store/slices/workSlice");
    dispatch(clearCacheForDate(selectedDate));

    dispatch(setSelectedDate(newDate));
    // Lưu ngày đã chọn vào localStorage
    localStorage.setItem("selectedWorkDate", newDate);

    // Reset initialization để fetch data mới
    setIsInitialized(false);
  }, [selectedDate, dispatch]);

  const handleNextDay = useCallback(async () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const newDate = nextDate.toISOString().split("T")[0];

    // Clear cache cho ngày cũ trước khi thay đổi
    const { clearCacheForDate } = await import("@/store/slices/workSlice");
    dispatch(clearCacheForDate(selectedDate));

    dispatch(setSelectedDate(newDate));
    // Lưu ngày đã chọn vào localStorage
    localStorage.setItem("selectedWorkDate", newDate);

    setIsInitialized(false);
  }, [selectedDate, dispatch]);

  const handleToday = useCallback(async () => {
    const today = new Date().toLocaleDateString("en-CA");

    // Clear cache cho ngày cũ trước khi thay đổi
    const { clearCacheForDate } = await import("@/store/slices/workSlice");
    dispatch(clearCacheForDate(selectedDate));
    dispatch(setSelectedDate(today));
    // Lưu ngày đã chọn vào localStorage
    localStorage.setItem("selectedWorkDate", today);
    // Reset initialization để fetch data mới
    setIsInitialized(false);
  }, [dispatch, selectedDate]);

  // Effect để load dữ liệu khi assign modal đóng (chỉ một lần)
  useEffect(() => {
    if (!isAssignModalOpen && selectedWork === null) {
      // Load data từ server khi assign modal đóng
      scheduleRefreshData(selectedDate).catch(error => {
        console.error('❌ Error refreshing data after assign modal close:', error);
      });
    }
  }, [isAssignModalOpen, selectedWork, selectedDate, scheduleRefreshData]); // Thêm scheduleRefreshData vào dependencies

  // Effect để đảm bảo modal đóng khi cần thiết
  useEffect(() => {
    if (isAssignModalOpen && !selectedWork) {
      setIsAssignModalOpen(false);
    }
  }, [isAssignModalOpen, selectedWork]);


  // Loại bỏ refreshTrigger để tránh gọi API không cần thiết
  // Chỉ refresh khi thực sự cần thiết (thay đổi ngày, assign worker, etc.)

  // Lưu ngày đã chọn vào localStorage mỗi khi selectedDate thay đổi
  useEffect(() => {
    if (selectedDate) {
      localStorage.setItem("selectedWorkDate", selectedDate);
    }
  }, [selectedDate]);

  // Show loading only during initial load
  if (!isInitialized && loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gradient-to-br from-brand-green/10 to-brand-yellow/10">
        <div className="w-12 h-12 rounded-full border-b-2 animate-spin border-brand-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gradient-to-br from-brand-green/10 to-brand-yellow/10">
        <div className="text-center">
          <div className="flex items-center mb-4 space-x-3 text-brand-yellow">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Lỗi tải dữ liệu</h2>
          </div>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 w-full text-white rounded-md transition-colors bg-brand-green hover:bg-green-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] p-2 mx-auto">
      {/* Compact Header */}
      <div className="flex justify-between items-center p-0 mb-0 bg-white rounded-lg shadow-sm">
        {/* Left side - Title and loading */}
        <div className="flex gap-4 items-center">
          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-yellow">
            Phân công công việc
          </h1>
          {isRefreshing && (
            <div className="flex gap-2 items-center text-sm text-brand-green">
              <div className="w-4 h-4 rounded-full border-2 animate-spin border-brand-green border-t-transparent"></div>
              <span>Đang cập nhật...</span>
            </div>
          )}
        </div>

        {/* Right side - Date picker and admin button */}
        <div className="flex gap-2 items-center mr-[15%]">
          {/* Date Navigator - Sử dụng UI component */}
          <DateNavigator
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
            onToday={handleToday}
            compact={true}
            className="text-xs"
          />
          
          {user?.role === "admin" && (
            <Link
              href={ROUTES.ADMIN.DASHBOARD}
              className="flex items-center gap-1.5 px-2 py-1.5 text-white transition-all duration-200 rounded-md shadow-sm bg-gradient-to-r from-brand-green to-brand-yellow hover:from-green-700 hover:to-yellow-600 text-xs font-medium"
            >
              <Crown className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          )}
        </div>
      </div>
        <div className="flex flex-col flex-1 min-h-0">
          {/* BỎ StatusLegend */}
          {/* <StatusLegend /> */}
          <div className="grid flex-1 grid-cols-1 gap-2 mt-2 min-h-0 lg:grid-cols-2">
            {/* Unassigned Works */}
            <div className="flex overflow-hidden flex-col h-full bg-white rounded-lg border shadow-sm border-brand-green/20">
              <div className="p-1.5 bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 border-b border-brand-green/20 flex items-center justify-between">
                <div className="flex items-center">
                  <h2 className="flex items-center text-xs font-semibold text-brand-green">
                    <span className="mr-1 w-1 h-1 rounded-full bg-brand-green"></span>
                    ⏳ Chưa phân công ({unassignedWorks?.length || 0})
                  </h2>
                </div>
              </div>
              <div className="overflow-hidden flex-1 p-1">
                {unassignedWorks ? (
                  <MemoizedNewJobsList
                    jobs={unassignedWorks}
                    workers={workers}
                    onAssign={handleAssign}
                    onEdit={handleEdit}
                  />
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    <div className="text-center">
                      <p>Đang tải dữ liệu...</p>
                      <p className="mt-1 text-xs">
                        unassignedWorks:{" "}
                        {unassignedWorks === null
                          ? "null"
                          : unassignedWorks === undefined
                          ? "undefined"
                          : "empty"}
                      </p>
                      <p className="mt-1 text-xs">
                        selectedDate: {selectedDate}
                      </p>
                      <p className="mt-1 text-xs">
                        isInitialized: {isInitialized.toString()}
                      </p>
                      <p className="mt-1 text-xs">
                        loading: {loading.toString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Works */}
            <div className="flex overflow-hidden flex-col h-full bg-white rounded-lg border shadow-sm border-brand-green/20">
              <div className="p-1.5 bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 border-b border-brand-green/20 flex items-center justify-between">
                <div className="flex items-center">
                  <h2 className="flex items-center text-xs font-semibold text-brand-green">
                    <span className="mr-1 w-1 h-1 rounded-full bg-brand-green"></span>
                    ✅ Đã phân công ({assignedWorks?.length || 0})
                  </h2>
                </div>
              </div>
              <div className="overflow-hidden flex-1 p-1">
                {assignedWorks ? (
                  <MemoizedWorkTable works={assignedWorks} workers={workers} />
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    <div className="text-center">
                      <p>Đang tải dữ liệu...</p>
                      <p className="mt-1 text-xs">
                        assignedWorks: {JSON.stringify(assignedWorks)}
                      </p>
                      <p className="mt-1 text-xs">
                        selectedDate: {selectedDate}
                      </p>
                      <p className="mt-1 text-xs">
                        isInitialized: {isInitialized.toString()}
                      </p>
                      <p className="mt-1 text-xs">
                        loading: {loading.toString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      {isAssignModalOpen && selectedWork ? (
        <MemoizedAssignWorkerModal
          work={selectedWork}
          workers={workers}
          onClose={handleCloseAssignModal}
          onAssign={handleAssignSubmit}
          isChanging={isChangingWorker}
        />
      ) : null}

      {/* Edit Work Modal */}
      {isEditModalOpen && selectedWorkForEdit ? (
        <EditWorkModal
          work={selectedWorkForEdit}
          onClose={handleCloseEditModal}
          onSave={handleEditSuccess}
        />
      ) : null}

      {/* Edit Assigned Work Modal */}
      {isEditAssignedModalOpen && selectedWorkForEdit ? (
        <EditAssignedWorkModal
          work={selectedWorkForEdit}
          onClose={handleCloseEditAssignedModal}
          onSave={handleEditAssignedSubmit}
        />
      ) : null}
    </div>
  );
}
