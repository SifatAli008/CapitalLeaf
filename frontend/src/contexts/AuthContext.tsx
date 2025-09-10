'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
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
  requiresDeviceRegistration?: boolean;
  deviceLimitExceeded?: boolean;
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

interface Device {
  fingerprint: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  isTrusted: boolean;
  lastUsed: string;
  registeredAt: string;
  isActive: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  requires2FA: boolean;
  pendingUser: User | null;
  isLoading: boolean;
  devices: Device[];
  deviceCount: number;
  maxDevices: number;
  canAddDevice: boolean;
  login: (username: string, password: string, deviceInfo?: Record<string, unknown>) => Promise<{ success: boolean; message: string; requiresMFA?: boolean; deviceLimitExceeded?: boolean }>;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  complete2FA: (code: string) => Promise<{ success: boolean; message: string }>;
  verify2FA: (username: string, code: string) => Promise<{ success: boolean; message: string }>;
  reset2FA: () => void;
  checkAuthStatus: () => void;
  completeLoginAfter2FADisable: () => void;
  // Device management methods
  loadDevices: () => Promise<void>;
  removeDevice: (deviceFingerprint: string) => Promise<{ success: boolean; message: string }>;
  updateDevice: (deviceFingerprint: string, deviceName: string) => Promise<{ success: boolean; message: string }>;
  trustDevice: (deviceFingerprint: string, mfaCode?: string) => Promise<{ success: boolean; message: string }>;
  registerDevice: (deviceName: string, deviceInfo: Record<string, unknown>) => Promise<{ success: boolean; message: string; requiresMFA?: boolean }>;
  // Session management methods
  invalidateSessions: (reason: string, deviceFingerprint?: string) => Promise<{ success: boolean; message: string }>;
  getActiveSessions: () => Promise<{ success: boolean; sessions: any[] }>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceCount, setDeviceCount] = useState(0);
  const [maxDevices, setMaxDevices] = useState(2);
  const [canAddDevice, setCanAddDevice] = useState(true);

  // Auto-logout configuration
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes of inactivity
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const sessionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setSession(null);
    setRequires2FA(false);
    setPendingUser(null);
    Cookies.remove('accessToken');
    Cookies.remove('userData');
    Cookies.remove('sessionData');
    
    // Clear all timeouts
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }
  }, []);

  const reset2FA = useCallback(() => {
    setRequires2FA(false);
    setPendingUser(null);
  }, []);

  const completeLoginAfter2FADisable = useCallback(() => {
    if (pendingUser) {
      console.log('Completing login after 2FA disable for user:', pendingUser.username);
      
      // Generate a mock token for the user
      const mockToken = `token_${pendingUser.id}_${Date.now()}`;
      
      // Create a mock session without 2FA requirement
      const mockSession = {
        sessionId: `session_${pendingUser.username}_${Date.now()}`,
        riskScore: 0.1,
        timestamp: new Date().toISOString(),
        requiresMFA: false, // 2FA is now disabled
        mfaMethods: [],
        deviceTrusted: true,
        behavioralAnomaly: { detected: false, anomalies: [], confidence: 0 },
        riskFactors: {
          device: 0.0,
          location: 0.0,
          transaction: 0.0,
          time: 0.0,
          network: 0.0,
          velocity: 0.0
        },
        recommendations: []
      };
      
      // Set authentication data
      Cookies.set('accessToken', mockToken, { expires: 1 });
      Cookies.set('userData', JSON.stringify(pendingUser), { expires: 1 });
      Cookies.set('sessionData', JSON.stringify(mockSession), { expires: 1 });
      
      // Update state
      setUser(pendingUser);
      setSession(mockSession);
      setIsAuthenticated(true);
      setRequires2FA(false);
      setPendingUser(null);
      
      // Start auto-logout timers
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      const timeout = setTimeout(() => {
        console.log('Session timeout - auto logging out');
        logout();
      }, SESSION_TIMEOUT);
      sessionTimeoutRef.current = timeout;
      
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      const inactivityTimeout = setTimeout(() => {
        console.log('Inactivity timeout - auto logging out');
        logout();
      }, INACTIVITY_TIMEOUT);
      inactivityTimeoutRef.current = inactivityTimeout;
      
      console.log('Login completed after 2FA disable');
    }
  }, [pendingUser, logout, SESSION_TIMEOUT, INACTIVITY_TIMEOUT]);

  // Auto-logout functions
  const resetInactivityTimer = useCallback(() => {
    setLastActivity(Date.now());
    
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    
    const timeout = setTimeout(() => {
      console.log('Inactivity timeout - auto logging out');
      logout();
    }, INACTIVITY_TIMEOUT);
    
    inactivityTimeoutRef.current = timeout;
  }, [logout, INACTIVITY_TIMEOUT]);

  const checkAuthStatus = useCallback(() => {
    const token = Cookies.get('accessToken');
    const userData = Cookies.get('userData');
    const sessionData = Cookies.get('sessionData');

    if (token && userData && sessionData) {
      try {
        const parsedUser = JSON.parse(userData);
        const parsedSession = JSON.parse(sessionData);
        
        // Check if session is expired
        const sessionTime = new Date(parsedSession.timestamp).getTime();
        const currentTime = Date.now();
        const sessionAge = currentTime - sessionTime;
        
        if (sessionAge > SESSION_TIMEOUT) {
          console.log('Session expired - auto logging out');
          logout();
          return;
        }
        
        setUser(parsedUser);
        setSession(parsedSession);
        setIsAuthenticated(true);
        
        // Start auto-logout timers
        if (sessionTimeoutRef.current) {
          clearTimeout(sessionTimeoutRef.current);
        }
        const timeout = setTimeout(() => {
          console.log('Session timeout - auto logging out');
          logout();
        }, SESSION_TIMEOUT);
        sessionTimeoutRef.current = timeout;
        
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
        }
        const inactivityTimeout = setTimeout(() => {
          console.log('Inactivity timeout - auto logging out');
          logout();
        }, INACTIVITY_TIMEOUT);
        inactivityTimeoutRef.current = inactivityTimeout;
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
    }
    setIsLoading(false);
  }, [logout, SESSION_TIMEOUT, INACTIVITY_TIMEOUT]);

  // Activity tracking
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      setLastActivity(Date.now());
      
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      
      const timeout = setTimeout(() => {
        console.log('Inactivity timeout - auto logging out');
        logout();
      }, INACTIVITY_TIMEOUT);
      
      inactivityTimeoutRef.current = timeout;
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isAuthenticated, logout, INACTIVITY_TIMEOUT]);

  // Before unload handler for system close detection
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Clear sensitive data from cookies when closing
      Cookies.remove('accessToken');
      Cookies.remove('userData');
      Cookies.remove('sessionData');
      
      // No confirmation dialog - just clean up data silently
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, start a shorter timeout
        console.log('Page hidden - starting shorter timeout');
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
        }
        
        const shortTimeout = setTimeout(() => {
          console.log('Page hidden timeout - auto logging out');
          logout();
        }, 5 * 60 * 1000); // 5 minutes when page is hidden
        
        inactivityTimeoutRef.current = shortTimeout;
      } else {
        // Page is visible again, reset timers
        setLastActivity(Date.now());
        
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
        }
        
        const timeout = setTimeout(() => {
          console.log('Inactivity timeout - auto logging out');
          logout();
        }, INACTIVITY_TIMEOUT);
        
        inactivityTimeoutRef.current = timeout;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, logout, INACTIVITY_TIMEOUT]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Load devices when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadDevices();
    }
  }, [isAuthenticated, user]);

  const login = async (username: string, password: string, deviceInfo?: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      console.log('AuthContext: Making login request with:', { username, deviceInfo });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, userContext: deviceInfo }),
      });

      console.log('AuthContext: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('AuthContext: Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('AuthContext: Response data:', data);

      if (data.success) {
        if (data.session?.requiresMFA) {
          setRequires2FA(true);
          setPendingUser(data.user);
          setIsLoading(false);
          return { success: true, message: 'Please complete 2FA verification', requiresMFA: true };
        } else {
          // Complete login - generate a mock token for demo purposes
          const mockToken = `token_${data.user.id}_${Date.now()}`;
          Cookies.set('accessToken', mockToken, { expires: 1 });
          Cookies.set('userData', JSON.stringify(data.user), { expires: 1 });
          Cookies.set('sessionData', JSON.stringify(data.session), { expires: 1 });
          
          setUser(data.user);
          setSession(data.session);
          setIsAuthenticated(true);
          setRequires2FA(false);
          
          // Start auto-logout timers
          if (sessionTimeoutRef.current) {
            clearTimeout(sessionTimeoutRef.current);
          }
          const timeout = setTimeout(() => {
            console.log('Session timeout - auto logging out');
            logout();
          }, SESSION_TIMEOUT);
          sessionTimeoutRef.current = timeout;
          
          if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
          }
          const inactivityTimeout = setTimeout(() => {
            console.log('Inactivity timeout - auto logging out');
            logout();
          }, INACTIVITY_TIMEOUT);
          inactivityTimeoutRef.current = inactivityTimeout;
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Try to extract error details from the error message
      if (error.message && error.message.includes('HTTP 400:')) {
        try {
          const errorData = JSON.parse(error.message.split('HTTP 400: ')[1]);
          return { 
            success: false, 
            message: errorData.message || 'Login failed',
            errorCode: errorData.errorCode,
            ...errorData
          };
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
      }
      
      return { success: false, message: 'Network error occurred' };
    }
    setIsLoading(false);
    return { success: false, message: 'Login failed' };
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      setIsLoading(false);
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const complete2FA = async (code: string): Promise<{ success: boolean; message: string }> => {
    console.log('complete2FA called with code:', code);
    console.log('complete2FA pendingUser:', pendingUser);
    
    if (!pendingUser) {
      console.log('complete2FA: No pending user, returning error');
      return { success: false, message: 'No pending user' };
    }
    
    try {
      console.log('complete2FA: Making API call to verify-mfa');
      
      // Get device fingerprint from cookies or generate one
      const deviceFingerprint = Cookies.get('deviceFingerprint') || `device_${Date.now()}`;
      
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: pendingUser.username, 
          code,
          deviceFingerprint,
          trustDevice: true // Trust device after successful MFA
        }),
      });

      console.log('complete2FA: API response status:', response.status);
      const data = await response.json();
      console.log('complete2FA: API response data:', data);

      if (data.success) {
        console.log('complete2FA: API success, setting up authentication');
        // Complete 2FA and login
        Cookies.set('accessToken', data.tokens.accessToken, { expires: 1 });
        Cookies.set('userData', JSON.stringify(data.user), { expires: 1 });
        Cookies.set('sessionData', JSON.stringify(data.session), { expires: 1 });
        
        setUser(data.user);
        setSession(data.session);
        setIsAuthenticated(true);
        setRequires2FA(false);
        
        // Start auto-logout timers
        if (sessionTimeoutRef.current) {
          clearTimeout(sessionTimeoutRef.current);
        }
        const timeout = setTimeout(() => {
          console.log('Session timeout - auto logging out');
          logout();
        }, SESSION_TIMEOUT);
        sessionTimeoutRef.current = timeout;
        
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
        }
        const inactivityTimeout = setTimeout(() => {
          console.log('Inactivity timeout - auto logging out');
          logout();
        }, INACTIVITY_TIMEOUT);
        inactivityTimeoutRef.current = inactivityTimeout;
        
        console.log('complete2FA: Authentication setup complete');
        return { success: true, message: '2FA verification successful' };
      }
      
      console.log('complete2FA: API returned failure:', data.message);
      return { success: false, message: data.message || '2FA verification failed' };
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
        body: JSON.stringify({ username, code }),
      });

      const data = await response.json();
      setIsLoading(false);
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error('2FA verification error:', error);
      setIsLoading(false);
      return { success: false, message: 'Network error occurred' };
    }
  };

  // Device management methods
  const loadDevices = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/auth/devices?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setDevices(data.devices);
        setDeviceCount(data.deviceCount);
        setMaxDevices(data.maxDevices);
        setCanAddDevice(data.canAddDevice);
      }
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  };

  const removeDevice = async (deviceFingerprint: string) => {
    try {
      const response = await fetch('/api/auth/devices', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          deviceFingerprint, 
          userId: user?.id 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadDevices(); // Reload devices
      }
      
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error('Error removing device:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const updateDevice = async (deviceFingerprint: string, deviceName: string) => {
    try {
      const response = await fetch('/api/auth/devices', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          deviceFingerprint, 
          deviceName,
          userId: user?.id 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadDevices(); // Reload devices
      }
      
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error('Error updating device:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const trustDevice = async (deviceFingerprint: string, mfaCode?: string) => {
    try {
      const response = await fetch('/api/auth/trust-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          deviceFingerprint, 
          userId: user?.id,
          mfaCode 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadDevices(); // Reload devices
      }
      
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error('Error trusting device:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const registerDevice = async (deviceName: string, deviceInfo: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/auth/register-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sessionId: session?.sessionId || `session_${Date.now()}`,
          deviceName, 
          deviceInfo,
          userId: user?.id || 'demo_user' // Fallback for demo purposes
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadDevices(); // Reload devices
      }
      
      return { 
        success: data.success, 
        message: data.message,
        requiresMFA: data.requiresMFA 
      };
    } catch (error) {
      console.error('Error registering device:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  // Session management methods
  const invalidateSessions = async (reason: string, deviceFingerprint?: string) => {
    try {
      const response = await fetch('/api/auth/session-invalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user?.id,
          reason,
          deviceFingerprint 
        }),
      });

      const data = await response.json();
      
      if (data.success && reason === 'device_limit_exceeded') {
        // If sessions were invalidated due to device limit, reload devices
        await loadDevices();
      }
      
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error('Error invalidating sessions:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const getActiveSessions = async () => {
    try {
      const response = await fetch(`/api/auth/session-invalidate?userId=${user?.id}`);
      const data = await response.json();
      
      return { 
        success: data.success, 
        sessions: data.sessions || [] 
      };
    } catch (error) {
      console.error('Error getting active sessions:', error);
      return { success: false, sessions: [] };
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    session,
    requires2FA,
    pendingUser,
    isLoading,
    devices,
    deviceCount,
    maxDevices,
    canAddDevice,
    login,
    register,
    logout,
    complete2FA,
    verify2FA,
    reset2FA,
    checkAuthStatus,
    completeLoginAfter2FADisable,
    loadDevices,
    removeDevice,
    updateDevice,
    trustDevice,
    registerDevice,
    invalidateSessions,
    getActiveSessions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
