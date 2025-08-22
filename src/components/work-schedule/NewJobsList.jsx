import React, { useState } from "react";
import JobCard from "./JobCard";
import AssignWorkerModal from "./AssignWorkerModal";

const NewJobsList = ({
  jobs = {},
  workers = [],
  onAssign,
  onEdit,
  onCopy,
  copiedWorkId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isChangingWorker, setIsChangingWorker] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(""); // Thêm state cho priority

  // Lấy dữ liệu từ data object
  const jobData = jobs?.data || jobs || {};

  // Tạo danh sách tất cả jobs từ các category
  const allJobs = [
    ...(jobData.job_priority || []).map((job) => ({
      ...job,
      category: "priority",
      priority: "high",
    })),
    ...(jobData.job_normal || []).map((job) => ({
      ...job,
      category: "normal",
      priority: "normal",
    })),
    ...(jobData.job_cancelled || []).map((job) => ({
      ...job,
      category: "cancelled",
      priority: "cancelled",
    })),
    ...(jobData.job_no_answer || []).map((job) => ({
      ...job,
      category: "no_answer",
      priority: "no_answer",
    })),
    ...(jobData.job_worker_return || []).map((job) => ({
      ...job,
      category: "worker_return",
      priority: "worker_return",
    })),
    ...(jobData.job_phone_error || []).map((job) => ({
      ...job,
      category: "phone_error",
      priority: "phone_error",
    })),
  ];

  // Lọc jobs theo category
  const filteredJobs =
    selectedCategory === "all"
      ? allJobs
      : allJobs.filter((job) => job.category === selectedCategory);

  // Tính tổng số jobs theo category
  const categoryCounts = {
    priority: jobData.job_priority?.length || 0,
    normal: jobData.job_normal?.length || 0,
    cancelled: jobData.job_cancelled?.length || 0,
    no_answer: jobData.job_no_answer?.length || 0,
    worker_return: jobData.job_worker_return?.length || 0,
    phone_error: jobData.job_phone_error?.length || 0,
  };

  // Category button config
  const categoryButtons = [
    { key: "priority", label: "🔥 Ưu tiên", color: "red" },
    { key: "normal", label: "🏠 Thường", color: "blue" },
    { key: "cancelled", label: "❌ Đã hủy", color: "gray" },
    { key: "no_answer", label: "📞 Không nghe", color: "yellow" },
    { key: "worker_return", label: "🔄 Thợ về", color: "orange" },
    { key: "phone_error", label: "📱 Lỗi số điện thoại", color: "purple" },
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority);
  };

  const handleAssignWorker = (work, isChanging = false) => {
    setSelectedWork(work);
    setIsChangingWorker(isChanging);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (workData) => {
    try {
      // Thêm priority vào workData trước khi gửi
      const workDataWithPriority = {
        ...workData,
        priority: selectedPriority, // Gửi priority đã chọn
      };
      
      await onAssign(workDataWithPriority);
      setIsAssignModalOpen(false);
      setSelectedWork(null);
      setIsChangingWorker(false);
      setSelectedPriority(""); // Reset priority sau khi gửi
    } catch (error) {
      console.error("Error assigning worker:", error);
    }
  };

  const handleCloseModal = () => {
    setIsAssignModalOpen(false);
    setSelectedWork(null);
    setIsChangingWorker(false);
    setSelectedPriority(""); // Reset priority khi đóng modal
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap gap-1 justify-end items-center mb-3">
        {/* Tất cả button */}
        <button
          onClick={() => handleCategoryChange("all")}
          className={`px-2 py-1 text-[10px] font-medium rounded-full transition-all duration-200 ${
            selectedCategory === "all"
              ? "bg-brand-green text-[#125d0d] shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tất cả ({allJobs.length})
        </button>

        {/* Category buttons */}
        {categoryButtons.map(({ key, label, color }) => {
          const count = categoryCounts[key];
          if (count === 0) return null;

          const isSelected = selectedCategory === key;
          const bgColor = isSelected ? `${color}-500` : `${color}-100`;
          const textColor = isSelected ? "white" : `${color}-700`;
          const hoverColor = isSelected ? "" : `${color}-200`;

          return (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={`px-2 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                isSelected
                  ? `shadow-md bg-${bgColor} text-${textColor}`
                  : `bg-${bgColor} text-${textColor} hover:bg-${hoverColor}`
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Jobs list */}
      <div className="overflow-y-auto flex-1 space-y-1">
        {filteredJobs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="text-sm">Không có công việc nào</p>
            <p className="mt-1 text-xs opacity-75">
              {selectedCategory === "all" 
                ? "Chưa có công việc nào được tạo" 
                : `Không có công việc nào trong danh mục "${selectedCategory}"`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredJobs.map((job, index) => (
              <JobCard
                key={`${job.job_code}-${job.category}-${index}`}
                job={job}
                index={index}
                workers={workers}
                onAssign={handleAssignWorker}
                onEdit={onEdit}
                onCopy={onCopy}
                copiedWorkId={copiedWorkId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Assign Worker Modal */}
      {isAssignModalOpen && selectedWork && (
        <AssignWorkerModal
          work={selectedWork}
          workers={workers}
          onClose={handleCloseModal}
          onAssign={handleAssignSubmit}
          isChanging={isChangingWorker}
        />
      )}
    </div>
  );
};

export default NewJobsList;
