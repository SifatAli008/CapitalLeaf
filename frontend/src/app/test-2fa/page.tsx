'use client';

import React, { useState } from 'react';
import { getUsersWith2FA, hasUser2FAEnabled, addUserTo2FA } from '@/lib/2fa-store';

const Test2FAPage: React.FC = () => {
  const [testUsername, setTestUsername] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [testResult, setTestResult] = useState('');

  const refreshUsers = () => {
    setUsers(getUsersWith2FA());
  };

  const testLogin = async () => {
    if (!testUsername.trim()) {
      setTestResult('Please enter a username');
      return;
    }

    const username = testUsername.trim();
    const has2FA = hasUser2FAEnabled(username);
    
    // Simulate the login API call
    const mockSession = {
      sessionId: `session_${username}_${Date.now()}`,
      riskScore: 0.3,
      timestamp: new Date().toISOString(),
      requiresMFA: has2FA,
      mfaMethods: has2FA ? ['google_authenticator'] : [],
      deviceTrusted: false,
      behavioralAnomaly: { detected: false, anomalies: [], confidence: 0 },
      riskFactors: {
        device: 0.1,
        location: 0.1,
        transaction: 0.0,
        time: 0.1,
        network: 0.0,
        velocity: 0.0
      },
      recommendations: []
    };

    const result = {
      success: true,
      user: { 
        id: username, 
        username,
        email: username.includes('@') ? username : `${username}@example.com`
      },
      session: mockSession,
      message: 'Authentication successful'
    };

    setTestResult(`
Login Test Results:
- Username: ${username}
- Has 2FA: ${has2FA}
- Requires MFA: ${mockSession.requiresMFA}
- Should redirect to: ${has2FA ? '/verify-2fa' : '/dashboard'}
- API Response: ${JSON.stringify(result, null, 2)}
    `);
  };

  const addUser = () => {
    if (testUsername.trim()) {
      addUserTo2FA(testUsername.trim());
      refreshUsers();
      setTestResult(`Added "${testUsername.trim()}" to 2FA list`);
    }
  };

  React.useEffect(() => {
    refreshUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">2FA Login Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Input */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 text-blue-800">Test Login Flow</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={testUsername}
                  onChange={(e) => setTestUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username to test"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={testLogin}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Test Login
                </button>
                <button
                  onClick={addUser}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add to 2FA
                </button>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 text-green-800">Users with 2FA</h2>
            <div className="space-y-2">
              <button
                onClick={refreshUsers}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Refresh
              </button>
              <div className="text-sm">
                <p><strong>Total:</strong> {users.length}</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {users.map((user, index) => (
                    <li key={index} className="text-gray-700">{user}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Test Results:</h3>
            <pre className="text-sm text-yellow-700 whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Enter the exact username you use to login</li>
            <li>Click "Add to 2FA" to enable 2FA for that username</li>
            <li>Click "Test Login" to see what the login API would return</li>
            <li>Check if "Requires MFA" is true and "Should redirect to" shows /verify-2fa</li>
            <li>If not, there's a username mismatch issue</li>
          </ol>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex space-x-4">
          <a
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </a>
          <a
            href="/debug-login"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Debug Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Test2FAPage;
