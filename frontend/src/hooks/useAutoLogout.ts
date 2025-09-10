import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseAutoLogoutOptions {
  inactivityTimeout?: number; // in milliseconds
  sessionTimeout?: number; // in milliseconds
  warningTime?: number; // in milliseconds - time before logout to show warning
  onWarning?: () => void;
  onLogout?: () => void;
}

export const useAutoLogout = (options: UseAutoLogoutOptions = {}) => {
  const {
    inactivityTimeout = 15 * 60 * 1000, // 15 minutes
    sessionTimeout = 30 * 60 * 1000, // 30 minutes
    warningTime = 2 * 60 * 1000, // 2 minutes
    onWarning,
    onLogout
  } = options;

  const { isAuthenticated, logout } = useAuth();
  const lastActivityRef = useRef<number>(Date.now());
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionStartRef = useRef<number>(Date.now());

  const clearTimeouts = useCallback(() => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (!isAuthenticated) return;

    lastActivityRef.current = Date.now();
    clearTimeouts();

    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      console.log('Inactivity warning - user will be logged out soon');
      onWarning?.();
    }, inactivityTimeout - warningTime);

    // Set logout timeout
    logoutTimeoutRef.current = setTimeout(() => {
      console.log('Auto logout due to inactivity');
      onLogout?.();
      logout();
    }, inactivityTimeout);
  }, [isAuthenticated, inactivityTimeout, warningTime, onWarning, onLogout, logout, clearTimeouts]);

  const resetSessionTimer = useCallback(() => {
    if (!isAuthenticated) return;

    sessionStartRef.current = Date.now();
    clearTimeouts();

    // Set session timeout
    logoutTimeoutRef.current = setTimeout(() => {
      console.log('Auto logout due to session timeout');
      onLogout?.();
      logout();
    }, sessionTimeout);
  }, [isAuthenticated, sessionTimeout, onLogout, logout, clearTimeouts]);

  const handleActivity = useCallback(() => {
    if (!isAuthenticated) return;
    resetInactivityTimer();
  }, [isAuthenticated, resetInactivityTimer]);

  const handleVisibilityChange = useCallback(() => {
    if (!isAuthenticated) return;

    if (document.hidden) {
      // Page is hidden, use shorter timeout
      clearTimeouts();
      logoutTimeoutRef.current = setTimeout(() => {
        console.log('Auto logout - page hidden for too long');
        onLogout?.();
        logout();
      }, 5 * 60 * 1000); // 5 minutes when hidden
    } else {
      // Page is visible again, reset timers
      resetInactivityTimer();
    }
  }, [isAuthenticated, resetInactivityTimer, onLogout, logout, clearTimeouts]);

  const handleBeforeUnload = useCallback((_event: BeforeUnloadEvent) => {
    if (!isAuthenticated) return;

    // Clear sensitive data
    const cookies = ['accessToken', 'userData', 'sessionData'];
    cookies.forEach(cookie => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    // No confirmation dialog - just clean up data silently
  }, [isAuthenticated]);

  // Set up activity tracking
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'focus'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Start timers
    resetInactivityTimer();
    resetSessionTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeouts();
    };
  }, [isAuthenticated, handleActivity, handleVisibilityChange, handleBeforeUnload, resetInactivityTimer, resetSessionTimer, clearTimeouts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  return {
    resetInactivityTimer,
    resetSessionTimer,
    clearTimeouts,
    getTimeUntilLogout: () => {
      if (!isAuthenticated) return 0;
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      const timeSinceSessionStart = Date.now() - sessionStartRef.current;
      const inactivityTimeLeft = Math.max(0, inactivityTimeout - timeSinceActivity);
      const sessionTimeLeft = Math.max(0, sessionTimeout - timeSinceSessionStart);
      return Math.min(inactivityTimeLeft, sessionTimeLeft);
    }
  };
};
