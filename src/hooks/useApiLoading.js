"use client";

import { useCallback } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

export const useApiLoading = () => {
  const { startLoading, stopLoading } = useLoading();

  const withLoading = useCallback(async (apiCall, loadingMessage = 'Đang tải...') => {
    try {
      startLoading(loadingMessage);
      const result = await apiCall();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const withLoadingCallback = useCallback((apiCall, loadingMessage = 'Đang tải...') => {
    return async (...args) => {
      try {
        startLoading(loadingMessage);
        const result = await apiCall(...args);
        return result;
      } finally {
        stopLoading();
      }
    };
  }, [startLoading, stopLoading]);

  return {
    withLoading,
    withLoadingCallback,
    startLoading,
    stopLoading
  };
};
