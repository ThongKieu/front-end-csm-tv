"use client";

import { useState } from 'react';
import { useApiLoading } from '@/hooks/useApiLoading';
import LoadingSpinner from './LoadingSpinner';

export default function LoadingDemo() {
  const [result, setResult] = useState(null);
  const { withLoading, startLoading, stopLoading } = useApiLoading();

  const simulateApiCall = async (delay = 2000) => {
    await new Promise(resolve => setTimeout(resolve, delay));
    return { message: 'API call completed!', timestamp: new Date().toLocaleTimeString() };
  };

  const handleWithLoading = async () => {
    try {
      const result = await withLoading(() => simulateApiCall(3000), 'Đang gọi API...');
      setResult(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleManualLoading = async () => {
    try {
      startLoading('Đang xử lý thủ công...');
      const result = await simulateApiCall(2000);
      setResult(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Loading System Demo</h3>
      
      <div className="flex space-x-4">
        <button
          onClick={handleWithLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test withLoading (3s)
        </button>
        
        <button
          onClick={handleManualLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Manual Loading (2s)
        </button>
      </div>

      <div className="p-4 bg-gray-100 rounded">
        <h4 className="font-medium mb-2">Result:</h4>
        {result ? (
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        ) : (
          <p className="text-gray-500">No result yet</p>
        )}
      </div>

      <div className="p-4 bg-blue-50 rounded">
        <h4 className="font-medium mb-2">Loading Spinner Examples:</h4>
        <div className="flex space-x-4 items-center">
          <LoadingSpinner size="sm" text="Small" />
          <LoadingSpinner size="md" text="Medium" />
          <LoadingSpinner size="lg" text="Large" />
          <LoadingSpinner size="xl" text="Extra Large" />
        </div>
      </div>
    </div>
  );
}
