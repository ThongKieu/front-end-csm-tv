// Environment configuration
export const ENV_CONFIG = {
  // API Base URL - Thay đổi tên miền ở đây
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.46',
  API_PORT: process.env.NEXT_PUBLIC_API_PORT || '',
  
  // Các môi trường khác nhau 
  ENVIRONMENTS: {
    DEVELOPMENT: 'http://192.168.1.46',
    STAGING: 'https://staging-api.yourdomain.com',
    PRODUCTION: 'https://api.yourdomain.com',
    LOCAL: 'http://localhost:3000'
  },
  
  // Môi trường hiện tại
  CURRENT_ENV: process.env.NODE_ENV || 'development'
};

// Function để lấy cấu hình môi trường
export const getEnvironmentConfig = () => {
  return ENV_CONFIG;
};

// Function để thay đổi môi trường
export const setEnvironment = (envName) => {
  if (ENV_CONFIG.ENVIRONMENTS[envName]) {
    ENV_CONFIG.API_BASE_URL = ENV_CONFIG.ENVIRONMENTS[envName];
    return true;
  }
  return false;
};
