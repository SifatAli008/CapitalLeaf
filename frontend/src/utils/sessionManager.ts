import Cookies from 'js-cookie';

export interface SessionConfig {
  inactivityTimeout: number; // in milliseconds
  sessionTimeout: number; // in milliseconds
  warningTime: number; // in milliseconds
}

export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  inactivityTimeout: 15 * 60 * 1000, // 15 minutes
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  warningTime: 2 * 60 * 1000, // 2 minutes
};

export class SessionManager {
  private config: SessionConfig;
  private lastActivity: number = Date.now();
  private sessionStart: number = Date.now();
  private inactivityTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private sessionTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private warningTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private onWarningCallback?: () => void;
  private onLogoutCallback?: () => void;

  constructor(config: SessionConfig = DEFAULT_SESSION_CONFIG) {
    this.config = config;
  }

  setCallbacks(onWarning?: () => void, onLogout?: () => void) {
    this.onWarningCallback = onWarning;
    this.onLogoutCallback = onLogout;
  }

  start() {
    this.clearAllTimeouts();
    this.sessionStart = Date.now();
    this.lastActivity = Date.now();
    this.startInactivityTimer();
    this.startSessionTimer();
  }

  stop() {
    this.clearAllTimeouts();
  }

  resetInactivity() {
    this.lastActivity = Date.now();
    this.startInactivityTimer();
  }

  extendSession() {
    this.resetInactivity();
    this.sessionStart = Date.now();
    this.startSessionTimer();
  }

  private startInactivityTimer() {
    this.clearInactivityTimeout();
    
    // Start warning timer
    this.warningTimeoutId = setTimeout(() => {
      this.onWarningCallback?.();
    }, this.config.inactivityTimeout - this.config.warningTime);

    // Start logout timer
    this.inactivityTimeoutId = setTimeout(() => {
      this.onLogoutCallback?.();
    }, this.config.inactivityTimeout);
  }

  private startSessionTimer() {
    this.clearSessionTimeout();
    
    this.sessionTimeoutId = setTimeout(() => {
      this.onLogoutCallback?.();
    }, this.config.sessionTimeout);
  }

  private clearInactivityTimeout() {
    if (this.inactivityTimeoutId) {
      clearTimeout(this.inactivityTimeoutId);
      this.inactivityTimeoutId = null;
    }
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
  }

  private clearSessionTimeout() {
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
      this.sessionTimeoutId = null;
    }
  }

  private clearAllTimeouts() {
    this.clearInactivityTimeout();
    this.clearSessionTimeout();
  }

  getTimeUntilLogout(): number {
    const timeSinceActivity = Date.now() - this.lastActivity;
    const timeSinceSessionStart = Date.now() - this.sessionStart;
    
    const inactivityTimeLeft = Math.max(0, this.config.inactivityTimeout - timeSinceActivity);
    const sessionTimeLeft = Math.max(0, this.config.sessionTimeout - timeSinceSessionStart);
    
    return Math.min(inactivityTimeLeft, sessionTimeLeft);
  }

  getSessionAge(): number {
    return Date.now() - this.sessionStart;
  }

  getInactivityTime(): number {
    return Date.now() - this.lastActivity;
  }

  isSessionExpired(): boolean {
    return this.getSessionAge() > this.config.sessionTimeout;
  }

  isInactive(): boolean {
    return this.getInactivityTime() > this.config.inactivityTimeout;
  }

  // Clean up sensitive data
  clearSensitiveData() {
    const sensitiveCookies = ['accessToken', 'userData', 'sessionData'];
    sensitiveCookies.forEach(cookie => {
      Cookies.remove(cookie);
      // Also try to clear with different path and domain options
      Cookies.remove(cookie, { path: '/' });
      Cookies.remove(cookie, { domain: window.location.hostname });
    });
  }

  // Handle page visibility changes
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, use shorter timeout
      this.clearAllTimeouts();
      this.inactivityTimeoutId = setTimeout(() => {
        this.onLogoutCallback?.();
      }, 5 * 60 * 1000); // 5 minutes when hidden
    } else {
      // Page is visible again, reset timers
      this.resetInactivity();
    }
  }

  // Handle before unload
  handleBeforeUnload(event: BeforeUnloadEvent) {
    this.clearSensitiveData();
    
    // Optional: Show confirmation dialog
    event.preventDefault();
    event.returnValue = 'Your session will be logged out when you leave.';
    return 'Your session will be logged out when you leave.';
  }
}

// Global session manager instance
export const sessionManager = new SessionManager();

// Utility functions
export const formatTimeRemaining = (milliseconds: number): string => {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const isSessionValid = (): boolean => {
  const token = Cookies.get('accessToken');
  const userData = Cookies.get('userData');
  const sessionData = Cookies.get('sessionData');
  
  if (!token || !userData || !sessionData) {
    return false;
  }

  try {
    const session = JSON.parse(sessionData);
    const sessionTime = new Date(session.timestamp).getTime();
    const currentTime = Date.now();
    const sessionAge = currentTime - sessionTime;
    
    return sessionAge < DEFAULT_SESSION_CONFIG.sessionTimeout;
  } catch {
    return false;
  }
};
