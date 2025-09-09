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
  User
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, session, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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

  const getRiskLevel = (score: number) => {
    if (score < 0.3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (score < 0.6) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score < 0.8) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const riskInfo = getRiskLevel(session.riskScore);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'sessions', label: 'Sessions', icon: Users },
    { id: 'devices', label: 'Devices', icon: Smartphone }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CapitalLeafLogo size="medium" showSubtitle={false} />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/account')}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <User size={20} />
                <span>{user.username}</span>
              </button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}!</h1>
          <p className="text-gray-600 mt-2">Here's your security overview</p>
        </div>

        {/* Risk Score Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Current Risk Score</h2>
              <p className="text-sm text-gray-600">Based on your current session</p>
            </div>
            <div className={`px-4 py-2 rounded-full ${riskInfo.bg}`}>
              <span className={`font-semibold ${riskInfo.color}`}>
                {riskInfo.level} Risk
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-4">
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
              <span className="text-sm font-medium text-gray-700">
                {(session.riskScore * 100).toFixed(1)}%
              </span>
            </div>
          </div>
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="text-green-600" size={24} />
                      <div>
                        <p className="text-sm font-medium text-green-800">Authentication</p>
                        <p className="text-xs text-green-600">Verified</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="text-blue-600" size={24} />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Zero Trust</p>
                        <p className="text-xs text-blue-600">Active</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="text-purple-600" size={24} />
                      <div>
                        <p className="text-sm font-medium text-purple-800">Monitoring</p>
                        <p className="text-xs text-purple-600">Real-time</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Info</h3>
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
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavioral Analysis</h3>
                    <div className={`p-4 rounded-lg ${session.behavioralAnomaly.detected ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <div className="flex items-center space-x-3">
                        {session.behavioralAnomaly.detected ? (
                          <AlertTriangle className="text-orange-600" size={24} />
                        ) : (
                          <CheckCircle className="text-green-600" size={24} />
                        )}
                        <div>
                          <p className={`font-medium ${session.behavioralAnomaly.detected ? 'text-orange-800' : 'text-green-800'}`}>
                            {session.behavioralAnomaly.detected ? 'Anomalies Detected' : 'Normal Behavior'}
                          </p>
                          <p className={`text-xs ${session.behavioralAnomaly.detected ? 'text-orange-600' : 'text-green-600'}`}>
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

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Recommendations</h3>
                    {session.recommendations.length > 0 ? (
                      <div className="space-y-2">
                        {session.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                            <AlertTriangle className="text-blue-600 mt-0.5" size={16} />
                            <span className="text-sm text-blue-800">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-green-50 rounded-lg">
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

            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg border">
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
                          <span className="text-xs text-green-600">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trusted Devices</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg border">
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
                              <span className="text-xs text-green-600">Trusted</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="text-yellow-600" size={16} />
                              <span className="text-xs text-yellow-600">New Device</span>
                            </>
                          )}
                        </div>
                      </div>
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

export default DashboardPage;
