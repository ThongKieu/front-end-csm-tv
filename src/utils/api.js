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
const apiManager = new ApiManager();

// API functions for workSlice
export const fetchAssignedWorksAPI = async (date) => {
  return apiManager.post(CONFIG.API.JOB.GET_ASSIGNED_WORKER_BY_DATE, { date });
};

export const fetchUnassignedWorksAPI = async (date) => {
  return apiManager.post(CONFIG.API.JOB.GET_BY_DATE, { date });
};

export const fetchWorkersAPI = async () => {
  return apiManager.get(CONFIG.API.WORKER.GET_ALL);
};

export const assignWorkerAPI = async (workData) => {
  const { work, worker, extraWorker, dateCheck, authId } = workData;
  
  const data_hisWork = [
    {
      id_auth: authId,
      id_worker: null,
      action: "guitho",
      time: new Date().toLocaleTimeString(),
    },
  ];

  const data = {
    id_work: work.id,
    id_worker: worker,
    id_phu: extraWorker,
    work_note: work.work_note,
    auth_id: authId,
    his_work: JSON.stringify(data_hisWork),
    dateCheck: dateCheck,
  };

  return apiManager.post(`${CONFIG.API.WORK_ASSIGNMENT.ASSIGN}?dateCheck=${dateCheck}`, data);
};

export const changeWorkerAPI = async (workData) => {
  const { workAssignment, worker, extraWorker, authId } = workData;
  
  const data_hisWork = [
    {
      id_auth: authId,
      id_worker: null,
      action: "doitho",
      time: new Date().toLocaleTimeString(),
    },
  ];

  const data = {
    id_work_ass: workAssignment.id,
    id_worker: worker || "",
    auth_id: authId,
    id_phu: extraWorker || "",
    his_work: JSON.stringify(data_hisWork),
  };

  return apiManager.post(CONFIG.API.WORK_ASSIGNMENT.CHANGE_WORKER, data);
};

export default apiManager;
