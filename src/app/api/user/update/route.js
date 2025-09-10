import { NextResponse } from 'next/server';
import { API_URLS } from '@/config/constants';

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetch(API_URLS.USER_UPDATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        id: body.id,
        ...(body.type && { type: body.type }),
        ...(body.code !== null && body.code !== undefined && { code: body.code }),
        ...(body.full_name && { full_name: body.full_name }),
        ...(body.date_of_birth && { date_of_birth: body.date_of_birth }),
        ...(body.address && { address: body.address }),
        ...(body.phone_business && { phone_business: body.phone_business }),
        ...(body.phone_personal && { phone_personal: body.phone_personal }),
        ...(body.phone_family && { phone_family: body.phone_family }),
        ...(body.role && { role: body.role }),
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