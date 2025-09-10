import { NextRequest, NextResponse } from 'next/server';
import { hasUser2FAEnabled, getUsersWith2FA } from '@/lib/2fa-store';
import { getUserDevices, addDeviceToUser } from '@/lib/mock-data-store';

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

interface LoginRequest {
  username: string;
  password: string;
  userContext?: DeviceInfo;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Login API: Request received');
    
    let body;
    try {
      body = await request.json();
      console.log('Login API: Request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Login API: JSON parse error:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { username, password, userContext }: LoginRequest = body;

    if (!username || !password) {
      console.log('Login API: Missing username or password');
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // In a real application, you would validate credentials against a database
    // For demo purposes, we'll accept any credentials
    
    // Get user device data
    const user = getUserDevices(username);
    const deviceFingerprint = userContext?.fingerprint;
    // const deviceName = userContext ? `${userContext.platform} - ${userContext.userAgent.split(' ')[0]}` : 'Unknown Device';
    
    // Check device registration and limits
    let deviceTrusted = false;
    let requiresDeviceRegistration = false;
    let deviceLimitExceeded = false;
    
    if (deviceFingerprint) {
      const existingDevice = user.deviceFingerprints.find(
        (device: any) => device.fingerprint === deviceFingerprint && device.isActive
      );
      
      if (existingDevice) {
        deviceTrusted = existingDevice.isTrusted;
        // Update last used time
        existingDevice.lastUsed = new Date().toISOString();
      } else {
        // New device - check if we can register it
        const activeDevices = user.deviceFingerprints.filter((device: any) => device.isActive);
        
        // If user has no devices yet, allow registration without limit check
        if (activeDevices.length === 0) {
          requiresDeviceRegistration = true;
        } else if (activeDevices.length >= user.maxDevices) {
          deviceLimitExceeded = true;
        } else {
          requiresDeviceRegistration = true;
        }
      }
    }
    
    // Check if user has 2FA enabled (in real app, this would come from database)
    // For demo: check the shared 2FA store
    const userHas2FAEnabled = hasUser2FAEnabled(username);
    console.log(`Login API: Checking 2FA for user "${username}" - Enabled: ${userHas2FAEnabled}`);
    console.log('Login API: All users with 2FA enabled:', getUsersWith2FA());
    console.log(`Login API: Username normalization test - original: "${username}", lowercase: "${username.toLowerCase()}"`);
    
    // Handle device limit exceeded - but allow login if user has no devices yet
    if (deviceLimitExceeded) {
      const activeDevices = user.deviceFingerprints.filter((device: any) => device.isActive);
      if (activeDevices.length > 0) {
        return NextResponse.json({
          success: false,
          message: `Device limit exceeded. Maximum ${user.maxDevices} devices allowed. Please remove an existing device first.`,
          errorCode: 'DEVICE_LIMIT_EXCEEDED',
          activeDevices: activeDevices.length,
          maxDevices: user.maxDevices
        }, { status: 400 });
      }
      // If no active devices, allow registration
      requiresDeviceRegistration = true;
      deviceLimitExceeded = false;
    }
    
    // CRITICAL: ALWAYS REQUIRE 2FA - NO BYPASSING ALLOWED FOR ANY USER
    console.log(`🚨 Login API: ALWAYS REQUIRING 2FA verification - NO BYPASS ALLOWED`);
    // Return immediately with 2FA required - don't proceed to normal login
    return NextResponse.json({
      success: true,
      user: { 
        id: username, 
        username,
        email: username.includes('@') ? username : `${username}@example.com`
      },
      session: {
        sessionId: `session_${username}_${Date.now()}`,
        riskScore: deviceTrusted ? 0.1 : 0.3, // Lower risk for trusted devices but still require 2FA
        timestamp: new Date().toISOString(),
        requiresMFA: true, // ALWAYS FORCE 2FA
        mfaMethods: ['google_authenticator'],
        deviceTrusted,
        requiresDeviceRegistration,
        deviceLimitExceeded,
        behavioralAnomaly: { detected: false, anomalies: [], confidence: 0 },
        riskFactors: {
          device: deviceTrusted ? 0.1 : 0.5,
          location: 0.1,
          transaction: 0.0,
          time: 0.1,
          network: 0.0,
          velocity: 0.0
        },
        recommendations: requiresDeviceRegistration ? ['Register this device for future trusted access'] : []
      },
      message: 'Authentication successful - 2FA required'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
