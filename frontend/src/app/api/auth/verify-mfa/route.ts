import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, method, code } = await request.json();

    if (!sessionId || !method || !code) {
      return NextResponse.json(
        { success: false, message: 'Session ID, method, and code are required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Validate the session
    // 2. Verify the MFA code against the user's registered method
    // 3. Update session with MFA verification status

    // For demo purposes, accept any 6-digit code
    if (code && code.length === 6) {
      return NextResponse.json({
        success: true,
        message: 'MFA verification successful'
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
