import { ENV_CONFIG } from './environment.js';

// Configuration file - Chỉ cần sửa ở đây để thay đổi tất cả
export const CONFIG = {
  // Backend server configuration
  BACKEND: {
    // Có thể thay đổi dễ dàng từ đây
    BASE_URL: ENV_CONFIG.API_BASE_URL,
    PORT: ENV_CONFIG.API_PORT,
    TIMEOUT: 10000, // Timeout cho requests (ms)
    
    // Các môi trường khác nhau
    ENVIRONMENTS: ENV_CONFIG.ENVIRONMENTS
  },
  
  // API endpoints - Không cần thay đổi khi đổi tên miền
  API: {
    USER: {
      CREATE: '/api/user/create',
      LOGIN: '/api/user/login',
      LOGOUT: '/api/user/logout',
      PROFILE: '/api/user/profile',
      CHANGE_PASSWORD: '/api/user/change-password',
      UPDATE: '/api/user/update',
    },
    JOB: {
      GET_BY_DATE: '/api/web/job/get-by-date',
      GET_ASSIGNED_WORKER_BY_DATE: '/api/web/job/get-assigned-worker-by-date',
      GET_ALL: '/api/web/job/get-all',
      CREATE: '/api/web/job/create',
      UPDATE: '/api/web/job/update',
      DELETE: '/api/web/job/delete',
      ASSIGN_WORKER: '/api/web/job/assign-worker',
    },
    WORKER: {
      GET_ALL: '/api/user/get-workers',
    },
    WORK_ASSIGNMENT: {
      ASSIGN: '/api/web/work-assignment',
      CHANGE_WORKER: '/api/web/work-assignment/change-worker',
    },
    ADMIN: {
      STATS: '/api/admin/stats',
      USERS: '/api/admin/users',
      WORKERS: '/api/admin/workers',
    },
    HEALTH: '/api/health',
  },
  
  // App configuration
  APP: {
    NAME: 'CSM TV',
    VERSION: '1.0.0',
  }
};

// Helper functions để lấy URL động
export const getBackendUrl = (environment = null) => {
  let baseUrl = CONFIG.BACKEND.BASE_URL;
  
  // Nếu chỉ định môi trường cụ thể
  if (environment && CONFIG.BACKEND.ENVIRONMENTS[environment]) {
    baseUrl = CONFIG.BACKEND.ENVIRONMENTS[environment];
  }
  
  const { PORT } = CONFIG.BACKEND;
  return PORT ? `${baseUrl}:${PORT}` : baseUrl;
};

export const getApiUrl = (endpoint, environment = null) => {
  return `${getBackendUrl(environment)}${endpoint}`;
};

// Function để lấy URL cho API calls từ frontend (sử dụng rewrites)
export const getClientApiUrl = (endpoint) => {
  // Nếu endpoint bắt đầu với /api/web, sử dụng relative URL để tận dụng rewrites
  if (endpoint.startsWith('/api/web')) {
    return endpoint;
  }
  // Các API khác (internal Next.js routes) cũng sử dụng relative URL
  return endpoint;
};

// Function để thay đổi tên miền động
export const setBackendUrl = (newUrl) => {
  CONFIG.BACKEND.BASE_URL = newUrl;
};

// Function để chuyển đổi môi trường
export const switchEnvironment = (environment) => {
  if (CONFIG.BACKEND.ENVIRONMENTS[environment]) {
    CONFIG.BACKEND.BASE_URL = CONFIG.BACKEND.ENVIRONMENTS[environment];
    return true;
  }
  return false;
};

// Pre-built API URLs - Sử dụng động
export const API_URLS = {
  USER_CREATE: getApiUrl(CONFIG.API.USER.CREATE),
  USER_LOGIN: getApiUrl(CONFIG.API.USER.LOGIN),
  USER_LOGOUT: getApiUrl(CONFIG.API.USER.LOGOUT),
  USER_PROFILE: getApiUrl(CONFIG.API.USER.PROFILE),
  USER_CHANGE_PASSWORD: getApiUrl(CONFIG.API.USER.CHANGE_PASSWORD),
  USER_UPDATE: getApiUrl(CONFIG.API.USER.UPDATE),
  JOB_GET_BY_DATE: getApiUrl(CONFIG.API.JOB.GET_BY_DATE),
  JOB_GET_ASSIGNED_WORKER_BY_DATE: getApiUrl(CONFIG.API.JOB.GET_ASSIGNED_WORKER_BY_DATE),
  JOB_GET_ALL: getApiUrl(CONFIG.API.JOB.GET_ALL),
  JOB_CREATE: getApiUrl(CONFIG.API.JOB.CREATE),
  JOB_UPDATE: getApiUrl(CONFIG.API.JOB.UPDATE),
  JOB_DELETE: getApiUrl(CONFIG.API.JOB.DELETE),
  JOB_ASSIGN_WORKER: getApiUrl(CONFIG.API.JOB.ASSIGN_WORKER),
  WORK_ASSIGNMENT_ASSIGN: getApiUrl(CONFIG.API.WORK_ASSIGNMENT.ASSIGN),
  WORK_ASSIGNMENT_CHANGE_WORKER: getApiUrl(CONFIG.API.WORK_ASSIGNMENT.CHANGE_WORKER),
  WORKER_GET_ALL: getApiUrl(CONFIG.API.WORKER.GET_ALL),
  ADMIN_STATS: getApiUrl(CONFIG.API.ADMIN.STATS),
  ADMIN_USERS: getApiUrl(CONFIG.API.ADMIN.USERS),
  ADMIN_WORKERS: getApiUrl(CONFIG.API.ADMIN.WORKERS),
  HEALTH: getApiUrl(CONFIG.API.HEALTH),
};

// Function để lấy tất cả API URLs với môi trường cụ thể
export const getEnvironmentApiUrls = (environment) => {
  const urls = {};
  Object.keys(CONFIG.API).forEach(category => {
    if (typeof CONFIG.API[category] === 'string') {
      urls[category] = getApiUrl(CONFIG.API[category], environment);
    } else {
      urls[category] = {};
      Object.keys(CONFIG.API[category]).forEach(endpoint => {
        urls[category][endpoint] = getApiUrl(CONFIG.API[category][endpoint], environment);
      });
    }
  });
  return urls;
}; 