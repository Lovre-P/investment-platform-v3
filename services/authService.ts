import { User, UserRole } from '../types';

// Use backend service URL in production, proxy in development
const API_BASE_URL = import.meta.env.PROD
  ? 'https://mega-invest-backend-production.up.railway.app/api/auth'
  : '/api/auth';

interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

// Global logout callback to be set by AuthContext
let globalLogoutCallback: (() => void) | null = null;

export const setGlobalLogoutCallback = (callback: () => void) => {
  globalLogoutCallback = callback;
};

// Enhanced error handling for authentication responses
async function handleAuthResponse(response: Response): Promise<LoginResponse> {
  if (!response.ok) {
    // Log authentication errors for debugging
    console.error(`Auth API Error: ${response.status} ${response.statusText}`, {
      url: response.url,
      status: response.status,
      timestamp: new Date().toISOString()
    });

    const errorData = await response.json().catch(() => ({ message: 'Login failed. Please check your credentials.' }));

    // Handle specific error codes
    if (response.status === 401) {
      const message = errorData.error?.code === 'TOKEN_EXPIRED'
        ? 'Your session has expired. Please log in again.'
        : 'Invalid credentials. Please check your email and password.';
      throw new Error(message);
    }

    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  // Handle backend response format {success: true, data: {...}}
  if (result.success && result.data !== undefined) {
    return result.data;
  }
  return result;
}

// Check if token is expired (basic client-side check)
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true; // If we can't parse it, consider it expired
  }
};

// Clear authentication state and trigger logout
export const clearAuthState = (): void => {
  localStorage.removeItem('megaInvestToken');
  if (globalLogoutCallback) {
    globalLogoutCallback();
  }
};

export const loginUser = async (credentials: LoginCredentials): Promise<User | null> => {
  try {
    console.log('authService: Making login request to:', `${API_BASE_URL}/login`);
    console.log('authService: Login attempt for:', credentials.email || credentials.username);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    console.log('authService: Response status:', response.status);
    const data = await handleAuthResponse(response);
    console.log('authService: Parsed response data:', data);

    if (data.token && data.user) {
      localStorage.setItem('megaInvestToken', data.token); // Store token
      console.log('authService: Token stored, returning user:', data.user);
      return data.user;
    }
    console.log('authService: No token or user in response');
    return null;
  } catch (error) {
    console.error('Login API error:', error);
    throw error; // Re-throw for the UI to handle
  }
};

// Enhanced session check with better error handling
export const checkSession = async (): Promise<User | null> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    return null;
  }

  // Check if token is expired client-side first
  if (isTokenExpired(token)) {
    console.warn('Token expired (client-side check), clearing auth state');
    clearAuthState();
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/session`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`Session check failed: ${response.status} ${response.statusText}`, {
        url: response.url,
        status: response.status,
        timestamp: new Date().toISOString()
      });

      // Handle specific error cases
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error?.code === 'TOKEN_EXPIRED') {
          console.warn('Token expired (server-side), clearing auth state');
        } else {
          console.warn('Invalid token (server-side), clearing auth state');
        }
      }

      clearAuthState();
      return null;
    }

    const result = await response.json();
    const userData: User = result.success ? result.data : result;

    // Ensure only admin users are restored for admin panel context
    if (userData && userData.role === UserRole.ADMIN) {
        return userData;
    }

    // If not an admin, clear the token as this is admin panel
    console.warn('Non-admin user attempted to access admin panel, clearing auth state');
    clearAuthState();
    return null;
  } catch (error) {
    console.error("Session check API error:", error);
    clearAuthState();
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  const token = localStorage.getItem('megaInvestToken');
  localStorage.removeItem('megaInvestToken'); // Optimistic removal

  if (token) {
    try {
      // Optionally, inform the backend about logout
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout API error:", error);
      // Client-side logout already performed, so this is best-effort
    }
  }
};
