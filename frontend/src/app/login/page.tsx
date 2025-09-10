'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CapitalLeafLogo from '@/components/CapitalLeafLogo';
import DeviceFingerprint from '@/components/DeviceFingerprint';
import { Shield, Eye, EyeOff, AlertCircle, Lock, User, ArrowRight, CreditCard, TrendingUp } from 'lucide-react';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, requires2FA, pendingUser, reset2FA } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [error, setError] = useState('');
  const [deviceInfo, setDeviceInfo] = useState<Record<string, unknown> | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset 2FA state if there's no pending user
  useEffect(() => {
    if (requires2FA && !pendingUser) {
      console.log('Login page: Resetting 2FA state - no pending user');
      reset2FA();
    }
  }, [requires2FA, pendingUser, reset2FA]);

  useEffect(() => {
    console.log('Login page useEffect triggered:', { isAuthenticated, requires2FA, pendingUser, hasRedirected });
    if (isAuthenticated && !requires2FA) {
      console.log('Login page: User is authenticated and 2FA not required, redirecting to dashboard');
      router.push('/dashboard');
    } else if (requires2FA && pendingUser && !isAuthenticated && !hasRedirected) {
      console.log('Login page: 2FA required with pending user, redirecting to verification page');
      setHasRedirected(true);
      router.push('/verify-2fa');
    }
  }, [isAuthenticated, requires2FA, pendingUser, hasRedirected, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return; // Prevent multiple submissions
    }
    
    setError('');
    setHasRedirected(false); // Reset redirect state
    setIsSubmitting(true);

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      setIsSubmitting(false);
      return;
    }

    if (!deviceInfo) {
      setError('Device analysis in progress, please wait...');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Login page: Attempting login with username:', formData.username);
      const result = await login(formData.username, formData.password, deviceInfo);
      console.log('Login result:', result);
      if (result.success) {
        console.log('Login successful, checking 2FA requirement');
        // The useEffect will handle the redirect based on the auth state
        // No need to manually redirect here
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-dark p-12 flex-col justify-between">
        <div>
          <CapitalLeafLogo 
            size="large" 
            subtitle="Secure Financial Technology"
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
                <h3 className="font-semibold">Bank-Grade Security</h3>
                <p className="text-sm text-green-200">256-bit encryption & zero-trust architecture</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-green-100">
              <div className="p-2 bg-green-700 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Real-Time Monitoring</h3>
                <p className="text-sm text-green-200">AI-powered threat detection & risk assessment</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-green-100">
              <div className="p-2 bg-green-700 rounded-lg">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Financial Compliance</h3>
                <p className="text-sm text-green-200">SOC 2, PCI DSS, and regulatory compliance</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-green-200 text-sm">
          <p>© 2024 CapitalLeaf. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <CapitalLeafLogo 
              size="medium" 
              subtitle="Secure Login"
              animated={true}
            />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your CapitalLeaf account</p>
          </div>

          <DeviceFingerprint onFingerprintGenerated={setDeviceInfo} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter your username or email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberDevice"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberDevice" className="ml-2 block text-sm text-gray-700">
                  Trust this device
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isSubmitting || !deviceInfo}
              className="w-full bg-gradient-to-r from-green-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              {(isLoading || isSubmitting) ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Create one here
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-indigo-50 rounded-xl border border-green-200">
            <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
              <Shield size={16} className="mr-2" />
              Demo Access
            </h4>
            <div className="text-xs text-green-700 space-y-1">
              <p><strong>Username:</strong> demo@capitalleaf.com</p>
              <p><strong>Password:</strong> SecurePass123!</p>
              <p className="text-green-600 italic mt-2">Or use any credentials to test the system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
