"use client";

import { useEffect, useState } from 'react';

export default function ContentPreloader({ children, priority = false }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // For priority content, load immediately
    if (priority) {
      setIsLoaded(true);
      return;
    }

    // For non-priority content, add a small delay to improve LCP
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [priority]);

  if (!isLoaded) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return children;
}
