import React from 'react';
import { ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ErrorAlertProps {
  error: string | null;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  type = 'error', 
  onDismiss,
  className = '' 
}) => {
  if (!error) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5" />;
      default:
        return <XCircleIcon className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-red-400';
    }
  };

  return (
    <div className={`rounded-md border p-4 ${getStyles()} ${className}`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${getIconColor()}`}>
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{error}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === 'warning' 
                    ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' 
                    : type === 'info'
                    ? 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                    : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <XCircleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
