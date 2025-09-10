'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignedWorks, fetchUnassignedWorks, fetchWorkers } from '@/store/slices/workSlice';

const ScheduleContext = createContext();

export function ScheduleProvider({ children }) {
  const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] = useState(false);
  const [onJobCreatedCallback, setOnJobCreatedCallback] = useState(null);
  const dispatch = useDispatch();
  
  // Lấy workers từ Redux store
  const workers = useSelector(state => state.work.workers || []);
  
  // Hàm refresh data - luôn load data từ server để đảm bảo có data mới nhất
  const refreshData = useCallback(async (selectedDate = null) => {
    try {
      // Nếu không có selectedDate, sử dụng ngày hiện tại
      const targetDate = selectedDate || new Date().toISOString().split('T')[0];
      
      // Clear cache trước khi fetch data mới để đảm bảo có data mới nhất
      const { clearCacheForDate } = await import('@/store/slices/workSlice');
      dispatch(clearCacheForDate(targetDate));
      
      // Luôn load data từ server để đảm bảo có data mới nhất từ API
      await Promise.all([
        dispatch(fetchAssignedWorks(targetDate)),
        dispatch(fetchUnassignedWorks(targetDate))
        // Không load workers ở đây để tránh duplicate calls
      ]);
      
      
    } catch (error) {
      console.error('❌ ScheduleContext: Error refreshing data from server:', error);
    }
  }, [dispatch]); // Loại bỏ workers.length khỏi dependencies để tránh gọi API liên tục

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