"use client";

import { useState, useEffect, forwardRef, useRef } from "react";
import { Calendar } from "lucide-react";

const DateInput = forwardRef(({ 
  value, 
  onChange, 
  placeholder = "Chọn ngày", 
  className = "", 
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  const [displayValue, setDisplayValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const hiddenInputRef = useRef(null);

  // Hàm chuyển đổi từ YYYY-MM-DD sang DD/MM/YYYY
  const formatToDisplay = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString + "T00:00:00"); // Thêm time để tránh timezone issues
      if (isNaN(date.getTime())) return "";
      
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Hàm chuyển đổi từ DD/MM/YYYY sang YYYY-MM-DD
  const formatToValue = (displayString) => {
    if (!displayString) return "";
    
    // Xóa tất cả ký tự không phải số
    const numbers = displayString.replace(/\D/g, "");
    
    // Nếu có đủ 8 số, format thành DD/MM/YYYY
    if (numbers.length === 8) {
      const day = numbers.slice(0, 2);
      const month = numbers.slice(2, 4);
      const year = numbers.slice(4, 8);
      
      // Validate ngày
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900) {
        const date = new Date(yearNum, monthNum - 1, dayNum);
        if (date.getDate() === dayNum && date.getMonth() === monthNum - 1 && date.getFullYear() === yearNum) {
          return `${year}-${month}-${day}`;
        }
      }
    }
    
    return "";
  };

  // Hàm xử lý input change
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    
    // Chỉ cho phép nhập số và dấu /
    const cleanedValue = inputValue.replace(/[^\d/]/g, "");
    
    // Tự động thêm dấu / khi nhập
    let formattedValue = cleanedValue;
    if (cleanedValue.length >= 2 && cleanedValue.length < 4 && !cleanedValue.includes("/")) {
      formattedValue = cleanedValue.slice(0, 2) + "/" + cleanedValue.slice(2);
    } else if (cleanedValue.length >= 5 && cleanedValue.length < 8 && cleanedValue.split("/").length === 2) {
      const parts = cleanedValue.split("/");
      if (parts[1].length >= 2) {
        formattedValue = parts[0] + "/" + parts[1].slice(0, 2) + "/" + parts[1].slice(2);
      }
    }
    
    setDisplayValue(formattedValue);
    
    // Validate và chuyển đổi sang format server
    const serverValue = formatToValue(formattedValue);
    const valid = !formattedValue || serverValue !== "";
    setIsValid(valid);
    
    // Gọi onChange với giá trị server
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value: serverValue
        }
      });
    }
  };

  // Hàm xử lý blur - validate cuối cùng
  const handleBlur = (e) => {
    const serverValue = formatToValue(displayValue);
    if (displayValue && !serverValue) {
      setIsValid(false);
    } else {
      setIsValid(true);
      if (serverValue && onChange) {
        onChange({
          ...e,
          target: {
            ...e.target,
            value: serverValue
          }
        });
      }
    }
  };

  // Hàm xử lý click vào input hoặc icon calendar để mở date picker
  const handleInputClick = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.showPicker();
    }
  };

  // Hàm xử lý khi date picker thay đổi
  const handleDatePickerChange = (e) => {
    const serverValue = e.target.value;
    if (serverValue) {
      const displayFormatted = formatToDisplay(serverValue);
      setDisplayValue(displayFormatted);
      setIsValid(true);
      
      if (onChange) {
        onChange({
          ...e,
          target: {
            ...e.target,
            value: serverValue
          }
        });
      }
    }
  };

  // Cập nhật display value khi value prop thay đổi
  useEffect(() => {
    if (value) {
      const formatted = formatToDisplay(value);
      setDisplayValue(formatted);
      setIsValid(true);
    } else {
      setDisplayValue("");
    }
  }, [value]);

  return (
    <div className="relative">
      {/* Hidden date input for native date picker */}
      <input
        ref={hiddenInputRef}
        type="date"
        value={value || ""}
        onChange={handleDatePickerChange}
        className="absolute opacity-0 pointer-events-none"
        style={{ width: 0, height: 0 }}
      />
      
      {/* Visible text input */}
      <input
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleInputClick}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 pr-10 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green cursor-pointer ${
          !isValid 
            ? "border-red-500 bg-red-50" 
            : "border-gray-300 bg-white hover:border-gray-400"
        } ${className}`}
        {...props}
      />
      
      {/* Calendar icon */}
      <div 
        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
        onClick={handleInputClick}
      >
        <Calendar className={`w-4 h-4 transition-colors ${
          !isValid ? "text-red-500" : "text-gray-400 hover:text-gray-600"
        }`} />
      </div>
      
      {/* Error message */}
      {!isValid && displayValue && (
        <p className="mt-1 text-xs text-red-500">
          Vui lòng nhập đúng định dạng ngày (DD/MM/YYYY)
        </p>
      )}
    </div>
  );
});

DateInput.displayName = "DateInput";

export default DateInput;
