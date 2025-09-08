"use client";

import { useEffect, useCallback, useState, useMemo, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import WorkTable from "@/components/work-schedule/WorkTable";
import NewJobsList from "@/components/work-schedule/NewJobsList";
import WorkHistory from "@/components/dashboard/WorkHistory";
import DateNavigator from "@/components/ui/DateNavigator";
import { useSchedule } from '@/contexts/ScheduleContext';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import("@/components/dashboard/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="mx-auto mb-2 w-8 h-8 rounded-full border-b-2 animate-spin border-brand-green"></div>
        <p className="text-sm text-gray-600">Đang tải bản đồ...</p>
      </div>
    </div>
  )
});
import AssignWorkerModal from "@/components/work-schedule/AssignWorkerModal";
import EditWorkModal from "@/components/work-schedule/EditWorkModal";
import EditAssignedWorkModal from "@/components/work-schedule/EditAssignedWorkModal";
import { AlertCircle, Crown, Filter } from "lucide-react";
import {
  fetchAssignedWorks,
  fetchUnassignedWorks,
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
  const [viewMode, setViewMode] = useState("list");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  // Sử dụng ScheduleContext để nhận thông báo khi có job mới được tạo
  const { setJobCreatedCallback } = useSchedule();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Đăng ký callback khi có job mới được tạo
  useEffect(() => {
    const handleJobCreated = async () => {
      // Đợi một chút để API hoàn tất
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load data từ server để lấy job mới từ API
      if (fetchDataRef.current) {
        try {
          await fetchDataRef.current(selectedDate, false);
          
          // Force re-render sau khi load data từ server
          setRefreshTrigger(prev => {
            return prev + 1;
          });
        } catch (error) {
          console.error('❌ DashboardClient: Server refresh failed:', error);
          // Không throw error để tránh crash app
        }
      }
    };
    
    setJobCreatedCallback(handleJobCreated);
    
    return () => {
      setJobCreatedCallback(null);
    };
  }, [setJobCreatedCallback, selectedDate]);
  const [copiedWorkId, setCopiedWorkId] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isChangingWorker, setIsChangingWorker] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditAssignedModalOpen, setIsEditAssignedModalOpen] = useState(false);
  const [selectedWorkForEdit, setSelectedWorkForEdit] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Sử dụng ref để tránh re-create function
  const fetchDataRef = useRef();

  // Khôi phục ngày từ localStorage ngay khi component mount
  useEffect(() => {
    const savedDate = localStorage.getItem("selectedWorkDate");
    if (savedDate && savedDate !== selectedDate) {
      dispatch(setSelectedDate(savedDate));
    }
  }, []); // Chỉ chạy một lần khi component mount

  // Tạo fetchData function một lần và lưu vào ref - LUÔN LOAD TỪ API
  useEffect(() => {
    fetchDataRef.current = async (date, showError = true) => {
      try {
        console.log('🔄 fetchDataRef: Starting API data fetch for date:', date);
        setIsRefreshing(true);
        if (showError) {
          setError(null);
        }

        // Luôn load data từ server API để đảm bảo có data mới nhất
        console.log('🔄 fetchDataRef: Loading assigned works...');
        await dispatch(fetchAssignedWorks(date));
        console.log('✅ fetchDataRef: Assigned works loaded');
        
        console.log('🔄 fetchDataRef: Loading unassigned works...');
        await dispatch(fetchUnassignedWorks(date));
        console.log('✅ fetchDataRef: Unassigned works loaded');

        console.log('✅ fetchDataRef: All API data fetch completed successfully');
      } catch (err) {
        console.error("❌ fetchDataRef: Error fetching API data:", err);
        if (showError) {
          setError("Không thể tải dữ liệu từ API. Vui lòng thử lại sau.");
        }
        // Không throw error để tránh crash app
      } finally {
        setIsRefreshing(false);
      }
    };
  }, [dispatch]);

  // Memoized handler functions để tránh re-renders
  const handleAssign = useCallback((work, isChanging = false) => {
    setSelectedWork(work);
    setIsChangingWorker(isChanging);
    setIsAssignModalOpen(true);
  }, []);

  const handleAssignSubmit = useCallback(
    async (updatedWork) => {
      try {
        console.log('🔄 handleAssignSubmit: Starting worker assignment');
        console.log('🔄 handleAssignSubmit: Updated work data:', updatedWork);
        
        // Đợi một chút để API hoàn tất
        console.log('🔄 handleAssignSubmit: Waiting for API to complete...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Luôn load data từ server API để đảm bảo có data mới nhất
        if (fetchDataRef.current) {
          console.log('🔄 handleAssignSubmit: Loading fresh data from server API');
          try {
            await fetchDataRef.current(selectedDate, false);
            console.log('✅ handleAssignSubmit: Server API data loaded successfully');
            
            // Force re-render sau khi load data từ API
            setRefreshTrigger(prev => {
              console.log('🔄 handleAssignSubmit: Refresh trigger after API load:', prev + 1);
              return prev + 1;
            });
          } catch (error) {
            console.error('❌ handleAssignSubmit: Error loading server API data:', error);
            // Không throw error để tránh crash modal
          }
        }
        
      } catch (error) {
        console.error('❌ handleAssignSubmit: Worker assignment failed:', error);
        alert(`Lỗi phân công thợ: ${error.message}`);
      } finally {
        // Reset state (modal đã được đóng trong AssignWorkerModal)
        console.log('🔄 handleAssignSubmit: Resetting state');
        setSelectedWork(null);
        setIsChangingWorker(false);
      }
    },
    [selectedDate]
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
    try {
      // Force re-render component để trigger UI update
      setRefreshTrigger(prev => prev + 1);
      
      // Luôn load từ server API để đảm bảo có data mới nhất
      if (fetchDataRef.current) {
        try {
          await fetchDataRef.current(selectedDate, false);
          // Force re-render lần nữa sau khi load data từ API
          setRefreshTrigger(prev => {
            return prev + 1;
          });
        } catch (error) {
          console.error('❌ Error loading data from server API:', error);
          // Không throw error để tránh crash modal
        }
      }
      
    } catch (error) {
      console.error('❌ Error in handleEditSuccess:', error);
      // Không throw error để tránh crash modal
    }
  }, [selectedDate]);

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
        if (fetchDataRef.current) {
          await fetchDataRef.current(selectedDate, false);
        }

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
        // Luôn load data từ server API để đảm bảo có data mới nhất
        if (fetchDataRef.current) {
          try {
            await fetchDataRef.current(selectedDate, false);
            
            // Force re-render sau khi load data từ API
            setRefreshTrigger(prev => {
              return prev + 1;
            });
          } catch (error) {
            console.error('❌ handleEditAssignedSubmit: Error loading server API data:', error);
            // Không throw error để tránh crash modal
          }
        }

        handleCloseEditAssignedModal();
      } catch (error) {
        console.error('❌ handleEditAssignedSubmit: Assigned work update failed:', error);
        alert(`Lỗi lưu chỉnh sửa: ${error.message}`);
      }
    },
    [selectedDate, handleCloseEditAssignedModal]
  );

  const handleCopy = useCallback(async (work) => {
    try {
      // TODO: Implement copy functionality
      setCopiedWorkId(work.id);
      setTimeout(() => setCopiedWorkId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, []);

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
  }, [dispatch, workers]);

  // Fetch data khi selectedDate thay đổi hoặc chưa initialized
  useEffect(() => {
    if (selectedDate && !isInitialized && fetchDataRef.current) {
      const initializeData = async () => {
        try {
          setError(null);
          await fetchDataRef.current(selectedDate);
          setIsInitialized(true);
        } catch (err) {
          setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        }
      };

      initializeData();
    }
  }, [selectedDate, isInitialized]); // Chạy khi selectedDate thay đổi hoặc isInitialized thay đổi

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

  // Memoize view mode change handler
  const handleViewModeChange = useCallback(
    (mode) => {
      setViewMode(mode);
      if (mode === "today" && isInitialized && fetchDataRef.current) {
        fetchDataRef.current(selectedDate, false);
      }
    },
    [selectedDate, isInitialized]
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
  // Memoize statistics
  const stats = useMemo(() => {
    const unassignedCount =
      (unassignedWorks?.job_priority?.length || 0) +
      (unassignedWorks?.job_normal?.length || 0) +
      (unassignedWorks?.job_cancelled?.length || 0) +
      (unassignedWorks?.job_no_answer?.length || 0) +
      (unassignedWorks?.job_worker_return?.length || 0);
    const assignedCount = (assignedWorks || []).reduce(
      (acc, cat) => acc + (cat.data ? cat.data.length : 0),
      0
    );
    return {
      unassignedCount,
      assignedCount,
    };
  }, [unassignedWorks, assignedWorks, refreshTrigger, forceUpdate]);

  // Debug effect để theo dõi thay đổi dữ liệu
  useEffect(() => {
    console.log('🔄 DashboardClient: Data changed - unassignedWorks:', unassignedWorks?.length, 'assignedWorks:', assignedWorks?.length, 'refreshTrigger:', refreshTrigger);
  }, [unassignedWorks, assignedWorks, refreshTrigger, forceUpdate]);

  // Effect để load dữ liệu khi modal đóng
  useEffect(() => {
    if (!isAssignModalOpen && !isEditModalOpen && !isEditAssignedModalOpen) {
      console.log('🔄 DashboardClient: All modals closed, checking if data needs refresh');
      // Có thể thêm logic refresh data ở đây nếu cần
    }
  }, [isAssignModalOpen, isEditModalOpen, isEditAssignedModalOpen]);

  // Effect để load dữ liệu khi assign modal đóng
  useEffect(() => {
    if (!isAssignModalOpen && selectedWork === null) {
      console.log('🔄 DashboardClient: Assign modal closed, refreshing data');
      // Load data từ server khi assign modal đóng
      if (fetchDataRef.current) {
        fetchDataRef.current(selectedDate, false).then(() => {
          setRefreshTrigger(prev => prev + 1);
        }).catch(error => {
          console.error('❌ Error refreshing data after assign modal close:', error);
        });
      }
    }
  }, [isAssignModalOpen, selectedWork, selectedDate]);

  // Effect để đảm bảo modal đóng khi cần thiết
  useEffect(() => {
    if (isAssignModalOpen && !selectedWork) {
      console.log('🔄 DashboardClient: No selected work, closing assign modal');
      setIsAssignModalOpen(false);
    }
  }, [isAssignModalOpen, selectedWork]);

  // Memoize date range change handler
  const handleDateRangeChange = useCallback((newRange) => {
    setDateRange(newRange);
  }, []);

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
      <div className="flex justify-between items-center p-2 mb-2 bg-white rounded-lg shadow-sm">
        <div className="flex gap-3 items-center">
          <h1 className="text-[15px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-yellow">
            Phân công công việc
          </h1>

          {/* Loading indicator when refreshing */}
          {isRefreshing && (
            <div className="flex items-center space-x-2 text-xs text-brand-green">
              <div className="w-3 h-3 rounded-full border-2 animate-spin border-brand-green border-t-transparent"></div>
              <span>Đang cập nhật...</span>
            </div>
          )}

          {/* Compact View Mode Tabs */}
          <div className="flex gap-0.5 items-center p-0.5 bg-gray-100 rounded-md">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                viewMode === "list"
                  ? "text-[#125d0d] bg-brand-green shadow-sm"
                  : "text-gray-600 hover:text-gray-800 "
              }`}
            >
              Danh sách
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                viewMode === "calendar"
                  ? "text-[#125d0d] bg-brand-green shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Lịch
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                viewMode === "map"
                  ? "text-[#125d0d] bg-brand-green shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Bản đồ
            </button>
          </div>

          {/* Date Navigator */}
          <DateNavigator
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
            onToday={handleToday}
            onViewModeChange={handleViewModeChange}
            viewMode={viewMode}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          {user?.role === "admin" && (
            <Link
              href={ROUTES.ADMIN.DASHBOARD}
              className="flex items-center px-3 py-1.5 space-x-1 text-white transition-all duration-200 rounded-md shadow-sm bg-gradient-to-r from-brand-green to-brand-yellow hover:from-green-700 hover:to-yellow-600 text-xs"
            >
              <Crown className="w-3 h-3" />
              <span className="font-medium">Admin</span>
            </Link>
          )}
        </div>
      </div>

      {/* Compact Date Range Selector */}
      {viewMode === "history" && (
        <div className="p-2 mb-2 bg-white rounded-lg shadow-sm">
          <div className="flex gap-3 items-center">
            <h3 className="text-sm font-semibold text-gray-700">
              Khoảng thời gian:
            </h3>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="px-2 py-1 text-xs rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
              <span className="text-xs text-gray-500">đến</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="px-2 py-1 text-xs rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
              <button
                onClick={() => {
                  // TODO: Implement date range filtering
                  console.log("Filtering date range:", dateRange);
                }}
                className="flex gap-1 items-center px-2 py-1 text-xs text-white rounded-md transition-colors bg-brand-green hover:bg-green-700"
              >
                <Filter className="w-3 h-3" />
                Lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === "list" ? (
        <div className="flex flex-col flex-1 min-h-0">
          {/* BỎ StatusLegend */}
          {/* <StatusLegend /> */}
          <div className="grid flex-1 grid-cols-1 gap-2 mt-2 min-h-0 xl:grid-cols-2">
            {/* Unassigned Works */}
            <div className="flex overflow-hidden flex-col h-full bg-white rounded-lg border shadow-sm border-brand-green/20">
              <div className="p-1.5 bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 border-b border-brand-green/20 flex items-center justify-between">
                <div className="flex items-center">
                  <h2 className="flex items-center text-xs font-semibold text-brand-green">
                    <span className="mr-1 w-1 h-1 rounded-full bg-brand-green"></span>
                    ⏳ Chưa phân công
                    <span className="ml-1 text-xs font-normal text-brand-green bg-brand-green/20 px-1 py-0.5 rounded-full">
                      {stats.unassignedCount}
                    </span>
                  </h2>
                </div>
                <p className="mt-0.5 text-xs text-brand-green">
                  🔥 Lịch gấp (Priority) • 🏠 Thường (Normal) • ❌ Đã hủy • 📞
                  Không nghe • 🔄 Thợ về
                </p>
              </div>
              {/* StatusStats compact */}
              {/* <div className="ml-auto">
              <StatusStats jobs={unassignedWorks.flatMap(category => category.data)} compact />
            </div> */}
              <div className="overflow-hidden flex-1 p-2">
                {unassignedWorks ? (
                  <MemoizedNewJobsList
                    jobs={unassignedWorks}
                    workers={workers}
                    onAssign={handleAssign}
                    onEdit={handleEdit}
                    onCopy={handleCopy}
                    copiedWorkId={copiedWorkId}
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
                    ✅ Đã phân công
                    <span className="ml-1 text-xs font-normal text-brand-green bg-brand-green/20 px-1 py-0.5 rounded-full">
                      {stats.assignedCount}
                    </span>
                  </h2>
                </div>
                <p className="mt-0.5 text-xs text-brand-green">
                  Công việc đã được giao cho thợ thực hiện
                </p>
              </div>
              {/* StatusStats compact */}
              {/* <div className="ml-auto">
              <StatusStats jobs={assignedWorks.flatMap(category => category.data)} compact />
            </div> */}
              <div className="overflow-hidden flex-1 p-2">
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
      ) : viewMode === "map" ? (
        <div className="flex-1 mt-2 min-h-0">
          <div className="h-full bg-white rounded-lg border shadow-sm border-brand-green/20">
            <div className="p-2 bg-gradient-to-r border-b from-brand-green/10 to-brand-yellow/10 border-brand-green/20">
              <h2 className="text-xs font-semibold text-brand-green">
                📍 Bản đồ công việc
              </h2>
            </div>
            <div className="h-[calc(100%-40px)] p-2">
              <MapView
                assignedWorks={assignedWorks}
                unassignedWorks={unassignedWorks}
                workers={workers}
                onAssign={handleAssign}
                onEdit={handleEdit}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden flex-1 min-h-0">
          <WorkHistory viewMode={viewMode} dateRange={dateRange} />
        </div>
      )}

      {/* Assign Worker Modal */}
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
