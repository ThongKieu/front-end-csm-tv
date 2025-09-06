import { useRef, useCallback } from 'react';

/**
 * Hook để tối ưu hóa việc gọi API và tránh lặp lại
 * @param {Function} apiFunction - Function gọi API
 * @param {number} debounceTime - Thời gian debounce (ms)
 * @returns {Object} - Object chứa các function được tối ưu
 */
export function useApiOptimization(apiFunction, debounceTime = 300) {
  const timeoutRef = useRef(null);
  const lastCallRef = useRef(null);
  const isPendingRef = useRef(false);
  const lastResultRef = useRef(null);
  const lastArgsRef = useRef(null);

  // Function để clear timeout
  const clearTimeoutFunc = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Debounced function để tránh gọi API quá nhiều
  const debouncedCall = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    return new Promise((resolve, reject) => {
      timeoutRef.current = setTimeout(async () => {
        try {
          // Kiểm tra xem có đang pending không
          if (isPendingRef.current) {
         
            return;
          }

          // Kiểm tra xem có phải là lần gọi trùng lặp không
          const callKey = JSON.stringify(args);
          if (lastCallRef.current === callKey && lastResultRef.current) {
            resolve(lastResultRef.current);
            return;
          }

          isPendingRef.current = true;
          lastCallRef.current = callKey;
          lastArgsRef.current = args;
          
          const result = await apiFunction(...args);
          
          // Cache kết quả
          lastResultRef.current = result;
          
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          isPendingRef.current = false;
        }
      }, debounceTime);
    });
  }, [apiFunction, debounceTime]);

  // Function để gọi API ngay lập tức (không debounce)
  const immediateCall = useCallback(async (...args) => {
    try {
      if (isPendingRef.current) {
        return;
      }

      // Kiểm tra cache cho immediate call
      const callKey = JSON.stringify(args);
      if (lastCallRef.current === callKey && lastResultRef.current) {
        return lastResultRef.current;
      }

      isPendingRef.current = true;
      lastCallRef.current = callKey;
      lastArgsRef.current = args;
      
      const result = await apiFunction(...args);
      
      // Cache kết quả
      lastResultRef.current = result;
      
      return result;
    } catch (error) {
      throw error;
    } finally {
      isPendingRef.current = false;
    }
  }, [apiFunction]);

  // Function để reset state
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    lastCallRef.current = null;
    lastArgsRef.current = null;
    lastResultRef.current = null;
    isPendingRef.current = false;
  }, []);

  // Function để clear cache
  const clearCache = useCallback(() => {
    lastResultRef.current = null;
    lastCallRef.current = null;
    lastArgsRef.current = null;
  }, []);

  return {
    debouncedCall,
    immediateCall,
    clearTimeout: clearTimeoutFunc,
    reset,
    clearCache,
    isPending: isPendingRef.current
  };
}

/**
 * Hook để quản lý cache cho API calls
 * @param {number} expiryTime - Thời gian cache hết hạn (ms)
 * @returns {Object} - Object chứa các function quản lý cache
 */
export function useApiCache(expiryTime = 5 * 60 * 1000) {
  const cacheRef = useRef(new Map());

  const get = useCallback((key) => {
    const cached = cacheRef.current.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > expiryTime) {
      cacheRef.current.delete(key);
      return null;
    }

    return cached.data;
  }, [expiryTime]);

  const set = useCallback((key, data) => {
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  const clear = useCallback((key) => {
    if (key) {
      cacheRef.current.delete(key);
    } else {
      cacheRef.current.clear();
    }
  }, []);

  const has = useCallback((key) => {
    return cacheRef.current.has(key);
  }, []);

  const getSize = useCallback(() => {
    return cacheRef.current.size;
  }, []);

  return { get, set, clear, has, getSize };
}

/**
 * Hook để quản lý request deduplication
 * @returns {Object} - Object chứa các function quản lý deduplication
 */
export function useRequestDeduplication() {
  const pendingRequestsRef = useRef(new Map());

  const makeRequest = useCallback(async (key, requestFn) => {
    // Kiểm tra xem có request đang pending không
    if (pendingRequestsRef.current.has(key)) {
      return pendingRequestsRef.current.get(key);
    }

    // Tạo promise mới
    const promise = requestFn();
    pendingRequestsRef.current.set(key, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      // Xóa khỏi pending requests
      pendingRequestsRef.current.delete(key);
    }
  }, []);

  const clearPending = useCallback(() => {
    pendingRequestsRef.current.clear();
  }, []);

  const getPendingCount = useCallback(() => {
    return pendingRequestsRef.current.size;
  }, []);

  return { makeRequest, clearPending, getPendingCount };
}
