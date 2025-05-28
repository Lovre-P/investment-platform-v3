
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g. 'text-primary-500'
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'text-primary-500',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4" role="status" aria-live="polite">
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} ${color} border-t-transparent`}
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className={`mt-3 text-sm ${color}`}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
    