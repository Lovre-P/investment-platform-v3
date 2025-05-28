
import React from 'react';

interface SkeletonLoaderProps {
  type?: 'text' | 'title' | 'avatar' | 'card' | 'list-item';
  className?: string;
  count?: number; // For repeating skeleton elements
}

const SkeletonElement: React.FC<Omit<SkeletonLoaderProps, 'count'>> = ({ type = 'text', className }) => {
  let baseClasses = 'bg-secondary-200 rounded animate-pulse';
  switch (type) {
    case 'title':
      baseClasses += ' h-8 w-3/4 mb-4';
      break;
    case 'avatar':
      baseClasses += ' h-12 w-12 rounded-full';
      break;
    case 'card':
      return (
        <div className={`p-4 border border-secondary-200 rounded-xl shadow ${className}`}>
          <div className="h-40 bg-secondary-200 rounded animate-pulse mb-4"></div>
          <div className="h-6 w-3/4 bg-secondary-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-full bg-secondary-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-5/6 bg-secondary-200 rounded animate-pulse"></div>
        </div>
      );
    case 'list-item':
      return (
        <div className={`flex items-center space-x-4 p-3 border-b border-secondary-200 ${className}`}>
          <div className="h-10 w-10 bg-secondary-200 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-secondary-200 rounded animate-pulse"></div>
            <div className="h-3 w-1/2 bg-secondary-200 rounded animate-pulse"></div>
          </div>
        </div>
      );
    case 'text':
    default:
      baseClasses += ' h-4 w-full mb-2';
      break;
  }
  return <div className={`${baseClasses} ${className || ''}`}></div>;
};


const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'text', className, count = 1 }) => {
  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonElement key={index} type={type} className={className} />
        ))}
      </>
    );
  }
  return <SkeletonElement type={type} className={className} />;
};


export const InvestmentCardSkeleton: React.FC = () => (
  <div className="relative rounded-xl overflow-hidden shadow-lg bg-white/30 backdrop-blur-md p-6 min-h-[380px]">
    <div className="animate-pulse flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="h-8 w-3/5 bg-secondary-300 rounded"></div>
          <div className="h-6 w-1/4 bg-secondary-300 rounded-full"></div>
        </div>
        <div className="h-4 bg-secondary-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-secondary-300 rounded w-5/6 mb-4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-5 w-1/2 bg-secondary-300 rounded"></div>
          <div className="h-5 w-2/3 bg-secondary-300 rounded"></div>
        </div>
      </div>
      <div>
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <div className="h-4 w-1/3 bg-secondary-300 rounded"></div>
            <div className="h-4 w-1/3 bg-secondary-300 rounded"></div>
          </div>
          <div className="h-2.5 bg-secondary-300 rounded-full w-full"></div>
        </div>
        <div className="h-12 bg-secondary-400 rounded-lg w-full"></div>
      </div>
    </div>
  </div>
);


export default SkeletonLoader;
    