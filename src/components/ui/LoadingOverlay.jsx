"use client";

import { useLoading } from '@/contexts/LoadingContext';
import { Loader2 } from 'lucide-react';

export default function LoadingOverlay() {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm loading-overlay">
      <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-2xl shadow-2xl page-enter">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-brand-green loading-spinner" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-brand-green/20 rounded-full animate-pulse"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">{loadingMessage}</p>
          <div className="flex items-center justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-brand-green rounded-full loading-dots"></div>
            <div className="w-2 h-2 bg-brand-green rounded-full loading-dots"></div>
            <div className="w-2 h-2 bg-brand-green rounded-full loading-dots"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
