'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  loginId: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login: (loginId: string, password: string) => Promise<AuthResponse>;
  signup: (loginId: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('currentUser');

    if (storedAuth) setIsAuthenticated(JSON.parse(storedAuth));
    if (storedUser) setUser(JSON.parse(storedUser));
    
    setLoading(false);
  }, []);

  const login = async (loginId: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setUser({ loginId: data.user.loginId, email: data.user.email });
        localStorage.setItem('isAuthenticated', JSON.stringify(true));
        localStorage.setItem('currentUser', JSON.stringify({ loginId: data.user.loginId, email: data.user.email }));
        return { success: true, message: data.message || 'Login successful!' };
      }

      return { success: false, message: data.error || 'Invalid login ID or password' };

    } catch (err) {
      console.error('Login Context Error:', err);
      return { success: false, message: 'Server connection failed.' };
    }
  };

  const signup = async (loginId: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        return { success: true, message: 'Account created successfully! Please log in.' };
      }

      return { success: false, message: data.error || 'Signup failed' };

    } catch (err) {
      console.error('Signup Context Error:', err);
      return { success: false, message: 'Server connection failed.' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.setItem('isAuthenticated', JSON.stringify(false));
    localStorage.removeItem('currentUser');
    
    // Optional: Call /api/auth/logout to clear HTTPOnly cookie if implemented
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
