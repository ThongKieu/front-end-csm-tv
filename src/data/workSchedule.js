// Dữ liệu mẫu cho bảng phân công công việc
export const workScheduleData = [
  {
    id: 1,
    employee: 'Nguyễn Văn A',
    position: 'Kỹ thuật viên',
    monday: { morning: 'Bảo trì hệ thống', afternoon: 'Kiểm tra thiết bị' },
    tuesday: { morning: 'Lắp đặt camera', afternoon: 'Cài đặt phần mềm' },
    wednesday: { morning: 'Sửa chữa thiết bị', afternoon: 'Bảo trì mạng' },
    thursday: { morning: 'Kiểm tra an ninh', afternoon: 'Cập nhật hệ thống' },
    friday: { morning: 'Bảo trì định kỳ', afternoon: 'Báo cáo tuần' },
    status: 'active'
  },
  {
    id: 2,
    employee: 'Trần Thị B',
    position: 'Nhân viên vận hành',
    monday: { morning: 'Giám sát hệ thống', afternoon: 'Xử lý sự cố' },
    tuesday: { morning: 'Cập nhật dữ liệu', afternoon: 'Kiểm tra báo cáo' },
    wednesday: { morning: 'Vận hành thiết bị', afternoon: 'Bảo trì phòng máy' },
    thursday: { morning: 'Kiểm tra an toàn', afternoon: 'Cập nhật phần mềm' },
    friday: { morning: 'Báo cáo vận hành', afternoon: 'Kiểm tra tổng thể' },
    status: 'active'
  },
  {
    id: 3,
    employee: 'Lê Văn C',
    position: 'Kỹ thuật viên',
    monday: { morning: 'Lắp đặt thiết bị', afternoon: 'Kiểm tra mạng' },
    tuesday: { morning: 'Bảo trì camera', afternoon: 'Cài đặt phần mềm' },
    wednesday: { morning: 'Sửa chữa hệ thống', afternoon: 'Kiểm tra an ninh' },
    thursday: { morning: 'Cập nhật thiết bị', afternoon: 'Bảo trì định kỳ' },
    friday: { morning: 'Kiểm tra tổng thể', afternoon: 'Báo cáo tuần' },
    status: 'active'
  }
]

// Các cột cho bảng phân công
export const columns = [
  {
    accessorKey: 'employee',
    header: 'Nhân viên',
    size: 150,
  },
  {
    accessorKey: 'position',
    header: 'Vị trí',
    size: 150,
  },
  {
    header: 'Thứ 2',
    columns: [
      {
        accessorKey: 'monday.morning',
        header: 'Sáng',
        size: 150,
      },
      {
        accessorKey: 'monday.afternoon',
        header: 'Chiều',
        size: 150,
      },
    ],
  },
  {
    header: 'Thứ 3',
    columns: [
      {
        accessorKey: 'tuesday.morning',
        header: 'Sáng',
        size: 150,
      },
      {
        accessorKey: 'tuesday.afternoon',
        header: 'Chiều',
        size: 150,
      },
    ],
  },
  {
    header: 'Thứ 4',
    columns: [
      {
        accessorKey: 'wednesday.morning',
        header: 'Sáng',
        size: 150,
      },
      {
        accessorKey: 'wednesday.afternoon',
        header: 'Chiều',
        size: 150,
      },
    ],
  },
  {
    header: 'Thứ 5',
    columns: [
      {
        accessorKey: 'thursday.morning',
        header: 'Sáng',
        size: 150,
      },
      {
        accessorKey: 'thursday.afternoon',
        header: 'Chiều',
        size: 150,
      },
    ],
  },
  {
    header: 'Thứ 6',
    columns: [
      {
        accessorKey: 'friday.morning',
        header: 'Sáng',
        size: 150,
      },
      {
        accessorKey: 'friday.afternoon',
        header: 'Chiều',
        size: 150,
      },
    ],
  },
] 