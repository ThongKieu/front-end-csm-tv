import { NextResponse } from "next/server";

// Mock data
const mockData = {
  totalAppointments: 156,
  totalCalls: 243,
  totalSources: 5,
  successRate: 85,
  averageResponseTime: 12,
  recentActivity: [
    {
      title: "Tạo lịch hẹn mới",
      description: "Đã tạo lịch hẹn tư vấn dịch vụ",
      timestamp: new Date("2024-03-20T09:00:00Z"),
    },
    {
      title: "Cuộc gọi thành công",
      description: "Đã hoàn thành cuộc gọi tư vấn",
      timestamp: new Date("2024-03-20T10:30:00Z"),
    },
    {
      title: "Cập nhật trạng thái",
      description: "Đã cập nhật trạng thái lịch hẹn",
      timestamp: new Date("2024-03-20T11:15:00Z"),
    },
    {
      title: "Thêm nguồn mới",
      description: "Đã thêm nguồn khách hàng từ Facebook",
      timestamp: new Date("2024-03-20T14:20:00Z"),
    },
    {
      title: "Tạo lịch hẹn mới",
      description: "Đã tạo lịch hẹn khảo sát công trình",
      timestamp: new Date("2024-03-20T15:45:00Z"),
    },
  ],
};

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 