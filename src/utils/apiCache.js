"use client";

// Simple in-memory cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class ApiCache {
  static get(key) {
    const cached = cache.get(key);
    if (!cached) return null;
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  static set(key, data) {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  static clear(key) {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  }
  
  static clearByPattern(pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  }
}

// Helper function to create cache key
export const createCacheKey = (url, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `${url}?${sortedParams}`;
};
