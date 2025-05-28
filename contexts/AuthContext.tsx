import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { User, UserRole } from '../types';
import { loginUser as apiLogin, logoutUser as apiLogout, checkSession as apiCheckSession } from '../services/authService'; // Import new service functions

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: { email?: string; password?: string }) => Promise<void>; // Credentials for login
  logout: () => Promise<void>;
  isLoading: boolean; // To handle initial session check
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true

  const login = useCallback(async (credentials: { email?: string; password?: string }) => {
    try {
      const userData = await apiLogin(credentials);
      if (userData && userData.role === UserRole.ADMIN) { // Ensure admin for admin panel
        setIsAuthenticated(true);
        setUser(userData);
        // Token is handled by authService
      } else if (userData) { // Logged in but not admin
        await apiLogout(); // Log them out if not admin for admin panel access
        throw new Error("Access denied. Admin privileges required.");
      } else { // Login failed
         throw new Error("Invalid credentials or not an admin account.");
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      console.error("Login failed in AuthContext:", error);
      throw error; // Re-throw for the form to handle
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout failed in AuthContext:", error);
      // Still update UI state even if API call fails
    }
    setIsAuthenticated(false);
    setUser(null);
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
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
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
