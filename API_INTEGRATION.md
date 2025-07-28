# Hướng dẫn tích hợp API Jobs mới

## Tổng quan

Dự án đã được cập nhật để sử dụng API mới cho việc quản lý jobs. API mới cung cấp cấu trúc dữ liệu khác với API cũ, vì vậy cần có các bước chuyển đổi dữ liệu.

## API Endpoint mới

### Endpoint: `http://192.168.1.27/api/web/job/get-by-date`
- **Method**: POST
- **Body**: `{ "date": "2025-07-26" }`
- **Response**: JSON với cấu trúc mới

### Cấu trúc dữ liệu mới

```json
{
  "success": true,
  "message": "Lấy danh sách công việc thành công",
  "data": {
    "date": "2025-07-26",
    "total_jobs": 6,
    "job_types": [
      {
        "job_type_id": 1,
        "job_type_name": "Điện Nước",
        "jobs_count": 5,
        "jobs": [
          {
            "id": 1,
            "job_code": "260725001",
            "job_content": "Nội dung công việc",
            "job_appointment_date": "2025-07-26",
            "job_customer_address": "Địa chỉ khách hàng",
            "job_customer_phone": "0947613923",
            "job_type_id": 1,
            "job_appointment_time": "08:30",
            "job_customer_name": "Tên khách hàng",
            "job_customer_note": "Ghi chú",
            "job_priority": "medium",
            "images_count": 1
          }
        ]
      }
    ]
  }
}
```

## Cấu trúc dữ liệu cũ (để tương thích)

```json
[
  {
    "kind_worker": {
      "id": 1,
      "numberOfWork": 5
    },
    "data": [
      {
        "id": 1,
        "work_content": "Nội dung công việc",
        "name_cus": "Tên khách hàng",
        "phone_number": "0947613923",
        "street": "Địa chỉ khách hàng",
        "district": "",
        "work_note": "Ghi chú",
        "date_book": "2025-07-26",
        "time_book": "08:30",
        "kind_work": 1,
        "status_work": 0,
        "job_code": "260725001",
        "images_count": 1,
        "id_worker": null,
        "worker_full_name": null,
        "worker_code": null,
        "worker_phone_company": null
      }
    ]
  }
]
```

## Các file đã được cập nhật

### 1. API Endpoints
- `src/app/api/jobs/route.js` - Endpoint chính để fetch jobs
- `src/app/api/jobs/assigned/route.js` - Endpoint cho assigned jobs (tạm thời trống)

### 2. Redux Store
- `src/store/slices/workSlice.js` - Cập nhật để sử dụng API mới

### 3. Components
- `src/components/work-schedule/JobCard.jsx` - Component hiển thị thông tin job
- `src/components/work-schedule/JobsList.jsx` - Component hiển thị danh sách jobs
- `src/components/work-schedule/StatusStats.jsx` - Component hiển thị thống kê trạng thái
- `src/components/work-schedule/StatusLegend.jsx` - Component hiển thị chú thích trạng thái
- `src/components/work-schedule/WorkTable.jsx` - Cập nhật để export các utility functions

### 4. Utilities
- `src/utils/jobDataTransformer.js` - Các hàm chuyển đổi dữ liệu

### 5. Dashboard
- `src/app/(dashboard)/dashboard/DashboardClient.jsx` - Cập nhật để sử dụng JobsList

## Mapping dữ liệu

### Job Priority → Status
- `high` → `4` (🔥 Lịch Gấp/Ưu tiên)
- `urgent` → `4` (🔥 Lịch Gấp/Ưu tiên)
- `priority` → `10` (⭐ Lịch ưu tiên)
- `medium` → `9` (👥 Khách quen)
- `regular` → `9` (👥 Khách quen)
- `low` → `0` (⏳ Chưa Phân)

### Job Type ID
- `1` → Điện Nước (ĐN)
- `2` → Điện Lạnh (ĐL)
- `3` → Đồ gỗ (ĐG)
- `4` → Năng Lượng Mặt trời (NLMT)
- `5` → Xây Dựng (XD)
- `6` → Tài Xế (TX)
- `7` → Cơ Khí (CK)
- `8` → Điện - Điện Tử (ĐĐT)
- `9` → Văn Phòng (VP)

## Tính năng mới

### 1. Hiển thị thời gian
- Thời gian hẹn được hiển thị riêng biệt với ngày
- Format: `HH:MM`

### 2. Mã công việc
- Hiển thị mã công việc (job_code) cho mỗi job

### 3. Số lượng hình ảnh
- Hiển thị số lượng hình ảnh đính kèm (images_count)

### 4. Priority levels
- Hỗ trợ 6 mức độ ưu tiên: urgent, priority, regular, high, medium, low
- **high/urgent** → Lịch gấp cần xử lý ngay
- **medium/regular** → Khách hàng quen
- **low** → Chưa phân công
- Hiển thị với emoji và màu sắc phân biệt rõ ràng

## Các bước tiếp theo

### 1. Implement assigned jobs API
- Cần API riêng để lấy danh sách jobs đã được assign worker
- Cập nhật `src/app/api/jobs/assigned/route.js`

### 2. Implement assign worker functionality
- Tạo API endpoint để assign worker cho job
- Cập nhật handler functions trong DashboardClient

### 3. Implement edit job functionality
- Tạo API endpoint để edit job
- Cập nhật handler functions

### 4. Implement copy job functionality
- Tạo API endpoint để copy job
- Cập nhật handler functions

### 5. Socket integration
- Cập nhật socket events để hoạt động với API mới
- Đảm bảo real-time updates

## Testing

### 1. Test API endpoint
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-07-26"}'
```

### 2. Test data transformation
- Kiểm tra việc chuyển đổi dữ liệu từ format mới sang format cũ
- Đảm bảo tất cả fields được map đúng

### 3. Test UI components
- Kiểm tra hiển thị của JobCard và JobsList
- Đảm bảo responsive design
- Test các filter buttons

## Troubleshooting

### 1. API không response
- Kiểm tra kết nối mạng
- Kiểm tra URL API có đúng không
- Kiểm tra format date có đúng không

### 2. Dữ liệu không hiển thị
- Kiểm tra console logs
- Kiểm tra Redux store
- Kiểm tra data transformation

### 3. UI không responsive
- Kiểm tra CSS classes
- Kiểm tra Tailwind CSS configuration
- Kiểm tra responsive breakpoints 