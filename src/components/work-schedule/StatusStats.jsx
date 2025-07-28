import React from 'react';
import { getStatusColor, getStatusName } from './WorkTable';

const mainStatusOrder = [4, 10, 9, 6, 0]; // Lịch gấp, ưu tiên, khách quen, đã phân, chưa phân

const StatusStats = ({ jobs = [], compact = false }) => {
  // Tính toán thống kê trạng thái
  const statusStats = jobs.reduce((acc, job) => {
    acc[job.status_work] = (acc[job.status_work] || 0) + 1;
    return acc;
  }, {});

  // Sắp xếp trạng thái theo thứ tự ưu tiên
  const sortedStats = compact
    ? mainStatusOrder
        .filter((status) => statusStats[status])
        .map((status) => ({
          status,
          count: statusStats[status],
          color: getStatusColor(status),
          name: getStatusName(status),
        }))
    : Object.entries(statusStats)
        .map(([status, count]) => ({
          status: Number(status),
          count,
          color: getStatusColor(Number(status)),
          name: getStatusName(Number(status)),
        }))
        .sort((a, b) => b.count - a.count);

  if (jobs.length === 0) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {sortedStats.map(({ status, count, color, name }) => (
          <div
            key={status}
            className={`flex items-center px-1 py-0.5 rounded-full text-[10px] font-medium ${color}`}
            title={name}
          >
            <span>{count}</span>
          </div>
        ))}
        <span className="ml-1 text-[10px] text-gray-500">/ {jobs.length}</span>
      </div>
    );
  }

  // Mặc định (không compact)
  return (
    <div className="mb-2 p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-700 mb-1">
        📊 Thống kê trạng thái ({jobs.length} công việc)
      </h3>
      <div className="flex flex-wrap gap-1">
        {sortedStats.map(({ status, count, color, name }) => (
          <div
            key={status}
            className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${color}`}
          >
            <span className="text-xs">{name}</span>
            <span className="bg-white bg-opacity-50 px-1 py-0.5 rounded-full font-bold text-xs">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusStats; 