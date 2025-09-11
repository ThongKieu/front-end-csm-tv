"use client";

import { memo } from 'react';
import LoadingSpinner from './LoadingSpinner';

const OptimizedLoading = memo(function OptimizedLoading({ 
  loading, 
  children, 
  skeleton = false,
  minHeight = "200px" 
}) {
  if (loading) {
    if (skeleton) {
      return (
        <div className="space-y-4" style={{ minHeight }}>
          <div className="loading-skeleton h-4 w-3/4 rounded"></div>
          <div className="loading-skeleton h-4 w-1/2 rounded"></div>
          <div className="loading-skeleton h-4 w-2/3 rounded"></div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center" style={{ minHeight }}>
        <LoadingSpinner size="md" text="Đang tải..." />
      </div>
    );
  }

  return children;
});

export default OptimizedLoading;
