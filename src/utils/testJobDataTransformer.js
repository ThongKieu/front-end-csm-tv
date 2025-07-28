import { transformJobData, getStatusFromPriority, getPriorityFromStatus } from './jobDataTransformer';

// Test data từ API mới
const testApiData = {
  "success": true,
  "message": "Lấy danh sách công việc thành công",
  "data": {
    "date": "2025-07-26",
    "total_jobs": 6,
    "job_types": [
      {
        "job_type_id": 1,
        "job_type_name": "Điện Nước",
        "jobs_count": 5,
        "jobs": [
          {
            "id": 1,
            "job_code": "260725001",
            "job_content": "1",
            "job_appointment_date": "2025-07-26",
            "job_customer_address": "1",
            "job_customer_phone": "1",
            "job_type_id": 1,
            "job_appointment_time": "08:30",
            "job_customer_name": "1",
            "job_customer_note": "1",
            "job_priority": "medium",
            "images_count": 1
          },
          {
            "id": 2,
            "job_code": "260725002",
            "job_content": "Thống test",
            "job_appointment_date": "2025-07-26",
            "job_customer_address": "Test",
            "job_customer_phone": "0947613923",
            "job_type_id": 1,
            "job_appointment_time": "08:30",
            "job_customer_name": "Test",
            "job_customer_note": "test",
            "job_priority": "high",
            "images_count": 1
          }
        ]
      },
      {
        "job_type_id": 2,
        "job_type_name": "Điện Lạnh",
        "jobs_count": 1,
        "jobs": [
          {
            "id": 6,
            "job_code": "260725006",
            "job_content": "Thống test",
            "job_appointment_date": "2025-07-26",
            "job_customer_address": "test",
            "job_customer_phone": "0947613923",
            "job_type_id": 2,
            "job_appointment_time": "09:31",
            "job_customer_name": "test",
            "job_customer_note": "test",
            "job_priority": "medium",
            "images_count": 0
          }
        ]
      }
    ]
  }
};

// Test function
export function testJobDataTransformer() {
  console.log('=== Testing Job Data Transformer ===');
  
  // Test 1: Transform job data
  console.log('\n1. Testing transformJobData:');
  const transformedData = transformJobData(testApiData.data);
  console.log('Transformed data:', JSON.stringify(transformedData, null, 2));
  
  // Test 2: Priority to status conversion
  console.log('\n2. Testing priority to status conversion:');
  console.log('high ->', getStatusFromPriority('high')); // Should be 4 (Lịch Gấp)
  console.log('medium ->', getStatusFromPriority('medium')); // Should be 9 (Khách quen)
  console.log('low ->', getStatusFromPriority('low')); // Should be 0 (Chưa Phân)
  console.log('urgent ->', getStatusFromPriority('urgent')); // Should be 4 (Lịch Gấp)
  console.log('priority ->', getStatusFromPriority('priority')); // Should be 10 (Lịch ưu tiên)
  console.log('regular ->', getStatusFromPriority('regular')); // Should be 9 (Khách quen)
  
  // Test 3: Status to priority conversion
  console.log('\n3. Testing status to priority conversion:');
  console.log('4 ->', getPriorityFromStatus(4)); // Should be 'high' (Lịch Gấp)
  console.log('10 ->', getPriorityFromStatus(10)); // Should be 'priority' (Lịch ưu tiên)
  console.log('9 ->', getPriorityFromStatus(9)); // Should be 'medium' (Khách quen)
  console.log('0 ->', getPriorityFromStatus(0)); // Should be 'low' (Chưa Phân)
  
  // Test 4: Verify structure
  console.log('\n4. Verifying structure:');
  console.log('Number of job types:', transformedData.length);
  transformedData.forEach((category, index) => {
    console.log(`Category ${index + 1}:`, {
      kind_worker_id: category.kind_worker.id,
      numberOfWork: category.kind_worker.numberOfWork,
      jobs_count: category.data.length
    });
    
    category.data.forEach((job, jobIndex) => {
      console.log(`  Job ${jobIndex + 1}:`, {
        id: job.id,
        job_code: job.job_code,
        work_content: job.work_content,
        name_cus: job.name_cus,
        phone_number: job.phone_number,
        date_book: job.date_book,
        time_book: job.time_book,
        kind_work: job.kind_work,
        status_work: job.status_work,
        images_count: job.images_count
      });
    });
  });
  
  console.log('\n=== Test completed ===');
  
  return transformedData;
}

// Export test data for use in other files
export { testApiData }; 