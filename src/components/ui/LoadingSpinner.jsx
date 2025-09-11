"use client";

import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'brand-green', 
  className = '',
  text = null 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    'brand-green': 'text-brand-green',
    'blue': 'text-blue-600',
    'gray': 'text-gray-600',
    'white': 'text-white'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} 
        />
        {text && (
          <p className="text-sm text-gray-600">{text}</p>
        )}
      </div>
    </div>
  );
}
