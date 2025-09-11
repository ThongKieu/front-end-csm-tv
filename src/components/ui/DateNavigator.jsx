import { Calendar, ChevronLeft, ChevronRight, Clock, AlertTriangle, CalendarDays } from "lucide-react";
import DateInput from "./DateInput";

const DateNavigator = ({
  selectedDate,
  onDateChange,
  onPreviousDay,
  onNextDay,
  onToday,
  className = "",
  showStatus = true,
  compact = false
}) => {
  // Helper functions
  const getDateStatus = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = today - targetDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays > 0) return "past";
    return "future";
  };

  const getStatusIcon = (date) => {
    const status = getDateStatus(date);
    switch (status) {
      case "today":
        return <Clock className="w-3 h-3 text-green-700" />;
      case "past":
        return <AlertTriangle className="w-3 h-3 text-orange-600" />;
      case "future":
        return <CalendarDays className="w-3 h-3 text-brand-green" />;
      default:
        return <Calendar className="w-3 h-3 text-gray-600" />;
    }
  };


  if (compact) {
    return (
      <div className={`flex flex-row items-center ${className}`}>
        {/* Navigation Buttons */}
        <div className="flex">
          <button
            onClick={onPreviousDay}
            className="flex flex-1 justify-center items-center p-2 text-xs text-gray-600 bg-white rounded-md border border-gray-200 transition-colors hover:bg-gray-50"
          >
            <ChevronLeft className="w-3 h-3" /> Trước
          </button>
          
          <button
            onClick={onToday}
            className="flex-1 p-2 text-xs font-medium text-green-700 rounded-md transition-colors hover:text-white hover:bg-green-700"
          >
            Hôm nay
          </button>
          
          <button
            onClick={onNextDay}
            className="flex flex-1 justify-center items-center p-2 text-xs text-gray-600 bg-white rounded-md border border-gray-200 transition-colors hover:bg-gray-50"
          >
            Sau <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Date Input */}
        <DateInput
          value={selectedDate}
          onChange={onDateChange}
          placeholder="DD/MM/YYYY"
          className="w-full py-1.5 text-xs font-medium text-gray-900"
        />

       
      </div>
    );
  }

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      {/* Navigation Buttons */}
      <button
        onClick={onPreviousDay}
        className="flex gap-1 items-center p-1 text-xs text-gray-600 bg-white rounded-md border border-gray-200 transition-colors hover:bg-gray-50"
      >
        <ChevronLeft className="w-3 h-3" />
        <span className="text-[12px]">Trước</span>
      </button>
      
      <button
        onClick={onToday}
        className="p-1 text-green-700 rounded-md transition-colors bg-brand-green hover:bg-green-700 hover:text-white"
      >
        <span className="text-[12px]">Hôm nay</span>
      </button>
      
      <button
        onClick={onNextDay}
        className="flex gap-1 items-center p-1 text-xs text-gray-600 bg-white rounded-md border border-gray-200 transition-colors hover:bg-gray-50"
      >
        <span className="text-[12px]">Sau</span>
        <ChevronRight className="w-3 h-3" />
      </button>

      {/* Date Input and Status */}
      {showStatus && (
        <div className="flex items-center px-2 py-1 space-x-1 rounded-md bg-brand-green/10">
          <Calendar className="w-3 h-3 text-brand-green" />
          <DateInput
            value={selectedDate}
            onChange={onDateChange}
            placeholder="DD/MM/YYYY"
            className="w-24 text-xs font-medium bg-transparent border-none text-brand-green focus:ring-0"
          />
        </div>
      )}
    </div>
  );
};

export default DateNavigator; 