import { NextResponse } from 'next/server';
import { API_URLS } from '@/config/constants';

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('Login attempt with:', body);
    console.log('Backend URL:', API_URLS.USER_LOGIN);
    
    const response = await fetch(API_URLS.USER_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Server error' }));
      console.error('Backend login error:', errorData);
      return NextResponse.json(
        { message: errorData.message || `Lỗi server: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Backend login response:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error during login:', error);
    
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