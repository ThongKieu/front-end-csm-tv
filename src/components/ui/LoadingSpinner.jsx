"use client";

import { memo } from 'react';

const LoadingSpinner = memo(function LoadingSpinner({ 
  size = 'md', 
  color = 'brand-green', 
  text = 'Đang tải...',
  showText = true 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    'brand-green': 'border-t-brand-green',
    'brand-yellow': 'border-t-brand-yellow',
    'blue': 'border-t-blue-500',
    'red': 'border-t-red-500',
    'gray': 'border-t-gray-500'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full ${colorClasses[color]}`}
          style={{ 
            animation: 'loaderSpin 1s linear infinite',
            willChange: 'transform',
            contain: 'layout style paint'
          }}
        ></div>
      </div>
      
      {showText && (
        <div className="text-center">
          <p className="text-xs font-medium text-gray-600">
            {text}
          </p>
        </div>
      )}
    </div>
  );
});

export default LoadingSpinner;