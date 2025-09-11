'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignedWorks, fetchUnassignedWorks, fetchWorkers } from '@/store/slices/workSlice';
import { useApiLoading } from '@/hooks/useApiLoading';
import { useApiManager } from '@/hooks/useApiManager';

const ScheduleContext = createContext();

export function ScheduleProvider({ children }) {
  const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] = useState(false);
  const [onJobCreatedCallback, setOnJobCreatedCallback] = useState(null);
  const dispatch = useDispatch();
  const { withLoading } = useApiLoading();
  const { fetchData, clearCache } = useApiManager();
  
  // Lấy workers từ Redux store
  const workers = useSelector(state => state.work.workers || []);
  
  // Hàm refresh data - chỉ load data khi thực sự cần thiết
  const refreshData = useCallback(async (selectedDate = null, forceRefresh = false) => {
    console.log("🔄 ScheduleContext.refreshData called:", { selectedDate, forceRefresh });
    
    // Nếu không có selectedDate, sử dụng ngày hiện tại
    const targetDate = selectedDate || new Date().toISOString().split('T')[0];
    
    console.log("🔄 Refreshing data for date:", targetDate, "forceRefresh:", forceRefresh);
    
    // Clear cache nếu force refresh
    if (forceRefresh) {
      console.log("🗑️ Clearing cache for date:", targetDate);
      clearCache(targetDate);
    }
    
    // Sử dụng useApiManager để tránh duplicate calls - không dùng withLoading để tránh hiển thị loading overlay
    await fetchData(targetDate, {
      forceRefresh,
      includeWorkers: false, // Không load workers ở đây để tránh duplicate calls
      skipCache: forceRefresh
    });
    
    console.log("✅ ScheduleContext.refreshData completed for date:", targetDate);
  }, [fetchData, clearCache]);

  // Không cần callback system nữa vì đã được xử lý trực tiếp

  const value = {
    isCreateScheduleModalOpen,
    setIsCreateScheduleModalOpen,
    workers,
    refreshData
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
} 