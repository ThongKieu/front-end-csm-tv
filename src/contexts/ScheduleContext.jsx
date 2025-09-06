'use client';

import { createContext, useContext, useState } from 'react';

const ScheduleContext = createContext();

export function ScheduleProvider({ children }) {
  const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] = useState(false);

  const value = {
    isCreateScheduleModalOpen,
    setIsCreateScheduleModalOpen
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