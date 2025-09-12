import React, { useState } from 'react';
import JobCard from './JobCard';
import { getWorkTypeColor, getWorkTypeName } from './utils';

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