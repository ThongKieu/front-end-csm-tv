import React, { useState, useRef, useEffect } from "react";
import JobInfo from "./JobInfo";
import JobActions from "./JobActions";
import JobDetailTooltip from "./JobDetailTooltip";

const JobItem = ({ 
  job, 
  index, 
  onAssign, 
  onEdit, 
  onCopy,
  onEditAssigned,
  onChangeWorker,
  copiedWorkId,
  showWorker = false,
  showTooltip = true,
  className = "",
  onClick = null,
  actionsMode = "full" // "full" hoặc "assign-only"
}) => {
  const [showTooltipState, setShowTooltipState] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState("bottom");
  const itemRef = useRef(null);

  // Kiểm tra vị trí của item để quyết định hiển thị tooltip lên trên hay xuống dưới
  useEffect(() => {
    const checkTooltipPosition = () => {
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const tooltipHeight = 200; // Ước tính chiều cao của tooltip

        // Nếu item ở gần cuối viewport, hiển thị tooltip lên trên
        if (rect.bottom + tooltipHeight > viewportHeight - 20) {
          setTooltipPosition("top");
        } else {
          setTooltipPosition("bottom");
        }
      }
    };

    if (showTooltipState) {
      checkTooltipPosition();
    }
  }, [showTooltipState]);

  const handleClick = () => {
    if (onClick) {
      onClick(job);
    }
  };

  return (
    <div
      ref={itemRef}
      className={`flex relative items-center text-xs bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:border-brand-green/300 hover:shadow-md ${className}`}
      onMouseEnter={() => showTooltip && setShowTooltipState(true)}
      onMouseLeave={() => showTooltip && setShowTooltipState(false)}
    >
      {/* Phần bên trái - Thông tin job */}
      <div
        className="flex flex-1 gap-2 items-center px-2 py-1 min-w-0 rounded-l-lg transition-colors cursor-pointer hover:bg-blue-50/30"
        onClick={handleClick}
      >
        <JobInfo 
          job={job}
          showWorker={showWorker}
          onClick={onClick}
        />
      </div>

      {/* Phần bên phải - Các nút hành động */}
      <div
        className="flex flex-shrink-0 items-center px-2 py-1 space-x-0.5 w-auto rounded-r-lg border-l border-gray-200 bg-gray-100/50"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setShowTooltipState(false)}
        onMouseLeave={() => setShowTooltipState(false)}
      >
        <JobActions
          job={job}
          onCopy={onCopy}
          onAssign={onAssign}
          onEdit={onEdit}
          onEditAssigned={onEditAssigned}
          onChangeWorker={onChangeWorker}
          copiedWorkId={copiedWorkId}
          mode={actionsMode}
        />
      </div>

      {/* Tooltip */}
      {showTooltip && showTooltipState && (
        <div
          className={`absolute left-0 z-50 ${
            tooltipPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <JobDetailTooltip job={job} />
        </div>
      )}
    </div>
  );
};

export default JobItem;
