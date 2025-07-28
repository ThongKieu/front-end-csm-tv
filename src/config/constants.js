// Configuration file - Chỉ cần sửa ở đây để thay đổi tất cả
export const CONFIG = {
  // Backend server configuration
  BACKEND: {
    BASE_URL: 'http://192.168.1.27', // Chỉ cần sửa IP ở đây
    PORT: '', // Để trống nếu không cần port
    TIMEOUT: 10000, // Timeout cho requests (ms)
  },
  
  // API endpoints
  API: {
    USER: {
      CREATE: '/api/user/create',
      LOGIN: '/api/user/login',
      LOGOUT: '/api/user/logout',
      PROFILE: '/api/user/profile',
    },
    JOB: {
      GET_BY_DATE: '/api/web/job/get-by-date',
    },
    HEALTH: '/api/health',
  },
  
  // App configuration
  APP: {
    NAME: 'CSM TV',
    VERSION: '1.0.0',
  }
};

// Helper functions
export const getBackendUrl = () => {
  const { BASE_URL, PORT } = CONFIG.BACKEND;
  return PORT ? `${BASE_URL}:${PORT}` : BASE_URL;
};

export const getApiUrl = (endpoint) => {
  return `${getBackendUrl()}${endpoint}`;
};

// Pre-built API URLs
export const API_URLS = {
  USER_CREATE: getApiUrl(CONFIG.API.USER.CREATE),
  USER_LOGIN: getApiUrl(CONFIG.API.USER.LOGIN),
  USER_LOGOUT: getApiUrl(CONFIG.API.USER.LOGOUT),
  USER_PROFILE: getApiUrl(CONFIG.API.USER.PROFILE),
  JOB_GET_BY_DATE: getApiUrl(CONFIG.API.JOB.GET_BY_DATE),
  HEALTH: getApiUrl(CONFIG.API.HEALTH),
}; 