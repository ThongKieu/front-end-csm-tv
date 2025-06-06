'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ScheduleContext = createContext();

export function ScheduleProvider({ children }) {
  const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] = useState(false);
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get('https://csm.thoviet.net/api/web/workers');
        setWorkers(response.data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };

    fetchWorkers();
  }, []);

  return (
    <ScheduleContext.Provider
      value={{
        isCreateScheduleModalOpen,
        setIsCreateScheduleModalOpen,
        workers,
      }}
    >
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