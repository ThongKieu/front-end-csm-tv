import { NextResponse } from 'next/server';
import { API_URLS } from '@/config/constants';

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('=== UPDATE USER REQUEST ===');
    console.log('Request body:', JSON.stringify(body, null, 2));
    console.log('Backend URL:', API_URLS.USER_UPDATE);
    
    const response = await fetch(API_URLS.USER_UPDATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        id: body.id,
        type: body.type,
        code: body.code,
        full_name: body.full_name,
        date_of_birth: body.date_of_birth,
        address: body.address,
        phone_business: body.phone_business,
        phone_personal: body.phone_personal,
        phone_family: body.phone_family,
        role: body.role,
      }),
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
      
      return NextResponse.json(
        { message: data.message || data.error || `Lỗi server: ${response.status}` },
        { status: response.status }
      );
    }
    
    console.log('User updated successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('=== UPDATE USER ERROR ===');
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