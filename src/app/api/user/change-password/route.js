import { NextResponse } from 'next/server';
import { API_URLS } from '@/config/constants';

export async function POST(request) {
  try {
    const body = await request.json();
    
      // Log password change request
  console.log('Password change request:', { user_name: body.user_name });
    
    const response = await fetch(API_URLS.USER_CHANGE_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        user_name: body.user_name,
        current_password: body.current_password,
        new_password: body.new_password
      }),
    });
    

    
    let data;
    try {
      data = await response.json();

    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      const textResponse = await response.text();

      data = { message: 'Invalid response format' };
    }
    
    if (!response.ok) {
      console.error('Backend error response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      return NextResponse.json(
        { message: data.message || data.error || `Lỗi server: ${response.status}` },
        { status: response.status }
      );
    }
    

    return NextResponse.json(data);
  } catch (error) {
    console.error('=== CHANGE PASSWORD ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' },
        { status: 503 }
      );
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json(
        { message: 'Lỗi kết nối mạng. Vui lòng thử lại.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Lỗi kết nối đến server: ' + error.message },
      { status: 500 }
    );
  }
} 