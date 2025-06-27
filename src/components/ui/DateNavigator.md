# DateNavigator Component

Component tái sử dụng cho việc điều hướng ngày tháng với các tính năng:
- Nút điều hướng trước/sau
- Nút "Hôm nay"
- Input chọn ngày
- Hiển thị trạng thái ngày (Hôm nay/Quá hạn/Tương lai)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedDate` | `string` | - | Ngày được chọn (format: YYYY-MM-DD) |
| `onDateChange` | `function` | - | Callback khi thay đổi ngày từ input |
| `onPreviousDay` | `function` | - | Callback khi click nút "Trước" |
| `onNextDay` | `function` | - | Callback khi click nút "Sau" |
| `onToday` | `function` | - | Callback khi click nút "Hôm nay" |
| `className` | `string` | `""` | CSS class tùy chỉnh |
| `showStatus` | `boolean` | `true` | Hiển thị trạng thái ngày |
| `compact` | `boolean` | `false` | Chế độ compact (chưa implement) |

## Cách sử dụng

### Import
```jsx
import DateNavigator from '@/components/ui/DateNavigator';
```

### Basic usage
```jsx
const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

const handleDateChange = (e) => {
  setSelectedDate(e.target.value);
};

const handlePreviousDay = () => {
  const prevDate = new Date(selectedDate);
  prevDate.setDate(prevDate.getDate() - 1);
  setSelectedDate(prevDate.toISOString().split('T')[0]);
};

const handleNextDay = () => {
  const nextDate = new Date(selectedDate);
  nextDate.setDate(nextDate.getDate() + 1);
  setSelectedDate(nextDate.toISOString().split('T')[0]);
};

const handleToday = () => {
  setSelectedDate(new Date().toISOString().split('T')[0]);
};

<DateNavigator
  selectedDate={selectedDate}
  onDateChange={handleDateChange}
  onPreviousDay={handlePreviousDay}
  onNextDay={handleNextDay}
  onToday={handleToday}
/>
```

### Không hiển thị trạng thái
```jsx
<DateNavigator
  selectedDate={selectedDate}
  onDateChange={handleDateChange}
  onPreviousDay={handlePreviousDay}
  onNextDay={handleNextDay}
  onToday={handleToday}
  showStatus={false}
/>
```

### Với styling tùy chỉnh
```jsx
<DateNavigator
  selectedDate={selectedDate}
  onDateChange={handleDateChange}
  onPreviousDay={handlePreviousDay}
  onNextDay={handleNextDay}
  onToday={handleToday}
  className="bg-gray-50 p-2 rounded-lg"
/>
```

## Tính năng

- **Trạng thái ngày**: Tự động hiển thị "Hôm nay", "Quá hạn", hoặc "Tương lai"
- **Responsive**: Tương thích với các kích thước màn hình khác nhau
- **Accessible**: Hỗ trợ keyboard navigation
- **Customizable**: Có thể tùy chỉnh styling và behavior

## Ví dụ hoàn chỉnh

Xem file `DateNavigator.example.jsx` để có ví dụ sử dụng đầy đủ. 