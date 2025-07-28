import { NextResponse } from 'next/server';
import { API_URLS, CONFIG } from '@/config/constants';

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('=== USER CREATE REQUEST ===');
    console.log('Request body:', JSON.stringify(body, null, 2));
    console.log('Backend URL:', API_URLS.USER_CREATE);
    
    // Kiểm tra dữ liệu trước khi gửi
    console.log('Data validation:');
    console.log('- user_name:', typeof body.user_name, body.user_name);
    console.log('- password:', typeof body.password, body.password?.length);
    console.log('- type:', typeof body.type, body.type);
    console.log('- code:', typeof body.code, body.code);
    console.log('- full_name:', typeof body.full_name, body.full_name);
    console.log('- phone_business:', typeof body.phone_business, body.phone_business);
    console.log('- role:', typeof body.role, body.role);
    
    const response = await fetch(API_URLS.USER_CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));
    
    let data;
    try {
      data = await response.json();
      console.log('Backend response data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      const textResponse = await response.text();
      console.log('Raw response text:', textResponse);
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
    
    console.log('User created successfully:', data);
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