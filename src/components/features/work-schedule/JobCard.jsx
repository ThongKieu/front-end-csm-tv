import React, { useState } from "react";
import JobItem from "./JobItem";
import AssignWorkerModal from "./AssignWorkerModal";
import { useJobOperations } from "@/hooks/useJobOperations";

const JobCard = ({ job, index, onAssign, onEdit, workers = [] }) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isChangingWorker, setIsChangingWorker] = useState(false);
  const { handleCopy, copiedWorkId } = useJobOperations();

  const handleAssignClick = (job) => {
    setIsChangingWorker(false);
    setIsAssignModalOpen(true);
  };

  const handleChangeWorkerClick = (job) => {
    setIsChangingWorker(true);
    setIsAssignModalOpen(true);
  };

  const handleEditClick = (job) => {
    onEdit(job, false);
  };

  const handleEditAssignedClick = (job) => {
    onEdit(job, true);
  };

  return (
    <>
      <JobItem
        job={job}
        index={index}
        onAssign={handleAssignClick}
        onEdit={handleEditClick}
        onEditAssigned={handleEditAssignedClick}
        onChangeWorker={handleChangeWorkerClick}
        onCopy={handleCopy}
        copiedWorkId={copiedWorkId}
        showWorker={!!job.id_worker}
        showTooltip={true}
        onClick={handleEditClick}
        actionsMode="assign-only"
      />

      {/* Assign Worker Modal */}
      {isAssignModalOpen && (
        <AssignWorkerModal
          work={job}
          workers={workers}
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={onAssign}
          isChanging={isChangingWorker}
        />
      )}
    </>
  );
};

export default JobCard;
