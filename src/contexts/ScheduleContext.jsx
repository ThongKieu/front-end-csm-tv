'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getClientApiUrl, CONFIG } from '@/config/constants';

const ScheduleContext = createContext();

export function ScheduleProvider({ children }) {
  const [workers, setWorkers] = useState([]);
  const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch workers
  const fetchWorkers = async () => {
    try {
      console.log('Fetching workers from:', getClientApiUrl(CONFIG.API.WORKER.GET_ALL));
      const response = await axios.get(getClientApiUrl(CONFIG.API.WORKER.GET_ALL));
      console.log('Workers fetched successfully:', response.data);
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
      // Set fallback workers nếu có lỗi
      const fallbackWorkers = [
        {
          id: 1,
          worker_full_name: "Nguyễn Văn A",
          worker_code: "NV001",
          worker_phone_company: "0123456789",
          worker_status: 1
        },
        {
          id: 2,
          worker_full_name: "Trần Thị B",
          worker_code: "NV002", 
          worker_phone_company: "0987654321",
          worker_status: 1
        }
      ];
      setWorkers(fallbackWorkers);
    }
  };

  // Refresh data function
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const value = {
    workers,
    fetchWorkers,
    isCreateScheduleModalOpen,
    setIsCreateScheduleModalOpen,
    refreshData,
    refreshTrigger
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