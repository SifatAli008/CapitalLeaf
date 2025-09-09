import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, deviceName, deviceInfo } = await request.json();

    if (!sessionId || !deviceName) {
      return NextResponse.json(
        { success: false, message: 'Session ID and device name are required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Validate the session
    // 2. Store device information in database
    // 3. Associate device with user account
    // 4. Update session to mark device as trusted

    // For demo purposes, we'll always succeed
    return NextResponse.json({
      success: true,
      message: 'Device registered successfully',
      device: {
        id: `device_${Date.now()}`,
        name: deviceName,
        fingerprint: deviceInfo?.fingerprint || 'demo_fingerprint',
        registeredAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Device registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Device registration failed' },
      { status: 500 }
    );
  }
}
