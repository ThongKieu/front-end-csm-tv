import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Gọi API backend để lấy danh sách thợ
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.46'
    const apiUrl = `${backendUrl}/api/user/get-workers`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Thêm timeout
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    })

    if (!response.ok) {
      console.error(`Backend responded with status: ${response.status}`)
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const workersResponse = await response.json()
    
    // Map API response to match expected structure
    if (workersResponse.success && workersResponse.data) {
      const mappedWorkers = workersResponse.data.map(worker => ({
        id: worker.id,
        worker_full_name: worker.full_name,
        worker_code: worker.type_code,
        worker_phone_company: worker.phone || '',
        worker_status: 1, // Default active
        worker_daily_sales: 0, // Default
        worker_address: worker.address || ''
      }));      
      // Trả về array trực tiếp (không có wrapper object)
      return NextResponse.json(mappedWorkers);
    }
    
    // Nếu không có success field nhưng có data
    if (workersResponse.data && Array.isArray(workersResponse.data)) {
      
      // Map data nếu cần thiết
      const mappedWorkers = workersResponse.data.map(worker => ({
        id: worker.id,
        worker_full_name: worker.full_name,
        worker_code: worker.type_code,
        worker_phone_company: worker.phone || '',
        worker_status: 1,
        worker_daily_sales: 0,
        worker_address: worker.address || ''
      }));
      
      return NextResponse.json(mappedWorkers);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching workers:', error)
    
    // Trả về dữ liệu mẫu nếu backend không hoạt động
    const fallbackWorkers = [
      {
        id: 1,
        worker_full_name: "Điện Nước",
        worker_code: "A01",
        worker_phone_company: "0123456789",
        worker_status: 1,
        worker_daily_sales: 0,
        worker_address: ""
      },
      {
        id: 2,
        worker_full_name: "Điện Lạnh", 
        worker_code: "B01",
        worker_phone_company: "0987654321",
        worker_status: 1,
        worker_daily_sales: 0,
        worker_address: ""
      }
    ]
    return NextResponse.json(fallbackWorkers);
  }
}
