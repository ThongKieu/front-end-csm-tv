"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const pathname = usePathname();

  useEffect(() => {
    // Start transition
    setIsTransitioning(true);
    
    // After a short delay, update children and end transition
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div className="relative">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isTransitioning
            ? 'opacity-0 transform translate-y-4 scale-95'
            : 'opacity-100 transform translate-y-0 scale-100 page-enter'
        }`}
      >
        {displayChildren}
      </div>
      
      {/* Transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 animate-pulse page-exit"></div>
        </div>
      )}
    </div>
  );
}
