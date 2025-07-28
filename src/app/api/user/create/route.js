import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('Creating user with data:', body);
    
    // Thêm timeout và headers
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch('http://192.168.1.27:3000/api/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Server error' }));
      console.error('Backend error:', errorData);
      return NextResponse.json(
        { message: errorData.message || `Lỗi server: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Backend response:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { message: 'Kết nối timeout. Vui lòng thử lại.' },
        { status: 408 }
      );
    }
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: 'Lỗi kết nối đến server: ' + error.message },
      { status: 500 }
    );
  }
} 