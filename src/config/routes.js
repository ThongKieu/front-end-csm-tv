export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  CUSTOMER: '/customer',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    SCHEDULE: '/admin/schedule',
    COMPANY: '/admin/company',
    REPORTS: '/admin/reports',
    DOCUMENTS: '/admin/documents',
    SETTINGS: '/admin/settings',
  },
  ACCOUNTANT: {
    TRANSACTIONS: '/accountant/transactions',
  },
};

// Helper function để lấy route dựa vào role
export const getRoleBasedRoute = (role) => {
  switch (role) {
    case 'admin':
      return ROUTES.ADMIN.DASHBOARD;
    case 'accountant':
      return ROUTES.ACCOUNTANT.TRANSACTIONS;
    case 'user':
      return ROUTES.HOME;
    default:
      return ROUTES.HOME;
  }
}; 