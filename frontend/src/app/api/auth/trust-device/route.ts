import { NextRequest, NextResponse } from 'next/server';
import { getUserDevices, trustDeviceInUser } from '@/lib/mock-data-store';

interface TrustDeviceRequest {
  deviceFingerprint: string;
  userId?: string;
  mfaCode?: string;
}

// GET /api/auth/trust-device - Test route accessibility
export async function GET() {
  console.log('Trust Device API: GET route accessed');
  return NextResponse.json({ 
    success: true, 
    message: 'Trust device API is working',
    timestamp: new Date().toISOString()
  });
}

// POST /api/auth/trust-device - Trust a device after MFA verification
export async function POST(request: NextRequest) {
  try {
    console.log('Trust Device API: Route accessed');
    const { deviceFingerprint, userId, mfaCode }: TrustDeviceRequest = await request.json();
    console.log('Trust Device API: Request data:', { deviceFingerprint, userId, mfaCode });

    if (!deviceFingerprint) {
      return NextResponse.json(
        { success: false, message: 'Device fingerprint is required' },
        { status: 400 }
      );
    }

    const demoUserId = userId || 'demo_user';
    const user = getUserDevices(demoUserId);
    
    const device = user.deviceFingerprints.find(
      (device: any) => device.fingerprint === deviceFingerprint
    );

    if (!device) {
      return NextResponse.json(
        { success: false, message: 'Device not found' },
        { status: 404 }
      );
    }

    // Use the same MFA verification logic as the login system
    // Accept any 6-digit code (same as verify-mfa API)
    if (mfaCode) {
      if (mfaCode.length !== 6) {
        return NextResponse.json(
          { success: false, message: 'Invalid verification code. Please enter a 6-digit code.' },
          { status: 400 }
        );
      }
      console.log(`Trust Device API: MFA code ${mfaCode} verified for device ${deviceFingerprint}`);
    } else {
      return NextResponse.json(
        { success: false, message: 'MFA code is required to trust this device' },
        { status: 400 }
      );
    }

    // Mark device as trusted using shared function
    trustDeviceInUser(demoUserId, deviceFingerprint);

    return NextResponse.json({
      success: true,
      message: 'Device trusted successfully',
      device: {
        fingerprint: device.fingerprint,
        deviceName: device.deviceName,
        deviceType: device.deviceType,
        isTrusted: device.isTrusted,
        lastUsed: device.lastUsed,
        registeredAt: device.registeredAt
      }
    });

  } catch (error) {
    console.error('Trust device error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to trust device' },
      { status: 500 }
    );
  }
}