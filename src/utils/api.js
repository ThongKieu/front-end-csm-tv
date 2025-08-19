import { getApiUrl, CONFIG } from '@/config/constants';

/**
 * Utility class để quản lý API calls
 */
export class ApiManager {
  constructor(baseUrl = null) {
    this.baseUrl = baseUrl || CONFIG.BACKEND.BASE_URL;
    this.timeout = CONFIG.BACKEND.TIMEOUT;
  }

  /**
   * Tạo URL đầy đủ cho API endpoint
   */
  buildUrl(endpoint, environment = null) {
    return getApiUrl(endpoint, environment);
  }

  /**
   * Thực hiện HTTP request
   */
  async request(endpoint, options = {}, environment = null) {
    const url = this.buildUrl(endpoint, environment);
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: this.timeout,
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}, environment = null) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, { method: 'GET' }, environment);
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, environment = null) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, environment);
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, environment = null) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, environment);
  }

  /**
   * DELETE request
   */
  async delete(endpoint, environment = null) {
    return this.request(endpoint, { method: 'DELETE' }, environment);
  }

  /**
   * Thay đổi base URL
   */
  setBaseUrl(newUrl) {
    this.baseUrl = newUrl;
  }

  /**
   * Lấy base URL hiện tại
   */
  getBaseUrl() {
    return this.baseUrl;
  }
}

// Tạo instance mặc định
export const api = new ApiManager();

// Export các helper functions
export const apiGet = (endpoint, params, environment) => api.get(endpoint, params, environment);
export const apiPost = (endpoint, data, environment) => api.post(endpoint, data, environment);
export const apiPut = (endpoint, data, environment) => api.put(endpoint, data, environment);
export const apiDelete = (endpoint, environment) => api.delete(endpoint, environment);
export const buildApiUrl = (endpoint, environment) => api.buildUrl(endpoint, environment);
