'use client';

import { useSchedule } from '@/contexts/ScheduleContext';
import { usePathname } from 'next/navigation';
import { CalendarPlus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CreateScheduleButton() {
  const { setIsCreateScheduleModalOpen } = useSchedule();
  const pathname = usePathname();

  // Ẩn nút ở trang login
  if (pathname === '/login') return null;

  return (
    <motion.button
      onClick={() => setIsCreateScheduleModalOpen(true)}
      className="fixed left-1/2 -translate-x-1/2 bottom-4 group z-10"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
        
        {/* Button content */}
        <div className="relative flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">Tạo lịch</span>
          <CalendarPlus className="w-4 h-4" />
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
      </div>
    </motion.button>
  );
} 