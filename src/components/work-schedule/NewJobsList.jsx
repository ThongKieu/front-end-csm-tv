import React, { useState } from "react";
import JobCard from "./JobCard";
import AssignWorkerModal from "./AssignWorkerModal";

const NewJobsList = ({
  jobs = {},
  workers = [],
  onAssign,
  onEdit,
}) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isChangingWorker, setIsChangingWorker] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(""); // Thêm state cho priority

  // Lấy dữ liệu từ data object
  const jobData = jobs?.data || jobs || {};

  // Tạo danh sách jobs theo thứ tự ưu tiên: cancelled, no_answer, phone_error, worker_return, normal, priority
  const jobCategories = [
    {
      key: 'job_cancelled',
      title: '🚫 Lịch hủy',
      color: 'bg-red-100 border-red-200 text-red-800',
      jobs: jobData.job_cancelled || []
    },
    {
      key: 'job_no_answer', 
      title: '📞 Lịch không nghe máy',
      color: 'bg-orange-100 border-orange-200 text-orange-800',
      jobs: jobData.job_no_answer || []
    },
    {
      key: 'job_phone_error',
      title: '❌ Lịch lỗi số điện thoại',
      color: 'bg-purple-100 border-purple-200 text-purple-800',
      jobs: jobData.job_phone_error || []
    },
    {
      key: 'job_worker_return',
      title: '🔄 Lịch thợ trả',
      color: 'bg-yellow-100 border-yellow-200 text-yellow-800', 
      jobs: jobData.job_worker_return || []
    },
    {
      key: 'job_normal',
      title: '📋 Lịch bình thường',
      color: 'bg-blue-100 border-blue-200 text-blue-800',
      jobs: jobData.job_normal || []
    },
    {
      key: 'job_priority',
      title: '⭐ Lịch ưu tiên',
      color: 'bg-green-100 border-green-200 text-green-800',
      jobs: jobData.job_priority || []
    }
  ];


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
  // Tính tổng số jobs
  const totalJobs = jobCategories.reduce((total, category) => total + category.jobs.length, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Jobs list */}
      <div className="overflow-y-auto flex-1 space-y-2">
        {totalJobs === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="text-sm">Không có công việc nào</p>
            <p className="mt-1 text-xs opacity-75">
              Chưa có công việc nào được tạo
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {jobCategories.map((category) => {
              if (category.jobs.length === 0) return null;
              
              return (
                <div key={category.key} className="space-y-1">
                  {/* Category Header */}
                  <div className={`px-3 py-2 rounded-lg border text-xs font-semibold ${category.color}`}>
                    {category.title} ({category.jobs.length})
                  </div>
                  
                  {/* Jobs in this category */}
                  <div className="space-y-1">
                    {category.jobs.map((job, index) => (
                      <JobCard
                        key={`${job.job_code}-${category.key}-${index}`}
                        job={{
                          ...job,
                          category: category.key,
                          priority: category.key === 'job_priority' ? 'high' : 'normal'
                        }}
                        index={index}
                        workers={workers}
                        onAssign={handleAssignWorker}
                        onEdit={onEdit}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
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
