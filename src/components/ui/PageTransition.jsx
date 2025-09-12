"use client";

import { useState, useEffect, memo } from 'react';
import { usePathname } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

const PageTransition = memo(function PageTransition({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [showLoader, setShowLoader] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check if this is a real page change (not initial load)
    if (previousPathname && previousPathname !== pathname) {
      setIsTransitioning(true);
      setShowLoader(true);
    }
    
    // Update previous pathname
    setPreviousPathname(pathname);
    
    // Optimized delay for better LCP - ensure content is fully loaded
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
      
      // Hide loader after content is properly rendered
      setTimeout(() => {
        setShowLoader(false);
      }, 200);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, children, previousPathname]);

  return (
    <div className="relative min-h-screen">
      {/* Page content */}
      <div
        className={`transition-all duration-300 ease-out ${
          isTransitioning
            ? 'opacity-0 transform translate-y-4 scale-98 blur-sm'
            : 'opacity-100 transform translate-y-0 scale-100 blur-0'
        }`}
        style={{
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: isTransitioning ? 'opacity, transform, filter' : 'auto'
        }}
      >
        {displayChildren}
      </div>
      
      {/* Loading overlay - only show when actually transitioning */}
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90">
          <LoadingSpinner 
            size="lg" 
            color="brand-green" 
            text="Đang tải..." 
            showText={true}
          />
        </div>
      )}
    </div>
  );
});

export default PageTransition;
