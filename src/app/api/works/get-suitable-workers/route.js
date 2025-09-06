import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    // Gọi API backend để lấy danh sách thợ phù hợp
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.46'
    const apiUrl = `${backendUrl}/api/web/job/get-suitable-workers`
    
    // Chuẩn bị dữ liệu để gửi đến backend
    const jobData = {
      job_content: body.job_content,
      job_appointment_date: body.job_appointment_date,
      job_appointment_time: body.job_appointment_time,
      // Có thể thêm các tham số khác nếu cần
    }
    
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
    })

    if (!response.ok) {
      console.error(`Backend responded with status: ${response.status}`)
      const errorText = await response.text()
      console.error('Backend error response:', errorText)
      throw new Error(`Backend responded with status: ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    
    // Trả về kết quả từ backend
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('❌ Error getting suitable workers:', error)
    
    // Fallback: trả về tất cả workers nếu API fail
    try {
      const fallbackResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.46'}/api/user/get-workers`)
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json()
        return NextResponse.json(fallbackData)
      }
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError)
    }
    
    // Trả về lỗi chi tiết
    return NextResponse.json(
      { 
        success: false, 
        message: `Lỗi lấy danh sách thợ phù hợp: ${error.message}`,
        error: error.message 
      },
      { status: 500 }
    )
  }
}
