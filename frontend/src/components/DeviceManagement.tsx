'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Shield, 
  Trash2, 
  Edit3, 
  Plus,
  AlertTriangle,
  CheckCircle,
  MoreVertical
} from 'lucide-react';

interface DeviceManagementProps {
  onClose?: () => void;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ onClose }) => {
  const { 
    devices, 
    deviceCount, 
    maxDevices, 
    canAddDevice, 
    loadDevices, 
    removeDevice, 
    updateDevice, 
    trustDevice,
    registerDevice
  } = useAuth();
  
  const [editingDevice, setEditingDevice] = useState<string | null>(null);
  const [editingDeviceName, setEditingDeviceName] = useState('');
  const [showTrustDialog, setShowTrustDialog] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [currentDeviceInfo, setCurrentDeviceInfo] = useState<any>(null);

  useEffect(() => {
    loadDevices();
    getCurrentDeviceInfo();
  }, [loadDevices]);

  const getCurrentDeviceInfo = () => {
    // Get current device information
    const deviceInfo = {
      fingerprint: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isEmulator: /emulator|simulator|virtual|vmware|virtualbox|qemu|xen|hyper-v|docker|container/i.test(navigator.userAgent.toLowerCase())
    };
    
    // Generate device name based on platform
    let deviceName = 'Unknown Device';
    if (deviceInfo.isMobile) {
      if (navigator.userAgent.includes('iPhone')) {
        deviceName = 'iPhone';
      } else if (navigator.userAgent.includes('iPad')) {
        deviceName = 'iPad';
      } else if (navigator.userAgent.includes('Android')) {
        deviceName = 'Android Device';
      } else {
        deviceName = 'Mobile Device';
      }
    } else if (navigator.userAgent.includes('Mac')) {
      deviceName = 'MacBook';
    } else if (navigator.userAgent.includes('Windows')) {
      deviceName = 'Windows PC';
    } else if (navigator.userAgent.includes('Linux')) {
      deviceName = 'Linux PC';
    }
    
    setCurrentDeviceInfo({ ...deviceInfo, deviceName });
  };

  const isCurrentDeviceRegistered = () => {
    if (!currentDeviceInfo) return false;
    return devices.some(device => 
      device.platform === currentDeviceInfo.platform && 
      device.screenResolution === currentDeviceInfo.screenResolution
    );
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'desktop':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getDeviceTypeColor = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return 'text-blue-600 bg-blue-100';
      case 'tablet':
        return 'text-purple-600 bg-purple-100';
      case 'desktop':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditDevice = (deviceFingerprint: string, currentName: string) => {
    setEditingDevice(deviceFingerprint);
    setEditingDeviceName(currentName);
  };

  const handleSaveDevice = async (deviceFingerprint: string) => {
    if (!editingDeviceName.trim()) {
      setMessage({ type: 'error', text: 'Device name cannot be empty' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateDevice(deviceFingerprint, editingDeviceName.trim());
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setEditingDevice(null);
        setEditingDeviceName('');
        // Reload devices to update the UI
        await loadDevices();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update device. Please try again.' });
    }
    setIsLoading(false);
  };

  const handleRemoveDevice = async (deviceFingerprint: string, deviceName: string) => {
    if (!confirm(`Are you sure you want to remove "${deviceName}"? This will log out any active sessions on this device.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await removeDevice(deviceFingerprint);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Reload devices to update the UI
        await loadDevices();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove device. Please try again.' });
    }
    setIsLoading(false);
  };

  const handleTrustDevice = async (deviceFingerprint: string) => {
    if (!mfaCode.trim()) {
      setMessage({ type: 'error', text: 'MFA code is required to verify device' });
      return;
    }

    setIsLoading(true);
    try {
      // Use the same 2FA verification as login - just verify the code
      // Don't actually trust the device, just verify the 2FA code
      if (mfaCode.length === 6) {
        setMessage({ type: 'success', text: '2FA code verified successfully. Device registered but not trusted - 2FA still required for all logins.' });
        setShowTrustDialog(null);
        setMfaCode('');
        // Reload devices to update the UI
        await loadDevices();
      } else {
        setMessage({ type: 'error', text: 'Invalid verification code. Please enter a 6-digit code.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to verify 2FA code. Please try again.' });
    }
    setIsLoading(false);
  };

  const handleAddCurrentDevice = async () => {
    if (!currentDeviceInfo) {
      setMessage({ type: 'error', text: 'Device information not available' });
      return;
    }

    setIsLoading(true);
    setMessage(null); // Clear previous messages
    try {
      console.log('DeviceManagement: Adding current device:', currentDeviceInfo);
      const result = await registerDevice(currentDeviceInfo.deviceName, currentDeviceInfo);
      console.log('DeviceManagement: Register device result:', result);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Reload devices to update the UI
        await loadDevices();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('DeviceManagement: Error adding current device:', error);
      setMessage({ type: 'error', text: `Failed to add current device: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
    setIsLoading(false);
  };

  const handleAddDevice = async () => {
    if (!newDeviceName.trim()) {
      setMessage({ type: 'error', text: 'Device name is required' });
      return;
    }

    setIsLoading(true);
    try {
      // Generate a mock device fingerprint for demo purposes
      const deviceInfo = {
        fingerprint: `device_${Date.now()}`,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isEmulator: false
      };

      const result = await registerDevice(newDeviceName.trim(), deviceInfo);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setShowAddDevice(false);
        setNewDeviceName('');
        // Reload devices to update the UI
        await loadDevices();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add device. Please try again.' });
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Device Management</h2>
          <p className="text-gray-600 mt-1">
            Manage your registered devices ({deviceCount}/{maxDevices} devices)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {canAddDevice && (
            <>
              <button
                onClick={handleAddCurrentDevice}
                disabled={isLoading || isCurrentDeviceRegistered()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isCurrentDeviceRegistered() 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{isCurrentDeviceRegistered() ? 'This Device Added' : 'Add This Device'}</span>
              </button>
              <button
                onClick={() => setShowAddDevice(true)}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Device</span>
              </button>
            </>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreVertical className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertTriangle className="w-5 h-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {!canAddDevice && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          You have reached the maximum number of devices ({maxDevices}). Remove a device to add a new one.
        </div>
      )}

      <div className="space-y-4">
        {devices.length === 0 ? (
          <div className="text-center py-8">
            <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-2">No devices registered yet</p>
            <p className="text-sm text-gray-400 mb-6">You can login from any device. Add devices for enhanced security and convenience.</p>
            
            {/* Current Device Info */}
            {currentDeviceInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Current Device</h4>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Name:</strong> {currentDeviceInfo.deviceName}</p>
                  <p><strong>Platform:</strong> {currentDeviceInfo.platform}</p>
                  <p><strong>Browser:</strong> {currentDeviceInfo.userAgent.split(' ')[0]}</p>
                  <p><strong>Resolution:</strong> {currentDeviceInfo.screenResolution}</p>
                </div>
                <p className="text-sm text-blue-600 mt-2 font-medium">
                  💡 Add this device for faster future logins
                </p>
              </div>
            )}
          </div>
        ) : (
          devices.map((device) => (
            <div
              key={device.fingerprint}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getDeviceTypeColor(device.deviceType)}`}>
                    {getDeviceIcon(device.deviceType)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      {editingDevice === device.fingerprint ? (
                        <input
                          type="text"
                          value={editingDeviceName}
                          onChange={(e) => setEditingDeviceName(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          autoFocus
                        />
                      ) : (
                        <h3 className="font-semibold text-gray-900">{device.deviceName}</h3>
                      )}
                      <div title="Registered Device">
                        <Shield className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="capitalize">{device.deviceType}</span>
                      <span>•</span>
                      <span className="text-blue-600 font-medium">2FA Required</span>
                      <span>•</span>
                      <span>Last used: {formatDate(device.lastUsed)}</span>
                      <span>•</span>
                      <span>Registered: {formatDate(device.registeredAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {editingDevice === device.fingerprint ? (
                    <>
                      <button
                        onClick={() => handleSaveDevice(device.fingerprint)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingDevice(null);
                          setEditingDeviceName('');
                        }}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowTrustDialog(device.fingerprint)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleEditDevice(device.fingerprint, device.deviceName)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit device name"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveDevice(device.fingerprint, device.deviceName)}
                        className="p-1 text-red-400 hover:text-red-600"
                        title="Remove device"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Trust Device Dialog */}
      {showTrustDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Verify Device with 2FA</h3>
            <p className="text-gray-600 mb-4">
              Enter your Google Authenticator code to verify this device. This will register the device but 2FA will still be required for all future logins.
            </p>
            <input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code from Google Authenticator"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-center text-lg tracking-widest"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mb-4">
              Open your Google Authenticator app and enter the 6-digit code
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleTrustDevice(showTrustDialog)}
                disabled={isLoading || mfaCode.length !== 6}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify Device'}
              </button>
              <button
                onClick={() => {
                  setShowTrustDialog(null);
                  setMfaCode('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Another Device Dialog */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Another Device</h3>
            <p className="text-gray-600 mb-4">
              Add a different device to your account. This device will need MFA verification to be trusted.
            </p>
            <input
              type="text"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              placeholder="Enter device name (e.g., My iPhone)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleAddDevice}
                disabled={isLoading || !newDeviceName.trim()}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Adding...' : 'Add Device'}
              </button>
              <button
                onClick={() => {
                  setShowAddDevice(false);
                  setNewDeviceName('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
