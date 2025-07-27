'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Types
interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'OPERATOR' | 'SUPERVISOR' | 'TECHNICIAN' | 'MANUFACTURER' | 'MANUFACTURER_WAREHOUSE';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  token: string | null;
  redirectToRoleDashboard: (role: string) => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API Base URL
const API_BASE_URL = 'http://localhost:3001';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Role-based redirect paths mapping
const getRoleDashboardPath = (role: string): string => {
  const normalizedRole = role.toLowerCase();
  switch (normalizedRole) {
    case 'admin': return '/admin';
    case 'operator': return '/operator';
    case 'supervisor': return '/supervisor';
    case 'technician': return '/technician';
    case 'manufacturer': return '/manufacturer';
    case 'manufacturer_warehouse': return '/manufacturer-warehouse';
    default: return '/service-request'; // Fallback to service request form
  }
};

// Robust redirect function with error handling and retry logic
const performRedirect = (path: string, retries = 3): void => {
  const redirect = (attempt: number) => {
    try {
      // Use window.location.href for forced navigation to avoid router issues
      if (typeof window !== 'undefined') {
        console.log(`Redirecting to ${path} (attempt ${attempt})`);
        window.location.href = path;
      }
    } catch (error) {
      console.error(`Redirect attempt ${attempt} failed:`, error);
      if (attempt < retries) {
        // Retry after a short delay
        setTimeout(() => redirect(attempt + 1), 100 * attempt);
      } else {
        console.error(`All redirect attempts failed for path: ${path}`);
        // Fallback: try to redirect to login
        if (path !== '/login') {
          window.location.href = '/login';
        }
      }
    }
  };

  redirect(1);
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Computed property for authentication status
  const isAuthenticated = !!user && !!token && isHydrated;

  // Initialize auth state from localStorage with proper SSR handling
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Ensure we're on the client side
        if (typeof window === 'undefined') {
          return;
        }

        // Add a small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 50));

        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            
            // Validate the stored data structure
            if (userData && userData.id && userData.username && userData.role) {
              setToken(storedToken);
              setUser(userData);
              // Set axios default header
              axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
              console.log('Auth state restored from localStorage:', userData.username, userData.role);
            } else {
              throw new Error('Invalid user data structure');
            }
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            // Clear invalid data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear potentially corrupted data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      } finally {
        setIsHydrated(true);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function with enhanced error handling
  const login = async (username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      setIsLoading(true);
      
      const response = await axios.post('/auth/login', {
        username,
        password
      });

      const { access_token, user: userData } = response.data;

      if (!access_token || !userData) {
        throw new Error('Invalid response from server');
      }

      // Validate user data structure
      if (!userData.id || !userData.username || !userData.role) {
        throw new Error('Invalid user data received from server');
      }

      // Store in localStorage with error handling
      try {
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      } catch (storageError) {
        console.error('Error storing auth data:', storageError);
        return { success: false, error: 'Failed to store authentication data' };
      }

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Update state
      setToken(access_token);
      setUser(userData);

      console.log('Login successful:', userData.username, userData.role);
      return { success: true, user: userData };
    } catch (error: any) {
      console.error('Login failed:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network.';
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function with cleanup
  const logout = () => {
    try {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }

      // Clear state
      setToken(null);
      setUser(null);

      // Remove axios default header
      delete axios.defaults.headers.common['Authorization'];

      console.log('Logout completed');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Redirect to role-based dashboard with error handling
  const redirectToRoleDashboard = (role: string) => {
    try {
      const dashboardPath = getRoleDashboardPath(role);
      console.log(`Redirecting ${role} to ${dashboardPath}`);
      performRedirect(dashboardPath);
    } catch (error) {
      console.error('Error in redirectToRoleDashboard:', error);
      // Fallback redirect
      performRedirect('/login');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isHydrated,
    login,
    logout,
    token,
    redirectToRoleDashboard
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};