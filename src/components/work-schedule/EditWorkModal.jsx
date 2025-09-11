import { useState, useEffect } from "react";
import { X, Image, Upload, Trash2, Eye } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateWorkInList } from "@/store/slices/workSlice";
import Select from "react-select";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import DateInput from "@/components/ui/DateInput";
import JobContentSelector from "@/components/ui/JobContentSelector";

const EditWorkModal = ({ work, onClose, onSave }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    job_id: "", job_content: "", job_customer_name: "", job_customer_address: "",
    job_customer_phone: "", job_customer_note: "", job_appointment_date: "",
    job_type_id: "1", job_source: "call_center", job_appointment_time: "",
    job_priority: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleJobContentChange = (content) => {
    setFormData((prev) => ({ ...prev, job_content: content }));
  };

  useEffect(() => {
    if (!work) return;
    const workId = work.id || work.job_id || work.work_id || work.job_code;
    if (!workId) throw new Error("Work object does not contain a valid ID");

    const today = new Date().toISOString().split("T")[0];
    const formatDate = (dateStr) => dateStr ? (dateStr.includes("T") ? dateStr.split("T")[0] : dateStr) : today;
    const formatTime = (timeStr) => timeStr?.includes(":") ? timeStr.substring(0, 5) : "";
    const existingContent = work.job_content || work.work_content || work.content || "";

    const initialData = {
      job_id: workId, job_content: existingContent,
      job_customer_name: work.job_customer_name || work.name_cus || work.customer_name || "",
      job_customer_address: work.job_customer_address || work.street || work.address || "",
      job_customer_phone: work.job_customer_phone || work.phone_number || work.phone || "",
      job_customer_note: work.job_customer_note || work.work_note || work.note || "",
      job_appointment_date: formatDate(work.job_appointment_date || work.date_book || work.appointment_date),
      job_type_id: work.job_type_id || work.kind_work || work.type_id || "1",
      job_source: work.job_source || work.source || "call_center",
      job_appointment_time: formatTime(work.job_appointment_time || work.appointment_time),
      job_priority: work.job_priority || work.priority || work.priority_level || "",
    };

    setFormData(initialData);
    setOriginalData(initialData);

    if (work.images?.length) {
      setImages(work.images);
    } else if (work.images_count > 0) {
      setImages(Array(work.images_count).fill().map((_, i) => ({
        id: `mock-${i}`, url: `/api/placeholder/400/300?text=Hình+${i + 1}`,
        name: `Hình ${i + 1}`, isMock: true,
      })));
    } else {
      setImages([]);
    }
  }, [work]);

  const getChangedFields = () => {
    return Object.entries(formData).reduce((acc, [key, value]) => {
      if (key === "id" || key === "job_id") return acc;
      const original = originalData[key];
      const isChanged = value !== original && !(value === "" && original == null) && !(original === "" && value == null);
      if (isChanged) acc[key] = value;
      return acc;
    }, {});
  };

  const validateForm = () => {
    const errors = [];
    const required = ["job_content", "job_customer_phone", "job_customer_address", "job_appointment_date"];
    const labels = {
      job_content: "Nội dung công việc", job_customer_phone: "Số điện thoại khách hàng",
      job_customer_address: "Địa chỉ khách hàng", job_appointment_date: "Ngày hẹn",
    };

    required.forEach((field) => {
      if (!formData[field]?.trim()) errors.push(`${labels[field]} là bắt buộc`);
    });

    if (formData.job_customer_phone && !/^[0-9]{10,11}$/.test(formData.job_customer_phone)) {
      errors.push("Số điện thoại phải có 10-11 chữ số");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join(", "));
        setLoading(false);
        return;
      }

      const changedFields = getChangedFields();
      if (Object.keys(changedFields).length === 0) {
        onClose();
        return;
      }

      if (!formData.job_id) throw new Error("Job ID is required but not found");

      const updateData = {
        job_id: parseInt(formData.job_id), user_id: 1, ...changedFields,
      };
      if (updateData.job_type_id) updateData.job_type_id = parseInt(updateData.job_type_id);

      const response = await fetch("/api/works/update", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedWorkData = {
        ...changedFields, job_content: formData.job_content, job_customer_name: formData.job_customer_name,
        job_customer_address: formData.job_customer_address, job_customer_phone: formData.job_customer_phone,
        job_customer_note: formData.job_customer_note, job_appointment_date: formData.job_appointment_date,
        job_type_id: formData.job_type_id, job_source: formData.job_source, job_appointment_time: formData.job_appointment_time,
        job_priority: formData.job_priority, priority: formData.job_priority,
        status: formData.job_priority === "cancelled" ? "cancelled" : formData.job_priority === "no_answer" ? "no_answer" : 
                formData.job_priority === "worker_return" ? "worker_return" : "pending",
        updated_at: new Date().toISOString(),
      };

      try {
        dispatch(updateWorkInList({ 
          workId: parseInt(formData.job_id), 
          updatedData: updatedWorkData,
          forceRefresh: true 
        }));
      } catch (error) {
        console.error("❌ Redux update failed:", error);
      }

      // Refresh data trước khi đóng modal
      if (onSave && typeof onSave === "function") {
        try {
          await onSave(true);
          console.log('✅ Data refreshed successfully after work update');
        } catch (error) {
          console.error("❌ EditWorkModal: Error loading server API data:", error);
        }
      }

      onClose();
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Có lỗi xảy ra khi cập nhật công việc");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "job_customer_phone" ? value.replace(/\D/g, "").slice(0, 11) : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, i) => ({
      id: `new-${Date.now()}-${i}`, file, url: URL.createObjectURL(file),
      name: file.name, isNew: true,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handlePasteImage = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const newImage = {
            id: `paste-${Date.now()}-${i}`,
            file,
            url: URL.createObjectURL(file),
            name: `Hình từ clipboard ${new Date().toLocaleTimeString()}`,
            isNew: true,
          };
          setImages((prev) => [...prev, newImage]);
        }
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      const newImages = imageFiles.map((file, i) => ({
        id: `drop-${Date.now()}-${i}`,
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        isNew: true,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (imageId) => setImages((prev) => prev.filter((img) => img.id !== imageId));
  const handleViewImage = (index) => { setSelectedImageIndex(index); setShowImageModal(true); };

  const jobSources = [
    { value: "call_center", label: "Tổng đài" }, { value: "app_customer", label: "App Khách hàng" },
    { value: "app_worker", label: "App Thợ" }, { value: "website", label: "Website" },
    { value: "zalo", label: "Zalo" }, { value: "facebook", label: "Facebook" },
    { value: "tiktok", label: "TikTok" }, { value: "office", label: "Văn phòng" }, { value: "other", label: "Khác" }
  ];

  const jobTypes = [
    { value: "1", label: "Điện Nước" }, { value: "2", label: "Điện Lạnh" },
    { value: "3", label: "Đồ gỗ" }, { value: "4", label: "Năng Lượng Mặt trời" },
    { value: "5", label: "Xây Dựng" }, { value: "6", label: "Tài Xế" },
    { value: "7", label: "Cơ Khí" }, { value: "8", label: "Điện - Điện Tử" }, { value: "9", label: "Văn Phòng" }
  ];

  const selectStyles = {
    control: (base) => ({ ...base, minHeight: '32px', fontSize: '14px', borderColor: '#d1d5db', '&:hover': { borderColor: '#10b981' } }),
    valueContainer: (base) => ({ ...base, padding: '2px 8px' }),
    input: (base) => ({ ...base, margin: '0px', padding: '0px' }),
    indicatorSeparator: () => ({ display: 'none' }),
    indicatorsContainer: (base) => ({ ...base, padding: '0px 8px' })
  };

  return (
    <div
      className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-1 bg-gradient-to-r border-b border-gray-200 from-brand-green/5 to-brand-yellow/5">
          <div className="flex items-center space-x-2">
            <div className="flex justify-center items-center w-6 h-6 bg-gradient-to-r rounded-lg from-brand-green to-brand-yellow">
              <span className="text-xs font-bold text-white">✏️</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Chỉnh sửa công việc
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 rounded-lg transition-colors hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="overflow-y-auto flex-1 px-2 py-1"
          onPaste={handlePasteImage}
          tabIndex={0}
        >
          <form
            id="edit-work-form"
            onSubmit={handleSubmit}
            className="space-y-2"
          >
            {/* Section 1: Thông tin khách hàng */}
            <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    name="job_customer_name"
                    value={formData.job_customer_name}
                    onChange={handleChange}
                    className="px-2 py-2 w-full text-sm rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    maxLength="255"
                    placeholder="Nhập tên khách hàng"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="job_customer_phone"
                    value={formData.job_customer_phone}
                    maxLength="20"
                    onChange={handleChange}
                    className="px-2 py-2 w-full text-sm rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    required
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-2">
                <div>
                  <AddressAutocomplete
                    value={formData.job_customer_address}
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        job_customer_address: value,
                      }));
                    }}
                    onSelect={(address) => {
                      setFormData((prev) => ({
                        ...prev,
                        job_customer_address: address.description,
                      }));
                    }}
                    placeholder="Nhập địa chỉ để tìm kiếm tự động..."
                    required={true}
                    label="Địa chỉ"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Nguồn công việc <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={jobSources.find(source => source.value === formData.job_source)}
                    onChange={(selectedOption) => {
                      const value = selectedOption?.value || "";
                      setFormData((prev) => ({ ...prev, job_source: value }));
                    }}
                    options={jobSources}
                    placeholder="Chọn nguồn"
                    isSearchable={true}
                    isClearable={true}
                    className="text-sm"
                    styles={selectStyles}
                  />
                </div>
              </div>
            </div>
            {/* Section 2: Nội dung công việc */}
            <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <JobContentSelector
                value={formData.job_content}
                onContentChange={handleJobContentChange}
                required={true}
                error={error && error.includes("Nội dung công việc") ? error : null}
              />
            </div>

            {/* Section 3: Thông tin cơ bản & Lịch hẹn */}
            <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    Loại công việc <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={jobTypes.find(type => type.value === formData.job_type_id)}
                    onChange={(selectedOption) => {
                      const value = selectedOption?.value || "";
                      setFormData((prev) => ({ ...prev, job_type_id: value }));
                    }}
                    options={jobTypes}
                    placeholder="Chọn loại công việc"
                    isSearchable={true}
                    isClearable={true}
                    className="text-sm"
                    styles={{...selectStyles, control: (base) => ({...base, minHeight: '28px'})}}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    Ngày hẹn <span className="text-red-500">*</span>
                  </label>
                  <DateInput
                    value={formData.job_appointment_date}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        job_appointment_date: e.target.value,
                      }));
                    }}
                    placeholder="DD/MM/YYYY"
                    className="px-2 py-1.5 w-full text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    required
                  />
                </div>

                {/* Only show time input if there's existing time or user wants to add time */}
                {(formData.job_appointment_time ||
                  originalData.job_appointment_time) && (
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700">
                      Giờ hẹn
                    </label>
                    <input
                      type="time"
                      name="job_appointment_time"
                      value={formData.job_appointment_time}
                      onChange={handleChange}
                      className="px-2 py-1.5 w-full text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                )}
              </div>

              <div className="mt-2">
                <label className="block mb-1 text-xs font-medium text-gray-700">
                  Mức độ ưu tiên
                </label>
                <div className="flex gap-1">
                  {[
                    {
                      value: "",
                      label: "Bình Thường",
                      color: "text-gray-500",
                      bg: "bg-gray-600",
                    },
                    {
                      value: "medium",
                      label: "Khách Quen",
                      color: "text-brand-green",
                      bg: "bg-blue-600",
                    },
                    {
                      value: "high",
                      label: "Lịch Ưu Tiên",
                      color: "text-brand-yellow",
                      bg: "bg-red-600",
                    },
                  ].map((p) => (
                    <label
                      key={p.value}
                      className={`flex items-center space-x-1 px-1.5 py-1 rounded cursor-pointer transition-all duration-200 text-xs font-medium border ${
                        formData.job_priority === p.value
                          ? `${p.bg} text-white border-gray-600 shadow-sm`
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="job_priority"
                        value={p.value}
                        checked={formData.job_priority === p.value}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            job_priority: e.target.value,
                          }))
                        }
                        className="w-2.5 h-2.5 border-gray-300 text-brand-green focus:ring-brand-green"
                      />
                      <span
                        className={
                          formData.job_priority === p.value
                            ? "text-white"
                            : p.color
                        }
                      >
                        {p.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-2">
                <label className="block mb-1 text-xs font-medium text-gray-700">
                  Ghi chú khách hàng
                </label>
                <textarea
                  name="job_customer_note"
                  value={formData.job_customer_note}
                  onChange={handleChange}
                  className="px-2 py-1.5 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  rows="1"
                  maxLength="500"
                  placeholder="Nhập ghi chú khách hàng"
                />
              </div>
            </div>

            {/* Section 4: Hình ảnh đính kèm */}
            <div 
              className="p-1.5 bg-gray-50 rounded-lg border border-gray-200"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="flex items-center text-xs font-semibold text-gray-900">
                  <span className="flex justify-center items-center mr-1 w-3 h-3 text-xs text-white rounded-full bg-brand-green">
                    4
                  </span>
                  Hình ảnh ({images.length})
                </h3>
                <div className="flex space-x-1">
                  <label className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-white rounded transition-colors cursor-pointer bg-brand-green hover:bg-green-700">
                    <Upload className="mr-1 w-2.5 h-2.5" />
                    Upload
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.multiple = true;
                      input.accept = 'image/*';
                      input.onchange = handleImageUpload;
                      input.click();
                    }}
                    className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-white rounded transition-colors cursor-pointer bg-blue-600 hover:bg-blue-700"
                  >
                    Upload
                  </button>
                </div>
              </div>

              {/* Image grid - compact with preview */}
              {images.length > 0 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-6 gap-0.5 sm:grid-cols-8 lg:grid-cols-10">
                    {images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <div className="overflow-hidden bg-gray-100 rounded border border-gray-200 aspect-square">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="object-cover w-full h-full transition-opacity cursor-pointer hover:opacity-80"
                            onClick={() => handleViewImage(index)}
                          />
                        </div>
                        <div className="flex absolute top-0 right-0 space-x-0 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleViewImage(index)}
                            className="p-0.5 text-white rounded transition-colors bg-black/50 hover:bg-black/70"
                            title="Xem"
                          >
                            <Eye className="w-1.5 h-1.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(image.id)}
                            className="p-0.5 text-white rounded transition-colors bg-red-500/80 hover:bg-red-600"
                            title="Xóa"
                          >
                            <Trash2 className="w-1.5 h-1.5" />
                          </button>
                        </div>
                        {/* Image info overlay */}
                        <div className="absolute right-0 bottom-0 left-0 p-1 text-xs text-white opacity-0 transition-opacity bg-black/70 group-hover:opacity-100">
                          <div className="truncate" title={image.name}>
                            {image.name}
                          </div>
                          <div className="text-xs opacity-75">
                            {image.isNew ? 'Mới' : 'Có sẵn'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Image summary */}
                  <div className="flex justify-between items-center p-2 text-xs text-gray-600 bg-gray-100 rounded">
                    <span>Tổng: {images.length} hình ảnh</span>
                    <div className="flex space-x-2">
                      <span>Mới: {images.filter(img => img.isNew).length}</span>
                      <span>Có sẵn: {images.filter(img => !img.isNew).length}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center py-6 text-gray-400 rounded border-2 border-gray-300 border-dashed transition-colors hover:border-brand-green">
                  <Image className="mb-2 w-8 h-8" />
                  <p className="text-sm font-medium">Chưa có hình ảnh</p>
                  <p className="mt-1 text-xs text-center">
                    Kéo thả file, dán hình ảnh từ clipboard,<br />
                    hoặc click Upload để chọn file
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="p-2.5 text-sm text-red-600 border border-red-200 rounded-md bg-red-50">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 bg-gray-50 rounded-b-xl border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              <span className="font-medium">Lưu ý:</span> Các trường có dấu{" "}
              <span className="text-red-500">*</span> là bắt buộc
            </div>
            <div className="flex space-x-1.5">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white rounded border border-gray-300 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                form="edit-work-form"
                disabled={loading}
                className="flex items-center px-4 py-1.5 text-xs font-semibold text-[#125d0d] hover:text-white bg-gradient-to-r rounded shadow-sm transition-all duration-200 from-brand-green to-brand-yellow hover:from-green-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <span className="mr-1">💾</span>
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && images.length > 0 && (
        <div className="flex fixed inset-0 justify-center items-center z-60 bg-black/75" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Hình ảnh ({selectedImageIndex + 1}/{images.length})</h3>
              <button onClick={() => setShowImageModal(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative p-4">
              <img src={images[selectedImageIndex]?.url} alt={images[selectedImageIndex]?.name} className="max-w-full max-h-[60vh] mx-auto object-contain rounded-lg" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setSelectedImageIndex((prev) => prev > 0 ? prev - 1 : images.length - 1)} className="absolute left-4 top-1/2 p-2 text-white rounded-full transition-colors -translate-y-1/2 bg-black/50 hover:bg-black/70">←</button>
                  <button onClick={() => setSelectedImageIndex((prev) => prev < images.length - 1 ? prev + 1 : 0)} className="absolute right-4 top-1/2 p-2 text-white rounded-full transition-colors -translate-y-1/2 bg-black/50 hover:bg-black/70">→</button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex overflow-x-auto space-x-2">
                  {images.map((image, index) => (
                    <button key={image.id} onClick={() => setSelectedImageIndex(index)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === selectedImageIndex ? "border-brand-green" : "border-gray-200 hover:border-gray-300"}`}>
                      <img src={image.url} alt={image.name} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditWorkModal;
