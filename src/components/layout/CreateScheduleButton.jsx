"use client";

import { useSchedule } from "@/contexts/ScheduleContext";
import { usePathname } from "next/navigation";
import { CalendarPlus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateScheduleButton() {
  const { setIsCreateScheduleModalOpen } = useSchedule();
  const pathname = usePathname();

  // Ẩn nút ở trang login
  if (pathname === "/login") return null;

  return (
    <motion.button
      onClick={() => setIsCreateScheduleModalOpen(true)}
      className="fixed bottom-4 left-1/2 z-10 -translate-x-1/2 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#125d0d] to-[#f5d20d] rounded-full opacity-75 blur-lg transition-opacity group-hover:opacity-100" />

        {/* Button content */}
        <div className="relative flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-[#125d0d] to-[#f5d20d] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">Tạo lịch</span>
          <CalendarPlus className="w-4 h-4" />
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 bg-white rounded-full opacity-0 transition-opacity group-hover:opacity-10" />
      </div>
    </motion.button>
  );
}
