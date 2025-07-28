import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing connection to backend server...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
    
    const response = await fetch('http://192.168.1.27:3000/api/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        status: 'success',
        message: 'Kết nối thành công',
        backend: data
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: `Backend trả về lỗi: ${response.status}`,
        statusCode: response.status
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Connection test error:', error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json({
        status: 'error',
        message: 'Kết nối timeout - Backend không phản hồi'
      }, { status: 200 });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json({
        status: 'error',
        message: 'Không thể kết nối đến backend server - Có thể server chưa chạy'
      }, { status: 200 });
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Lỗi kết nối: ' + error.message
    }, { status: 200 });
  }
} 