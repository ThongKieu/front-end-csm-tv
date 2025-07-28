import React, { useState } from 'react';
import JobCard from './JobCard';
import { getWorkTypeColor, getWorkTypeName } from './WorkTable';

const JobsList = ({ jobs = [], workers = [], onAssign, onEdit, onCopy, copiedWorkId }) => {
  const [selectedWorkerType, setSelectedWorkerType] = useState("all");

  // Lọc jobs theo loại worker
  const filteredJobs = selectedWorkerType === "all" 
    ? jobs 
    : jobs.filter(job => job.kind_work === parseInt(selectedWorkerType));

  // Nhóm jobs theo loại công việc
  const groupedJobs = filteredJobs.reduce((acc, job) => {
    const kindWork = job.kind_work;
    if (!acc[kindWork]) {
      acc[kindWork] = {
        kind_worker: {
          id: kindWork,
          numberOfWork: 0
        },
        data: []
      };
    }
    acc[kindWork].data.push(job);
    acc[kindWork].kind_worker.numberOfWork++;
    return acc;
  }, {});

  const jobCategories = Object.values(groupedJobs);

  const handleWorkerTypeChange = (type) => {
    setSelectedWorkerType(type);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Filter buttons */}
      <div className="flex items-center gap-1 justify-end mb-2">
        <button
          onClick={() => handleWorkerTypeChange("all")}
          className={`px-1.5 py-0.5 text-xs font-medium rounded-full transition-all duration-200 ${
            selectedWorkerType === "all"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tất cả
        </button>
        {jobCategories.map((category) => (
          <button
            key={category.kind_worker?.id}
            onClick={() => handleWorkerTypeChange(category.kind_worker?.id)}
            className={`px-1.5 py-0.5 text-xs font-medium cursor-pointer rounded-full transition-all duration-200 ${
              selectedWorkerType === category.kind_worker?.id
                ? "ring-1 ring-blue-500 shadow-sm"
                : ""
            } ${getWorkTypeColor(category.kind_worker?.id)}`}
          >
            {getWorkTypeName(category.kind_worker?.id)}
            <span className="ml-0.5 text-xs opacity-75">
              ({category.kind_worker?.numberOfWork || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Jobs list */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {jobCategories.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-xs">
            <p>Không có công việc nào</p>
          </div>
        ) : (
          jobCategories.map((category) => (
            <div key={category.kind_worker.id} className="space-y-0.5">
              <h3 className="text-[10px] font-semibold text-gray-700 flex items-center space-x-1">
                <span className={`px-1 py-0.5 text-[9px] font-medium rounded ${getWorkTypeColor(category.kind_worker.id)}`}>
                  {getWorkTypeName(category.kind_worker.id)}
                </span>
                <span className="text-gray-500">
                  ({category.kind_worker.numberOfWork} công việc)
                </span>
              </h3>
              <div className="space-y-0.5">
                {category.data.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    index={index}
                    onAssign={onAssign}
                    onEdit={onEdit}
                    onCopy={onCopy}
                    copiedWorkId={copiedWorkId}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobsList; 