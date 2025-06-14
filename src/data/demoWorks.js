// Hàm helper để tạo thời gian hợp lệ
const generateValidTime = (date) => {
  const hours = Math.floor(Math.random() * 8) + 8; // Từ 8h đến 16h
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00Z`;
};

// Danh sách tên khách hàng mẫu
const customerNames = [
  "Nguyễn Văn An", "Trần Thị Bình", "Lê Văn Cường", "Phạm Thị Dung",
  "Hoàng Văn Em", "Vũ Thị Phương", "Đặng Văn Hùng", "Bùi Thị Mai",
  "Đỗ Văn Nam", "Hồ Thị Lan", "Ngô Văn Tú", "Dương Thị Hương",
  "Trịnh Văn Minh", "Lý Thị Hà", "Võ Văn Sơn", "Đinh Thị Thảo",
  "Mai Văn Tuấn", "Lâm Thị Nga", "Tạ Văn Hải", "Phan Thị Hồng"
];

// Danh sách địa chỉ mẫu
const addresses = [
  "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
  "456 Đường Lê Lợi, Quận 1, TP.HCM",
  "789 Đường Đồng Khởi, Quận 1, TP.HCM",
  "321 Đường Nguyễn Du, Quận 1, TP.HCM",
  "654 Đường Lê Duẩn, Quận 1, TP.HCM",
  "987 Đường Pasteur, Quận 1, TP.HCM",
  "147 Đường Võ Văn Tần, Quận 3, TP.HCM",
  "258 Đường Lý Tự Trọng, Quận 1, TP.HCM",
  "369 Đường Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM",
  "741 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM"
];

// Danh sách nội dung công việc mẫu
const workContents = {
  "Điều hòa": [
    "Sửa chữa điều hòa không lạnh",
    "Bảo trì định kỳ điều hòa",
    "Lắp đặt điều hòa mới",
    "Vệ sinh điều hòa",
    "Sửa chữa điều hòa bị rò gas"
  ],
  "Camera": [
    "Lắp đặt camera an ninh mới",
    "Sửa chữa camera không hoạt động",
    "Nâng cấp hệ thống camera",
    "Bảo trì camera định kỳ",
    "Lắp đặt camera giám sát"
  ],
  "Điện": [
    "Sửa chữa hệ thống điện",
    "Lắp đặt điện mới",
    "Bảo trì hệ thống điện",
    "Sửa chữa chập điện",
    "Nâng cấp hệ thống điện"
  ],
  "Âm thanh": [
    "Lắp đặt hệ thống âm thanh",
    "Sửa chữa loa không hoạt động",
    "Nâng cấp hệ thống âm thanh",
    "Bảo trì hệ thống âm thanh",
    "Lắp đặt âm thanh hội trường"
  ]
};

// Hàm tạo số điện thoại ngẫu nhiên
const generatePhone = () => {
  return `0${Math.floor(Math.random() * 900000000) + 100000000}`;
};

// Hàm tạo email từ tên
const generateEmail = (name) => {
  const nameParts = name.toLowerCase().split(' ');
  return `${nameParts[nameParts.length - 1]}${Math.floor(Math.random() * 1000)}@example.com`;
};

// Dữ liệu mẫu cho công việc
const demoWorks = [
  // Ngày 12/06/2025 - Các công việc đã hoàn thành
  ...Array.from({ length: 15 }, (_, i) => {
    const kindWork = ['Điều hòa', 'Camera', 'Điện', 'Âm thanh'][Math.floor(Math.random() * 4)];
    const customerName = customerNames[i % customerNames.length];
    return {
      id: i + 1,
      customer: {
        id: i + 1,
        name: customerName,
        phone: generatePhone(),
        email: generateEmail(customerName)
      },
      work_content: workContents[kindWork][Math.floor(Math.random() * workContents[kindWork].length)],
      status_work: "completed",
      kind_work: kindWork,
      date_book: "2025-06-12",
      address: {
        id: i + 1,
        address: addresses[i % addresses.length],
        latitude: 10.7756587,
        longitude: 106.7004238
      },
      created_at: `2025-06-12T${generateValidTime()}`,
      updated_at: `2025-06-12T${generateValidTime()}`
    };
  }),

  // Ngày 13/06/2025 - Các công việc đang thực hiện
  ...Array.from({ length: 15 }, (_, i) => {
    const kindWork = ['Điều hòa', 'Camera', 'Điện', 'Âm thanh'][Math.floor(Math.random() * 4)];
    const customerName = customerNames[(i + 15) % customerNames.length];
    return {
      id: i + 16,
      customer: {
        id: i + 16,
        name: customerName,
        phone: generatePhone(),
        email: generateEmail(customerName)
      },
      work_content: workContents[kindWork][Math.floor(Math.random() * workContents[kindWork].length)],
      status_work: "in_progress",
      kind_work: kindWork,
      date_book: "2025-06-13",
      address: {
        id: i + 16,
        address: addresses[(i + 15) % addresses.length],
        latitude: 10.7756587,
        longitude: 106.7004238
      },
      created_at: `2025-06-13T${generateValidTime()}`,
      updated_at: `2025-06-13T${generateValidTime()}`
    };
  }),

  // Ngày 14/06/2025 - Các công việc đang báo giá
  ...Array.from({ length: 20 }, (_, i) => {
    const kindWork = ['Điều hòa', 'Camera', 'Điện', 'Âm thanh'][Math.floor(Math.random() * 4)];
    const customerName = customerNames[(i + 30) % customerNames.length];
    return {
      id: i + 31,
      customer: {
        id: i + 31,
        name: customerName,
        phone: generatePhone(),
        email: generateEmail(customerName)
      },
      work_content: workContents[kindWork][Math.floor(Math.random() * workContents[kindWork].length)],
      status_work: "pending",
      kind_work: kindWork,
      date_book: "2025-06-14",
      address: {
        id: i + 31,
        address: addresses[(i + 30) % addresses.length],
        latitude: 10.7756587,
        longitude: 106.7004238
      },
      created_at: `2025-06-13T${generateValidTime()}`,
      updated_at: `2025-06-13T${generateValidTime()}`
    };
  })
];

// Hàm lấy công việc theo ngày
export const getWorksByDate = (date) => {
  // Chuyển đổi date thành string format YYYY-MM-DD
  const dateStr = date instanceof Date 
    ? date.toISOString().split('T')[0]
    : date;

  // Lọc công việc theo ngày đặt
  return demoWorks.filter(work => work.date_book === dateStr);
};

// Hàm lấy tất cả công việc
export const getAllWorks = () => {
  return demoWorks;
};

// Hàm lấy công việc theo trạng thái
export const getWorksByStatus = (status) => {
  return demoWorks.filter(work => work.status_work === status);
};

// Hàm lấy công việc theo loại
export const getWorksByKind = (kind) => {
  return demoWorks.filter(work => work.kind_work === kind);
};

// Hàm lấy công việc theo khách hàng
export const getWorksByCustomer = (customerId) => {
  return demoWorks.filter(work => work.customer.id === customerId);
};

// Hàm lấy công việc theo khoảng thời gian
export const getWorksByDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return demoWorks.filter(work => {
    const workDate = new Date(work.created_at);
    return workDate >= start && workDate <= end;
  });
};

// Hàm lấy công việc theo số điện thoại khách hàng
export const getWorksByCustomerPhone = (phone) => {
  // Chuyển đổi số điện thoại tìm kiếm về định dạng chuẩn (bỏ khoảng trắng, dấu gạch ngang)
  const normalizedSearchPhone = phone.replace(/[\s-]/g, '');
  
  return demoWorks.filter(work => {
    // Chuyển đổi số điện thoại trong dữ liệu về định dạng chuẩn
    const normalizedWorkPhone = work.customer.phone.replace(/[\s-]/g, '');
    // Tìm kiếm không phân biệt hoa thường và trả về true nếu số điện thoại chứa chuỗi tìm kiếm
    return normalizedWorkPhone.toLowerCase().includes(normalizedSearchPhone.toLowerCase());
  });
};

export default demoWorks; 