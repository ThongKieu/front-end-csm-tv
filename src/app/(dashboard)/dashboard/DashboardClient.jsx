"use client";

import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WorkTable from "@/components/work-schedule/WorkTable";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Wrench,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  AlertCircle,
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

export default function DashboardClient() {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const assignedWorks = useSelector(selectAssignedWorks);
  const unassignedWorks = useSelector(selectUnassignedWorks);
  const workers = useSelector(selectWorkers);
  const loading = useSelector(selectLoading);
  const [error, setError] = useState(null);

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

  const handleDateChange = useCallback(
    (e) => {
      const newDate = e.target.value;
      dispatch(setSelectedDate(newDate));
      fetchData(newDate);
    },
    [dispatch, fetchData]
  );

  useEffect(() => {
    const initializeData = async () => {
      try {
        setError(null);
        // Fetch workers first
        await dispatch(fetchWorkers());
        // Then fetch initial data
        await fetchData(selectedDate);
      } catch (err) {
        console.error("Error initializing data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      }
    };

    initializeData();
  }, [dispatch, fetchData, selectedDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Đã xảy ra lỗi</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchData(selectedDate)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-w-[1920px] mx-auto flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-2 mb-2">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Phân công công việc
        </h1>
        <div className="flex items-center space-x-3 bg-blue-50 rounded-lg px-4 py-1">
          <Calendar className="w-3 h-3 text-blue-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="bg-transparent border-none focus:ring-0 text-blue-900 font-medium"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 min-h-0">
        {/* Unassigned Works */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100 flex flex-col h-full">
          <div className="p-1 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-lg font-semibold text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Công việc chưa phân công
              <span className="ml-2 text-sm font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                {unassignedWorks.reduce((acc, cat) => acc + cat.data.length, 0)}
              </span>
            </h2>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <WorkTable works={unassignedWorks} workers={workers} />
          </div>
        </div>

        {/* Assigned Works */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100 flex flex-col h-full">
          <div className="p-1 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-lg font-semibold text-green-900 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Công việc đã phân công
              <span className="ml-2 text-sm font-normal text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                {assignedWorks.reduce((acc, cat) => acc + cat.data.length, 0)}
              </span>
            </h2>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <WorkTable works={assignedWorks} workers={workers} />
          </div>
        </div>
      </div>
    </div>
  );
}
