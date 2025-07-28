'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ScheduleContext = createContext();

export function ScheduleProvider({ children }) {
  const [workers, setWorkers] = useState([]);
  const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch workers
  const fetchWorkers = async () => {
    try {
      const response = await axios.get('https://csm.thoviet.net/api/web/workers');
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
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