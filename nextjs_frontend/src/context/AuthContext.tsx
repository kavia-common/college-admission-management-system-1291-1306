"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, setAuthToken, clearAuthToken } from '@/services/api';

/**
 * User role type
 */
export type UserRole = 'applicant' | 'admin';

/**
 * User interface representing the authenticated user
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

/**
 * Auth context value interface
 */
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isApplicant: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// PUBLIC_INTERFACE
/**
 * AuthProvider component wraps the app and provides authentication state and methods
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('auth_token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Ignore parse errors
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      if (res.error) {
        return { success: false, error: res.error };
      }
      if (res.data) {
        setAuthToken(res.data.access_token);
        const userData = res.data.user as unknown as User;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, error: 'Unknown error occurred' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; phone?: string }) => {
    try {
      const res = await authApi.register(data);
      if (res.error) {
        return { success: false, error: res.error };
      }
      if (res.data) {
        setAuthToken(res.data.access_token);
        const userData = res.data.user as unknown as User;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, error: 'Unknown error occurred' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isApplicant: user?.role === 'applicant',
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
/**
 * Hook to access authentication context
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
