import React, { useState } from 'react';
import JobCard from './JobCard';
import { getWorkTypeColor, getWorkTypeName } from './WorkTable';

const JobsList = ({ jobs = [], workers = [], onAssign, onEdit, onCopy, copiedWorkId }) => {
  const [selectedWorkerType, setSelectedWorkerType] = useState("all");

  // Lọc jobs theo loại worker
  const filteredJobs = selectedWorkerType === "all" 
    ? jobs 
    : jobs.filter(job => {
        const jobType = job.kind_work || job.job_content;
        return jobType === selectedWorkerType;
      });

  // Không cần nhóm theo loại công việc nữa, chỉ hiển thị danh sách đơn giản

  const handleWorkerTypeChange = (type) => {
    setSelectedWorkerType(type);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter buttons */}
      <div className="flex gap-1 justify-end items-center mb-2">
        <button
          onClick={() => handleWorkerTypeChange("all")}
          className={`px-1.5 py-0.5 text-xs font-medium rounded-full transition-all duration-200 ${
            selectedWorkerType === "all"
              ? "bg-brand-green text-[#125d0d] shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tất cả
        </button>
        {/* Bỏ phần filter theo loại công việc */}
      </div>

      {/* Jobs list */}
      <div className="overflow-y-auto flex-1 space-y-1">
        {filteredJobs.length === 0 ? (
          <div className="p-4 text-xs text-center text-gray-500">
            <p>Không có công việc nào</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredJobs.map((job, index) => (
              <JobCard
                key={`${job.id || job.job_code}-${index}`}
                job={job}
                index={index}
                onAssign={onAssign}
                onEdit={onEdit}
                onCopy={onCopy}
                copiedWorkId={copiedWorkId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList; 