'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Session {
  sessionId: string;
  riskScore: number;
  requiresMFA: boolean;
  mfaMethods: string[];
  deviceTrusted: boolean;
  behavioralAnomaly: {
    detected: boolean;
    anomalies: string[];
    confidence: number;
  };
  riskFactors: {
    device: number;
    location: number;
    transaction: number;
    time: number;
    network: number;
    velocity: number;
  };
  recommendations: string[];
  timestamp: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  requires2FA: boolean;
  pendingUser: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string; requiresMFA?: boolean }>;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  complete2FA: (code: string) => Promise<{ success: boolean; message: string }>;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const checkAuthStatus = () => {
    const token = Cookies.get('accessToken');
    const userData = Cookies.get('userData');
    const sessionData = Cookies.get('sessionData');

    if (token && userData && sessionData) {
      try {
        const parsedUser = JSON.parse(userData);
        const parsedSession = JSON.parse(sessionData);
        
        setUser(parsedUser);
        setSession(parsedSession);
        setIsAuthenticated(true);
        setRequires2FA(false);
        setPendingUser(null);
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        logout();
      }
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.requiresMFA) {
          setRequires2FA(true);
          setPendingUser(data.user);
          return { success: true, message: '2FA required', requiresMFA: true };
        } else {
          // Complete login
          Cookies.set('accessToken', data.tokens.accessToken, { expires: 1 });
          Cookies.set('userData', JSON.stringify(data.user), { expires: 1 });
          Cookies.set('sessionData', JSON.stringify(data.session), { expires: 1 });
          
          setUser(data.user);
          setSession(data.session);
          setIsAuthenticated(true);
          setRequires2FA(false);
          setPendingUser(null);
          
          return { success: true, message: 'Login successful' };
        }
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        // Auto-login after successful registration
        Cookies.set('accessToken', data.tokens.accessToken, { expires: 1 });
        Cookies.set('userData', JSON.stringify(data.user), { expires: 1 });
        Cookies.set('sessionData', JSON.stringify(data.session), { expires: 1 });
        
        setUser(data.user);
        setSession(data.session);
        setIsAuthenticated(true);
        setRequires2FA(false);
        setPendingUser(null);
      }

      return { success: data.success, message: data.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const complete2FA = async (code: string) => {
    if (!pendingUser) {
      return { success: false, message: 'No pending authentication' };
    }

    try {
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: pendingUser.username, 
          code: code 
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Complete 2FA and login
        Cookies.set('accessToken', data.tokens.accessToken, { expires: 1 });
        Cookies.set('userData', JSON.stringify(data.user), { expires: 1 });
        Cookies.set('sessionData', JSON.stringify(data.session), { expires: 1 });
        
        setUser(data.user);
        setSession(data.session);
        setIsAuthenticated(true);
        setRequires2FA(false);
        setPendingUser(null);
        
        return { success: true, message: '2FA completed successfully' };
      } else {
        return { success: false, message: data.message || '2FA verification failed' };
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('userData');
    Cookies.remove('sessionData');
    
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
    setRequires2FA(false);
    setPendingUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    session,
    requires2FA,
    pendingUser,
    login,
    register,
    logout,
    complete2FA,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};