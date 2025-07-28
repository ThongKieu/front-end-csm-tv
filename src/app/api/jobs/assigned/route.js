import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { date } = await request.json();
    
    // Tạm thời trả về mảng rỗng vì API mới chưa có assigned jobs
    // Có thể cần API riêng để lấy assigned jobs
    const assignedJobs = [];
    
    return NextResponse.json(assignedJobs);
  } catch (error) {
    console.error('Error fetching assigned jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned jobs' },
      { status: 500 }
    );
  }
} 