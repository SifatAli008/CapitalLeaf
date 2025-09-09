'use client';

import React, { useState } from 'react';
import { getUsersWith2FA, hasUser2FAEnabled, addUserTo2FA } from '@/lib/2fa-store';

const Force2FAPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [result, setResult] = useState('');

  const refreshUsers = () => {
    setUsers(getUsersWith2FA());
  };

  const forceEnable2FA = () => {
    if (username.trim()) {
      addUserTo2FA(username.trim());
      refreshUsers();
      setResult(`✅ FORCED 2FA enabled for "${username.trim()}"`);
    }
  };

  const testLogin = async () => {
    if (!username.trim()) {
      setResult('❌ Please enter a username');
      return;
    }

    const testUsername = username.trim();
    const has2FA = hasUser2FAEnabled(testUsername);
    
    // Simulate login API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: testUsername,
        password: 'test123',
        userContext: {
          userId: testUsername,
          timestamp: new Date().toISOString(),
          deviceFingerprint: 'test_fingerprint',
          deviceInfo: { isMobile: false, isEmulator: false },
          browserInfo: {
            userAgent: 'test',
            language: 'en',
            platform: 'test'
          },
          screenInfo: {
            resolution: '1920x1080',
            pixelRatio: 1
          }
        }
      })
    });

    const data = await response.json();
    
    setResult(`
🔍 LOGIN TEST RESULTS:
Username: ${testUsername}
Has 2FA: ${has2FA}
API Response Success: ${data.success}
Requires MFA: ${data.session?.requiresMFA}
Should Redirect To: ${data.session?.requiresMFA ? '/verify-2fa' : '/dashboard'}

Full Response:
${JSON.stringify(data, null, 2)}
    `);
  };

  React.useEffect(() => {
    refreshUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-red-800">🚨 FORCE 2FA DEBUG PAGE</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Force 2FA */}
          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
            <h2 className="text-lg font-semibold mb-3 text-red-800">🚨 FORCE 2FA ENABLE</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter username to FORCE enable 2FA"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={forceEnable2FA}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-bold"
                >
                  🚨 FORCE ENABLE 2FA
                </button>
                <button
                  onClick={testLogin}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Test Login
                </button>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <h2 className="text-lg font-semibold mb-3 text-green-800">✅ Users with 2FA</h2>
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
                    <li key={index} className="text-gray-700 font-mono">{user}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">🔍 Test Results:</h3>
            <pre className="text-sm text-yellow-700 whitespace-pre-wrap font-mono">{result}</pre>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">📋 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
            <li><strong>Enter your exact login username</strong> in the input field</li>
            <li><strong>Click "FORCE ENABLE 2FA"</strong> to add your username to the 2FA list</li>
            <li><strong>Click "Test Login"</strong> to simulate the login API call</li>
            <li><strong>Check the results</strong> - "Requires MFA" should be true</li>
            <li><strong>Go to login page</strong> and try logging in with that username</li>
            <li><strong>Should redirect to /verify-2fa</strong> page</li>
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
          <a
            href="/test-2fa"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Test 2FA
          </a>
        </div>
      </div>
    </div>
  );
};

export default Force2FAPage;
