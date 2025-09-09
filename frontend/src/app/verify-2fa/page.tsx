'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CapitalLeafLogo from '@/components/CapitalLeafLogo';
import { Shield, Smartphone, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { authenticator } from 'otplib';

// Function to check if user has 2FA enabled
async function checkUser2FAStatus(username: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/auth/2fa-status?username=${encodeURIComponent(username)}`);
    const data = await response.json();
    return data.success ? data.has2FA : false;
  } catch (error) {
    console.error('Error checking 2FA status:', error);
    return false;
  }
}

const Verify2FAPage: React.FC = () => {
  const router = useRouter();
  const { pendingUser, complete2FA, isLoading, logout } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 2FA Setup states
  const [show2FASetup, setShow2FASetup] = useState(false);

  useEffect(() => {
    // Redirect if no pending user (shouldn't be on this page)
    if (!pendingUser) {
      router.push('/login');
    } else {
      // Check if user has 2FA enabled
      checkUser2FAStatus(pendingUser.username).then((userHas2FAEnabled) => {
        if (!userHas2FAEnabled) {
          // User doesn't have 2FA enabled, redirect to dashboard
          console.log('User does not have 2FA enabled, redirecting to dashboard');
          router.push('/dashboard');
          return;
        }
      });
      
      // Skip setup flow - go directly to verification
      setShow2FASetup(false);
    }
  }, [pendingUser, router]);


  const getUserSecretKey = (username: string): string => {
    // Generate a proper Base32 secret key for Google Authenticator compatibility
    // In a real app, this would fetch the user's secret key from the backend
    
    // Create a deterministic secret based on username
    // Use a simple approach that Google Authenticator can handle
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    
    const usernameLower = username.toLowerCase();
    
    // Generate 32-character Base32 secret
    for (let i = 0; i < 32; i++) {
      const charCode = usernameLower.charCodeAt(i % usernameLower.length);
      const index = (charCode + i) % chars.length;
      secret += chars[index];
    }
    
    return secret;
  };

  const validateTOTPCode = (code: string, secret: string): boolean => {
    try {
      // Configure TOTP for Google Authenticator compatibility
      authenticator.options = {
        window: 1, // Allow 1 time window before/after current time
        step: 30,  // 30-second time step (standard)
        algorithm: 'sha1' as any, // SHA-1 algorithm (standard)
        digits: 6 // 6-digit codes
      };
      
      // Use real TOTP validation with otplib
      return authenticator.verify({ token: code, secret });
    } catch (error) {
      console.error('TOTP validation error:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    // Validate the Google Authenticator code using real TOTP
    // Get the user's secret key (in real app, this would come from backend)
    const userSecretKey = getUserSecretKey(pendingUser?.username || '');
    const isValidCode = validateTOTPCode(verificationCode, userSecretKey);
    
    if (isValidCode) {
      setSuccess('Verification successful! Redirecting to dashboard...');
      
      // Complete the 2FA verification and redirect to dashboard
      const success = await complete2FA(verificationCode);
      if (success) {
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } else {
      setError(`Invalid verification code: "${verificationCode}". Please enter the current 6-digit code from your Google Authenticator app.`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    setError('');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!pendingUser) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <CapitalLeafLogo 
            size="medium" 
            subtitle="Two-Factor Authentication"
            animated={true}
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h1>
            <p className="text-gray-600">
              Enter the 6-digit code from your Google Authenticator app
            </p>
          </div>

          {/* User Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {pendingUser.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{pendingUser.username}</p>
                <p className="text-sm text-gray-600">Signing in securely</p>
              </div>
            </div>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-center text-2xl font-mono tracking-widest hover:border-gray-400 text-gray-900 placeholder-gray-500"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                <Shield size={16} className="mr-2" />
                How to get your code
              </h4>
              <div className="space-y-2 text-xs text-blue-700">
                <p>• Open your Google Authenticator app</p>
                <p>• Find the entry for CapitalLeaf</p>
                <p>• Enter the 6-digit code shown</p>
                <p>• The code refreshes every 30 seconds</p>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-xl border border-green-200">
                <CheckCircle size={20} />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-gray-600 hover:text-gray-800 py-2 px-4 rounded-xl font-medium transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel & Sign Out
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <Shield size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-600">
                <p className="font-semibold text-gray-800 mb-1">Security Notice</p>
                <p>
                  This verification step helps protect your account from unauthorized access. 
                  Never share your verification codes with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 CapitalLeaf. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Verify2FAPage;
