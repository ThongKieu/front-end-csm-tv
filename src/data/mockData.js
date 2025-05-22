// Dữ liệu người dùng mẫu
export const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'user123',
    name: 'Normal User',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Normal+User&background=0D8ABC&color=fff'
  },
  {
    id: 3,
    email: 'accountant@example.com',
    password: 'accountant123',
    name: 'Kế Toán',
    role: 'accountant',
    avatar: 'https://ui-avatars.com/api/?name=Accountant+User&background=0D8ABC&color=fff'
  }
]

// Dữ liệu khách hàng mẫu
export const customers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    email: 'nguyenvana@example.com',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    phone: '0987654321',
    email: 'tranthib@example.com',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    status: 'active',
    createdAt: '2024-01-02'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    phone: '0369852147',
    email: 'levanc@example.com',
    address: '789 Đường DEF, Quận 3, TP.HCM',
    status: 'inactive',
    createdAt: '2024-01-03'
  }
]

// Dữ liệu giao dịch mẫu
export const transactions = [
  {
    id: 1,
    customerId: 1,
    amount: 1500000,
    type: 'deposit',
    status: 'completed',
    description: 'Nạp tiền tháng 1',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    customerId: 2,
    amount: 2000000,
    type: 'withdraw',
    status: 'completed',
    description: 'Rút tiền tháng 1',
    createdAt: '2024-01-16'
  },
  {
    id: 3,
    customerId: 3,
    amount: 3000000,
    type: 'deposit',
    status: 'pending',
    description: 'Nạp tiền tháng 1',
    createdAt: '2024-01-17'
  }
]

// Menu items cho sidebar
export const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    route: '/dashboard',
    roles: ['admin', 'user', 'accountant']
  },
  {
    id: 'customers',
    label: 'Khách hàng',
    icon: 'Users',
    route: '/customer',
    roles: ['admin', 'user']
  },
  {
    id: 'transactions',
    label: 'Giao dịch',
    icon: 'CreditCard',
    route: '/accountant/transactions',
    roles: ['admin', 'accountant']
  },
  {
    id: 'reports',
    label: 'Báo cáo',
    icon: 'BarChart',
    route: '/accountant/reports',
    roles: ['admin', 'accountant']
  },
  {
    id: 'users',
    label: 'Quản lý người dùng',
    icon: 'UserCog',
    route: '/admin/users',
    roles: ['admin']
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: 'Settings',
    route: '/admin/settings',
    roles: ['admin']
  }
] 