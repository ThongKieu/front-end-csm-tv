"use client";

// Global request deduplication map
const pendingRequests = new Map();

/**
 * Deduplication utility để tránh gọi API trùng lặp
 */
export class RequestDeduplication {
  static async makeRequest(key, requestFn) {
    // Kiểm tra xem có request đang pending không
    if (pendingRequests.has(key)) {
      console.log(`🔄 Deduplicating request: ${key}`);
      return pendingRequests.get(key);
    }

    // Tạo promise mới
    const promise = requestFn();
    pendingRequests.set(key, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      // Xóa khỏi pending requests
      pendingRequests.delete(key);
    }
  }

  static clearPending(key) {
    if (key) {
      pendingRequests.delete(key);
    } else {
      pendingRequests.clear();
    }
  }

  static getPendingCount() {
    return pendingRequests.size;
  }

  static getPendingKeys() {
    return Array.from(pendingRequests.keys());
  }
}

/**
 * Tạo key duy nhất cho request
 */
export const createRequestKey = (endpoint, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${JSON.stringify(params[key])}`)
    .join('&');
  
  return `${endpoint}?${sortedParams}`;
};
