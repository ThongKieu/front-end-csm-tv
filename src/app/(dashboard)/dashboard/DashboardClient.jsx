"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import WorkTable from "@/components/work-schedule/WorkTable";
import JobsList from "@/components/work-schedule/JobsList";
import StatusLegend from "@/components/work-schedule/StatusLegend";
import StatusStats from "@/components/work-schedule/StatusStats";
import WorkHistory from "@/components/dashboard/WorkHistory";
import DateNavigator from "@/components/ui/DateNavigator";
import {
  AlertCircle,
  Crown,
  History,
  Filter,
  Calendar,
  AlertTriangle,
} from "lucide-react";
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
import { useSchedule } from "@/contexts/ScheduleContext";

export default function DashboardClient() {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const assignedWorks = useSelector(selectAssignedWorks);
  const unassignedWorks = useSelector(selectUnassignedWorks);
  const workers = useSelector(selectWorkers);
  const loading = useSelector(selectLoading);
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("today");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [isInitialized, setIsInitialized] = useState(false);
  const [copiedWorkId, setCopiedWorkId] = useState(null);
  
  // Lấy refreshTrigger từ ScheduleContext
  const { refreshTrigger } = useSchedule();

  // Handler functions for JobsList
  const handleAssign = (work, isChanging = false) => {

    // TODO: Implement assign functionality
  };

  const handleEdit = (work, isAssigned = false) => {

    // TODO: Implement edit functionality
  };

  const handleCopy = async (work) => {
    try {
      // TODO: Implement copy functionality
      setCopiedWorkId(work.id);
      setTimeout(() => setCopiedWorkId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Memoize fetchData to prevent unnecessary re-creations
  const fetchData = useCallback(
    async (date) => {
      try {
        setError(null);
        await Promise.all([
          dispatch(fetchAssignedWorks(date)),
          dispatch(fetchUnassignedWorks(date)),
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      }
    },
    [dispatch]
  );

  // Memoize date change handler
  const handleDateChange = useCallback(
    (e) => {
      const newDate = e.target.value;
      dispatch(setSelectedDate(newDate));
      fetchData(newDate);
    },
    [dispatch, fetchData]
  );

  // Memoize view mode change handler
  const handleViewModeChange = useCallback(
    (mode) => {
      setViewMode(mode);
      if (mode === "today" && isInitialized) {
        fetchData(selectedDate);
      }
    },
    [fetchData, selectedDate, isInitialized]
  );

  // Memoize navigation handlers
  const handlePreviousDay = useCallback(() => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const newDate = prevDate.toISOString().split("T")[0];
    dispatch(setSelectedDate(newDate));
    fetchData(newDate);
  }, [selectedDate, dispatch, fetchData]);

  const handleNextDay = useCallback(() => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const newDate = nextDate.toISOString().split("T")[0];
    dispatch(setSelectedDate(newDate));
    fetchData(newDate);
  }, [selectedDate, dispatch, fetchData]);

  const handleToday = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    dispatch(setSelectedDate(today));
    fetchData(today);
  }, [dispatch, fetchData]);

  // Memoize statistics
  const stats = useMemo(
    () => ({
      unassignedCount: unassignedWorks.reduce(
        (acc, cat) => acc + cat.data.length,
        0
      ),
      assignedCount: assignedWorks.reduce(
        (acc, cat) => acc + cat.data.length,
        0
      ),
    }),
    [unassignedWorks, assignedWorks]
  );

  // Initialize data only once
  useEffect(() => {
    const initializeData = async () => {
      if (isInitialized) return;

      try {
        setError(null);
        // Fetch workers first, then data
        await dispatch(fetchWorkers());
        await fetchData(selectedDate);
        setIsInitialized(true);
      } catch (err) {
        console.error("Error initializing data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      }
    };

    initializeData();
  }, [dispatch, fetchData, selectedDate, isInitialized]);

  // Lắng nghe refreshTrigger để tự động refresh data
  useEffect(() => {
    if (isInitialized && refreshTrigger > 0) {
  
      fetchData(selectedDate);
    }
  }, [refreshTrigger, isInitialized, fetchData, selectedDate]);

  // Show loading only during initial load
  if (!isInitialized && loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="w-12 h-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-md">
          <div className="flex items-center mb-4 space-x-3 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Đã xảy ra lỗi</h2>
          </div>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => fetchData(selectedDate)}
            className="px-4 py-2 w-full text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
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
          <h1 className="text-[15px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Phân công công việc
          </h1>

          {/* Compact View Mode Tabs */}
          <div className="flex gap-0.5 items-center p-0.5 bg-gray-100 rounded-md">
                          <button
                onClick={() => handleViewModeChange("today")}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  viewMode === "today"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>Hôm nay</span>
              </button>
            <button
              onClick={() => handleViewModeChange("history")}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                viewMode === "history"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <History className="w-3 h-3" />
              <span>Lịch sử</span>
            </button>
            <button
              onClick={() => handleViewModeChange("pending")}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                viewMode === "pending"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Chưa xử lý</span>
            </button>
          </div>

          {/* Date Navigation */}
          <DateNavigator
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
            onToday={handleToday}
          />
        </div>

        <div className="flex items-center space-x-2">
          {user?.role === "admin" && (
            <Link
              href={ROUTES.ADMIN.DASHBOARD}
              className="flex items-center px-3 py-1.5 space-x-1 text-white transition-all duration-200 rounded-md shadow-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-xs"
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
                className="px-2 py-1 text-xs rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">đến</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="px-2 py-1 text-xs rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  // TODO: Implement date range filtering
                  console.log('Filtering date range:', dateRange);
                }}
                className="flex gap-1 items-center px-2 py-1 text-xs text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
              >
                <Filter className="w-3 h-3" />
                Lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === "today" ? (
        <div className="flex flex-col flex-1 min-h-0">
          {/* BỎ StatusLegend */}
          {/* <StatusLegend /> */}
          
          <div className="grid flex-1 grid-cols-1 gap-2 mt-2 min-h-0 xl:grid-cols-2">
          {/* Unassigned Works */}
          <div className="flex overflow-hidden flex-col h-full bg-white rounded-lg border border-blue-100 shadow-sm">
            <div className="p-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
              <div>
                <h2 className="flex items-center text-xs font-semibold text-blue-900">
                  <span className="mr-1 w-1 h-1 bg-yellow-500 rounded-full"></span>
                  ⏳ Chưa phân công
                  <span className="ml-1 text-xs font-normal text-blue-600 bg-blue-100 px-1 py-0.5 rounded-full">
                    {stats.unassignedCount}
                  </span>
                </h2>
                <p className="mt-0.5 text-xs text-blue-700">
                  🔥 Lịch gấp (high) • ⭐ Lịch ưu tiên • 👥 Khách quen (medium) • ⏳ Chưa phân (low)
                </p>
              </div>
              {/* StatusStats compact */}
              <div className="ml-auto">
                <StatusStats jobs={unassignedWorks.flatMap(category => category.data)} compact />
              </div>
            </div>
            <div className="overflow-hidden flex-1 p-2">
              <JobsList 
                jobs={unassignedWorks.flatMap(category => category.data)} 
                workers={workers}
                onAssign={handleAssign}
                onEdit={handleEdit}
                onCopy={handleCopy}
                copiedWorkId={copiedWorkId}
              />
            </div>
          </div>

          {/* Assigned Works */}
          <div className="flex overflow-hidden flex-col h-full bg-white rounded-lg border border-green-100 shadow-sm">
            <div className="p-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 flex items-center justify-between">
              <div>
                <h2 className="flex items-center text-xs font-semibold text-green-900">
                  <span className="mr-1 w-1 h-1 bg-green-500 rounded-full"></span>
                  ✅ Đã phân công
                  <span className="ml-1 text-xs font-normal text-green-600 bg-green-100 px-1 py-0.5 rounded-full">
                    {stats.assignedCount}
                  </span>
                </h2>
                <p className="mt-0.5 text-xs text-green-700">
                  Công việc đã được giao cho thợ thực hiện
                </p>
              </div>
              {/* StatusStats compact */}
              <div className="ml-auto">
                <StatusStats jobs={assignedWorks.flatMap(category => category.data)} compact />
              </div>
            </div>
            <div className="overflow-hidden flex-1 p-2">
              <WorkTable works={assignedWorks} workers={workers} />
            </div>
          </div>
        </div>
        </div>
      ) : (
        <div className="overflow-hidden flex-1 min-h-0">
          <WorkHistory viewMode={viewMode} dateRange={dateRange} />
        </div>
      )}
    </div>
  );
}
