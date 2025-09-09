import { NextRequest, NextResponse } from 'next/server';
import { getUsersWith2FA, addUserTo2FA, removeUserFrom2FA, hasUser2FAEnabled } from '@/lib/2fa-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { success: false, message: 'Username is required' },
        { status: 400 }
      );
    }

    const has2FA = hasUser2FAEnabled(username);
    
    return NextResponse.json({
      success: true,
      has2FA,
      username: username.toLowerCase()
    });

  } catch (error) {
    console.error('2FA status check error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check 2FA status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, enable } = await request.json();

    if (!username || typeof enable !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Username and enable status are required' },
        { status: 400 }
      );
    }

    const normalizedUsername = username.toLowerCase();
    
    if (enable) {
      // Enable 2FA
      addUserTo2FA(normalizedUsername);
      console.log(`2FA Status API: Enabled 2FA for user "${normalizedUsername}". All users with 2FA:`, getUsersWith2FA());
    } else {
      // Disable 2FA
      removeUserFrom2FA(normalizedUsername);
      console.log(`2FA Status API: Disabled 2FA for user "${normalizedUsername}". All users with 2FA:`, getUsersWith2FA());
    }

    return NextResponse.json({
      success: true,
      has2FA: hasUser2FAEnabled(normalizedUsername),
      username: normalizedUsername,
      message: enable ? '2FA enabled successfully' : '2FA disabled successfully'
    });

  } catch (error) {
    console.error('2FA status update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update 2FA status' },
      { status: 500 }
    );
  }
}
