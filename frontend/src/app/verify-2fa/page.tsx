'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CapitalLeafLogo from '@/components/CapitalLeafLogo';
import { Shield, ArrowLeft, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';

const Verify2FAPage: React.FC = () => {
  const router = useRouter();
  const { verify2FA, isLoading, pendingUser, requires2FA } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // If doesn't require 2FA or no pending user, redirect to login
    // Note: isAuthenticated can be false during 2FA flow
    if ((!requires2FA || !pendingUser) && !hasRedirected) {
      console.log('Verify-2FA page: Redirecting to login - requires2FA:', requires2FA, 'pendingUser:', pendingUser);
      setHasRedirected(true);
      router.push('/login');
    }
  }, [requires2FA, pendingUser, hasRedirected, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      setIsVerifying(false);
      return;
    }

    if (!pendingUser) {
      setError('No pending authentication found. Please login again.');
      setIsVerifying(false);
      router.push('/login');
      return;
    }

    console.log('2FA Verification: Attempting to verify code for user:', pendingUser.username);
    const result = await verify2FA(pendingUser.username, code);
    console.log('2FA Verification result:', result);

    if (result.success) {
      console.log('2FA verification successful, redirecting to dashboard');
      router.push('/dashboard');
    } else {
      setError(result.message || 'Invalid verification code. Please try again.');
    }
    setIsVerifying(false);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setCode(value);
      setError(''); // Clear error when user starts typing
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-dark p-12 flex-col justify-between">
        <div>
          <CapitalLeafLogo 
            size="large" 
            subtitle="Two-Factor Authentication"
            animated={true}
            variant="light"
            showSubtitle={true}
          />
          <div className="mt-8 space-y-6">
            <div className="flex items-center space-x-3 text-green-100">
              <div className="p-2 bg-green-700 rounded-lg">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Enhanced Security</h3>
                <p className="text-sm text-green-200">Your account is protected with 2FA</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-green-100">
              <div className="p-2 bg-green-700 rounded-lg">
                <Smartphone size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Google Authenticator</h3>
                <p className="text-sm text-green-200">Time-based one-time passwords</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-green-200 text-sm">
          <p>© 2024 CapitalLeaf. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - 2FA Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <CapitalLeafLogo 
              size="medium" 
              subtitle="2FA Verification"
              animated={true}
            />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h1>
            <p className="text-gray-600">
              Enter the 6-digit code from your Google Authenticator app
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={handleCodeChange}
                className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 placeholder-gray-400 tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
                autoComplete="one-time-code"
                autoFocus
              />
              <p className="mt-2 text-sm text-gray-500">
                Open Google Authenticator and enter the current code
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isVerifying || code.length !== 6}
              className="w-full bg-gradient-to-r from-green-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              {isLoading || isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>Verify Code</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <button
              onClick={handleBackToLogin}
              className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Login</span>
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Don't have Google Authenticator?{' '}
                <a
                  href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Download it here
                </a>
              </p>
            </div>
          </div>

          {/* Demo Information */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-indigo-50 rounded-xl border border-green-200">
            <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
              <Shield size={16} className="mr-2" />
              Demo Mode
            </h4>
            <div className="text-xs text-green-700 space-y-1">
              <p><strong>For testing:</strong> Enter any 6-digit number</p>
              <p className="text-green-600 italic mt-2">Example: 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify2FAPage;
