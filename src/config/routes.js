export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Main routes
  HOME: '/dashboard',
  CUSTOMER: '/customer',
  PROFILE: '/profile',

  // Admin routes
  ADMIN: {
    ROOT: '/admin',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
  },

  // Accountant routes
  ACCOUNTANT: {
    ROOT: '/accountant',
    TRANSACTIONS: '/accountant/transactions',
    REPORTS: '/accountant/reports',
  },
};

// Helper function để lấy route dựa vào role
export const getRoleBasedRoute = (role) => {
  switch (role) {
    case 'admin':
      return ROUTES.ADMIN.ROOT;
    case 'accountant':
      return ROUTES.ACCOUNTANT.ROOT;
    case 'user':
      return ROUTES.HOME;
    default:
      return ROUTES.HOME;
  }
}; 