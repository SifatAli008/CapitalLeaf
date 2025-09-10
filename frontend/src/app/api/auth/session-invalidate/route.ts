import { NextRequest, NextResponse } from 'next/server';

interface SessionInvalidateRequest {
  userId: string;
  reason: 'device_limit_exceeded' | 'security_breach' | 'manual_logout' | 'session_expired';
  deviceFingerprint?: string;
}

// Mock user data for demo purposes
const mockUsers = new Map<string, any>();

const getUserDevices = (userId: string) => {
  if (!mockUsers.has(userId)) {
    mockUsers.set(userId, {
      id: userId,
      deviceFingerprints: [],
      maxDevices: 2,
      activeSessions: [],
      mfaEnabled: false
    });
  }
  return mockUsers.get(userId);
};

// POST /api/auth/session-invalidate - Invalidate user sessions
export async function POST(request: NextRequest) {
  try {
    const { userId, reason, deviceFingerprint }: SessionInvalidateRequest = await request.json();

    if (!userId || !reason) {
      return NextResponse.json(
        { success: false, message: 'User ID and reason are required' },
        { status: 400 }
      );
    }

    const user = getUserDevices(userId);
    
    // If specific device fingerprint provided, only invalidate that device's sessions
    if (deviceFingerprint) {
      const sessionsToInvalidate = user.activeSessions.filter(
        (session: any) => session.deviceFingerprint === deviceFingerprint
      );
      
      user.activeSessions = user.activeSessions.filter(
        (session: any) => session.deviceFingerprint !== deviceFingerprint
      );
      
      return NextResponse.json({
        success: true,
        message: `Sessions invalidated for device ${deviceFingerprint}`,
        invalidatedSessions: sessionsToInvalidate.length,
        reason
      });
    }
    
    // Otherwise, invalidate all sessions
    const invalidatedCount = user.activeSessions.length;
    user.activeSessions = [];
    
    return NextResponse.json({
      success: true,
      message: `All sessions invalidated for user ${userId}`,
      invalidatedSessions: invalidatedCount,
      reason
    });

  } catch (error) {
    console.error('Session invalidation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to invalidate sessions' },
      { status: 500 }
    );
  }
}

// GET /api/auth/session-invalidate - Get active sessions for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = getUserDevices(userId);
    const activeSessions = user.activeSessions.filter((session: any) => session.isActive);

    return NextResponse.json({
      success: true,
      sessions: activeSessions,
      sessionCount: activeSessions.length
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve sessions' },
      { status: 500 }
    );
  }
}
