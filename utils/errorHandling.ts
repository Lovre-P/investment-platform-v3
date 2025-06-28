// Utility functions for consistent error handling across the application
import { ApiClientError } from './apiClient';

export interface ErrorInfo {
  message: string;
  isAuthError: boolean;
  shouldRetry: boolean;
  code?: string;
}

// Parse and categorize errors for consistent handling
export const parseError = (error: unknown): ErrorInfo => {
  // Handle API client errors
  if (error instanceof ApiClientError) {
    return {
      message: error.message,
      isAuthError: error.status === 401,
      shouldRetry: error.status !== 401 && error.status !== 403 && error.status !== 429, // Don't retry rate limit errors
      code: error.code
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    return {
      message: error.message,
      isAuthError: false,
      shouldRetry: true
    };
  }

  // Handle unknown errors
  return {
    message: 'An unexpected error occurred. Please try again.',
    isAuthError: false,
    shouldRetry: true
  };
};

// Get user-friendly error message based on error type
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  const errorInfo = parseError(error);
  
  if (errorInfo.isAuthError) {
    return 'Your session has expired. Please log in again.';
  }
  
  if (errorInfo.code === 'LOGOUT_IN_PROGRESS') {
    return 'Logout in progress...';
  }

  if (errorInfo.code === 'RATE_LIMIT_EXCEEDED' || errorInfo.code === 'AUTH_RATE_LIMIT_EXCEEDED') {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (errorInfo.code === 'NETWORK_ERROR') {
    return 'Network connection error. Please check your internet connection and try again.';
  }

  if (errorInfo.code === 'TOKEN_EXPIRED') {
    return 'Your session has expired. Please log in again.';
  }

  if (errorInfo.code === 'INVALID_TOKEN') {
    return 'Your session is invalid. Please log in again.';
  }
  
  return errorInfo.message;
};

// Log errors with context for debugging
export const logError = (error: unknown, context: string, additionalInfo?: Record<string, any>): void => {
  const errorInfo = parseError(error);
  
  console.error(`Error in ${context}:`, {
    message: errorInfo.message,
    code: errorInfo.code,
    isAuthError: errorInfo.isAuthError,
    shouldRetry: errorInfo.shouldRetry,
    timestamp: new Date().toISOString(),
    context,
    ...additionalInfo
  });
  
  // In production, you might want to send this to an error tracking service
  if (import.meta.env.PROD && errorInfo.isAuthError) {
    console.warn('Authentication error in production - user will be logged out');
  }
};

// Retry wrapper for API calls
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 1, // Reduced from 2 to 1 to prevent rate limiting
  context: string = 'API operation'
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const errorInfo = parseError(error);

      logError(error, `${context} (attempt ${attempt})`);

      // Don't retry auth errors, rate limit errors, or if we've exhausted retries
      if (errorInfo.isAuthError ||
          errorInfo.code === 'RATE_LIMIT_EXCEEDED' ||
          attempt > maxRetries ||
          !errorInfo.shouldRetry) {
        break;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};
