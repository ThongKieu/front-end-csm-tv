"use client";

import { useState, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

const LoadingLink = memo(function LoadingLink({ 
  href, 
  children, 
  className = "",
  onClick,
  ...props 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e) => {
    if (onClick) {
      onClick(e);
    }

    if (href && href.startsWith('/')) {
      e.preventDefault();
      setIsLoading(true);
      
      // Immediate navigation for better performance
      router.push(href);
      
      // Reset loading state quickly
      setTimeout(() => {
        setIsLoading(false);
      }, 50);
    }
  };

  if (isLoading) {
    return (
      <div className={`inline-flex justify-center items-center ${className}`}>
        <LoadingSpinner size="sm" showText={false} />
      </div>
    );
  }

  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
});

export default LoadingLink;
