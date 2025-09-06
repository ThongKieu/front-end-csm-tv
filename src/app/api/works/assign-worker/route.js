import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    // Gọi API backend để phân công thợ
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.46'
    const apiUrl = `${backendUrl}/api/web/job/assign-worker`
    
    // Chuẩn bị dữ liệu để gửi đến backend theo format mới
    const workData = {
      job_id: body.work?.id || body.job_id,
      worker_id: body.worker,
      role: body.role || (body.extraWorker ? 'assistant' : 'main'), // main: thợ chính, assistant: thợ phụ
      user_id: body.authId,
    }
    
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workData),
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
    console.error('❌ Error assigning worker:', error)
    
    // Trả về lỗi chi tiết
    return NextResponse.json(
      { 
        success: false, 
        message: `Lỗi phân công thợ: ${error.message}`,
        error: error.message 
      },
      { status: 500 }
    )
  }
}
