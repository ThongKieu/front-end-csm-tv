import { Calendar, ChevronLeft, ChevronRight, Clock, AlertTriangle, CalendarDays } from "lucide-react";

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
        return <Clock className="w-3 h-3 text-blue-600" />;
      case "past":
        return <AlertTriangle className="w-3 h-3 text-orange-600" />;
      case "future":
        return <CalendarDays className="w-3 h-3 text-green-600" />;
      default:
        return <Calendar className="w-3 h-3 text-gray-600" />;
    }
  };

  const getStatusText = (date) => {
    const status = getDateStatus(date);
    switch (status) {
      case "today":
        return "Hôm nay";
      case "past":
        return "Quá hạn";
      case "future":
        return "Tương lai";
      default:
        return "Không xác định";
    }
  };

  if (compact) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {/* Navigation Buttons */}
        <div className="flex gap-1">
          <button
            onClick={onPreviousDay}
            className="flex-1 flex items-center justify-center p-2 text-xs text-gray-600 bg-white rounded-md border border-gray-200 transition-colors hover:bg-gray-50"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          
          <button
            onClick={onToday}
            className="flex-1 p-2 text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700 text-xs font-medium"
          >
            Hôm nay
          </button>
          
          <button
            onClick={onNextDay}
            className="flex-1 flex items-center justify-center p-2 text-xs text-gray-600 bg-white rounded-md border border-gray-200 transition-colors hover:bg-gray-50"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Date Input */}
        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={onDateChange}
            className="w-full pl-7 pr-2 py-1.5 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status */}
        {showStatus && (
          <div className="flex items-center justify-center gap-1 px-2 py-1 bg-gray-50 rounded-md">
            {getStatusIcon(selectedDate)}
            <span className="text-xs font-medium text-gray-600">
              {getStatusText(selectedDate)}
            </span>
          </div>
        )}
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
        className="p-1 text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
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
        <div className="flex items-center px-2 py-1 space-x-1 bg-blue-50 rounded-md">
          <Calendar className="w-3 h-3 text-blue-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={onDateChange}
            className="w-24 text-xs font-medium text-blue-900 bg-transparent border-none focus:ring-0"
          />
          <span className="text-xs font-medium text-blue-600">
            {getStatusText(selectedDate)}
          </span>
        </div>
      )}
    </div>
  );
};

export default DateNavigator; 