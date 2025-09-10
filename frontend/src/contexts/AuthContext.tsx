'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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
  isLoading: boolean;
  login: (username: string, password: string, deviceInfo?: Record<string, unknown>) => Promise<{ success: boolean; message: string; requiresMFA?: boolean }>;
  register: (userData: Record<string, unknown>) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  complete2FA: (code: string) => Promise<{ success: boolean; message: string }>;
  verify2FA: (username: string, code: string) => Promise<{ success: boolean; message: string }>;
  reset2FA: () => void;
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
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(() => {
    Cookies.remove('accessToken');
    Cookies.remove('userData');
    Cookies.remove('sessionData');
    Cookies.remove('refreshToken');
    
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
    setRequires2FA(false);
    setPendingUser(null);
  }, []);

  const reset2FA = useCallback(() => {
    setRequires2FA(false);
    setPendingUser(null);
  }, []);

  const checkAuthStatus = useCallback(() => {
    const token = Cookies.get('accessToken');
    const userData = Cookies.get('userData');
    const sessionData = Cookies.get('sessionData');

    if (token && userData && sessionData && userData !== 'undefined' && sessionData !== 'undefined') {
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
        // Clear invalid cookies
        Cookies.remove('accessToken');
        Cookies.remove('userData');
        Cookies.remove('sessionData');
        logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (username: string, password: string, deviceInfo?: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, userContext: deviceInfo }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.session?.requiresMFA) {
          setRequires2FA(true);
          setPendingUser(data.user);
          setIsLoading(false);
          return { success: true, message: '2FA required', requires2FA: true };
        } else {
          // Complete login - create a mock access token since the API doesn't return tokens
          const mockAccessToken = `mock_token_${data.user.id}_${Date.now()}`;
          Cookies.set('accessToken', mockAccessToken, { expires: 1 });
          Cookies.set('userData', JSON.stringify(data.user), { expires: 1 });
          Cookies.set('sessionData', JSON.stringify(data.session), { expires: 1 });
          
          setUser(data.user);
          setSession(data.session);
          setIsAuthenticated(true);
          setRequires2FA(false);
          setPendingUser(null);
          setIsLoading(false);
          
          return { success: true, message: 'Login successful' };
        }
      } else {
        setIsLoading(false);
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const register = async (userData: Record<string, unknown>) => {
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
        // Auto-login after successful registration - create a mock access token
        const mockAccessToken = `mock_token_${data.user.id}_${Date.now()}`;
        Cookies.set('accessToken', mockAccessToken, { expires: 1 });
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
          code 
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

  const verify2FA = async (username: string, code: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          code 
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
        setIsLoading(false);
        
        return { success: true, message: '2FA verification successful' };
      } else {
        setIsLoading(false);
        return { success: false, message: data.message || '2FA verification failed' };
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      setIsLoading(false);
      return { success: false, message: 'Network error occurred' };
    }
  };


  const value: AuthContextType = {
    isAuthenticated,
    user,
    session,
    requires2FA,
    pendingUser,
    isLoading,
    login,
    register,
    logout,
    complete2FA,
    verify2FA,
    reset2FA,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};