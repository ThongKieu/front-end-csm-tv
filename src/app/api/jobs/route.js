import { NextResponse } from 'next/server';
import { transformJobData } from '@/utils/jobDataTransformer';

export async function POST(request) {
  try {
    const { date } = await request.json();
    
    // Gọi API mới
    const response = await fetch('http://192.168.1.27/api/web/job/get-by-date', {
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