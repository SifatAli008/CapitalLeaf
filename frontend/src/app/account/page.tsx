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
  ArrowLeft,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Key,
  Smartphone as Phone,
  Monitor,
  Tablet,
  Camera,
  Phone as PhoneIcon,
  MapPin,
  Globe2,
  Plus
} from 'lucide-react';
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

// Function to enable 2FA for a user
async function enable2FAForUser(username: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/2fa-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        enable: true
      })
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    return false;
  }
}

// Function to disable 2FA for a user
async function disable2FAForUser(username: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/2fa-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        enable: false
      })
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    return false;
  }
}

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [, setCurrentTOTPCode] = useState('');

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
      
      // Check if user has 2FA enabled (sync with login system)
      console.log('Account page: Checking 2FA status for user:', user.username);
      checkUser2FAStatus(user.username).then((userHas2FAEnabled) => {
        console.log('Account page: User 2FA status:', userHas2FAEnabled);
        setTwoFactorEnabled(userHas2FAEnabled);
      });
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || !session) {
    return (
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{width: '48px', height: '48px', border: '2px solid #2563eb', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto'}}></div>
          <p style={{marginTop: '16px', color: '#6b7280'}}>Loading your account settings...</p>
        </div>
      </div>
    );
  }


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

  const navigationItems = [
    { id: 'profile', label: 'Profile', icon: User, color: 'text-blue-600' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-green-600' },
    { id: 'devices', label: 'Devices', icon: Smartphone, color: 'text-purple-600' },
    { id: 'preferences', label: 'Preferences', icon: Settings, color: 'text-orange-600' }
  ];

  const mockDevices = [
    { 
      name: 'MacBook Pro', 
      type: 'desktop', 
      lastSeen: '2 hours ago', 
      trusted: true, 
      icon: Monitor,
      location: 'San Francisco, CA',
      ip: '192.168.1.100',
      os: 'macOS 14.0',
      browser: 'Chrome 119.0'
    },
    { 
      name: 'iPhone 14', 
      type: 'mobile', 
      lastSeen: '1 hour ago', 
      trusted: true, 
      icon: Phone,
      location: 'San Francisco, CA',
      ip: '192.168.1.101',
      os: 'iOS 17.1',
      browser: 'Safari 17.1'
    },
    { 
      name: 'iPad Air', 
      type: 'tablet', 
      lastSeen: '3 days ago', 
      trusted: false, 
      icon: Tablet,
      location: 'New York, NY',
      ip: '10.0.0.50',
      os: 'iPadOS 17.1',
      browser: 'Safari 17.1'
    }
  ];

  const securityEvents = [
    { type: 'login', message: 'Successful login from MacBook Pro', time: '2 hours ago', status: 'success' },
    { type: 'device', message: 'New device registered: iPhone 14', time: '1 day ago', status: 'info' },
    { type: 'password', message: 'Password changed successfully', time: '3 days ago', status: 'success' },
    { type: 'security', message: 'Security scan completed', time: '1 week ago', status: 'info' }
  ];

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
        setShowAvatarUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTwoFactor = async () => {
    if (!twoFactorEnabled) {
      // Start 2FA setup process
      setShow2FASetup(true);
      generateSecretKey();
    } else {
      // Disable 2FA
      console.log('🚨 Account page: Disabling 2FA for user:', user?.username);
      
      // Update the user's 2FA status in the system FIRST
      if (user?.username) {
        const success = await disable2FAForUser(user.username);
        if (success) {
          console.log('✅ 2FA disabled for user:', user.username);
          // Only update UI state after successful API call
          setTwoFactorEnabled(false);
          setShow2FASetup(false);
          setShowBackupCodes(false);
          setSuccess('Two-factor authentication disabled successfully!');
        } else {
          console.error('❌ Failed to disable 2FA for user:', user.username);
          setError('Failed to disable 2FA. Please try again.');
        }
      } else {
        setError('User not found. Please refresh the page and try again.');
      }
    }
  };

  const generateSecretKey = () => {
    // Generate a proper Base32 secret key for Google Authenticator compatibility
    // In a real app, this would come from backend
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    
    if (user?.username) {
      // Create a deterministic secret based on username
      // Use a simple approach that Google Authenticator can handle
      const username = user.username.toLowerCase();
      
      // Generate 32-character Base32 secret
      for (let i = 0; i < 32; i++) {
        const charCode = username.charCodeAt(i % username.length);
        const index = (charCode + i) % chars.length;
        secret += chars[index];
      }
    }
    
    setSecretKey(secret);
    
    // Generate QR code URL (in real app, this would be generated by backend)
    const qrData = `otpauth://totp/CapitalLeaf:${user?.username || 'user'}?secret=${secret}&issuer=CapitalLeaf`;
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`);
    
    // Generate initial TOTP code
    if (secret) {
      // Configure TOTP for Google Authenticator compatibility
      // authenticator.options = {
      //   window: 1,
      //   step: 30,
      //   algorithm: 'sha1' as any,
      //   digits: 6
      // };
      
      setCurrentTOTPCode(authenticator.generate(secret));
      
      // Update TOTP code every 30 seconds (standard TOTP window)
      const interval = setInterval(() => {
        setCurrentTOTPCode(authenticator.generate(secret));
      }, 30000);
      
      // Clean up interval when component unmounts or secret changes
      return () => clearInterval(interval);
    }
  };

  const verify2FACode = async () => {
    try {
      console.log('Verify button clicked, code:', verificationCode);
      console.log('Code length:', verificationCode.length);
      console.log('Code type:', typeof verificationCode);
      
      // Clear any previous messages
      setError('');
      setSuccess('');
      
      if (verificationCode.length !== 6) {
        setError('Please enter a valid 6-digit code');
        return;
      }

      // Use real TOTP validation with otplib
      if (!secretKey) {
        setError('Secret key not found. Please refresh the page and try again.');
        return;
      }

      // Configure TOTP for Google Authenticator compatibility
      authenticator.options = {
        window: 1, // Allow 1 time window before/after current time
        step: 30,  // 30-second time step (standard)
        algorithm: 'sha1' as any, // SHA-1 algorithm (standard)
        digits: 6 // 6-digit codes
      };
      
      // Validate the TOTP code
      const isValidTOTP = authenticator.verify({ token: verificationCode, secret: secretKey });
      
      if (isValidTOTP) {
        console.log('Verification successful');
        
        // Use setTimeout to ensure state updates happen properly
        setTimeout(() => {
          setTwoFactorEnabled(true);
          setShow2FASetup(false);
          generateBackupCodes();
          setSuccess('Two-factor authentication enabled successfully!');
          setVerificationCode('');
          
          // Update the user's 2FA status in the system
          if (user?.username) {
            console.log('🚨 Account page: Enabling 2FA for user:', user.username);
            enable2FAForUser(user.username).then((success) => {
              if (success) {
                console.log('✅ 2FA enabled for user:', user.username);
                // Refresh 2FA status to ensure UI is in sync
                checkUser2FAStatus(user.username).then((userHas2FAEnabled) => {
                  console.log('Account page: Refreshed 2FA status:', userHas2FAEnabled);
                  setTwoFactorEnabled(userHas2FAEnabled);
                });
              } else {
                console.error('❌ Failed to enable 2FA for user:', user.username);
                // Revert the UI state if API call failed
                setTwoFactorEnabled(false);
                setShow2FASetup(true);
                setError('Failed to enable 2FA. Please try again.');
              }
            });
          }
        }, 100);
        
      } else {
        console.log('Verification failed, code:', verificationCode);
        setError(`Invalid verification code: "${verificationCode}". Please enter the current 6-digit code from your Google Authenticator app.`);
      }
    } catch (error) {
      console.error('Error in verify2FACode:', error);
      setError('An error occurred during verification. Please try again.');
    }
  };

  const generateBackupCodes = () => {
    // Generate backup codes (in real app, this would come from backend)
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    setBackupCodes(codes);
    setShowBackupCodes(true);
  };

  const copyToClipboard = async (text: string, successMessage: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setSuccess(successMessage);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setSuccess(successMessage);
      }
    } catch {
      setError('Failed to copy to clipboard. Please copy manually.');
    }
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    copyToClipboard(codesText, 'Backup codes copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => router.push('/dashboard')}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
            <ArrowLeft size={24} />
              </button>
              <CapitalLeafLogo size="small" showSubtitle={false} />
              <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
            <Menu size={24} />
              </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <CapitalLeafLogo size="medium" showSubtitle={false} />
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
        </div>

            {/* User Info */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} className={activeTab === item.id ? 'text-blue-600' : item.color} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Back to Dashboard */}
            <div className="p-4 border-t">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
          </div>
          </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Desktop Header */}
          <header className="hidden lg:block bg-white shadow-sm border-b">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600">Manage your profile and security preferences</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <Bell size={20} />
                </button>
                <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <Search size={20} />
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Dashboard</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      {avatar ? (
                        <img 
                          src={avatar} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                          <User size={32} className="text-white" />
                        </div>
                      )}
                      <button
                        onClick={() => setShowAvatarUpload(!showAvatarUpload)}
                        className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                      >
                        <Camera size={16} />
                      </button>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">Member since {new Date().getFullYear()}</span>
                        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">Verified</span>
                      </div>
                    </div>
                  </div>
                  
                  {showAvatarUpload && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Profile Picture</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  )}
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400" />
                          </div>
                      <input
                        type="text"
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Enter your first name"
                      />
                        </div>
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400" />
                          </div>
                      <input
                        type="text"
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Enter your last name"
                      />
                        </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400" />
                        </div>
                    <input
                      type="email"
                      id="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      placeholder="Enter your email address"
                    />
                      </div>
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-gray-400" />
                        </div>
                    <input
                      type="text"
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      placeholder="Enter your username"
                    />
                      </div>
                  </div>

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

                  <button
                    type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Save size={20} />
                    <span>Update Profile</span>
                  </button>
                </form>
                </div>

              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-gray-400" />
                        </div>
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key size={18} className="text-gray-400" />
                        </div>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                          placeholder="Enter your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key size={18} className="text-gray-400" />
                        </div>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                          placeholder="Confirm your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

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

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <Lock size={20} />
                      <span>Update Password</span>
                    </button>
                  </form>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h2>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Shield className="text-blue-600" size={20} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Google Authenticator</p>
                        <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (twoFactorEnabled) {
                          // Show confirmation dialog for disabling 2FA
                          const confirmed = window.confirm(
                            'Are you sure you want to disable Two-Factor Authentication?\n\n' +
                            'This will make your account less secure. You will no longer need to enter a verification code when signing in.\n\n' +
                            'Click OK to disable 2FA, or Cancel to keep it enabled.'
                          );
                          if (confirmed) {
                            toggleTwoFactor();
                          }
                        } else {
                          toggleTwoFactor();
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  {twoFactorEnabled && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="text-blue-600" size={16} />
                        <span className="text-sm font-medium text-blue-800">2FA is now enabled</span>
                      </div>
                      <p className="text-xs text-blue-700">Use Google Authenticator to generate codes when signing in</p>
                    </div>
                  )}

                  {/* Google Authenticator Setup Flow */}
                  {show2FASetup && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Google Authenticator</h3>
                      
                      {/* Step 1: Download App */}
                      <div className="mb-6">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">Step 1: Download Google Authenticator</h4>
                        <p className="text-sm text-gray-800 mb-3">Download and install Google Authenticator on your mobile device:</p>
                        <div className="flex space-x-4">
                          <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium">
                            <Smartphone size={16} />
                            <span>Android</span>
                          </a>
                          <a href="https://apps.apple.com/app/google-authenticator/id388497605" 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium">
                            <Smartphone size={16} />
                            <span>iOS</span>
                          </a>
                        </div>
                      </div>

                      {/* Step 2: Scan QR Code */}
                      <div className="mb-6">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">Step 2: Scan QR Code</h4>
                        <p className="text-sm text-gray-800 mb-3">Open Google Authenticator and scan this QR code:</p>
                        <div className="flex items-center space-x-4">
                          <div className="p-4 bg-white rounded-lg border border-gray-200">
                            {qrCodeUrl ? (
                              <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                            ) : (
                              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-gray-500">Loading QR Code...</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 mb-2">Or manually enter this key:</p>
                            <div className="p-3 bg-white rounded border border-gray-200 font-mono text-sm break-all text-gray-900">
                              {secretKey}
                            </div>
                            <button 
                              onClick={() => copyToClipboard(secretKey, 'Secret key copied to clipboard!')}
                              className="mt-2 px-3 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                              Copy Key
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Verify Code */}
                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-gray-900 mb-2">Step 3: Verify Setup</h4>
                        <p className="text-sm text-gray-800 mb-3">Enter the 6-digit code from Google Authenticator:</p>
                        <div className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="123456"
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 text-center font-mono text-lg text-gray-900 bg-white transition-colors duration-200"
                            maxLength={6}
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              verify2FACode();
                            }}
                            disabled={verificationCode.length !== 6}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-all duration-200 text-sm font-medium"
                          >
                            Verify
                          </button>
                        </div>
                         <p className="text-sm text-gray-700 mt-2">
                           Enter the current 6-digit code from your Google Authenticator app. The code changes every 30 seconds.
                         </p>
                        {verificationCode && (
                          <p className="text-xs text-gray-500 mt-1">
                            Debug: Current code: &quot;<span className="font-mono">{verificationCode}</span>&quot; (Length: {verificationCode.length})
                          </p>
                        )}
                      </div>

                      {/* Error and Success Messages */}
                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertCircle size={16} className="text-red-600" />
                            <span className="text-sm text-red-700">{error}</span>
                          </div>
                        </div>
                      )}

                      {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle size={16} className="text-green-600" />
                            <span className="text-sm text-green-700">{success}</span>
                          </div>
                        </div>
                      )}

                      {/* Cancel Setup */}
                      <button
                        onClick={() => {
                          setShow2FASetup(false);
                          setVerificationCode('');
                          setError('');
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                      >
                        Cancel Setup
                      </button>
                    </div>
                  )}

                  {/* Backup Codes */}
                  {showBackupCodes && (
                    <div className="mt-6 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertCircle className="text-yellow-600" size={16} />
                        <h3 className="text-sm font-medium text-yellow-800">Save Your Backup Codes</h3>
                      </div>
                      <p className="text-xs text-yellow-700 mb-4">
                        These backup codes can be used to access your account if you lose your phone. 
                        Store them in a safe place.
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {backupCodes.map((code, index) => (
                          <div key={index} className="p-2 bg-white rounded border border-yellow-200 font-mono text-xs text-center">
                            {code}
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={copyBackupCodes}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                        >
                          Copy Codes
                        </button>
                        <button
                          onClick={() => setShowBackupCodes(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                        >
                          I&apos;ve Saved These
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center space-x-3">
                        <Shield className="text-green-600" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Zero Trust Authentication</p>
                          <p className="text-xs text-gray-500">Active and monitoring</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">Active</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="text-blue-600" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Device Trust</p>
                          <p className="text-xs text-gray-500">
                            {session.deviceTrusted ? 'Device is trusted' : 'New device detected'}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        session.deviceTrusted ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                      }`}>
                        {session.deviceTrusted ? 'Trusted' : 'New'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="flex items-center space-x-3">
                        <Mail className="text-purple-600" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Multi-Factor Authentication</p>
                          <p className="text-xs text-gray-500">
                            {twoFactorEnabled ? '2FA is enabled' : '2FA is disabled'}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        twoFactorEnabled ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'
                      }`}>
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Events */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h2>
                  <div className="space-y-3">
                    {securityEvents.map((event, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-full ${
                          event.status === 'success' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {event.type === 'login' && <CheckCircle size={16} className="text-green-600" />}
                          {event.type === 'device' && <Smartphone size={16} className="text-blue-600" />}
                          {event.type === 'password' && <Lock size={16} className="text-green-600" />}
                          {event.type === 'security' && <Shield size={16} className="text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{event.message}</p>
                          <p className="text-xs text-gray-500">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Trusted Devices</h2>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Plus size={16} />
                      <span>Add Device</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {mockDevices.map((device, index) => {
                      const Icon = device.icon;
                      return (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                              <Icon className="text-gray-600" size={24} />
                          <div>
                                <p className="text-sm font-medium text-gray-900">{device.name}</p>
                                <p className="text-xs text-gray-500">Last seen {device.lastSeen}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                              {device.trusted ? (
                            <>
                              <Shield className="text-green-600" size={16} />
                                  <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">Trusted</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="text-yellow-600" size={16} />
                                  <span className="text-xs text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full font-medium">New Device</span>
                            </>
                          )}
                        </div>
                      </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                            <div className="flex items-center space-x-2">
                              <MapPin size={12} />
                              <span>{device.location}</span>
                    </div>
                            <div className="flex items-center space-x-2">
                              <Globe2 size={12} />
                              <span>{device.ip}</span>
                  </div>
                            <div className="flex items-center space-x-2">
                              <Monitor size={12} />
                              <span>{device.os}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Globe size={12} />
                              <span>{device.browser}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Manage</button>
                            <button className="text-xs text-red-600 hover:text-red-700 font-medium">Remove</button>
                      </div>
                    </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                {/* Notification Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Mail size={20} className="text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                        <p className="text-xs text-gray-500">Receive security alerts via email</p>
                      </div>
                      </div>
                      <button 
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <PhoneIcon size={20} className="text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-xs text-gray-500">Receive security alerts via SMS</p>
                      </div>
                      </div>
                      <button 
                        onClick={() => setSmsNotifications(!smsNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
          </div>
        </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AccountPage;
