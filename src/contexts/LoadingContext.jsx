"use client";

import { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = useCallback((message = 'Đang tải...') => {
    setLoadingCount(prev => prev + 1);
    setIsLoading(true);
    setLoadingMessage(message);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount(prev => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) {
        setIsLoading(false);
        setLoadingMessage('');
      }
      return newCount;
    });
  }, []);

  const resetLoading = useCallback(() => {
    setLoadingCount(0);
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  const value = {
    isLoading,
    loadingMessage,
    loadingCount,
    startLoading,
    stopLoading,
    resetLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
