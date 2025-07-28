// Hàm chuyển đổi dữ liệu từ format mới sang format cũ
export function transformJobData(data) {
  const { job_types } = data;
  
  // Chuyển đổi job_types thành format cũ
  const transformedJobTypes = job_types.map(jobType => ({
    kind_worker: {
      id: jobType.job_type_id,
      numberOfWork: jobType.jobs_count
    },
    data: jobType.jobs.map(job => ({
      id: job.id,
      work_content: job.job_content,
      name_cus: job.job_customer_name,
      phone_number: job.job_customer_phone,
      street: job.job_customer_address,
      district: '', // Có thể cần bổ sung từ API
      work_note: job.job_customer_note,
      date_book: job.job_appointment_date,
      time_book: job.job_appointment_time,
      kind_work: job.job_type_id,
      status_work: getStatusFromPriority(job.job_priority),
      job_code: job.job_code,
      images_count: job.images_count,
      // Các trường khác có thể cần mapping
      id_worker: null, // Chưa được assign
      worker_full_name: null,
      worker_code: null,
      worker_phone_company: null
    }))
  }));

  return transformedJobTypes;
}

// Hàm chuyển đổi priority sang status
export function getStatusFromPriority(priority) {
  switch (priority) {
    case 'high':
      return 4; // Lịch Gấp/Ưu tiên
    case 'medium':
      return 9; // Khách quen
    case 'low':
      return 0; // Chưa Phân
    case 'urgent':
      return 4; // Lịch Gấp/Ưu tiên
    case 'priority':
      return 10; // Lịch ưu tiên
    case 'regular':
      return 9; // Khách quen
    default:
      return 0;
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
      return 'medium'; // Khách quen
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