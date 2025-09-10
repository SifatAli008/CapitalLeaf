'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, LogOut } from 'lucide-react';

interface AutoLogoutWarningProps {
  timeLeft: number;
  onExtendSession: () => void;
  onLogoutNow: () => void;
}

const AutoLogoutWarning: React.FC<AutoLogoutWarningProps> = ({
  timeLeft,
  onExtendSession,
  onLogoutNow
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      setIsVisible(true);
      const totalSeconds = Math.ceil(timeLeft / 1000);
      setMinutes(Math.floor(totalSeconds / 60));
      setSeconds(totalSeconds % 60);
    } else {
      setIsVisible(false);
    }
  }, [timeLeft]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in slide-in-from-bottom-4 duration-300">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>

          {/* Warning Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Session Timeout Warning
          </h3>

          {/* Warning Message */}
          <p className="text-gray-600 mb-6">
            You will be automatically logged out due to inactivity. Your session will expire in:
          </p>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Clock className="h-6 w-6 text-orange-600" />
            <div className="text-3xl font-mono font-bold text-orange-600">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onExtendSession}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Clock className="h-5 w-5" />
              <span>Extend Session</span>
            </button>
            
            <button
              onClick={onLogoutNow}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout Now</span>
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 mt-4">
            Click "Extend Session" to continue working, or "Logout Now" to end your session immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutoLogoutWarning;
