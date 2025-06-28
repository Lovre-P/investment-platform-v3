import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { User, UserRole } from '../types';
import { loginUser as apiLogin, logoutUser as apiLogout, checkSession as apiCheckSession, setGlobalLogoutCallback } from '../services/authService'; // Import new service functions
import { setGlobalLoggingOutState } from '../utils/apiClient';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: { email?: string; password?: string }) => Promise<void>; // Credentials for login
  logout: () => Promise<void>;
  isLoading: boolean; // To handle initial session check
  isLoggingOut: boolean; // To prevent API calls during logout
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Start with loading true

  const login = useCallback(async (credentials: { email?: string; password?: string }) => {
    try {
      console.log('AuthContext: Attempting login for:', credentials.email);
      const userData = await apiLogin(credentials);
      console.log('AuthContext: Login response:', userData);

      if (userData) {
        console.log('AuthContext: User role:', userData.role);
        if (userData.role === UserRole.ADMIN) {
          setIsAuthenticated(true);
          setUser(userData);
          console.log('AuthContext: Admin login successful');
        } else {
          // For now, allow all users to login, not just admins
          setIsAuthenticated(true);
          setUser(userData);
          console.log('AuthContext: User login successful');
        }
      } else {
        throw new Error("Invalid credentials - no user data returned.");
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      console.error("Login failed in AuthContext:", error);
      throw error; // Re-throw for the form to handle
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    setGlobalLoggingOutState(true);
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout failed in AuthContext:", error);
      // Still update UI state even if API call fails
    }
    setIsAuthenticated(false);
    setUser(null);
    setIsLoggingOut(false);
    setGlobalLoggingOutState(false);
  }, []);

  // Set up global logout callback for automatic logout on auth errors
  useEffect(() => {
    const handleGlobalLogout = () => {
      console.log('Global logout triggered due to authentication error');
      setIsLoggingOut(true);
      setGlobalLoggingOutState(true);
      setIsAuthenticated(false);
      setUser(null);
      // Reset logging out state after a brief delay
      setTimeout(() => {
        setIsLoggingOut(false);
        setGlobalLoggingOutState(false);
      }, 100);
    };

    setGlobalLogoutCallback(handleGlobalLogout);

    // Cleanup on unmount
    return () => {
      setGlobalLogoutCallback(() => {});
    };
  }, []);
  
  useEffect(() => {
    const verifySession = async () => {
      setIsLoading(true);
      try {
        const sessionUser = await apiCheckSession();
        if (sessionUser && sessionUser.role === UserRole.ADMIN) { // Critical: check if admin
          setIsAuthenticated(true);
          setUser(sessionUser);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          // If there was a token but it wasn't valid or for an admin, it's cleared by authService
        }
      } catch (error) {
        console.error("Failed to verify session:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []); // Run once on mount

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading, isLoggingOut }}>
      {!isLoading ? children : <div className="flex justify-center items-center min-h-screen">Loading Application...</div> /* Or a proper spinner component */}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
