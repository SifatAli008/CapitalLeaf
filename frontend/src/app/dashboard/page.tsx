'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CapitalLeafLogo from '@/components/CapitalLeafLogo';
import { 
  Shield, 
  Activity, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Smartphone,
  Globe,
  Lock,
  LogOut,
  Settings,
  User,
  TrendingUp,
  CreditCard,
  BarChart3,
  Eye,
  EyeOff,
  Bell,
  Search,
  Menu,
  X,
  ArrowRight,
  Zap,
  Target,
  Database,
  Network,
  Moon,
  Sun,
  RefreshCw,
  Download,
  Upload,
  Calendar,
  MapPin,
  Globe2,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Signal,
  AlertCircle,
  Info,
  ExternalLink,
  Plus,
  Minus,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Share,
  Bookmark,
  Star,
  Heart,
  ThumbsUp,
  MessageCircle,
  Phone,
  Mail,
  Camera,
  Image,
  File,
  Folder,
  Archive,
  Tag,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  Calculator,
  PieChart,
  LineChart,
  TrendingDown,
  MinusCircle,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock3,
  Timer,
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarRange,
  CalendarSearch,
  CalendarHeart,
  CalendarClock
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, session, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRiskDetails, setShowRiskDetails] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your secure dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getRiskLevel = (score: number) => {
    if (score < 0.3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
    if (score < 0.6) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
    if (score < 0.8) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' };
    return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
  };

  const riskInfo = getRiskLevel(session.riskScore);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'text-blue-600' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-green-600' },
    { id: 'monitoring', label: 'Monitoring', icon: Activity, color: 'text-purple-600' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'text-indigo-600' },
    { id: 'devices', label: 'Devices', icon: Smartphone, color: 'text-orange-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' }
  ];

  const quickStats = [
    { 
      label: 'Security Score', 
      value: '98%', 
      icon: Shield, 
      color: 'text-green-600', 
      bg: 'bg-green-50'
    },
    { 
      label: 'Active Sessions', 
      value: '1', 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50'
    },
    { 
      label: 'Trusted Devices', 
      value: '3', 
      icon: Smartphone, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50'
    },
    { 
      label: 'Risk Level', 
      value: riskInfo.level, 
      icon: Target, 
      color: riskInfo.color, 
      bg: riskInfo.bg
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <CapitalLeafLogo size="small" showSubtitle={false} />
          <button
            onClick={() => router.push('/account')}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <User size={24} />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
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

            {/* Logout */}
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
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
                <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.username}</p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Refresh Button */}
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                </button>

                {/* Account Button */}
                <button
                  onClick={() => router.push('/account')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <User size={20} />
                  <span>Account</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className={`${stat.bg} p-6 rounded-xl border border-gray-200`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                          </div>
                          <Icon size={32} className={stat.color} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Risk Assessment Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Risk Assessment</h2>
                    <button
                      onClick={() => setShowRiskDetails(!showRiskDetails)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <span className="text-sm font-medium">Details</span>
                      {showRiskDetails ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            session.riskScore < 0.3 ? 'bg-green-500' :
                            session.riskScore < 0.6 ? 'bg-yellow-500' :
                            session.riskScore < 0.8 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${session.riskScore * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${riskInfo.bg} border ${riskInfo.border}`}>
                      <span className={`text-sm font-semibold ${riskInfo.color}`}>
                        {(session.riskScore * 100).toFixed(1)}% - {riskInfo.level}
                      </span>
                    </div>
                  </div>

                  {showRiskDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Risk Factors</h3>
                        <div className="space-y-3">
                          {Object.entries(session.riskFactors).map(([factor, score]) => (
                            <div key={factor} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 capitalize">
                                {factor.replace(/([A-Z])/g, ' $1')}
                              </span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${score * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 w-8">
                                  {(score * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Session Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Session ID</span>
                            <span className="text-xs text-gray-500 font-mono">
                              {session.sessionId.slice(0, 12)}...
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Started</span>
                            <span className="text-xs text-gray-500">
                              {new Date(session.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Device Trusted</span>
                            <span className={`text-xs ${session.deviceTrusted ? 'text-green-600' : 'text-yellow-600'}`}>
                              {session.deviceTrusted ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">MFA Required</span>
                            <span className={`text-xs ${session.requiresMFA ? 'text-orange-600' : 'text-green-600'}`}>
                              {session.requiresMFA ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <CheckCircle className="text-green-600" size={24} />
                      <div>
                        <p className="font-semibold text-green-800">Authentication</p>
                        <p className="text-sm text-green-600">Verified & Secure</p>
                      </div>
                    </div>
                    <p className="text-xs text-green-700">Your account is protected with enterprise-grade security</p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Shield className="text-blue-600" size={24} />
                      <div>
                        <p className="font-semibold text-blue-800">Zero Trust</p>
                        <p className="text-sm text-blue-600">Active Protection</p>
                      </div>
                    </div>
                    <p className="text-xs text-blue-700">Continuous verification and threat monitoring enabled</p>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Activity className="text-purple-600" size={24} />
                      <div>
                        <p className="font-semibold text-purple-800">Monitoring</p>
                        <p className="text-sm text-purple-600">Real-time Analysis</p>
                      </div>
                    </div>
                    <p className="text-xs text-purple-700">AI-powered behavioral analysis and anomaly detection</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavioral Analysis</h3>
                    <div className={`p-4 rounded-xl ${session.behavioralAnomaly.detected ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
                      <div className="flex items-center space-x-3">
                        {session.behavioralAnomaly.detected ? (
                          <AlertTriangle className="text-orange-600" size={24} />
                        ) : (
                          <CheckCircle className="text-green-600" size={24} />
                        )}
                        <div>
                          <p className={`font-semibold ${session.behavioralAnomaly.detected ? 'text-orange-800' : 'text-green-800'}`}>
                            {session.behavioralAnomaly.detected ? 'Anomalies Detected' : 'Normal Behavior'}
                          </p>
                          <p className={`text-sm ${session.behavioralAnomaly.detected ? 'text-orange-600' : 'text-green-600'}`}>
                            Confidence: {(session.behavioralAnomaly.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      {session.behavioralAnomaly.detected && session.behavioralAnomaly.anomalies.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-orange-700">Detected anomalies:</p>
                          <ul className="text-xs text-orange-600 mt-1 space-y-1">
                            {session.behavioralAnomaly.anomalies.map((anomaly, index) => (
                              <li key={index}>• {anomaly.replace(/_/g, ' ')}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Recommendations</h3>
                    {session.recommendations.length > 0 ? (
                      <div className="space-y-3">
                        {session.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <AlertTriangle className="text-blue-600 mt-0.5" size={16} />
                            <span className="text-sm text-blue-800">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="text-green-600" size={20} />
                          <span className="text-sm text-green-800">No security recommendations at this time</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'monitoring' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="text-gray-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Current Session</p>
                            <p className="text-xs text-gray-500">
                              Started {new Date(session.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Logins</p>
                        <p className="text-2xl font-bold text-blue-800">1,247</p>
                      </div>
                      <BarChart3 size={32} className="text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-green-600">Security Events</p>
                        <p className="text-2xl font-bold text-green-800">23</p>
                      </div>
                      <Shield size={32} className="text-green-600" />
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Risk Score</p>
                        <p className="text-2xl font-bold text-purple-800">2.3</p>
                      </div>
                      <Target size={32} className="text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Activity</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <LineChart size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Login trends chart</p>
                        <p className="text-sm text-gray-500">Visual representation of login patterns</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Events</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <PieChart size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Security events breakdown</p>
                        <p className="text-sm text-gray-500">Distribution of security incidents</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trusted Devices</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="text-gray-600" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Current Device</p>
                            <p className="text-xs text-gray-500">
                              {session.deviceTrusted ? 'Trusted' : 'Not Trusted'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {session.deviceTrusted ? (
                            <>
                              <Lock className="text-green-600" size={16} />
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">Trusted</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="text-yellow-600" size={16} />
                              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full font-medium">New Device</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                  <div className="text-center py-12">
                    <Settings size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Settings panel coming soon</p>
                    <p className="text-sm text-gray-500 mt-2">Account preferences and configuration options will be available here</p>
                    <button
                      onClick={() => router.push('/account')}
                      className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>Go to Account</span>
                      <ArrowRight size={16} />
                    </button>
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

export default DashboardPage;
