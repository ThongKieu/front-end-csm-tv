import { NextResponse } from 'next/server';
import { transformJobData } from '@/utils/jobDataTransformer';
import { API_URLS } from '@/config/constants';

export async function POST(request) {
  try {
    const { date } = await request.json();
    
    // Gọi API mới
    const response = await fetch(API_URLS.JOB_GET_BY_DATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Kiểm tra cấu trúc dữ liệu
    if (!data.data) {
      return NextResponse.json(
        { error: 'Invalid API response format' },
        { status: 500 }
      );
    }
    
    // Chuyển đổi dữ liệu từ format mới sang format cũ
    const transformedData = transformJobData(data.data);
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
} 