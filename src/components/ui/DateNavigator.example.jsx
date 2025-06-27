import { useState } from 'react';
import DateNavigator from './DateNavigator';

// Ví dụ sử dụng DateNavigator component
const DateNavigatorExample = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    console.log('Date changed to:', e.target.value);
  };

  const handlePreviousDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const newDate = prevDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
    console.log('Previous day:', newDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const newDate = nextDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
    console.log('Next day:', newDate);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    console.log('Today:', today);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">DateNavigator Component Examples</h2>
      
      {/* Basic usage */}
      <div className="p-4 rounded-lg border">
        <h3 className="mb-2 text-sm font-medium">Basic DateNavigator:</h3>
        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          onToday={handleToday}
        />
      </div>

      {/* Without status */}
      <div className="p-4 rounded-lg border">
        <h3 className="mb-2 text-sm font-medium">DateNavigator without status:</h3>
        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          onToday={handleToday}
          showStatus={false}
        />
      </div>

      {/* With custom className */}
      <div className="p-4 rounded-lg border">
        <h3 className="mb-2 text-sm font-medium">DateNavigator with custom styling:</h3>
        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          onToday={handleToday}
          className="p-2 bg-gray-50 rounded-lg"
        />
      </div>
    </div>
  );
};

export default DateNavigatorExample; 