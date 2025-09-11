import { getApiUrl, CONFIG } from "@/config/constants";
import { ApiCache, createCacheKey } from "./apiCache";
import { RequestDeduplication, createRequestKey } from "./requestDeduplication";

/**
 * Simple API utility để tránh lỗi "Failed to fetch"
 */
export class ApiManager {
  constructor(baseUrl = null) {
    this.baseUrl = baseUrl || CONFIG.BACKEND.BASE_URL;
    this.timeout = 10000; // 10 seconds timeout
  }

  /**
   * Tạo URL đầy đủ cho API endpoint
   */
  buildUrl(endpoint, environment = null) {
    return getApiUrl(endpoint, environment);
  }

  /**
   * Thực hiện HTTP request đơn giản
   */
  async request(endpoint, options = {}, environment = null) {
    const url = this.buildUrl(endpoint, environment);

    // Đơn giản hóa options để tránh lỗi
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Xử lý lỗi đơn giản
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      }

      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}, environment = null) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: "GET" }, environment);
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, environment = null) {
    return this.request(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      environment
    );
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, environment = null) {
    return this.request(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      environment
    );
  }

  /**
   * DELETE request
   */
  async delete(endpoint, environment = null) {
    return this.request(endpoint, { method: "DELETE" }, environment);
  }
}

// Tạo instance mặc định
const apiManager = new ApiManager();

// API functions đơn giản với cache và deduplication
export const fetchAssignedWorksAPI = async (date, page = 1, limit = 50, useCache = true) => {
  try {
    const cacheKey = createCacheKey(CONFIG.API.JOB.GET_ASSIGNED_WORKER_BY_DATE, { date, page, limit });
    const requestKey = createRequestKey(CONFIG.API.JOB.GET_ASSIGNED_WORKER_BY_DATE, { date, page, limit });
    
    // Check cache first
    if (useCache) {
      const cached = ApiCache.get(cacheKey);
      if (cached) {
        console.log("📦 Using cached assigned works data");
        return cached;
      }
    }
    
    // Use deduplication to prevent duplicate requests
    const data = await RequestDeduplication.makeRequest(requestKey, async () => {
      return await apiManager.post(CONFIG.API.JOB.GET_ASSIGNED_WORKER_BY_DATE, {
        date,
        page,
        limit
      });
    });
    
    // Cache the result
    if (useCache) {
      ApiCache.set(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch assigned works:", error);
    throw error;
  }
};

export const fetchUnassignedWorksAPI = async (date, page = 1, limit = 50, useCache = true) => {
  try {
    const cacheKey = createCacheKey(CONFIG.API.JOB.GET_BY_DATE, { date, page, limit });
    const requestKey = createRequestKey(CONFIG.API.JOB.GET_BY_DATE, { date, page, limit });
    
    // Check cache first
    if (useCache) {
      const cached = ApiCache.get(cacheKey);
      if (cached) {
        console.log("📦 Using cached unassigned works data");
        return cached;
      }
    }
    
    // Use deduplication to prevent duplicate requests
    const data = await RequestDeduplication.makeRequest(requestKey, async () => {
      return await apiManager.post(CONFIG.API.JOB.GET_BY_DATE, { 
        date,
        page,
        limit
      });
    });
    
    // Cache the result
    if (useCache) {
      ApiCache.set(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch unassigned works:", error);
    throw error;
  }
};

export const fetchWorkersAPI = async (jobData = null) => {
  try {
    // Nếu có jobData, gọi API để lấy workers phù hợp
    if (
      jobData &&
      (jobData.job_content ||
        jobData.job_appointment_date ||
        jobData.job_appointment_time)
    ) {
      const requestKey = createRequestKey('/api/works/get-suitable-workers', jobData);
      
      return await RequestDeduplication.makeRequest(requestKey, async () => {
        const response = await fetch("/api/works/get-suitable-workers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobData),
        });

        if (!response.ok) {
          throw new Error("Lỗi lấy danh sách thợ phù hợp");
        }

        return await response.json();
      });
    }

    const requestKey = createRequestKey('/api/user/get-workers');
    return await RequestDeduplication.makeRequest(requestKey, async () => {
      return await apiManager.get('/api/user/get-workers');
    });
  } catch (error) {
    console.error("❌ Failed to fetch workers:", error);
    throw error;
  }
};

export const assignWorkerAPI = async (workData) => {
  try {
    const { work, worker, extraWorker, authId } = workData;

    // Xác định role dựa trên extraWorker
    const role = extraWorker ? "assistant" : "main";

    const response = await fetch("/api/works/assign-worker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        work,
        worker,
        extraWorker,
        authId,
        role,
      }),
    });

    if (!response.ok) {
      throw new Error("Lỗi phân công thợ");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Failed to assign worker:", error);
    throw error;
  }
};

export const changeWorkerAPI = async (workData) => {
  try {
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

    return await apiManager.post(
      CONFIG.API.WORK_ASSIGNMENT.CHANGE_WORKER,
      data
    );
  } catch (error) {
    console.error("❌ Failed to change worker:", error);
    throw error;
  }
};

export default apiManager;
