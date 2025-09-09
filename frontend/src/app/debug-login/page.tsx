'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUsersWith2FA, hasUser2FAEnabled } from '@/lib/2fa-store';

const DebugLoginPage: React.FC = () => {
  const { user, session, isAuthenticated, requires2FA, pendingUser } = useAuth();
  const [testUsername, setTestUsername] = useState('');
  const [users, setUsers] = useState<string[]>([]);

  const refreshUsers = () => {
    setUsers(getUsersWith2FA());
  };

  const checkUser = () => {
    if (testUsername.trim()) {
      const has2FA = hasUser2FAEnabled(testUsername.trim());
      alert(`User "${testUsername.trim()}" has 2FA: ${has2FA}`);
    }
  };

  React.useEffect(() => {
    refreshUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Login Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Auth State */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 text-blue-800">Current Auth State</h2>
            <div className="space-y-2 text-sm">
              <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
              <p><strong>requires2FA:</strong> {requires2FA ? 'true' : 'false'}</p>
              <p><strong>user:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
              <p><strong>session:</strong> {session ? JSON.stringify(session, null, 2) : 'null'}</p>
              <p><strong>pendingUser:</strong> {pendingUser ? JSON.stringify(pendingUser, null, 2) : 'null'}</p>
            </div>
          </div>

          {/* 2FA Users List */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 text-green-800">Users with 2FA Enabled</h2>
            <div className="space-y-2">
              <button
                onClick={refreshUsers}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Refresh List
              </button>
              <div className="text-sm">
                <p><strong>Total users:</strong> {users.length}</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {users.map((user, index) => (
                    <li key={index} className="text-gray-700">{user}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Test Section */}
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-yellow-800">Test 2FA Status</h2>
          <div className="flex space-x-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter username to test"
              />
            </div>
            <button
              onClick={checkUser}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Check 2FA Status
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Debug Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Check the "Current Auth State" section to see your current login status</li>
            <li>Check the "Users with 2FA Enabled" list to see if your username is there</li>
            <li>If your username is not in the list, go to Account Settings and enable 2FA</li>
            <li>After enabling 2FA, refresh this page to see if your username appears</li>
            <li>Try logging in with the exact same username that appears in the 2FA list</li>
            <li>Check browser console for detailed debug logs</li>
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
            href="/account"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Go to Account Settings
          </a>
          <a
            href="/debug-2fa"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Go to 2FA Debug
          </a>
        </div>
      </div>
    </div>
  );
};

export default DebugLoginPage;
