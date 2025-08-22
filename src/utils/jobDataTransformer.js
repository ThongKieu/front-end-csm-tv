// Hàm chuyển đổi dữ liệu từ format mới sang format cũ
export const transformJobData = (data) => {
  // Transform the job data structure
  if (!data || typeof data !== 'object') {
    return data;
  }

  // If data already has the expected structure, return as is
  if (data.job_priority !== undefined || data.job_normal !== undefined) {
    return data;
  }

  // Transform from old structure to new structure
  const transformed = {
    job_priority: [],
    job_normal: [],
    job_cancelled: [],
    job_no_answer: [],
    job_worker_return: [],
    job_phone_error: []
  };

  // Map old structure to new structure
  if (Array.isArray(data)) {
    data.forEach(job => {
      // Determine job category based on job properties
      if (job.priority === 'high' || job.is_priority) {
        transformed.job_priority.push(job);
      } else if (job.status === 'cancelled') {
        transformed.job_cancelled.push(job);
      } else if (job.status === 'no_answer') {
        transformed.job_no_answer.push(job);
      } else if (job.status === 'worker_return') {
        transformed.job_worker_return.push(job);
      } else if (job.status === 'phone_error') {
        transformed.job_phone_error.push(job);
      } else {
        transformed.job_normal.push(job);
      }
    });
  }

  return transformed;
};

// Hàm chuyển đổi priority sang status
export function getStatusFromPriority(priority) {
  switch (priority) {
    case 'high':
      return 4; // Lịch Gấp/Ưu tiên
    case 'normal':
      return 9; // Khách quen
    case 'cancelled':
      return 3; // Đã hủy
    case 'no_answer':
      return 2; // Không nghe máy
    case 'worker_return':
      return 1; // Công nhân về
    case 'urgent':
      return 4; // Lịch Gấp/Ưu tiên
    case 'priority':
      return 10; // Lịch ưu tiên
    case 'regular':
      return 9; // Khách quen
    default:
      return 0; // Chưa Phân
  }
}

// Hàm chuyển đổi status sang priority
export function getPriorityFromStatus(status) {
  switch (status) {
    case 4:
      return 'high'; // Lịch Gấp/Ưu tiên
    case 10:
      return 'priority'; // Lịch ưu tiên
    case 9:
      return 'normal'; // Khách quen
    case 3:
      return 'cancelled'; // Đã hủy
    case 2:
      return 'no_answer'; // Không nghe máy
    case 1:
      return 'worker_return'; // Công nhân về
    case 0:
    default:
      return 'low'; // Chưa Phân
  }
}

// Hàm format thời gian
export function formatTime(timeString) {
  if (!timeString) return '';
  
  // Giả sử timeString có format "HH:MM"
  return timeString;
}

// Hàm format ngày
export function formatDate(dateString) {
  if (!dateString) return '';
  
  // Giả sử dateString có format "YYYY-MM-DD"
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
}

// Hàm helper để lấy danh sách jobs theo trạng thái
export function getJobsByStatus(data, status) {
  switch (status) {
    case 'priority':
      return data.job_priority || [];
    case 'normal':
      return data.job_normal || [];
    case 'cancelled':
      return data.job_cancelled || [];
    case 'no_answer':
      return data.job_no_answer || [];
    case 'worker_return':
      return data.job_worker_return || [];
    default:
      return [];
  }
}

// Hàm helper để đếm tổng số jobs
export function getTotalJobsCount(data) {
  return (
    (data.job_priority?.length || 0) +
    (data.job_normal?.length || 0) +
    (data.job_cancelled?.length || 0) +
    (data.job_no_answer?.length || 0) +
    (data.job_worker_return?.length || 0)
  );
} 