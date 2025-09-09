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
  requires2FA: boolean;
  pendingUser: User | null;
  login: (username: string, password: string, deviceInfo: any) => Promise<{ success: boolean; requires2FA: boolean }>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  verifyMFA: (method: string, code: string) => Promise<boolean>;
  registerDevice: (deviceName: string) => Promise<boolean>;
  complete2FA: (code: string) => Promise<boolean>;
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
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const isAuthenticated = !!user && !!session && !requires2FA;

  const login = async (username: string, password: string, deviceInfo: any): Promise<{ success: boolean; requires2FA: boolean }> => {
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
      console.log('AuthContext: API response:', result);
      
      if (result.success) {
        // Check if 2FA is required
        console.log('AuthContext: Checking requiresMFA =', result.session.requiresMFA);
        if (result.session.requiresMFA) {
          console.log('AuthContext: 2FA required, setting pending user');
          console.log('AuthContext: Setting requires2FA = true, pendingUser =', result.user);
          setRequires2FA(true);
          setPendingUser(result.user);
          return { success: true, requires2FA: true }; // Login successful but needs 2FA
        } else {
          console.log('AuthContext: No 2FA required, setting user and session');
          setUser(result.user);
          setSession(result.session);
          setRequires2FA(false);
          setPendingUser(null);
          return { success: true, requires2FA: false };
        }
      } else {
        // Login failed - return error
        console.log('AuthContext: Login failed - API returned success: false');
        return { success: false, requires2FA: false };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, requires2FA: false };
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
    setRequires2FA(false);
    setPendingUser(null);
  };

  const complete2FA = async (code: string): Promise<boolean> => {
    if (!pendingUser) {
      console.log('🚨 complete2FA: No pending user - cannot complete 2FA');
      return false;
    }
    
    console.log(`🚨 complete2FA: Completing 2FA for user "${pendingUser.username}" with code "${code}"`);
    
    setIsLoading(true);
    try {
      // Simulate 2FA verification (in real app, this would verify with backend)
      // Accept any 6-digit code for demo purposes
      if (code && code.length === 6) {
        console.log(`✅ complete2FA: Valid 6-digit code provided for user "${pendingUser.username}"`);
        
        // Create a mock session for the authenticated user
        // Note: requiresMFA is false because 2FA has been completed for THIS SESSION
        // The user still has 2FA enabled for future logins
        const mockSession: Session = {
          sessionId: `demo_session_${pendingUser.username}_${Date.now()}`,
          riskScore: 0.15, // Fixed value to avoid hydration mismatch
          requiresMFA: false, // 2FA completed for this session
          mfaMethods: ['google_authenticator'], // User still has 2FA enabled
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
        
        console.log(`✅ complete2FA: Setting user and session for "${pendingUser.username}"`);
        setUser(pendingUser);
        setSession(mockSession);
        setRequires2FA(false);
        setPendingUser(null);
        return true;
      } else {
        console.log(`❌ complete2FA: Invalid code "${code}" - must be 6 digits`);
        return false;
      }
    } catch (error) {
      console.error('❌ complete2FA: Error completing 2FA:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
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
      return Boolean(code && code.length === 6);
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
    requires2FA,
    pendingUser,
    login,
    register,
    logout,
    verifyMFA,
    registerDevice,
    complete2FA
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
