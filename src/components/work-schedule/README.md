# Modal Phân Thợ - AssignWorkerModal

## Tổng quan
`AssignWorkerModal` là component modal cho phép phân công thợ chính và thợ phụ cho công việc. Modal này hỗ trợ cả việc phân công mới và thay đổi thợ.

## Tính năng chính

### ✅ **Chọn thợ chính (bắt buộc)**
- Hiển thị thông tin thợ đã chọn: tên, mã, SĐT
- Có thể bỏ chọn và chọn lại
- Hiển thị badge "Chính" màu xanh

### ✅ **Chọn thợ phụ (tùy chọn)**
- Hiển thị thông tin thợ phụ đã chọn
- Có thể bỏ chọn và chọn lại
- Hiển thị badge "Phụ" màu vàng
- Không thể chọn trùng với thợ chính

### ✅ **Tìm kiếm thợ**
- Tìm kiếm theo tên, mã hoặc SĐT
- Kết quả tìm kiếm real-time
- Hiển thị danh sách thợ có thể chọn

### ✅ **Giao diện thân thiện**
- Hiển thị avatar với chữ cái đầu tên
- Màu sắc phân biệt thợ chính/phụ
- Responsive design
- Loading state khi submit

## Props

```jsx
<AssignWorkerModal
  work={workData}           // Thông tin công việc
  workers={workersList}     // Danh sách thợ
  onClose={handleClose}     // Hàm đóng modal
  onAssign={handleAssign}   // Hàm xử lý phân công
  isChanging={false}        // true = đổi thợ, false = phân công mới
/>
```

## Cách sử dụng

### 1. Import component
```jsx
import AssignWorkerModal from './AssignWorkerModal';
```

### 2. State management
```jsx
const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
const [selectedWork, setSelectedWork] = useState(null);
const [isChangingWorker, setIsChangingWorker] = useState(false);
```

### 3. Handler functions
```jsx
const handleAssignWorker = (work, isChanging = false) => {
  setSelectedWork(work);
  setIsChangingWorker(isChanging);
  setIsAssignModalOpen(true);
};

const handleAssignSubmit = async (workData) => {
  try {
    // Gọi API phân công thợ
    await assignWorkerAPI(workData);
    
    // Đóng modal và refresh data
    setIsAssignModalOpen(false);
    setSelectedWork(null);
    setIsChangingWorker(false);
  } catch (error) {
    console.error('Error assigning worker:', error);
  }
};

const handleCloseModal = () => {
  setIsAssignModalOpen(false);
  setSelectedWork(null);
  setIsChangingWorker(false);
};
```

### 4. Render modal
```jsx
{isAssignModalOpen && selectedWork && (
  <AssignWorkerModal
    work={selectedWork}
    workers={workers}
    onClose={handleCloseModal}
    onAssign={handleAssignSubmit}
    isChanging={isChangingWorker}
  />
)}
```

## Cấu trúc dữ liệu

### Work object
```jsx
{
  id: "123",
  job_code: "260725001",
  job_content: "Sửa máy lạnh",
  job_customer_name: "Nguyễn Văn A",
  job_customer_address: "123 Đường ABC",
  id_worker: "456",        // ID thợ chính (nếu đã phân công)
  id_phu: "789"           // ID thợ phụ (nếu có)
}
```

### Worker object
```jsx
{
  id: "456",
  full_name: "Trần Văn B",
  worker_code: "THO001",
  phone_company: "0123456789"
}
```

### WorkData sau khi phân công
```jsx
{
  ...work,
  id_worker: "456",                    // ID thợ chính
  id_phu: "789",                       // ID thợ phụ (có thể null)
  worker_full_name: "Trần Văn B",      // Tên thợ chính
  worker_code: "THO001",               // Mã thợ chính
  extra_worker_full_name: "Lê Văn C",  // Tên thợ phụ
  extra_worker_code: "THO002"          // Mã thợ phụ
}
```

## Luồng hoạt động

1. **Mở modal**: Click nút phân công/đổi thợ
2. **Chọn thợ chính**: Click vào thợ trong danh sách
3. **Chọn thợ phụ** (tùy chọn): Click vào thợ khác
4. **Submit**: Click nút "Phân công" hoặc "Cập nhật"
5. **Xử lý**: Gọi API và refresh data
6. **Đóng modal**: Tự động đóng sau khi thành công

## Validation

- **Thợ chính**: Bắt buộc phải chọn
- **Thợ phụ**: Không được trùng với thợ chính
- **Submit button**: Disabled khi chưa chọn thợ chính
- **Loading state**: Hiển thị khi đang xử lý

## Styling

- **Thợ chính**: Màu xanh (`brand-green`)
- **Thợ phụ**: Màu vàng (`brand-yellow`)
- **Avatar**: Hình tròn với chữ cái đầu tên
- **Badge**: Hiển thị trạng thái "Chính"/"Phụ"
- **Hover effects**: Tương tác mượt mà

## Responsive

- **Mobile**: Modal full-width với padding
- **Tablet**: Modal max-width 2xl
- **Desktop**: Modal centered với shadow lớn
- **Scroll**: Tự động scroll khi nội dung dài

## Error Handling

- **API errors**: Log lỗi và hiển thị thông báo
- **Validation errors**: Alert khi chưa chọn thợ chính
- **Network errors**: Fallback và retry mechanism
- **State cleanup**: Reset state khi đóng modal

## Performance

- **Memoization**: Sử dụng `useMemo` cho filtered workers
- **Debounced search**: Tìm kiếm real-time
- **Lazy loading**: Modal chỉ render khi cần
- **State optimization**: Minimal re-renders
