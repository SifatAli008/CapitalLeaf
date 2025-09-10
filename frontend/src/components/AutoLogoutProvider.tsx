'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAutoLogout } from '@/hooks/useAutoLogout';
import AutoLogoutWarning from './AutoLogoutWarning';

interface AutoLogoutProviderProps {
  children: React.ReactNode;
}

const AutoLogoutProvider: React.FC<AutoLogoutProviderProps> = ({ children }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [warningInterval, setWarningInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const { getTimeUntilLogout, resetInactivityTimer, clearTimeouts } = useAutoLogout({
    inactivityTimeout: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 2 * 60 * 1000, // 2 minutes warning
    onWarning: () => {
      setShowWarning(true);
      startWarningCountdown();
    },
    onLogout: () => {
      setShowWarning(false);
      clearWarningInterval();
    }
  });

  const startWarningCountdown = () => {
    const updateTimeLeft = () => {
      const time = getTimeUntilLogout();
      setTimeLeft(time);
      
      if (time <= 0) {
        setShowWarning(false);
        clearWarningInterval();
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    setWarningInterval(interval);
  };

  const clearWarningInterval = useCallback(() => {
    if (warningInterval) {
      clearInterval(warningInterval);
      setWarningInterval(null);
    }
  }, [warningInterval]);

  const handleExtendSession = () => {
    setShowWarning(false);
    clearWarningInterval();
    resetInactivityTimer();
  };

  const handleLogoutNow = () => {
    setShowWarning(false);
    clearWarningInterval();
    clearTimeouts();
    // The logout will be handled by the useAutoLogout hook
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearWarningInterval();
    };
  }, [clearWarningInterval]);

  return (
    <>
      {children}
      {showWarning && (
        <AutoLogoutWarning
          timeLeft={timeLeft}
          onExtendSession={handleExtendSession}
          onLogoutNow={handleLogoutNow}
        />
      )}
    </>
  );
};

export default AutoLogoutProvider;
