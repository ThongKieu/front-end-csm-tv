"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  X,
  User,
  FileText,
  Briefcase,
  CheckCircle2,
  Clipboard,
  ZoomIn,
  MapPin,
} from "lucide-react";
import wardsData from "../../data/tphcm-wards-complete.json";

// CSS để buộc hiển thị format 24h cho input time
const timeInputStyles = `
  input[type="time"]::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
  }
  
  input[type="time"]::-webkit-datetime-edit-hour-field,
  input[type="time"]::-webkit-datetime-edit-minute-field,
  input[type="time"]::-webkit-datetime-edit-ampm-field {
    padding: 0;
  }
  
  input[type="time"]::-webkit-datetime-edit-ampm-field {
    display: none;
  }
`;


export default function CreateScheduleModal({
  isOpen,
  onClose,
  workers,
  onSuccess,
}) {

  const fileInputRef = useRef(null);

  // Date & time helpers
  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };
  const getDefaultFormData = (time = getCurrentTime()) => ({
    job_content: "", job_appointment_date: getTodayDate(), job_appointment_time: time,
    job_customer_address: "", job_customer_phone: "", job_customer_name: "", job_customer_note: "",
    job_type_id: "", job_source: "call_center", job_priority: "", user_id: "1", job_images: [],
    has_appointment_time: false, // Thêm field để kiểm soát việc có hẹn giờ hay không
    job_customer_ward: "", // Thêm field cho phường/xã
    job_customer_district: "", // Thêm field cho quận
    job_content_construction: "", // Thêm field cho thi công
    job_content_installation: "", // Thêm field cho lắp đặt
    job_content_aircon: "", // Thêm field cho máy lạnh
  });
  const defaultFormData = getDefaultFormData();

  const [scheduleData, setScheduleData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [wardSearchTerm, setWardSearchTerm] = useState("");
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  // Load saved data when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem("createScheduleFormData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          const hasAppointmentTime = parsedData.has_appointment_time !== undefined 
            ? parsedData.has_appointment_time 
            : (parsedData.job_appointment_time && parsedData.job_appointment_time.trim() !== "");
          
          // Format giờ hẹn
          let appointmentTime = parsedData.job_appointment_time || "";
          if (appointmentTime && hasAppointmentTime) {
            const timeMatch = appointmentTime.match(/(\d{1,2}):(\d{2})/);
            if (timeMatch) {
              const hour = parseInt(timeMatch[1]).toString().padStart(2, '0');
              appointmentTime = `${hour}:${timeMatch[2]}`;
            }
          }
          
          setScheduleData({ 
            ...defaultFormData, 
            ...parsedData,
            has_appointment_time: hasAppointmentTime,
            job_appointment_time: appointmentTime
          });
          
          setWardSearchTerm(parsedData.job_customer_ward || "");
          setDistrictSearchTerm(parsedData.job_customer_district || "");
        } catch (error) {
          console.error("Error parsing saved form data:", error);
          resetForm();
        }
      } else {
        resetForm();
      }
    } else {
      resetForm();
    }
  }, [isOpen]);

  // Save data to localStorage whenever form data changes
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem(
        "createScheduleFormData",
        JSON.stringify(scheduleData)
      );
    }
  }, [scheduleData, isOpen]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Validate phone number whenever it changes
  useEffect(() => {
    const phoneDigits = scheduleData.job_customer_phone.replace(/\D/g, "");
    setPhoneError(phoneDigits.length > 0 && phoneDigits.length < 10);
  }, [scheduleData.job_customer_phone]);

  // Add paste event listener for clipboard images
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            // Convert clipboard image to File object
            const blob = new Blob([file], { type: file.type });
            const newFile = new File([blob], `pasted-image-${Date.now()}.png`, {
              type: file.type,
            });

            setScheduleData((prev) => ({
              ...prev,
              job_images: [...prev.job_images, newFile],
            }));

    
            break;
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener("paste", handlePaste);
    }

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [isOpen]);

  const clearSavedData = () => localStorage.removeItem("createScheduleFormData");
  const resetForm = () => {
    setScheduleData(getDefaultFormData(currentTime));
    setWardSearchTerm("");
    setDistrictSearchTerm("");
    setShowWardDropdown(false);
    setShowDistrictDropdown(false);
  };

  // Trích xuất và xử lý dữ liệu quận/phường
  const allOldDistricts = Array.from(new Set(
    wardsData.wards.flatMap(ward => 
      ward.formed_from.match(/Quận\s*\d+/g) || []
    )
  )).sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  const filteredWards = wardsData.wards
    .filter(ward => {
      const nameMatch = ward.name.toLowerCase().includes(wardSearchTerm.toLowerCase());
      const districtMatch = !districtSearchTerm || ward.formed_from.includes(districtSearchTerm);
      return nameMatch && districtMatch;
    })
    .slice(0, 10);

  const filteredDistricts = allOldDistricts.filter(district =>
    district.toLowerCase().includes(districtSearchTerm.toLowerCase())
  );

  const getOldDistrictsFromWard = (wardName) => {
    const ward = wardsData.wards.find(w => w.name === wardName);
    if (!ward) return [];
    
    const matches = ward.formed_from.match(/Quận\s*\d+/g);
    return matches || [];
  };

  const handleWardSelect = (ward) => {
    const oldDistricts = getOldDistrictsFromWard(ward.name);
    setScheduleData({
      ...scheduleData,
      job_customer_ward: ward.name,
      job_customer_district: oldDistricts.join(", "),
    });
    setWardSearchTerm(ward.name);
    setDistrictSearchTerm(oldDistricts.join(", "));
    setShowWardDropdown(false);
  };

  const handleWardInputChange = (e) => {
    const value = e.target.value;
    setWardSearchTerm(value);
    setScheduleData({ ...scheduleData, job_customer_ward: value });
    setShowWardDropdown(value.length > 0);
    
    if (value === "") {
      setDistrictSearchTerm("");
      setScheduleData(prev => ({ ...prev, job_customer_district: "" }));
    }
  };

  const handleDistrictSelect = (district) => {
    setScheduleData({ ...scheduleData, job_customer_district: district });
    setDistrictSearchTerm(district);
    setShowDistrictDropdown(false);
    
    // Reset phường/xã khi chọn quận
    setWardSearchTerm("");
    setScheduleData(prev => ({ ...prev, job_customer_ward: "" }));
  };

  const handleDistrictInputChange = (e) => {
    const value = e.target.value;
    setDistrictSearchTerm(value);
    setScheduleData({ ...scheduleData, job_customer_district: value });
    setShowDistrictDropdown(value.length > 0);
    
    if (value === "") {
      setWardSearchTerm("");
      setScheduleData(prev => ({ ...prev, job_customer_ward: "" }));
    }
  };

    // Phone number handlers
  const handlePhoneChange = (e) => {
    const numbersOnly = e.target.value.replace(/\D/g, "").slice(0, 11);
    setScheduleData({ ...scheduleData, job_customer_phone: numbersOnly });
  };
  const getPhoneDigitsCount = () => scheduleData.job_customer_phone.replace(/\D/g, "").length;
  const isPhoneValid = () => {
    const digits = getPhoneDigitsCount();
    return digits >= 10 && digits <= 11;
  };

  // Data options
  const jobPriorities = [
    { value: "", label: "Không chọn", color: "text-gray-500" },
    { value: "medium", label: "Khách quen", color: "text-brand-green" },
    { value: "high", label: "Lịch ưu tiên", color: "text-brand-yellow" },
  ];
  const jobTypes = [
    { value: "1", label: "Điện Nước" }, { value: "2", label: "Điện Lạnh" },
    { value: "3", label: "Đồ gỗ" }, { value: "4", label: "Năng Lượng Mặt trời" },
    { value: "5", label: "Xây Dựng" }, { value: "6", label: "Tài Xế" },
    { value: "7", label: "Cơ Khí" }, { value: "8", label: "Điện - Điện Tử" },
    { value: "9", label: "Văn Phòng" },
  ];
  const jobSources = [
    { value: "call_center", label: "Tổng đài" }, { value: "app_customer", label: "App Khách hàng" },
    { value: "app_worker", label: "App Thợ" }, { value: "website", label: "Website" },
    { value: "zalo", label: "Zalo" }, { value: "facebook", label: "Facebook" },
    { value: "tiktok", label: "TikTok" }, { value: "office", label: "Văn phòng" },
    { value: "other", label: "Khác" },
  ];

  // Handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setScheduleData(prev => ({ ...prev, job_images: [...prev.job_images, ...files] }));
    
  };
  const handleRemoveImage = (index) => {
    setScheduleData(prev => ({ ...prev, job_images: prev.job_images.filter((_, i) => i !== index) }));
    
  };
  const handlePasteClick = () => fileInputRef.current?.click();
  const handleImageClick = (file, index) => { 
    setSelectedImage({ file, index }); 
    setImageViewerOpen(true); 
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };
  const handleCloseImageViewer = () => { 
    setImageViewerOpen(false); 
    setSelectedImage(null); 
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };
  const handleImageWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    const newZoom = Math.max(0.5, Math.min(3, imageZoom + delta));
    setImageZoom(newZoom);
  };

  const handleImageMouseDown = (e) => {
    if (imageZoom <= 1) return;
    e.preventDefault();
    const startX = e.clientX - imagePosition.x;
    const startY = e.clientY - imagePosition.y;
    
    const handleMouseMove = (e) => {
      setImagePosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = [
      { field: "job_appointment_date", message: "Vui lòng chọn ngày hẹn" },
      { field: "job_customer_address", message: "Vui lòng nhập địa chỉ" },
      { field: "job_customer_phone", message: "Vui lòng nhập số điện thoại" },
      { field: "job_type_id", message: "Vui lòng chọn loại công việc" },
      { field: "job_source", message: "Vui lòng chọn nguồn" },
    ];

    // Validate nội dung công việc
    if (!scheduleData.job_content || !scheduleData.job_content.trim()) {
      return;
    }

    for (const { field, message } of requiredFields) {
      if (!scheduleData[field] || !scheduleData[field].toString().trim()) {

        return;
      }
    }

      // Validate giờ hẹn
  if (scheduleData.has_appointment_time && (!scheduleData.job_appointment_time || !scheduleData.job_appointment_time.trim())) {
    return;
  }

  if (scheduleData.has_appointment_time && scheduleData.job_appointment_time) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(scheduleData.job_appointment_time)) {
      return;
    }
  }

    // Validate phone number format
    if (!isPhoneValid()) {
      
      return;
    }

    setIsSubmitting(true);

    try {
      // Chuẩn bị dữ liệu gửi đi với format chính xác
      const requestData = {
        job_content: scheduleData.job_content.trim(),
        job_appointment_date: scheduleData.job_appointment_date,
        // Chỉ gửi giờ hẹn khi có hẹn giờ cụ thể
        ...(scheduleData.has_appointment_time && {
          job_appointment_time: scheduleData.job_appointment_time,
        }),
        job_customer_address: scheduleData.job_customer_address.trim(),
        job_customer_phone: scheduleData.job_customer_phone
          .trim()
          .replace(/\s/g, ""),
        job_customer_name:
          scheduleData.job_customer_name.trim() || "Khách hàng",
        job_customer_note: scheduleData.job_customer_note.trim() || "",
        job_customer_ward: scheduleData.job_customer_ward.trim() || "",
        job_customer_district: scheduleData.job_customer_district.trim() || "",
        job_type_id: parseInt(scheduleData.job_type_id), // Đảm bảo là số
        job_source: scheduleData.job_source,
        job_priority: scheduleData.job_priority,
        user_id: parseInt(scheduleData.user_id) || 1, // Đảm bảo là số
        // Thêm các field có thể cần thiết
        job_status: "pending", // Trạng thái mặc định
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const formData = new FormData();

      // Thêm các field text
      Object.keys(requestData).forEach((key) => {
        if (requestData[key] !== null && requestData[key] !== undefined) {
          formData.append(key, requestData[key]);
        }
      });

      // Thêm files nếu có
      if (scheduleData.job_images && scheduleData.job_images.length > 0) {
        scheduleData.job_images.forEach((file) => {
          formData.append("job_images[]", file);
        });
      }

      const response = await axios.post(
        "http://192.168.1.27/api/web/job/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          timeout: 30000, // 30 giây timeout
        }
      );

      if (response.status === 200 || response.status === 201) {

        clearSavedData();

        // Gọi callback để refresh data
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess();
        }

        onClose();
        resetForm();
      }
    } catch (error) {
      console.error("Error creating job:", error);
      console.error("Error response:", error.response);
      console.error("Error request:", error.request);

      let errorMessage = "Có lỗi xảy ra khi tạo công việc";

      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        console.error("Response data:", responseData);

        const messages = {
          400: "Dữ liệu không hợp lệ",
          401: "Không có quyền truy cập",
          403: "Truy cập bị từ chối",
          404: "API không tồn tại",
          422: "Dữ liệu không hợp lệ (422) - Vui lòng kiểm tra lại thông tin",
          500: "Lỗi server, vui lòng thử lại sau",
        };

        // Xử lý lỗi 422 chi tiết hơn
        if (status === 422 && responseData && responseData.errors) {
          const validationErrors = Object.values(responseData.errors).flat();
          errorMessage = `Lỗi validation: ${validationErrors.join(", ")}`;
        } else if (responseData && responseData.message) {
          errorMessage = responseData.message;
        } else {
          errorMessage = messages[status] || `Lỗi server (${status})`;
        }
      } else if (error.request) {
        errorMessage =
          "Không thể kết nối đến server, vui lòng kiểm tra kết nối mạng";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout, vui lòng thử lại";
      }

      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => { 
    resetForm();
    clearSavedData();
  };

  if (!isOpen) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: timeInputStyles }} />
      <div
        className="flex fixed inset-0 z-50 justify-end items-start p-4 bg-black/0"
        onClick={onClose}
      >
        <div
          className="flex overflow-hidden flex-col w-full max-w-2xl h-full max-h-screen bg-white rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold bg-gradient-to-r from-[#125d0d] to-[#f5d20d] bg-clip-text text-transparent">
                  Tạo công việc mới
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Điền thông tin để tạo công việc mới
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            <form onSubmit={handleCreateSchedule} className="p-6 space-y-6">
              {/* Thông tin khách hàng - Ưu tiên cao nhất */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex justify-center items-center w-8 h-8 bg-blue-100 rounded-lg">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Thông tin khách hàng
                  </h3>
                </div>

                {/* Số điện thoại - Quan trọng nhất */}
                <div>
                  <label className="block mb-2 text-xs font-medium text-gray-700">
                    Số điện thoại <span className="text-red-500">*</span>{" "}
                    <span className="ml-2 text-xs text-gray-500">
                      ({getPhoneDigitsCount()}/11)
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={scheduleData.job_customer_phone}
                    onChange={handlePhoneChange}
                    className={`w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors ${
                      phoneError ? "border-red-500" : ""
                    }`}
                    placeholder="Nhập số điện thoại khách hàng"
                    required
                  />
                  {phoneError && (
                    <p className="mt-1 text-xs text-red-500">
                      Số điện thoại phải có từ 10 đến 11 số.
                    </p>
                  )}
                </div>

                {/* Tên khách hàng */}
                <div>
                  <label className="block mb-2 text-xs font-medium text-gray-700">
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    value={scheduleData.job_customer_name}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        job_customer_name: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                    placeholder="Nhập tên khách hàng"
                  />
                </div>

                {/* Địa chỉ và vị trí */}
                <div className="space-y-3">
                  {/* Quận và Phường/Xã */}
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Phường/Xã */}
                    <div>
                      <label className="block mb-2 text-xs font-medium text-gray-700">
                        Phường/Xã
                      </label>
                      <div className="relative">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={wardSearchTerm}
                            onChange={handleWardInputChange}
                            onFocus={() => setShowWardDropdown(wardSearchTerm.length > 0)}
                            onBlur={() => setTimeout(() => setShowWardDropdown(false), 200)}
                            className="flex-1 rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                            placeholder="Tìm kiếm phường/xã..."
                          />
                          {wardSearchTerm && (
                            <button
                              type="button"
                              onClick={() => {
                                setWardSearchTerm("");
                                setDistrictSearchTerm("");
                                setScheduleData(prev => ({
                                  ...prev,
                                  job_customer_ward: "",
                                  job_customer_district: "",
                                }));
                              }}
                              className="p-1 text-gray-400 transition-colors hover:text-gray-600"
                              title="Xóa"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        
                        {showWardDropdown && filteredWards.length > 0 && (
                          <div className="overflow-y-auto absolute z-10 mt-1 w-full max-h-60 bg-white rounded-lg border border-gray-200 shadow-lg">
                            {filteredWards.map((ward) => (
                              <button
                                key={ward.code}
                                type="button"
                                onClick={() => handleWardSelect(ward)}
                                className="px-3 py-2 w-full text-sm text-left border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-b-0"
                              >
                                <div className="font-medium text-gray-900">{ward.name}</div>
                                <div className="text-xs text-gray-500">{ward.formed_from}</div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quận cũ (trước sáp nhập) */}
                    <div>
                      <label className="block mb-2 text-xs font-medium text-gray-700">
                        Quận cũ <span className="text-gray-500">(trước sáp nhập)</span>
                      </label>
                      <div className="relative">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={districtSearchTerm}
                            onChange={handleDistrictInputChange}
                            onFocus={() => setShowDistrictDropdown(districtSearchTerm.length > 0)}
                            onBlur={() => setTimeout(() => setShowDistrictDropdown(false), 200)}
                            className="flex-1 rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                            placeholder="Tự động điền khi chọn phường/xã..."
                            readOnly
                          />
                          {districtSearchTerm && (
                            <button
                              type="button"
                              onClick={() => {
                                setDistrictSearchTerm("");
                                setWardSearchTerm("");
                                setScheduleData(prev => ({
                                  ...prev,
                                  job_customer_district: "",
                                  job_customer_ward: "",
                                }));
                              }}
                              className="p-1 text-gray-400 transition-colors hover:text-gray-600"
                              title="Xóa"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        
                        {showDistrictDropdown && filteredDistricts.length > 0 && (
                          <div className="overflow-y-auto absolute z-10 mt-1 w-full max-h-60 bg-white rounded-lg border border-gray-200 shadow-lg">
                            {filteredDistricts.map((district) => (
                              <button
                                key={district}
                                type="button"
                                onClick={() => handleDistrictSelect(district)}
                                className="px-3 py-2 w-full text-sm text-left border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-b-0"
                              >
                                <div className="font-medium text-gray-900">{district}</div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Địa chỉ chi tiết */}
                  <div>
                    <label className="block mb-2 text-xs font-medium text-gray-700">
                      Địa chỉ chi tiết <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={scheduleData.job_customer_address}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          job_customer_address: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                      placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã)"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin công việc */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex justify-center items-center w-8 h-8 rounded-lg bg-brand-yellow/10">
                    <Briefcase className="w-4 h-4 text-brand-yellow" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Thông tin công việc
                  </h3>
                </div>

                                {/* Nội dung công việc */}
                <div>
                  <label className="block mb-2 text-xs font-medium text-gray-700">
                    Nội dung công việc <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                    {/* Thi công */}
                    <div>
                      <label className="block mb-2 text-xs font-medium text-gray-600">
                        Thi công
                      </label>
                      <select
                        value={scheduleData.job_content_construction || ""}
                        onChange={(e) =>
                          setScheduleData({
                            ...scheduleData,
                            job_content_construction: e.target.value,
                            job_content: [
                              e.target.value,
                              scheduleData.job_content_installation || "",
                              scheduleData.job_content_aircon || ""
                            ].filter(Boolean).join(", ")
                          })
                        }
                        className="w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                      >
                        <option value="">Chọn loại thi công</option>
                        <option value="Thi công điện">Thi công điện</option>
                        <option value="Thi công nước">Thi công nước</option>
                        <option value="Thi công xây dựng">Thi công xây dựng</option>
                        <option value="Thi công cơ khí">Thi công cơ khí</option>
                        <option value="Thi công nội thất">Thi công nội thất</option>
                        <option value="Thi công năng lượng mặt trời">Thi công năng lượng mặt trời</option>
                      </select>
                    </div>

                    {/* Lắp đặt */}
                    <div>
                      <label className="block mb-2 text-xs font-medium text-gray-600">
                        Lắp đặt
                      </label>
                      <select
                        value={scheduleData.job_content_installation || ""}
                        onChange={(e) =>
                          setScheduleData({
                            ...scheduleData,
                            job_content_installation: e.target.value,
                            job_content: [
                              scheduleData.job_content_construction || "",
                              e.target.value,
                              scheduleData.job_content_aircon || ""
                            ].filter(Boolean).join(", ")
                          })
                        }
                        className="w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                      >
                        <option value="">Chọn loại lắp đặt</option>
                        <option value="Lắp đặt thiết bị điện">Lắp đặt thiết bị điện</option>
                        <option value="Lắp đặt thiết bị nước">Lắp đặt thiết bị nước</option>
                        <option value="Lắp đặt nội thất">Lắp đặt nội thất</option>
                        <option value="Lắp đặt hệ thống">Lắp đặt hệ thống</option>
                        <option value="Lắp đặt camera">Lắp đặt camera</option>
                        <option value="Lắp đặt cửa cuốn">Lắp đặt cửa cuốn</option>
                      </select>
                    </div>

                    {/* Máy lạnh */}
                    <div>
                      <label className="block mb-2 text-xs font-medium text-gray-600">
                        Máy lạnh
                      </label>
                      <select
                        value={scheduleData.job_content_aircon || ""}
                        onChange={(e) =>
                          setScheduleData({
                            ...scheduleData,
                            job_content_aircon: e.target.value,
                            job_content: [
                              scheduleData.job_content_construction || "",
                              scheduleData.job_content_installation || "",
                              e.target.value
                            ].filter(Boolean).join(", ")
                          })
                        }
                        className="w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                      >
                        <option value="">Chọn loại máy lạnh</option>
                        <option value="Lắp đặt máy lạnh">Lắp đặt máy lạnh</option>
                        <option value="Sửa chữa máy lạnh">Sửa chữa máy lạnh</option>
                        <option value="Bảo trì máy lạnh">Bảo trì máy lạnh</option>
                        <option value="Vệ sinh máy lạnh">Vệ sinh máy lạnh</option>
                        <option value="Nạp gas máy lạnh">Nạp gas máy lạnh</option>
                        <option value="Thay linh kiện máy lạnh">Thay linh kiện máy lạnh</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Hiển thị nội dung đã chọn */}
                  {scheduleData.job_content && (
                    <div className="p-3 mt-3 bg-gray-50 rounded-lg">
                      <div className="mb-1 text-xs font-medium text-gray-700">Nội dung đã chọn:</div>
                      <div className="text-sm text-gray-900">{scheduleData.job_content}</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-xs font-medium text-gray-700">
                      Loại công việc <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={scheduleData.job_type_id}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          job_type_id: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                      required
                    >
                      <option value="">Chọn loại công việc</option>
                      {jobTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-xs font-medium text-gray-700">
                      Nguồn <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={scheduleData.job_source}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          job_source: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                      required
                    >
                      <option value="">Chọn nguồn</option>
                      {jobSources.map((source) => (
                        <option key={source.value} value={source.value}>
                          {source.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Thời gian và ưu tiên */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-xs font-medium text-gray-700">
                      Ngày hẹn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={scheduleData.job_appointment_date}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          job_appointment_date: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-xs font-medium text-gray-700">
                      Mức độ ưu tiên
                    </label>
                    <div className="flex gap-1">
                      {jobPriorities.map((priority) => (
                        <label
                          key={priority.value}
                          className={`flex items-center space-x-1 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors text-xs font-medium ${
                            scheduleData.job_priority === priority.value
                              ? "bg-brand-green/10 border border-brand-green/20"
                              : "border border-gray-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="job_priority"
                            value={priority.value}
                            checked={
                              scheduleData.job_priority === priority.value
                            }
                            onChange={(e) =>
                              setScheduleData({
                                ...scheduleData,
                                job_priority: e.target.value,
                              })
                            }
                            className="w-3 h-3 border-gray-300 text-brand-green focus:ring-brand-green"
                          />
                          <span className={priority.color}>
                            {priority.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                                {/* Chọn giờ hẹn */}
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduleData.has_appointment_time}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          has_appointment_time: e.target.checked,
                          job_appointment_time: e.target.checked ? scheduleData.job_appointment_time : "",
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Khách có hẹn giờ cụ thể
                    </span>
                  </label>
                  
                  {scheduleData.has_appointment_time && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center px-3 py-1 space-x-1 bg-white rounded border border-gray-200">
                        <select
                          value={scheduleData.job_appointment_time ? scheduleData.job_appointment_time.split(':')[0] : '00'}
                          onChange={(e) => {
                            const currentMinute = scheduleData.job_appointment_time ? scheduleData.job_appointment_time.split(':')[1] || '00' : '00';
                            const newTime = `${e.target.value.padStart(2, '0')}:${currentMinute}`;
                            setScheduleData({
                              ...scheduleData,
                              job_appointment_time: newTime,
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Tab' && !e.shiftKey) {
                              e.preventDefault();
                              e.target.nextElementSibling?.nextElementSibling?.focus();
                            } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                              const currentValue = parseInt(e.target.value);
                              const newValue = e.key === 'ArrowUp' 
                                ? (currentValue + 1) % 24 
                                : (currentValue - 1 + 24) % 24;
                              e.target.value = newValue.toString().padStart(2, '0');
                              e.target.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                          }}
                          className="w-12 text-sm font-medium text-center bg-transparent border-none cursor-pointer outline-none hover:bg-gray-50 focus:bg-blue-50"
                          title="Chọn giờ"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i.toString().padStart(2, '0')}>
                              {i.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                        <span className="text-sm font-bold text-gray-400">:</span>
                        <select
                          value={scheduleData.job_appointment_time ? scheduleData.job_appointment_time.split(':')[1] || '00' : '00'}
                          onChange={(e) => {
                            const currentHour = scheduleData.job_appointment_time ? scheduleData.job_appointment_time.split(':')[0] || '00' : '00';
                            const newTime = `${currentHour}:${e.target.value.padStart(2, '0')}`;
                            setScheduleData({
                              ...scheduleData,
                              job_appointment_time: newTime,
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Tab' && e.shiftKey) {
                              e.preventDefault();
                              e.target.previousElementSibling?.previousElementSibling?.focus();
                            } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                              const currentValue = parseInt(e.target.value);
                              const newValue = e.key === 'ArrowUp' 
                                ? (currentValue + 1) % 60 
                                : (currentValue - 1 + 60) % 60;
                              e.target.value = newValue.toString().padStart(2, '0');
                              e.target.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                          }}
                          className="w-12 text-sm font-medium text-center bg-transparent border-none cursor-pointer outline-none hover:bg-gray-50 focus:bg-blue-50"
                          title="Chọn phút"
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={i.toString().padStart(2, '0')}>
                              {i.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setScheduleData({
                            ...scheduleData,
                            job_appointment_time: currentTime,
                          });
                        }}
                        className="p-1.5 text-xs text-blue-600 bg-blue-50 rounded border border-blue-200 transition-colors hover:bg-blue-100"
                        title="Giờ hiện tại"
                      >
                        ⏰
                      </button>
                    </div>
                  )}
                </div>
              </div>

                          {/* Ghi chú và ảnh */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="flex justify-center items-center w-6 h-6 bg-gradient-to-r from-[#125d0d] to-[#f5d20d] rounded-md">
                  <FileText className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Ghi chú & Hình ảnh
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div>
                    <label className="block mb-1.5 text-xs font-medium text-gray-700">
                      Ghi chú thêm
                    </label>
                    <textarea
                      value={scheduleData.job_customer_note}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          job_customer_note: e.target.value,
                        })
                      }
                      className="px-3 py-2 w-full text-sm bg-white rounded-lg border-gray-200 shadow-sm transition-colors resize-none focus:border-brand-green focus:ring-brand-green"
                      rows="2"
                      placeholder="Nhập ghi chú bổ sung (không bắt buộc)"
                    />
                  </div>

                                    <div>
                    <label className="block mb-1.5 text-xs font-medium text-gray-700">
                      Chọn ảnh
                    </label>
                    
                    {/* Upload area */}
                    <div className="p-3 text-center rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-brand-green">
                      <div className="flex justify-center items-center space-x-2">
                        <Clipboard className="w-4 h-4 text-gray-500" />
                        <button
                          type="button"
                          onClick={handlePasteClick}
                          className="text-sm font-medium transition-colors text-brand-green hover:text-brand-green/80"
                        >
                          Chọn file ảnh
                        </button>
                        <span className="text-xs text-gray-500">hoặc dán ảnh (Ctrl+V)</span>
                      </div>
                    </div>
                    
                    {/* Ảnh đã chọn */}
                    {scheduleData.job_images && scheduleData.job_images.length > 0 && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <p className="text-xs text-gray-600">Ảnh ({scheduleData.job_images.length})</p>
                          <button
                            type="button"
                            onClick={() => {
                              setScheduleData(prev => ({ ...prev, job_images: [] }));
                      
                            }}
                            className="text-xs text-red-500 transition-colors hover:text-red-600"
                          >
                            Xóa tất cả
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 max-h-20 overflow-y-auto">
                          {scheduleData.job_images.map((file, index) => (
                            <div key={index} className="relative group aspect-square">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Ảnh ${index + 1}`}
                                className="object-cover w-full h-full rounded border border-gray-200 transition-opacity cursor-pointer hover:opacity-80"
                                onClick={() => handleImageClick(file, index)}
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(index);
                                }}
                                className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Nút điều khiển */}
              <div className="flex-shrink-0 px-6 pt-4 bg-white border-t border-gray-100">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600"
                  >
                    Xóa form
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#125d0d] to-[#f5d20d] rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed from-green-700 to-yellow-600"
                        : "hover:from-green-700 hover:to-yellow-600"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1.5"></div>
                        Đang tạo...
                      </>
                    ) : (
                      <div className="flex justify-center items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1.5" />
                        <span>Tạo công việc</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {imageViewerOpen && selectedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
          onClick={handleCloseImageViewer}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4 overflow-hidden">
            <button
              onClick={handleCloseImageViewer}
              className="absolute top-2 right-2 z-10 p-2 text-white rounded-full transition-colors bg-black/50 hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
            <div 
              className="flex justify-center items-center w-full h-full"
              onWheel={handleImageWheel}
            >
              <img
                src={URL.createObjectURL(selectedImage.file)}
                alt={`Ảnh ${selectedImage.index + 1}`}
                className="object-contain max-w-full max-h-full rounded-lg transition-transform duration-200 select-none"
                style={{
                  transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  cursor: imageZoom > 1 ? 'grab' : 'default'
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={handleImageMouseDown}
                draggable={false}
              />
            </div>
            <div className="absolute bottom-4 left-4 px-3 py-1 text-sm text-white rounded-lg bg-black/50">
              Ảnh {selectedImage.index + 1} / {scheduleData.job_images.length} 
              {imageZoom !== 1 && ` (${Math.round(imageZoom * 100)}%)`}
            </div>
            {imageZoom !== 1 && (
              <div className="flex absolute right-4 bottom-4 items-center px-3 py-1 space-x-2 text-sm text-white rounded-lg bg-black/50">
                <button
                  onClick={() => {
                    setImageZoom(1);
                    setImagePosition({ x: 0, y: 0 });
                  }}
                  className="transition-colors hover:text-gray-300"
                >
                  Reset
                </button>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-300">
                  {Math.abs(imagePosition.x) > 5 || Math.abs(imagePosition.y) > 5 ? 'Kéo để di chuyển' : 'Lăn chuột để zoom'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
