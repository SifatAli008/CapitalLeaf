import { NextRequest, NextResponse } from 'next/server';
import { getUserDevices, trustDeviceInUser } from '@/lib/mock-data-store';

interface VerifyMFARequest {
  username: string;
  code: string;
  deviceFingerprint?: string;
  trustDevice?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { username, code, deviceFingerprint, trustDevice }: VerifyMFARequest = await request.json();

    if (!username || !code) {
      return NextResponse.json(
        { success: false, message: 'Username and code are required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Validate the session
    // 2. Verify the MFA code against the user's registered method
    // 3. Update session with MFA verification status

    // For demo purposes, accept any 6-digit code
    if (code && code.length === 6) {
      // Handle device trust if device fingerprint is provided
      if (deviceFingerprint && trustDevice) {
        trustDeviceInUser(username, deviceFingerprint);
        console.log(`MFA Verification API: Device ${deviceFingerprint} trusted for user ${username}`);
      }

      // Create a mock session and user data for successful 2FA completion
      const mockAccessToken = `mock_token_${username}_${Date.now()}`;
      const mockUser = {
        id: username,
        username,
        email: username.includes('@') ? username : `${username}@example.com`
      };
      const mockSession = {
        sessionId: `session_${username}_${Date.now()}`,
        riskScore: 0.1, // Lower risk score after successful 2FA
        timestamp: new Date().toISOString(),
        requiresMFA: false, // 2FA completed
        mfaMethods: [],
        deviceTrusted: deviceFingerprint ? true : false, // Trust device if fingerprint provided
        behavioralAnomaly: { detected: false, anomalies: [], confidence: 0 },
        riskFactors: {
          device: deviceFingerprint ? 0.0 : 0.1,
          location: 0.0,
          transaction: 0.0,
          time: 0.0,
          network: 0.0,
          velocity: 0.0
        },
        recommendations: []
      };

      return NextResponse.json({
        success: true,
        message: 'MFA verification successful',
        tokens: {
          accessToken: mockAccessToken
        },
        user: mockUser,
        session: mockSession
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('MFA verification error:', error);
    return NextResponse.json(
      { success: false, message: 'MFA verification failed' },
      { status: 500 }
    );
  }
}
