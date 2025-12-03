import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`}></div>
  );
};

export const ProductSkeleton = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
    <Skeleton className="h-32 w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);