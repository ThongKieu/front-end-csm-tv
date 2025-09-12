export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  WORKS: "/works",
  CUSTOMERS: "/customer",
  SERVICES: "/services",
  REPORTS: "/reports",
  WORKERS: "/workers",
  SETTINGS: "/settings",
  CHANGE_PASSWORD: '/change-password',
  CUSTOMER: '/customer',
  QUOTES: '/quotes',
  WARDS: '/wards',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    MAIN: '/admin',
    USERS: '/admin/workers',
    SCHEDULE: '/admin/schedule',
    COMPANY: '/admin/company',
    REPORTS: '/admin/reports',
    DOCUMENTS: '/admin/documents',
    SETTINGS: '/admin/settings',
    ZNS: '/admin/zns'
  },
  ACCOUNTANT: {
    TRANSACTIONS: '/accountant/transactions',
  },
  WORKER: {
    MY_WORKS: '/worker/my-works',
  },
};

// Helper function để lấy route dựa vào role
export const getRoleBasedRoute = (role) => {
  switch (role) {
    case 'admin':
      return ROUTES.ADMIN.DASHBOARD;
    case 'manager':
      return ROUTES.DASHBOARD; // Manager đi đến dashboard thường
    case 'office':
      return ROUTES.ADMIN.DASHBOARD; // Office đi đến admin dashboard
    case 'accountant':
      return ROUTES.ACCOUNTANT.TRANSACTIONS;
    case 'worker':
      return ROUTES.WORKER.MY_WORKS;
    case 'user':
      return ROUTES.DASHBOARD; // User đi đến dashboard thường
    default:
      return ROUTES.DASHBOARD; // Default đi đến dashboard
  }
}; 