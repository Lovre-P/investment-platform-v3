// Centralized API client with authentication error handling
import { clearAuthState, isTokenExpired } from '../services/authService';

// Global logout state checker - will be set by AuthContext
let isLoggingOutGlobal = false;
export const setGlobalLoggingOutState = (state: boolean) => {
  isLoggingOutGlobal = state;
};

// Request deduplication to prevent multiple identical requests
const pendingRequests = new Map<string, Promise<any>>();

const getRequestKey = (endpoint: string, options: RequestInit): string => {
  return `${options.method || 'GET'}:${endpoint}:${JSON.stringify(options.body || '')}`;
};

// Use backend service URL in production, proxy in development
const API_BASE_URL = import.meta.env.PROD
  ? 'https://mega-invest-backend-production.up.railway.app/api'
  : '/api';

interface ApiError extends Error {
  status?: number;
  code?: string;
}

// Enhanced error class for API errors
class ApiClientError extends Error implements ApiError {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

// Get authentication headers with token validation
function getAuthHeaders(isMultipart = false): HeadersInit {
  const token = localStorage.getItem('megaInvestToken');
  
  if (token && isTokenExpired(token)) {
    console.warn('Token expired during request preparation, clearing auth state');
    clearAuthState();
    return {
      'Content-Type': 'application/json'
    };
  }
  
  const headers: HeadersInit = {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

// Enhanced response handler with authentication error detection
async function handleApiResponse<T>(response: Response): Promise<T> {
  // Log all non-2xx responses for debugging
  if (!response.ok) {
    console.error(`API Error: ${response.status} ${response.statusText}`, {
      url: response.url,
      status: response.status,
      timestamp: new Date().toISOString()
    });
  }

  // Handle authentication errors globally
  if (response.status === 401) {
    const errorData = await response.json().catch(() => ({}));
    const errorCode = errorData.error?.code;
    const errorMessage = errorData.error?.message || errorData.message;
    
    // Log specific authentication error details
    console.error('Authentication error detected:', {
      status: response.status,
      code: errorCode,
      message: errorMessage,
      url: response.url,
      timestamp: new Date().toISOString()
    });
    
    // Clear authentication state and trigger logout
    clearAuthState();
    
    // Provide user-friendly error messages
    const userMessage = errorCode === 'TOKEN_EXPIRED' 
      ? 'Your session has expired. Please log in again.'
      : errorCode === 'INVALID_TOKEN'
      ? 'Your session is invalid. Please log in again.'
      : 'Authentication failed. Please log in again.';
    
    throw new ApiClientError(userMessage, 401, errorCode);
  }

  // Handle other HTTP errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
      message: `HTTP error! status: ${response.status}` 
    }));
    
    const message = errorData.error?.message || errorData.message || response.statusText;
    const code = errorData.error?.code;
    
    throw new ApiClientError(message, response.status, code);
  }

  // Parse successful response
  const result = await response.json();
  
  // Handle backend response format {success: true, data: [...]}
  if (result.success && result.data !== undefined) {
    return result.data;
  }
  
  return result;
}

// Generic API request function with retry logic for auth errors
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Skip API calls if logout is in progress
  if (isLoggingOutGlobal) {
    throw new ApiClientError(
      'Request cancelled due to logout in progress',
      0,
      'LOGOUT_IN_PROGRESS'
    );
  }

  // Request deduplication for GET requests to prevent rate limiting
  const requestKey = getRequestKey(endpoint, options);
  const isGetRequest = !options.method || options.method === 'GET';

  if (isGetRequest && pendingRequests.has(requestKey)) {
    console.log('Deduplicating request:', requestKey);
    return pendingRequests.get(requestKey);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const isMultipart = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(isMultipart),
      ...options.headers
    }
  };

  const requestPromise = (async () => {
    try {
      const response = await fetch(url, requestOptions);
      return await handleApiResponse<T>(response);
    } catch (error) {
      // Re-throw API errors as-is
      if (error instanceof ApiClientError) {
        throw error;
      }

      // Handle network errors
      console.error('Network error during API request:', {
        url,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });

      throw new ApiClientError(
        'Network error. Please check your connection and try again.',
        0,
        'NETWORK_ERROR'
      );
    } finally {
      // Clean up pending request
      if (isGetRequest) {
        pendingRequests.delete(requestKey);
      }
    }
  })();

  // Store GET requests for deduplication
  if (isGetRequest) {
    pendingRequests.set(requestKey, requestPromise);
  }

  return requestPromise;
}

// Convenience methods for different HTTP verbs
// Health check function to verify backend connectivity
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const apiClient = {
  get: <T>(endpoint: string): Promise<T> =>
    apiRequest<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, data?: any): Promise<T> =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined
    }),

  put: <T>(endpoint: string, data?: any): Promise<T> =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined
    }),

  delete: <T>(endpoint: string): Promise<T> =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),

  // Health check method
  healthCheck: checkBackendHealth
};

export { ApiClientError };
export type { ApiError };
