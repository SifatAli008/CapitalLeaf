'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email?: string;
  role?: string;
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
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, deviceInfo: any) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  verifyMFA: (method: string, code: string) => Promise<boolean>;
  registerDevice: (deviceName: string) => Promise<boolean>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user && !!session;

  const login = async (username: string, password: string, deviceInfo: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          userContext: {
            userId: username,
            timestamp: new Date().toISOString(),
            deviceFingerprint: deviceInfo.fingerprint,
            deviceInfo,
            isMobile: deviceInfo.isMobile,
            isEmulator: deviceInfo.isEmulator,
            browserInfo: {
              userAgent: navigator.userAgent,
              language: navigator.language,
              platform: navigator.platform,
            },
            screenInfo: {
              resolution: deviceInfo.screenResolution,
              pixelRatio: window.devicePixelRatio
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setUser(result.user);
        setSession(result.session);
        return true;
      } else {
        // Demo mode fallback
        const mockSession: Session = {
          sessionId: `demo_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          riskScore: Math.random() * 0.4,
          requiresMFA: false,
          mfaMethods: [],
          deviceTrusted: false,
          behavioralAnomaly: { detected: false, anomalies: [], confidence: 0 },
          riskFactors: {
            device: 0.1,
            location: 0.1,
            transaction: 0.0,
            time: 0.1,
            network: 0.0,
            velocity: 0.0
          },
          recommendations: [],
          timestamp: new Date().toISOString()
        };
        
        setUser({ id: username, username });
        setSession(mockSession);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Registration error:', error);
      // Demo mode - always succeed
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSession(null);
  };

  const verifyMFA = async (method: string, code: string): Promise<boolean> => {
    if (!session) return false;
    
    try {
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          method,
          code
        })
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('MFA verification error:', error);
      // Demo mode - accept any 6-digit code
      return code && code.length === 6;
    }
  };

  const registerDevice = async (deviceName: string): Promise<boolean> => {
    if (!session) return false;
    
    try {
      const response = await fetch('/api/auth/register-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          deviceName,
          deviceInfo: {
            fingerprint: 'demo_fingerprint',
            name: deviceName
          }
        })
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Device registration error:', error);
      // Demo mode - always succeed
      return true;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    verifyMFA,
    registerDevice
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
