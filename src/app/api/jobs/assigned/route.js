import { NextResponse } from 'next/server';
import { transformJobData } from '@/utils/jobDataTransformer';
import { API_URLS } from '@/config/constants';

export async function POST(request) {
  try {
    const { date } = await request.json();
    
    // Gọi API để lấy assigned jobs
    console.log('🚀 Calling assigned API:', API_URLS.JOB_GET_ASSIGNED_WORKER_BY_DATE);
    console.log('📅 Date parameter:', date);
    
    // Lấy token từ request headers nếu có
    const authHeader = request.headers.get('authorization');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(API_URLS.JOB_GET_ASSIGNED_WORKER_BY_DATE, {
      method: 'POST',
      headers,
      body: JSON.stringify({ date }),
    });
    
    console.log('📡 API response status:', response.status);
    console.log('📡 API response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Debug: Log API response
    console.log('🔍 Assigned API response:', data);
    
    // Kiểm tra cấu trúc dữ liệu - có thể có nhiều format khác nhau
    let rawData = null;
    
    if (data.data) {
      // Format: { success: true, data: {...} }
      rawData = data.data;
      console.log('✅ Using data.data format');
    } else if (Array.isArray(data)) {
      // Format: [...] (mảng trực tiếp)
      rawData = data;
      console.log('✅ Using direct array format');
    } else if (data && typeof data === 'object') {
      // Format: {...} (object trực tiếp)
      rawData = data;
      console.log('✅ Using direct object format');
    } else {
      console.log('❌ Unknown data format:', data);
      return NextResponse.json(
        { error: 'Invalid API response format' },
        { status: 500 }
      );
    }
    
    // Xử lý cấu trúc dữ liệu assigned jobs - nhóm theo worker
    let transformedData = null;
    
    if (Array.isArray(rawData)) {
      // Cấu trúc: [{ worker_code, worker_name, jobs: [...] }, ...]
      console.log('✅ Processing assigned jobs grouped by worker');
      
      // Gộp tất cả jobs từ tất cả workers thành 1 mảng
      const allJobs = [];
      rawData.forEach(worker => {
        if (worker.jobs && Array.isArray(worker.jobs)) {
          worker.jobs.forEach(job => {
            // Thêm thông tin worker vào mỗi job
            allJobs.push({
              ...job,
              worker_code: worker.worker_code,
              worker_name: worker.worker_name,
              worker_full_name: worker.worker_name, // Để tương thích với UI
              // Đảm bảo có các field cần thiết
              job_priority: 'normal', // Mặc định là normal
              images_count: 0 // Mặc định không có ảnh
            });
          });
        }
      });
      
      console.log(`✅ Flattened ${allJobs.length} jobs from ${rawData.length} workers`);
      
      // Chuyển đổi sang cấu trúc tương thích với transformJobData
      transformedData = transformJobData(allJobs);
    } else {
      // Nếu không phải mảng, sử dụng transformJobData như cũ
      transformedData = transformJobData(rawData);
    }
    
    console.log('✅ Final transformed assigned data:', transformedData);
    
    // Nếu không có dữ liệu, trả về cấu trúc rỗng
    if (!transformedData || (typeof transformedData === 'object' && Object.keys(transformedData).length === 0)) {
      console.log('⚠️ No assigned jobs found, returning empty structure');
      return NextResponse.json({
        job_priority: [],
        job_normal: [],
        job_cancelled: [],
        job_no_answer: [],
        job_worker_return: [],
        job_phone_error: []
      });
    }
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching assigned jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned jobs' },
      { status: 500 }
    );
  }
} 