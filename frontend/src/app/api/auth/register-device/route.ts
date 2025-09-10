import { NextRequest, NextResponse } from 'next/server';
import { getUserDevices, addDeviceToUser, getDeviceType } from '@/lib/mock-data-store';

interface DeviceInfo {
  fingerprint: string;
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  isMobile: boolean;
  isEmulator: boolean;
}

interface DeviceRegistrationRequest {
  sessionId: string;
  deviceName: string;
  deviceInfo: DeviceInfo;
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Register Device API: Request received');
    const body = await request.json();
    console.log('Register Device API: Request body:', JSON.stringify(body, null, 2));
    
    const { deviceName, deviceInfo, userId }: DeviceRegistrationRequest = body;

    if (!deviceName || !deviceInfo?.fingerprint) {
      console.log('Register Device API: Missing required fields');
      return NextResponse.json(
        { success: false, message: 'Device name and device fingerprint are required' },
        { status: 400 }
      );
    }

    // For demo purposes, use a mock user ID if not provided
    const demoUserId = userId || 'demo_user';
    const user = getUserDevices(demoUserId);
    
    // Check if device is already registered
    const existingDevice = user.deviceFingerprints.find(
      (device: any) => device.fingerprint === deviceInfo.fingerprint
    );

    if (existingDevice) {
      // Update existing device
      existingDevice.lastUsed = new Date().toISOString();
      existingDevice.deviceName = deviceName;
      existingDevice.isActive = true;
      
      return NextResponse.json({
        success: true,
        message: 'Device updated successfully',
        device: {
          id: existingDevice.fingerprint,
          name: deviceName,
          fingerprint: deviceInfo.fingerprint,
          deviceType: existingDevice.deviceType,
          isTrusted: existingDevice.isTrusted,
          lastUsed: existingDevice.lastUsed,
          registeredAt: existingDevice.registeredAt
        },
        isNewDevice: false
      });
    }

    // Check device limit
    const activeDevices = user.deviceFingerprints.filter((device: any) => device.isActive);
    if (activeDevices.length >= user.maxDevices) {
      // Invalidate oldest device's sessions to make room for new device
      const oldestDevice = activeDevices.reduce((oldest: any, current: any) => 
        new Date(current.lastUsed) < new Date(oldest.lastUsed) ? current : oldest
      );
      
      // Remove oldest device
      const deviceIndex = user.deviceFingerprints.findIndex(
        (device: any) => device.fingerprint === oldestDevice.fingerprint
      );
      if (deviceIndex !== -1) {
        user.deviceFingerprints[deviceIndex].isActive = false;
        // Remove sessions for the oldest device
        user.activeSessions = user.activeSessions.filter(
          (session: any) => session.deviceFingerprint !== oldestDevice.fingerprint
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Device limit exceeded. The oldest device "${oldestDevice.deviceName}" has been removed to make room for this new device.`,
          errorCode: 'DEVICE_LIMIT_EXCEEDED',
          activeDevices: activeDevices.length - 1,
          maxDevices: user.maxDevices,
          removedDevice: {
            name: oldestDevice.deviceName,
            fingerprint: oldestDevice.fingerprint
          }
        },
        { status: 400 }
      );
    }

    // Register new device
    const deviceType = getDeviceType(deviceInfo);
    const newDevice = {
      fingerprint: deviceInfo.fingerprint,
      deviceName,
      deviceType,
      isTrusted: false, // New devices require MFA to be trusted
      lastUsed: new Date().toISOString(),
      registeredAt: new Date().toISOString(),
      isActive: true
    };

    addDeviceToUser(demoUserId, newDevice);

    return NextResponse.json({
      success: true,
      message: 'Device registered successfully. MFA verification required to trust this device.',
      device: {
        id: newDevice.fingerprint,
        name: deviceName,
        fingerprint: deviceInfo.fingerprint,
        deviceType: newDevice.deviceType,
        isTrusted: newDevice.isTrusted,
        lastUsed: newDevice.lastUsed,
        registeredAt: newDevice.registeredAt
      },
      isNewDevice: true,
      requiresMFA: true
    });

  } catch (error) {
    console.error('Device registration error:', error);
    return NextResponse.json(
      { success: false, message: `Device registration failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
