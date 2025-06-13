// Performance optimization utilities for Mama Bear Chat
import React from 'react';

// Debounce function to reduce excessive API calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for input handling
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Optimize React re-renders
export const shouldComponentUpdate = (prevProps: any, nextProps: any): boolean => {
  return JSON.stringify(prevProps) !== JSON.stringify(nextProps);
};

// Lazy loading utility
export const lazyLoad = (importFunc: () => Promise<any>) => {
  return React.lazy(importFunc);
};

// Memory cleanup utility
export const cleanupMemory = () => {
  // Force garbage collection if available (development only)
  if (process.env.NODE_ENV === 'development' && (window as any).gc) {
    (window as any).gc();
  }
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Optimize animations
export const getOptimizedAnimationConfig = () => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { 
    duration: 0.2, // Reduced from longer durations
    ease: "easeOut" // Simpler easing
  }
});

// Reduce motion for accessibility and performance
export const getReducedMotionConfig = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return {
      initial: {},
      animate: {},
      transition: { duration: 0 }
    };
  }
  
  return getOptimizedAnimationConfig();
};