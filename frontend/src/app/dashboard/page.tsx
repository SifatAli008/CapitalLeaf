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
  Smartphone,
  Lock,
  LogOut,
  Settings,
  User,
  BarChart3,
  Eye,
  EyeOff,
  TrendingUp,
  Menu,
  X,
  ArrowRight,
  RefreshCw,
  Target,
  PieChart,
  Bell,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  Globe,
  Database,
  Key,
  Cpu,
  Zap
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
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

  const refreshData = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const securityMetrics = [
    {
      title: 'Security Score',
      value: '98.7%',
      change: '+2.3%',
      trend: 'up',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Active Sessions',
      value: '3',
      change: 'Stable',
      trend: 'stable',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Threats Blocked',
      value: '47',
      change: '+12 today',
      trend: 'up',
      icon: Target,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Uptime',
      value: '99.9%',
      change: 'Last 30 days',
      trend: 'stable',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'login',
      description: 'Successful login from Chrome on Windows',
      time: '2 minutes ago',
      status: 'success',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'security',
      description: '2FA verification completed',
      time: '5 minutes ago',
      status: 'success',
      icon: Shield
    },
    {
      id: 3,
      type: 'threat',
      description: 'Suspicious activity blocked',
      time: '1 hour ago',
      status: 'warning',
      icon: AlertTriangle
    },
    {
      id: 4,
      type: 'system',
      description: 'Security scan completed',
      time: '2 hours ago',
      status: 'info',
      icon: Cpu
    }
  ];

  const quickActions = [
    {
      title: 'Security Scan',
      description: 'Run comprehensive security check',
      icon: Shield,
      color: 'bg-blue-500',
      action: () => console.log('Security scan')
    },
    {
      title: 'View Reports',
      description: 'Access security analytics',
      icon: BarChart3,
      color: 'bg-green-500',
      action: () => console.log('View reports')
    },
    {
      title: 'Manage Users',
      description: 'User access management',
      icon: Users,
      color: 'bg-purple-500',
      action: () => console.log('Manage users')
    },
    {
      title: 'Settings',
      description: 'Configure security settings',
      icon: Settings,
      color: 'bg-orange-500',
      action: () => setActiveTab('settings')
    }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>
              <CapitalLeafLogo variant="default" size="lg" animated={true} />
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 lg:hidden">
            <CapitalLeafLogo variant="default" size="md" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
                  <p className="text-gray-600 mt-2">Monitor and manage your security posture</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={refreshData}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Security Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {securityMetrics.map((metric, index) => (
                <div key={index} className={`${metric.bgColor} ${metric.borderColor} border rounded-2xl p-6 hover:shadow-lg transition-all duration-200`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${metric.color} bg-white/50`}>
                      <metric.icon size={24} />
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${metric.color}`}>
                        {metric.change}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.title}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`p-2 rounded-lg ${
                          activity.status === 'success' ? 'bg-green-100 text-green-600' :
                          activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <activity.icon size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="space-y-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className={`p-3 rounded-xl ${action.color} text-white`}>
                          <action.icon size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{action.title}</div>
                          <div className="text-sm text-gray-600">{action.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Overview Chart */}
            <div className="mt-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Security Overview</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                      <Filter size={16} />
                    </button>
                    <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                      <Calendar size={16} />
                    </button>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Security trends chart</p>
                    <p className="text-sm text-gray-500">Visual representation of security metrics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;