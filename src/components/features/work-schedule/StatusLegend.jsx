import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getStatusColor, getStatusName } from './utils';

const StatusLegend = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statuses = [
    { id: 4, description: 'Lịch gấp cần xử lý ngay (high/urgent)' },
    { id: 10, description: 'Lịch ưu tiên cao (priority)' },
    { id: 9, description: 'Khách hàng quen (medium/regular)' },
    { id: 0, description: 'Chưa được phân công (low)' },
    { id: 1, description: 'Khách không nghe máy' },
    { id: 2, description: 'Khách nhắc lần 1' },
    { id: 3, description: 'Khách nhắc nhiều lần' },
    { id: 5, description: 'Đang trong quá trình xử lý' },
    { id: 6, description: 'Đã phân công thợ' },
    { id: 7, description: 'Lịch đã bị hủy' },
    { id: 8, description: 'Không xử lý' }
  ];

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-2 flex items-center justify-between text-left hover:bg-gray-100 transition-colors rounded-lg"
      >
        <h3 className="text-xs font-semibold text-gray-700">
          📋 Chú thích trạng thái
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3 text-gray-500" />
        ) : (
          <ChevronDown className="w-3 h-3 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-2 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {statuses.map(({ id, description }) => (
              <div key={id} className="flex items-center space-x-1">
                <span
                  className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(id)}`}
                >
                  {getStatusName(id)}
                </span>
                <span className="text-xs text-gray-600">{description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusLegend; 