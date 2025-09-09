'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CapitalLeafLogo from '@/components/CapitalLeafLogo';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Smartphone, 
  Globe,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  LogOut,
  ArrowLeft
} from 'lucide-react';

const AccountPage: React.FC = () => {
  const router = useRouter();
  const { user, session, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user) {
      setProfileData({
        firstName: user.username.split(' ')[0] || '',
        lastName: user.username.split(' ')[1] || '',
        email: user.email || '',
        username: user.username
      });
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    // Simulate password change
    setSuccess('Password updated successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Simulate profile update
    setSuccess('Profile updated successfully');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <CapitalLeafLogo size="small" showSubtitle={false} />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and security settings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your username"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle size={20} />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                      <CheckCircle size={20} />
                      <span className="text-sm">{success}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Save size={20} />
                    <span>Update Profile</span>
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Enter your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Confirm your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertCircle size={20} />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}

                    {success && (
                      <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                        <CheckCircle size={20} />
                        <span className="text-sm">{success}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Lock size={20} />
                      <span>Update Password</span>
                    </button>
                  </form>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Shield className="text-green-600" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Zero Trust Authentication</p>
                          <p className="text-xs text-gray-500">Active and monitoring</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="text-blue-600" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Device Trust</p>
                          <p className="text-xs text-gray-500">
                            {session.deviceTrusted ? 'Device is trusted' : 'New device detected'}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        session.deviceTrusted ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                      }`}>
                        {session.deviceTrusted ? 'Trusted' : 'New'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Mail className="text-purple-600" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Multi-Factor Authentication</p>
                          <p className="text-xs text-gray-500">
                            {session.requiresMFA ? 'MFA required for this session' : 'MFA not required'}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        session.requiresMFA ? 'text-orange-600 bg-orange-100' : 'text-green-600 bg-green-100'
                      }`}>
                        {session.requiresMFA ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trusted Devices</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="text-gray-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Current Device</p>
                            <p className="text-xs text-gray-500">
                              Session started {new Date(session.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {session.deviceTrusted ? (
                            <>
                              <Shield className="text-green-600" size={16} />
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Trusted</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="text-yellow-600" size={16} />
                              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">New Device</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                        <p className="text-xs text-gray-500">Switch to dark theme</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                        <p className="text-xs text-gray-500">Receive security alerts via email</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-xs text-gray-500">Receive security alerts via SMS</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
