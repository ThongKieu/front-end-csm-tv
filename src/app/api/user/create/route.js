import { NextResponse } from 'next/server';
import { API_URLS, CONFIG } from '@/config/constants';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Log request for debugging
    console.log('User create request:', { user_name: body.user_name, type: body.type, role: body.role });
    
    const response = await fetch(API_URLS.USER_CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
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
      
      // Xử lý lỗi 422 validation
      if (response.status === 422) {
        let errorMessage = 'Dữ liệu không hợp lệ';
        
        if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map(err => err.message || err).join(', ');
        } else if (data.validation_errors) {
          errorMessage = Object.entries(data.validation_errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
        
        console.error('422 Validation error details:', errorMessage);
        return NextResponse.json(
          { message: `Lỗi validation: ${errorMessage}` },
          { status: 422 }
        );
      }
      
      return NextResponse.json(
        { message: data.message || data.error || `Lỗi server: ${response.status}` },
        { status: response.status }
      );
    }
    

    return NextResponse.json(data);
  } catch (error) {
    console.error('=== USER CREATE ERROR ===');
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