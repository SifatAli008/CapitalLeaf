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
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  complete2FA: (code: string) => Promise<{ success: boolean; message: string }>;
  verify2FA: (username: string, code: string) => Promise<{ success: boolean; message: string }>;
  reset2FA: () => void;
  checkAuthStatus: () => void;
  completeLoginAfter2FADisable: () => void;
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
  }, [logout, SESSION_TIMEOUT]);

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
    } catch (error) {
      console.error('Login error:', error);
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
    completeLoginAfter2FADisable,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
