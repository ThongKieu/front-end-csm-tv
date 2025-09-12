import React from "react";
import { Copy, UserPlus, UserCog, Settings, DollarSign } from "lucide-react";

const JobActions = ({ 
  job, 
  onCopy, 
  onAssign, 
  onEdit, 
  onEditAssigned,
  onChangeWorker,
  copiedWorkId,
  className = "",
  mode = "full" // "full" hoặc "assign-only"
}) => {
  const hasWorker = job.id_worker || job.worker_code;

  const handleAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    action(job);
  };

  // Nếu mode là "assign-only", chỉ hiển thị nút phân công
  if (mode === "assign-only") {
    return (
      <div className={`flex flex-shrink-0 items-center space-x-2 ${className}`}>
        <button
          onClick={(e) => handleAction(e, onAssign)}
          className="p-2 text-gray-500 rounded-full transition-colors hover:text-brand-green hover:bg-brand-green/10"
          title="Phân công thợ"
        >
          <UserPlus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Mode "full" - hiển thị tất cả nút
  return (
    <div className={`flex flex-shrink-0 items-center space-x-2 ${className}`}>
      {/* Nút sao chép - luôn hiển thị */}
      <button
        onClick={(e) => handleAction(e, onCopy)}
        className={`p-2 rounded-full transition-colors ${
          copiedWorkId === job.id
            ? "text-brand-green bg-brand-green/10"
            : "text-gray-500 hover:text-brand-green hover:bg-brand-green/10"
        }`}
        title="Sao chép lịch"
      >
        <Copy className="w-4 h-4" />
      </button>

      {hasWorker ? (
        // Các nút cho job đã có thợ
        <>
          <button
            onClick={(e) => handleAction(e, onChangeWorker)}
            className="p-2 text-gray-500 rounded-full transition-colors hover:text-brand-green hover:bg-brand-green/10"
            title="Đổi thợ"
          >
            <UserCog className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleAction(e, onEditAssigned)}
            className="p-2 text-gray-500 rounded-full transition-colors hover:text-brand-green hover:bg-brand-green/10"
            title="Nhập thu chi"
          >
            <DollarSign className="w-4 h-4" />
          </button>
        </>
      ) : (
        // Các nút cho job chưa có thợ
        <>
          <button
            onClick={(e) => handleAction(e, onAssign)}
            className="p-2 text-gray-500 rounded-full transition-colors hover:text-brand-green hover:bg-brand-green/10"
            title="Phân công thợ"
          >
            <UserPlus className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleAction(e, onEdit)}
            className="p-2 text-gray-500 rounded-full transition-colors hover:text-brand-green hover:bg-brand-green/10"
            title="Chỉnh sửa"
          >
            <Settings className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};

export default JobActions;
