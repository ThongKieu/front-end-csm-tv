export const ROUTES = {
  // Auth routes
  LOGIN: "/login",

  // Main routes
  HOME: "/dashboard", // Trang chủ/dashboard chung
  DASHBOARD: "/dashboard", // Trùng với HOME
  CUSTOMER: "/customer", // Trang chủ/dashboard chung
  CUSTOMER: "/customer", // Trùng với HOME
  LOCAL_WORKER: "/", // Trang chủ/dashboard chung
  LOCAL_WORKER: "/", // Trùng với HOME

  // Admin routes
  ADMIN: {
    ROOT: "/admin", // Trang chủ admin
    USERS: "/admin/users",
    SETTINGS: "/admin/settings",
  },

  // Accountant routes
  ACCOUNTANT: {
    ROOT: "/accountant", // Trang chủ kế toán
    TRANSACTIONS: "/accountant/transactions",
    REPORTS: "/accountant/reports",
  },

  // User routes
  USER: {
    ROOT: "/user", // Trang chủ user
    PROFILE: "/user/profile",
  },
};

// Helper function để lấy route dựa vào role
export const getRoleBasedRoute = (role) => {
  switch (role) {
    case "admin":
      return ROUTES.ADMIN.ROOT;
    case "accountant":
      return ROUTES.ACCOUNTANT.ROOT;
    case "user":
      return ROUTES.USER.ROOT;
    default:
      return ROUTES.HOME; // Sử dụng HOME thay vì DASHBOARD
  }
};

// Helper function để kiểm tra route có thuộc role không
export const isRouteAllowed = (pathname, role) => {
  // Cho phép truy cập trang chủ/dashboard
  if (pathname === "/") return true;

  // Kiểm tra các route được bảo vệ
  if (pathname.startsWith("/admin") && role !== "admin") return false;
  if (pathname.startsWith("/accountant") && role !== "accountant") return false;
  return true;
};
