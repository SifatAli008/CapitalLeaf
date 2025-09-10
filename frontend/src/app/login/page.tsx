'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CapitalLeafLogo from '@/components/CapitalLeafLogo';
import DeviceFingerprint from '@/components/DeviceFingerprint';
import { Shield, Eye, EyeOff, AlertCircle, Lock, User, ArrowRight, CreditCard, TrendingUp, CheckCircle, Star } from 'lucide-react';

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
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Login attempt with device info:', deviceInfo);
      const result = await login(formData.username, formData.password, deviceInfo);
      console.log('Login result:', result);
      
      if (result.success) {
        if (result.requiresMFA) {
          console.log('Login successful, 2FA required');
          // The useEffect will handle the redirect to verify-2fa
        } else {
          console.log('Login successful, redirecting to dashboard');
          router.push('/dashboard');
        }
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative z-10">
          <CapitalLeafLogo 
            size="large" 
            subtitle="Secure Financial Technology"
            animated={true}
            variant="light"
            showSubtitle={true}
          />
          <div className="mt-12 space-y-8">
            <div className="flex items-start space-x-4 text-blue-100">
              <div className="p-3 bg-blue-700/50 rounded-xl backdrop-blur-sm">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Bank-Grade Security</h3>
                <p className="text-blue-200 leading-relaxed">256-bit encryption, zero-trust architecture, and SOC 2 Type II compliance</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 text-blue-100">
              <div className="p-3 bg-blue-700/50 rounded-xl backdrop-blur-sm">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">AI-Powered Monitoring</h3>
                <p className="text-blue-200 leading-relaxed">Real-time threat detection and behavioral analytics for proactive security</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 text-blue-100">
              <div className="p-3 bg-blue-700/50 rounded-xl backdrop-blur-sm">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Financial Compliance</h3>
                <p className="text-blue-200 leading-relaxed">PCI DSS, GDPR, and regulatory compliance built-in from day one</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-blue-200 text-sm">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle size={16} />
            <span className="font-medium">Trusted by 500+ Financial Institutions</span>
          </div>
          <p>© 2024 CapitalLeaf. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <CapitalLeafLogo 
              size="large" 
              subtitle="Secure Login"
              animated={true}
            />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h1>
            <p className="text-gray-600 text-lg">Sign in to your CapitalLeaf account</p>
          </div>

          <DeviceFingerprint onFingerprintGenerated={setDeviceInfo} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 text-lg"
                    placeholder="Enter your username or email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 text-lg"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
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
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberDevice" className="ml-3 block text-sm font-medium text-gray-700">
                  Trust this device
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-xl border-2 border-red-200">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isSubmitting || !deviceInfo}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl"
            >
              {(isLoading || isSubmitting) ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
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
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
              >
                Create one here
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
            <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center">
              <Shield size={18} className="mr-2" />
              Demo Access
            </h4>
            <div className="text-sm text-blue-700 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Username:</span>
                <span className="font-mono">demo@capitalleaf.com</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Password:</span>
                <span className="font-mono">SecurePass123!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
