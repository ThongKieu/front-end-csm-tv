# Hướng dẫn test Scroll

## Vấn đề đã được sửa

### 1. Layout Structure
- Đã sửa cấu trúc layout để đảm bảo `flex-1` và `min-h-0` hoạt động đúng
- Container chính có `h-[calc(100vh-64px)]` để chiếm đủ chiều cao
- Các container con có `flex-1` để mở rộng đúng

### 2. StatusLegend Component
- Đã thêm tính năng **show/hide** với button toggle
- Sử dụng `useState` để quản lý trạng thái `isExpanded`
- Icon chevron up/down để chỉ thị trạng thái
- Animation mượt mà khi expand/collapse

### 3. Scroll Areas
- **JobsList**: `overflow-y-auto` cho danh sách jobs
- **WorkTable**: `overflow-auto` cho bảng dữ liệu
- **Container chính**: `flex-1 min-h-0` để đảm bảo scroll hoạt động

## Cách test Scroll

### 1. Test với dữ liệu thật
```bash
# Chạy ứng dụng
npm run dev

# Truy cập dashboard và kiểm tra:
# - Scroll trong phần "Chưa phân công"
# - Scroll trong phần "Đã phân công"
# - Show/hide StatusLegend
```

### 2. Test với dữ liệu test
Tạm thời thay thế JobsList bằng ScrollTest:

```jsx
// Trong DashboardClient.jsx
import ScrollTest from "@/components/work-schedule/ScrollTest";

// Thay thế JobsList
<ScrollTest />
```

### 3. Kiểm tra các vấn đề thường gặp

#### Vấn đề: Không scroll được
**Nguyên nhân:**
- Container không có `flex-1` hoặc `min-h-0`
- Parent container không có chiều cao cố định
- CSS `overflow` bị override

**Giải pháp:**
```css
.parent {
  height: 100vh; /* hoặc calc(100vh - header) */
  display: flex;
  flex-direction: column;
}

.scroll-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
```

#### Vấn đề: StatusLegend không show/hide
**Nguyên nhân:**
- `useState` không được import
- Event handler không được gọi
- CSS transition bị conflict

**Giải pháp:**
```jsx
import { useState } from 'react';

const [isExpanded, setIsExpanded] = useState(false);

const toggleExpanded = () => setIsExpanded(!isExpanded);
```

## Cấu trúc CSS đã sửa

### Dashboard Layout
```jsx
<div className="flex flex-col h-[calc(100vh-64px)] p-3 py-1 mx-auto">
  {/* Header */}
  <div className="flex justify-between items-center p-3 py-1 mb-3">
  
  {/* Content */}
  <div className="flex flex-col flex-1 min-h-0">
    {/* StatusLegend - có thể collapse */}
    <StatusLegend />
    
    {/* StatusStats */}
    <StatusStats />
    
    {/* Grid layout cho 2 cột */}
    <div className="grid flex-1 grid-cols-1 gap-3 mt-4 min-h-0 xl:grid-cols-2">
      {/* JobsList - có scroll */}
      <div className="flex overflow-hidden flex-col h-full">
        <JobsList />
      </div>
      
      {/* WorkTable - có scroll */}
      <div className="flex overflow-hidden flex-col h-full">
        <WorkTable />
      </div>
    </div>
  </div>
</div>
```

### JobsList Scroll
```jsx
<div className="h-full flex flex-col">
  {/* Filter buttons - fixed */}
  <div className="flex items-center gap-2 justify-end mb-4">
  
  {/* Jobs list - scrollable */}
  <div className="flex-1 overflow-y-auto space-y-4">
    {/* Job cards */}
  </div>
</div>
```

## Troubleshooting

### 1. Scroll không hoạt động
- Kiểm tra console có lỗi CSS không
- Đảm bảo container có chiều cao cố định
- Kiểm tra `overflow` không bị `hidden`

### 2. StatusLegend không toggle
- Kiểm tra console có lỗi JavaScript không
- Đảm bảo `useState` được import
- Kiểm tra event handler được gọi

### 3. Layout bị vỡ
- Kiểm tra responsive breakpoints
- Đảm bảo `grid` và `flex` không conflict
- Kiểm tra `min-h-0` được set đúng

## Performance Tips

### 1. Virtual Scrolling
Nếu có quá nhiều items (>100), cân nhắc virtual scrolling:
```jsx
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => (
  <List
    height={400}
    itemCount={items.length}
    itemSize={80}
  >
    {({ index, style }) => (
      <div style={style}>
        <JobCard job={items[index]} />
      </div>
    )}
  </List>
);
```

### 2. Lazy Loading
Load dữ liệu theo trang:
```jsx
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = () => {
  if (hasMore) {
    setPage(prev => prev + 1);
  }
};
```

### 3. Debounced Search
Tránh search quá nhiều:
```jsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (searchTerm) => {
    // Search logic
  },
  300
);
``` 