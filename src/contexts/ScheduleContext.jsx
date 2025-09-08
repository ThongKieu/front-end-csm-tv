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
      
      // Luôn load data từ server để đảm bảo có data mới nhất từ API
      await Promise.all([
        dispatch(fetchAssignedWorks(targetDate)),
        dispatch(fetchUnassignedWorks(targetDate)),
        // Chỉ load workers nếu chưa có
        ...(workers.length === 0 ? [dispatch(fetchWorkers())] : [])
      ]);
      
    } catch (error) {
      console.error('❌ ScheduleContext: Error refreshing data from server:', error);
    }
  }, [dispatch, workers.length]);

  // Hàm để đăng ký callback khi job được tạo
  const setJobCreatedCallback = useCallback((callback) => {
    setOnJobCreatedCallback(() => callback);
  }, []);

  // Hàm để gọi callback khi job được tạo
  const notifyJobCreated = useCallback(() => {
    if (onJobCreatedCallback && typeof onJobCreatedCallback === 'function') {
      onJobCreatedCallback();
    }
  }, [onJobCreatedCallback]);

  const value = {
    isCreateScheduleModalOpen,
    setIsCreateScheduleModalOpen,
    workers,
    refreshData,
    setJobCreatedCallback,
    notifyJobCreated
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