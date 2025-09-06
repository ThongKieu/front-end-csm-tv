# MapView Component

## Mô tả
Component `MapView` hiển thị bản đồ với các công việc được phân công và chưa phân công. Sử dụng React Leaflet để render bản đồ OpenStreetMap.

## Tính năng
- Hiển thị bản đồ với markers cho các công việc
- Phân loại markers theo trạng thái:
  - 🔴 Đỏ: Công việc ưu tiên (chưa phân công)
  - 🟡 Vàng: Công việc thường (chưa phân công)  
  - 🟢 Xanh: Công việc đã phân công
- Popup hiển thị thông tin chi tiết khi click vào marker
- Nút "Phân công" và "Chỉnh sửa" trong popup
- Legend hiển thị chú thích các loại marker
- Tự động fit bounds để hiển thị tất cả markers

## Props
- `assignedWorks`: Array các công việc đã phân công
- `unassignedWorks`: Object chứa các công việc chưa phân công theo category
- `workers`: Array các thợ
- `onAssign`: Function xử lý khi click "Phân công"
- `onEdit`: Function xử lý khi click "Chỉnh sửa"

## Sử dụng
```jsx
<MapView
  assignedWorks={assignedWorks}
  unassignedWorks={unassignedWorks}
  workers={workers}
  onAssign={handleAssign}
  onEdit={handleEdit}
/>
```

## Dependencies
- `react-leaflet`: ^5.0.0
- `leaflet`: ^1.9.4
- `lucide-react`: ^0.511.0

## Lưu ý
- Component sử dụng dynamic import để tránh lỗi SSR
- Cần có CSS cho custom markers trong globals.css
- Tọa độ hiện tại được mock dựa trên job_id, cần tích hợp geocoding thực tế
