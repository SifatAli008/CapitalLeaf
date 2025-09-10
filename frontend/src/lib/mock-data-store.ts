// Shared mock data store for demo purposes
interface Device {
  fingerprint: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  isTrusted: boolean;
  lastUsed: string;
  registeredAt: string;
  isActive: boolean;
}

interface User {
  id: string;
  deviceFingerprints: Device[];
  maxDevices: number;
  activeSessions: any[];
  mfaEnabled: boolean;
}

// Global mock data store
const mockUsers = new Map<string, User>();

export const getUserDevices = (userId: string): User => {
  if (!mockUsers.has(userId)) {
    // Start with no devices - users can add devices as needed
    mockUsers.set(userId, {
      id: userId,
      deviceFingerprints: [],
      maxDevices: 5, // Increased limit for better user experience
      activeSessions: [],
      mfaEnabled: false
    });
  }
  return mockUsers.get(userId)!;
};

export const addDeviceToUser = (userId: string, device: Device) => {
  const user = getUserDevices(userId);
  user.deviceFingerprints.push(device);
  return user;
};

export const removeDeviceFromUser = (userId: string, deviceFingerprint: string) => {
  const user = getUserDevices(userId);
  const deviceIndex = user.deviceFingerprints.findIndex(
    device => device.fingerprint === deviceFingerprint
  );
  
  if (deviceIndex !== -1) {
    user.deviceFingerprints[deviceIndex].isActive = false;
    // Also remove any active sessions for this device
    user.activeSessions = user.activeSessions.filter(
      session => session.deviceFingerprint !== deviceFingerprint
    );
  }
  return user;
};

export const updateDeviceInUser = (userId: string, deviceFingerprint: string, updates: Partial<Device>) => {
  const user = getUserDevices(userId);
  const device = user.deviceFingerprints.find(
    device => device.fingerprint === deviceFingerprint
  );
  
  if (device) {
    Object.assign(device, updates);
  }
  return user;
};

export const trustDeviceInUser = (userId: string, deviceFingerprint: string) => {
  const user = getUserDevices(userId);
  const device = user.deviceFingerprints.find(
    device => device.fingerprint === deviceFingerprint
  );
  
  if (device) {
    device.isTrusted = true;
    device.lastUsed = new Date().toISOString();
  }
  return user;
};

export const getDeviceType = (deviceInfo: any): 'desktop' | 'mobile' | 'tablet' | 'unknown' => {
  if (deviceInfo.isMobile) {
    return 'mobile';
  }
  if (deviceInfo.screenResolution?.includes('1024') || deviceInfo.screenResolution?.includes('768')) {
    return 'tablet';
  }
  return 'desktop';
};
