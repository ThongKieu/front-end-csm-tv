import { NextResponse } from 'next/server';
import { API_URLS } from '@/config/constants';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Log login attempt
    console.log('=== LOGIN DEBUG ===');
    console.log('Login attempt:', { user_name: body.user_name });
    console.log('Backend URL:', API_URLS.USER_LOGIN);
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const response = await fetch(API_URLS.USER_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Server error' }));
      console.error('Backend login error:', errorData);
      console.log('=== END LOGIN DEBUG ===');
      return NextResponse.json(
        { message: errorData.message || `Lỗi server: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Login API: Response từ backend:', data);
    console.log('=== END LOGIN DEBUG ===');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error during login:', error);
    console.log('=== END LOGIN DEBUG ===');
    
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