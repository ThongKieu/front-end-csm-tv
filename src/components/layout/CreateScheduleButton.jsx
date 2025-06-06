'use client';

import { useSchedule } from '@/contexts/ScheduleContext';

export default function CreateScheduleButton() {
  const { setIsCreateScheduleModalOpen } = useSchedule();

  return (
    <button
      onClick={() => setIsCreateScheduleModalOpen(true)}
      className="fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>Tạo lịch</span>
    </button>
  );
} 