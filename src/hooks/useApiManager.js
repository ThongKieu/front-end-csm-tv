"use client";

import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAssignedWorks, fetchUnassignedWorks, fetchWorkers } from '@/store/slices/workSlice';

export const useApiManager = () => {
  const dispatch = useDispatch();
  const lastCallRef = useRef({});
  const pendingCallsRef = useRef(new Set());

  const fetchData = useCallback(async (date, options = {}) => {
    const {
      forceRefresh = false,
      includeWorkers = false,
      skipCache = false
    } = options;

    const callKey = `fetchData_${date}_${forceRefresh}_${includeWorkers}`;
    
    // Nếu forceRefresh hoặc skipCache, không check duplicate calls
    if (!forceRefresh && !skipCache) {
      // Prevent duplicate calls
      if (pendingCallsRef.current.has(callKey)) {
        return;
      }

      // Check if we recently made the same call
      const now = Date.now();
      const lastCall = lastCallRef.current[callKey];
      if (lastCall && (now - lastCall) < 1000) { // 1 second cooldown
        return;
      }
    }

    pendingCallsRef.current.add(callKey);
    lastCallRef.current[callKey] = Date.now();

    try {

      const promises = [
        dispatch(fetchAssignedWorks({ date, forceRefresh, skipCache })),
        dispatch(fetchUnassignedWorks({ date, forceRefresh, skipCache }))
      ];

      if (includeWorkers) {
        promises.push(dispatch(fetchWorkers()));
      }

      await Promise.all(promises);
      
    } catch (error) {
      console.error(`❌ Error fetching data for date: ${date}`, error);
      throw error;
    } finally {
      pendingCallsRef.current.delete(callKey);
    }
  }, [dispatch]);

  const clearCache = useCallback((date) => {
    if (date) {
      // Clear specific date cache
      Object.keys(lastCallRef.current).forEach(key => {
        if (key.includes(date)) {
          delete lastCallRef.current[key];
        }
      });
    } else {
      // Clear all cache
      lastCallRef.current = {};
      pendingCallsRef.current.clear();
    }
  }, []);

  return {
    fetchData,
    clearCache,
    getPendingCalls: () => Array.from(pendingCallsRef.current),
    getLastCalls: () => lastCallRef.current
  };
};
