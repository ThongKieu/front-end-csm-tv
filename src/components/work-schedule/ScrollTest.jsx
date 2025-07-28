import React from 'react';

const ScrollTest = () => {
  // Tạo dữ liệu test với nhiều items để test scroll
  const testJobs = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    work_content: `Công việc test ${index + 1}`,
    name_cus: `Khách hàng ${index + 1}`,
    phone_number: `012345678${index.toString().padStart(2, '0')}`,
    street: `Địa chỉ ${index + 1}`,
    date_book: '2025-07-26',
    time_book: '08:30',
    kind_work: (index % 3) + 1,
    status_work: index % 4,
    job_code: `TEST${index.toString().padStart(3, '0')}`,
    images_count: index % 3
  }));

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 bg-blue-100 border-b">
        <h3 className="font-semibold">Test Scroll - {testJobs.length} items</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {testJobs.map((job) => (
            <div key={job.id} className="p-3 bg-white border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{job.work_content}</h4>
                  <p className="text-sm text-gray-600">{job.name_cus}</p>
                  <p className="text-xs text-gray-500">{job.phone_number}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    #{job.job_code}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{job.date_book}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollTest; 