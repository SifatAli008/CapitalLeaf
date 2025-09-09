'use client';

import React, { useState } from 'react';
import { debugAddUser, getUsersWith2FA, hasUser2FAEnabled } from '@/lib/2fa-store';

const Debug2FAPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<string[]>([]);

  const handleAddUser = () => {
    if (username.trim()) {
      debugAddUser(username.trim());
      setUsers(getUsersWith2FA());
      setUsername('');
    }
  };

  const handleCheckUser = () => {
    if (username.trim()) {
      const has2FA = hasUser2FAEnabled(username.trim());
      alert(`User "${username.trim()}" has 2FA: ${has2FA}`);
    }
  };

  const refreshUsers = () => {
    setUsers(getUsersWith2FA());
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">2FA Debug Page</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add User to 2FA
            </button>
            
            <button
              onClick={handleCheckUser}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Check User 2FA Status
            </button>
            
            <button
              onClick={refreshUsers}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Refresh Users List
            </button>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Users with 2FA Enabled:</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600 mb-2">Current users: {users.length}</p>
              <ul className="list-disc list-inside space-y-1">
                {users.map((user, index) => (
                  <li key={index} className="text-sm text-gray-800">{user}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-semibold text-yellow-800 mb-2">Test Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
              <li>Add a user to 2FA list using the form above</li>
              <li>Go to login page and login with that username</li>
              <li>Should redirect to /verify-2fa page</li>
              <li>Enter any 6-digit code to complete login</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debug2FAPage;
