import { User, UserRole } from '../types';

const API_BASE_URL = (typeof window !== 'undefined' && (window as any).VITE_API_URL)
  ? `${(window as any).VITE_API_URL}/api/auth`
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

async function handleAuthResponse(response: Response): Promise<LoginResponse> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Login failed. Please check your credentials.' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  // Handle backend response format {success: true, data: {...}}
  if (result.success && result.data !== undefined) {
    return result.data;
  }
  return result;
}

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

// checkSession now verifies the token with the backend
export const checkSession = async (): Promise<User | null> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/session`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      localStorage.removeItem('megaInvestToken'); // Invalid token
      return null;
    }
    const userData: User = await response.json();
     // Ensure only admin users are restored for admin panel context if that's the logic
    if (userData && userData.role === UserRole.ADMIN) { 
        return userData;
    }
    // If not specifically an admin session check, just return user data
    // return userData; 
    localStorage.removeItem('megaInvestToken'); // Or clear if role doesn't match expectations
    return null;
  } catch (error) {
    console.error("Session check API error:", error);
    localStorage.removeItem('megaInvestToken');
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
