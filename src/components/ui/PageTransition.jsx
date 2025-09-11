"use client";

import { useState, useEffect, memo } from 'react';
import { usePathname } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

const PageTransition = memo(function PageTransition({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [showLoader, setShowLoader] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show loader for actual page changes, not initial load
    if (pathname !== window.location.pathname) {
      setIsTransitioning(true);
      setShowLoader(true);
    }
    
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
  }, [pathname, children]);

  return (
    <div className="relative min-h-screen">
      {/* Page content */}
      <div
        className={`${
          isTransitioning
            ? 'opacity-0 transform translate-y-8 scale-95 blur-sm'
            : 'opacity-100 transform translate-y-0 scale-100 blur-0 page-enter'
        }`}
        style={{
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: !isTransitioning ? 'pageEnter 0.4s ease-out' : 'none',
          willChange: isTransitioning ? 'opacity, transform' : 'auto'
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
