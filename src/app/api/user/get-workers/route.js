import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Gọi API backend để lấy danh sách thợ
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.46'
    const apiUrl = `${backendUrl}/api/web/workers`
    
    console.log('Fetching workers from:', apiUrl)
    
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

    const workers = await response.json()
    console.log('Workers fetched successfully:', workers.length)
    
    return NextResponse.json(workers)
  } catch (error) {
    console.error('Error fetching workers:', error)
    
    // Trả về dữ liệu mẫu nếu backend không hoạt động
    const fallbackWorkers = [
      {
        id: 1,
        worker_full_name: "Nguyễn Văn A",
        worker_code: "NV001",
        worker_phone_company: "0123456789",
        worker_status: 1
      },
      {
        id: 2,
        worker_full_name: "Trần Thị B",
        worker_code: "NV002", 
        worker_phone_company: "0987654321",
        worker_status: 1
      }
    ]
    
    return NextResponse.json(fallbackWorkers)
  }
}
