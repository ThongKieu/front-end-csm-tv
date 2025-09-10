"use client";

import { useState, useEffect, useRef, useCallback, memo, useMemo, useTransition } from "react";
import axios from "axios";
import {
  X,
  User,
  FileText,
  Briefcase,
  CheckCircle2,
  Clipboard,
} from "lucide-react";
// Không cần import data cũ nữa vì sẽ dùng API
import { API_URLS } from "../../config/constants";
import AddressAutocomplete from "../ui/AddressAutocomplete";
// Không cần import addNewWork nữa vì chỉ dựa vào API

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
  selectedDate = null, // Thêm prop để nhận ngày hiện tại được chọn
}) {
  // Không cần dispatch nữa vì chỉ dựa vào API
  const fileInputRef = useRef(null);
  const submissionRef = useRef(false); // Track submission state
  const requestIdRef = useRef(null); // Track unique request ID

  // Date & time helpers
  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };
  const getDefaultFormData = (time = getCurrentTime()) => ({
    job_content: "",
    job_appointment_date: getTodayDate(),
    job_appointment_time: time,
    job_customer_address: "",
    job_customer_phone: "",
    job_customer_name: "",
    job_customer_note: "",
    job_type_id: "1", // Mặc định chọn "Điện Nước" (value = "1")
    job_source: "call_center",
    job_priority: "",
    user_id: "1",
    job_images: [],
    has_appointment_time: false, // Thêm field để kiểm soát việc có hẹn giờ hay không
  });
  const defaultFormData = getDefaultFormData();

  const [scheduleData, setScheduleData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  
  // States cho service search
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState(false);
  
  // useTransition để làm cho UI mượt mà hơn
  const [isPending, startTransition] = useTransition();

  // Hàm loại bỏ dấu tiếng Việt
  const removeVietnameseAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  // Filter services based on search term - sử dụng useMemo để tối ưu
  const filteredServices = useMemo(() => {
    if (serviceSearchTerm.trim() === "") {
      return [];
    }

    const searchTerm = removeVietnameseAccents(serviceSearchTerm.toLowerCase());
    return services.filter(service => {
      const serviceName = removeVietnameseAccents(service.name.toLowerCase());
      return serviceName.includes(searchTerm);
    });
  }, [serviceSearchTerm, services]);

  // Update dropdown visibility based on filtered services
  useEffect(() => {
    setShowServiceDropdown(filteredServices.length > 0 && serviceSearchTerm.trim() !== "");
  }, [filteredServices, serviceSearchTerm]);

  // Service handlers - tối ưu để tránh giật
  const handleServiceSelect = useCallback((service) => {
    startTransition(() => {
      setSelectedServices(prev => {
        const isAlreadySelected = prev.some(s => s.id === service.id);
        if (!isAlreadySelected) {
          const newSelectedServices = [...prev, service];
          const content = newSelectedServices.map(s => s.name).join(", ");
          
          // Batch state updates trong một callback
          setScheduleData(prevSchedule => ({
            ...prevSchedule,
            job_content: content,
          }));
          setServiceError(false);
          
          console.log("Selected service:", service.name, "Total services:", newSelectedServices.length);
          return newSelectedServices;
        }
        return prev;
      });
    });
    
    // Clear search và dropdown ngay lập tức (không cần transition)
    setServiceSearchTerm("");
    setShowServiceDropdown(false);
  }, []); // Bỏ dependency để tránh re-create

  const handleServiceRemove = useCallback((serviceId) => {
    setSelectedServices(prev => {
      const newSelectedServices = prev.filter(s => s.id !== serviceId);
      const content = newSelectedServices.map(s => s.name).join(", ");
      
      // Batch state updates trong một callback
      setScheduleData(prevSchedule => ({
        ...prevSchedule,
        job_content: content,
      }));
      
      // Clear error if there are still services selected
      if (newSelectedServices.length > 0) {
        setServiceError(false);
      }
      
      console.log("Removed service, new content:", content);
      return newSelectedServices;
    });
  }, []); // Bỏ dependency để tránh re-create

  // Debounced search handler
  const handleServiceSearchChange = useCallback((e) => {
    const value = e.target.value;
    setServiceSearchTerm(value);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // This will trigger the useMemo for filteredServices
    }, 150); // 150ms debounce

    return () => clearTimeout(timer);
  }, [serviceSearchTerm]);

  // Memoized dropdown item component - tối ưu để tránh re-render
  const ServiceDropdownItem = useMemo(() => {
    return memo(({ service, isSelected, onSelect }) => (
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelect(service);
        }}
        className={`px-3 py-2 text-sm transition-colors cursor-pointer select-none ${
          isSelected 
            ? "font-medium bg-brand-green/10 text-brand-green" 
            : "text-gray-700 hover:bg-gray-100"
        }`}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className="flex justify-between items-center">
          <span>{service.name}</span>
          {isSelected && (
            <span className="text-xs">✓</span>
          )}
        </div>
      </div>
    ));
  }, []);

  // Load services from API
  useEffect(() => {
    const fetchServices = async () => {
      if (services.length > 0) return; // Đã load rồi
      
      setLoadingServices(true);
      try {
        const response = await fetch('https://data.thoviet.com/api/get-service-all');
        const data = await response.json();
        
        if (data.success && data.data) {
          setServices(data.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoadingServices(false);
      }
    };

    if (isOpen) {
      fetchServices();
    }
  }, [isOpen, services.length]);

  // Load saved data when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem("createScheduleFormData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          const hasAppointmentTime =
            parsedData.has_appointment_time !== undefined
              ? parsedData.has_appointment_time
              : parsedData.job_appointment_time &&
                parsedData.job_appointment_time.trim() !== "";

          // Format giờ hẹn
          let appointmentTime = parsedData.job_appointment_time || "";
          if (appointmentTime && hasAppointmentTime) {
            const timeMatch = appointmentTime.match(/(\d{1,2}):(\d{2})/);
            if (timeMatch) {
              const hour = parseInt(timeMatch[1]).toString().padStart(2, "0");
              appointmentTime = `${hour}:${timeMatch[2]}`;
            }
          }

          setScheduleData({
            ...defaultFormData,
            ...parsedData,
            has_appointment_time: hasAppointmentTime,
            job_appointment_time: appointmentTime,
          });

          // Load selected services from saved data
          if (parsedData.selectedServices) {
            setSelectedServices(parsedData.selectedServices);
          }
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
        JSON.stringify({
          ...scheduleData,
          selectedServices: selectedServices
        })
      );
    }
  }, [scheduleData, selectedServices, isOpen]);

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

  const clearSavedData = () =>
    localStorage.removeItem("createScheduleFormData");
  const resetForm = () => {
    setScheduleData(getDefaultFormData(currentTime));
    setSelectedServices([]);
    setServiceSearchTerm("");
    setServiceError(false);
  };

  // Phone number handlers
  const handlePhoneChange = (e) => {
    const numbersOnly = e.target.value.replace(/\D/g, "").slice(0, 11);
    setScheduleData({ ...scheduleData, job_customer_phone: numbersOnly });
  };
  const getPhoneDigitsCount = () =>
    scheduleData.job_customer_phone.replace(/\D/g, "").length;
  const isPhoneValid = () => {
    const digits = getPhoneDigitsCount();
    return digits >= 10 && digits <= 11;
  };

  // Data options
  const jobPriorities = [
    { value: "", label: "Bình Thường", color: "text-gray-500" },
    { value: "medium", label: "Khách quen", color: "text-brand-green" },
    { value: "high", label: "Lịch ưu tiên", color: "text-brand-yellow" },
  ];
  const jobTypes = [
    { value: "1", label: "Điện Nước" },
    { value: "2", label: "Điện Lạnh" },
    { value: "3", label: "Đồ gỗ" },
    { value: "4", label: "Năng Lượng Mặt trời" },
    { value: "5", label: "Xây Dựng" },
    { value: "6", label: "Tài Xế" },
    { value: "7", label: "Cơ Khí" },
    { value: "8", label: "Điện - Điện Tử" },
    { value: "9", label: "Văn Phòng" },
  ];
  const jobSources = [
    { value: "call_center", label: "Tổng đài" },
    { value: "app_customer", label: "App Khách hàng" },
    { value: "app_worker", label: "App Thợ" },
    { value: "website", label: "Website" },
    { value: "zalo", label: "Zalo" },
    { value: "facebook", label: "Facebook" },
    { value: "tiktok", label: "TikTok" },
    { value: "office", label: "Văn phòng" },
    { value: "other", label: "Khác" },
  ];

  // Handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setScheduleData((prev) => ({
      ...prev,
      job_images: [...prev.job_images, ...files],
    }));
  };
  const handleRemoveImage = (index) => {
    setScheduleData((prev) => ({
      ...prev,
      job_images: prev.job_images.filter((_, i) => i !== index),
    }));
  };
  const handlePasteClick = () => fileInputRef.current?.click();
  const handleImageClick = (file, index) => {
    setSelectedImage({ file, index });
    setImageViewerOpen(true);
  };
  const handleCloseImageViewer = () => {
    setImageViewerOpen(false);
    setSelectedImage(null);
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (submissionRef.current) {
      return;
    }

    // Validation
    const requiredFields = [
      { field: "job_appointment_date", message: "Vui lòng chọn ngày hẹn" },
      { field: "job_customer_address", message: "Vui lòng nhập địa chỉ" },
      { field: "job_customer_phone", message: "Vui lòng nhập số điện thoại" },
      { field: "job_type_id", message: "Vui lòng chọn loại công việc" },
      { field: "job_source", message: "Vui lòng chọn nguồn" },
      // Bỏ validation bắt buộc cho priority - cho phép "không chọn"
    ];

    // Validate nội dung công việc - kiểm tra cả job_content và selectedServices
    const hasJobContent = scheduleData.job_content && scheduleData.job_content.trim();
    const hasSelectedServices = selectedServices && selectedServices.length > 0;
    
    if (!hasJobContent && !hasSelectedServices) {
      console.log("Validation failed: No job content or selected services");
      setServiceError(true);
      return;
    } else {
      setServiceError(false);
    }

    // Priority không bắt buộc nữa - có thể để trống

    for (const { field, message } of requiredFields) {
      if (!scheduleData[field] || !scheduleData[field].toString().trim()) {
        return;
      }
    }

    // Validate giờ hẹn
    if (
      scheduleData.has_appointment_time &&
      (!scheduleData.job_appointment_time ||
        !scheduleData.job_appointment_time.trim())
    ) {
      return;
    }

    if (
      scheduleData.has_appointment_time &&
      scheduleData.job_appointment_time
    ) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(scheduleData.job_appointment_time)) {
        return;
      }
    }

    // Validate phone number format
    if (!isPhoneValid()) {
      return;
    }

    // Generate unique request ID to prevent duplicates
    const requestId = `job_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    requestIdRef.current = requestId;
    submissionRef.current = true; // Set submission state to true
    setIsSubmitting(true);

    try {
      // Check if this request is still valid (not superseded by another)
      if (requestIdRef.current !== requestId) {
        return;
      }

      // Chuẩn bị dữ liệu gửi đi với format chính xác
      // Đảm bảo job_content được tạo từ selectedServices nếu chưa có
      let finalJobContent = scheduleData.job_content.trim();
      if (!finalJobContent && selectedServices.length > 0) {
        finalJobContent = selectedServices.map(service => service.name).join(", ");
      }
      
      const requestData = {
        job_content: finalJobContent,
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
        job_type_id: parseInt(scheduleData.job_type_id), // Đảm bảo là số
        job_source: scheduleData.job_source,
        job_priority: scheduleData.job_priority.trim(), // Đảm bảo priority được gửi đúng
        user_id: parseInt(scheduleData.user_id) || 1, // Đảm bảo là số
        // Thêm các field có thể cần thiết
        job_status: "pending", // Trạng thái mặc định
      };

      // Final validation: priority có thể để trống hoặc là giá trị hợp lệ
      if (requestData.job_priority && requestData.job_priority !== "") {
        // Nếu có chọn priority thì phải là giá trị hợp lệ
        const validPriorities = ["high", "medium"];
        if (!validPriorities.includes(requestData.job_priority)) {
          console.error("Invalid priority value:", requestData.job_priority);
          throw new Error("Invalid priority value");
        }
      }

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

      const response = await axios.post(API_URLS.JOB_CREATE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          "X-Request-ID": requestId, // Add request ID to headers
        },
        timeout: 30000, // 30 giây timeout
      });

      // Check if this request is still valid
      if (requestIdRef.current !== requestId) {
        return;
      }

      if (response.status === 200 || response.status === 201) {
        // Check if this request is still valid
        if (requestIdRef.current !== requestId) {
          return;
        }

        // Validate response data to ensure only one job was created
        if (response.data) {
          // Check if response indicates duplicate creation
          if (
            response.data.message &&
            response.data.message.includes("duplicate")
          ) {
            console.error("API indicates duplicate job creation");
            throw new Error("Duplicate job detected by API");
          }
        }

        clearSavedData();

        // Gọi callback để refresh data từ server
        if (onSuccess && typeof onSuccess === "function") {
          const targetDate = selectedDate || scheduleData.job_appointment_date;
          try {
            setIsRefreshing(true);
            await onSuccess(targetDate);
          } catch (error) {
            console.error(
              "❌ CreateScheduleModal: Server refresh failed:",
              error
            );
            // Không throw error vì job đã được tạo thành công
          } finally {
            setIsRefreshing(false);
          }
        }        
        // Đóng modal và reset form (không cần alert)
        onClose();
        resetForm();
      } else {
        console.error("Unexpected response status:", response.status);
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      // Check if this request is still valid
      if (requestIdRef.current !== requestId) {
        return;
      }

      console.error("Error creating job:", error);
      console.error("Error response:", error.response);
      console.error("Error request:", error.request);

      let errorMessage = "Có lỗi xảy ra khi tạo công việc";

      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

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

      // TODO: Hiển thị error message cho user
      console.error("Error message:", errorMessage);
    } finally {
      // Check if this request is still valid
      if (requestIdRef.current !== requestId) {
        return;
      }

      submissionRef.current = false; // Reset submission state
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
            <form
              onSubmit={(e) => {
                // Prevent form submission if already submitting
                if (submissionRef.current) {
                  e.preventDefault();
                  return false;
                }
                handleCreateSchedule(e);
              }}
              className="p-6 space-y-6"
              onKeyDown={(e) => {
                // Prevent form submission on Enter key if already submitting
                if (e.key === "Enter" && submissionRef.current) {
                  e.preventDefault();
                }
              }}
            >
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

                {/* Địa chỉ với autocomplete */}
                <AddressAutocomplete
                  value={scheduleData.job_customer_address}
                  onChange={(value) => {
                    setScheduleData({
                      ...scheduleData,
                      job_customer_address: value,
                    });
                  }}
                  onSelect={(address) => {
                    setScheduleData({
                      ...scheduleData,
                      job_customer_address: address.description,
                    });
                  }}
                  placeholder="Nhập địa chỉ để tìm kiếm tự động..."
                  required={true}
                  label="Địa chỉ"
                />
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

                {/* Nội dung công việc - Service search */}
                <div className="space-y-3">
                  {/* Service search input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={serviceSearchTerm}
                      onChange={handleServiceSearchChange}
                      onFocus={() => {
                        if (serviceSearchTerm.trim() && filteredServices.length > 0) {
                          setShowServiceDropdown(true);
                        }
                      }}
                      className={`w-full rounded-lg border-gray-200 shadow-sm focus:border-brand-green focus:ring-brand-green bg-white text-sm px-3 py-2.5 transition-colors ${
                        serviceError ? "border-red-500" : ""
                      }`}
                      placeholder="Tìm kiếm dịch vụ..."
                    />
                    
                    {/* Loading indicator */}
                    {loadingServices && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 rounded-full border-b-2 animate-spin border-brand-green"></div>
                      </div>
                    )}

                    {/* Service dropdown */}
                    {showServiceDropdown && filteredServices.length > 0 && (
                      <div className="overflow-y-auto absolute z-10 mt-1 w-full max-h-60 bg-white rounded-lg border border-gray-200 shadow-lg">
                        {filteredServices.map((service) => {
                          const isSelected = selectedServices.some(s => s.id === service.id);
                          return (
                            <ServiceDropdownItem
                              key={service.id}
                              service={service}
                              isSelected={isSelected}
                              onSelect={handleServiceSelect}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Error message */}
                  {serviceError && (
                    <p className="mt-1 text-xs text-red-500">
                      Vui lòng chọn ít nhất một dịch vụ
                    </p>
                  )}

                  {/* Selected services tags */}
                  {selectedServices.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-gray-600">
                          Dịch vụ đã chọn ({selectedServices.length}):
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedServices([]);
                            setScheduleData((prev) => ({
                              ...prev,
                              job_content: "",
                            }));
                            setServiceError(false);
                          }}
                          className="text-xs text-red-500 transition-colors hover:text-red-600"
                          title="Xóa tất cả"
                        >
                          × Xóa tất cả
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedServices.map((service) => (
                          <div
                            key={service.id}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border bg-brand-green/10 text-brand-green border-brand-green/20"
                          >
                            <span>{service.name}</span>
                            <button
                              type="button"
                              onClick={() => handleServiceRemove(service.id)}
                              className="ml-1.5 text-brand-green/60 hover:text-brand-green transition-colors"
                              title="Xóa"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Job content preview */}
                  {scheduleData.job_content && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Nội dung công việc:
                      </label>
                      <div className="p-2 bg-white rounded border border-gray-200">
                        <span className="text-sm font-medium text-gray-800">
                          {scheduleData.job_content}
                        </span>
                      </div>
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
                    <div className="flex gap-1.5">
                      {jobPriorities.map((priority) => (
                        <label
                          key={priority.value}
                          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-all duration-200 text-xs font-medium border ${
                            scheduleData.job_priority === priority.value
                              ? priority.value === ""
                                ? "bg-gray-600 text-white border-gray-600 shadow-sm"
                                : priority.value === "medium"
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-red-600 text-white border-red-600 shadow-sm"
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="job_priority"
                            value={priority.value}
                            checked={
                              scheduleData.job_priority === priority.value
                            }
                            onChange={(e) => {
                              const newPriority = e.target.value;
                              setScheduleData((prev) => ({
                                ...prev,
                                job_priority: newPriority,
                              }));
                            }}
                            className="w-3 h-3 border-gray-300 text-brand-green focus:ring-brand-green"
                          />
                          <span
                            className={
                              scheduleData.job_priority === priority.value
                                ? "text-white"
                                : priority.color
                            }
                          >
                            {priority.value === ""
                              ? "Bình Thường"
                              : priority.value === "medium"
                              ? "Khách quen"
                              : priority.value === "high"
                              ? "Lịch ưu tiên"
                              : priority.label}
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
                          job_appointment_time: e.target.checked
                            ? scheduleData.job_appointment_time
                            : "",
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
                          value={
                            scheduleData.job_appointment_time
                              ? scheduleData.job_appointment_time.split(":")[0]
                              : "00"
                          }
                          onChange={(e) => {
                            const currentMinute =
                              scheduleData.job_appointment_time
                                ? scheduleData.job_appointment_time.split(
                                    ":"
                                  )[1] || "00"
                                : "00";
                            const newTime = `${e.target.value.padStart(
                              2,
                              "0"
                            )}:${currentMinute}`;
                            setScheduleData({
                              ...scheduleData,
                              job_appointment_time: newTime,
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Tab" && !e.shiftKey) {
                              e.preventDefault();
                              e.target.nextElementSibling?.nextElementSibling?.focus();
                            } else if (
                              e.key === "ArrowUp" ||
                              e.key === "ArrowDown"
                            ) {
                              e.preventDefault();
                              const currentValue = parseInt(e.target.value);
                              const newValue =
                                e.key === "ArrowUp"
                                  ? (currentValue + 1) % 24
                                  : (currentValue - 1 + 24) % 24;
                              e.target.value = newValue
                                .toString()
                                .padStart(2, "0");
                              e.target.dispatchEvent(
                                new Event("change", { bubbles: true })
                              );
                            }
                          }}
                          className="w-12 text-sm font-medium text-center bg-transparent border-none cursor-pointer outline-none hover:bg-gray-50 focus:bg-blue-50"
                          title="Chọn giờ"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option
                              key={i}
                              value={i.toString().padStart(2, "0")}
                            >
                              {i.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <span className="text-sm font-bold text-gray-400">
                          :
                        </span>
                        <select
                          value={
                            scheduleData.job_appointment_time
                              ? scheduleData.job_appointment_time.split(
                                  ":"
                                )[1] || "00"
                              : "00"
                          }
                          onChange={(e) => {
                            const currentHour =
                              scheduleData.job_appointment_time
                                ? scheduleData.job_appointment_time.split(
                                    ":"
                                  )[0] || "00"
                                : "00";
                            const newTime = `${currentHour}:${e.target.value.padStart(
                              2,
                              "0"
                            )}`;
                            setScheduleData({
                              ...scheduleData,
                              job_appointment_time: newTime,
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Tab" && e.shiftKey) {
                              e.preventDefault();
                              e.target.previousElementSibling?.previousElementSibling?.focus();
                            } else if (
                              e.key === "ArrowUp" ||
                              e.key === "ArrowDown"
                            ) {
                              e.preventDefault();
                              const currentValue = parseInt(e.target.value);
                              const newValue =
                                e.key === "ArrowUp"
                                  ? (currentValue + 1) % 60
                                  : (currentValue - 1 + 60) % 60;
                              e.target.value = newValue
                                .toString()
                                .padStart(2, "0");
                              e.target.dispatchEvent(
                                new Event("change", { bubbles: true })
                              );
                            }
                          }}
                          className="w-12 text-sm font-medium text-center bg-transparent border-none cursor-pointer outline-none hover:bg-gray-50 focus:bg-blue-50"
                          title="Chọn phút"
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <option
                              key={i}
                              value={i.toString().padStart(2, "0")}
                            >
                              {i.toString().padStart(2, "0")}
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
                        <span className="text-xs text-gray-500">
                          hoặc dán ảnh (Ctrl+V)
                        </span>
                      </div>
                    </div>

                    {/* Ảnh đã chọn */}
                    {scheduleData.job_images &&
                      scheduleData.job_images.length > 0 && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1.5">
                            <p className="text-xs text-gray-600">
                              Ảnh ({scheduleData.job_images.length})
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setScheduleData((prev) => ({
                                  ...prev,
                                  job_images: [],
                                }));
                              }}
                              className="text-xs text-red-500 transition-colors hover:text-red-600"
                            >
                              Xóa tất cả
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 max-h-20 overflow-y-auto">
                            {scheduleData.job_images.map((file, index) => (
                              <div
                                key={index}
                                className="relative group aspect-square"
                              >
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

              {/* Nút điều khiển - Di chuyển lên trên */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
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
                    disabled={isSubmitting || isRefreshing}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xóa form
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isRefreshing}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#125d0d] to-[#f5d20d] rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSubmitting || isRefreshing
                        ? "opacity-50 cursor-not-allowed from-green-700 to-yellow-600"
                        : "hover:from-green-700 hover:to-yellow-600"
                    }`}
                    onClick={(e) => {
                      // Additional protection against duplicate clicks
                      if (submissionRef.current) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1.5"></div>
                        Đang tạo...
                      </>
                    ) : isRefreshing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1.5"></div>
                        Đang cập nhật...
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
            <div className="flex justify-center items-center w-full h-full">
              <img
                src={URL.createObjectURL(selectedImage.file)}
                alt={`Ảnh ${selectedImage.index + 1}`}
                className="object-contain max-w-full max-h-full rounded-lg transition-transform duration-200 select-none"
              />
            </div>
            <div className="absolute bottom-4 left-4 px-3 py-1 text-sm text-white rounded-lg bg-black/50">
              Ảnh {selectedImage.index + 1} / {scheduleData.job_images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
