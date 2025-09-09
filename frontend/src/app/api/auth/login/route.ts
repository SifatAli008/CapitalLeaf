import { NextRequest, NextResponse } from 'next/server';
import { hasUser2FAEnabled, getUsersWith2FA } from '@/lib/2fa-store';

export async function POST(request: NextRequest) {
  try {
    const { username, password, userContext } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // In a real application, you would validate credentials against a database
    // For demo purposes, we'll accept any credentials
    
    // Check if user has 2FA enabled (in real app, this would come from database)
    // For demo: check the shared 2FA store
    const userHas2FAEnabled = hasUser2FAEnabled(username);
    console.log(`Login API: Checking 2FA for user "${username}" - Enabled: ${userHas2FAEnabled}`);
    console.log(`Login API: All users with 2FA enabled:`, getUsersWith2FA());
    console.log(`Login API: Username normalization test - original: "${username}", lowercase: "${username.toLowerCase()}"`);
    
    // CRITICAL: Force 2FA for users who have it enabled - NO BYPASSING ALLOWED
    if (userHas2FAEnabled) {
      console.log(`🚨 Login API: User "${username}" has 2FA enabled - REQUIRING 2FA verification - NO BYPASS ALLOWED`);
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
          riskScore: 0.3,
          timestamp: new Date().toISOString(),
          requiresMFA: true, // FORCE 2FA
          mfaMethods: ['google_authenticator'],
          deviceTrusted: false,
          behavioralAnomaly: { detected: false, anomalies: [], confidence: 0 },
          riskFactors: {
            device: 0.1,
            location: 0.1,
            transaction: 0.0,
            time: 0.1,
            network: 0.0,
            velocity: 0.0
          },
          recommendations: []
        },
        message: 'Authentication successful - 2FA required'
      });
    } else {
      console.log(`Login API: User "${username}" does not have 2FA enabled - allowing direct login`);
    }
    
    const mockSession = {
      sessionId: `session_${username}_${Date.now()}`,
      riskScore: 0.3, // Fixed value to avoid hydration mismatch
      timestamp: new Date().toISOString(),
      requiresMFA: userHas2FAEnabled, // Only require 2FA if user has it enabled
      mfaMethods: userHas2FAEnabled ? ['google_authenticator'] : [],
      deviceTrusted: false,
      behavioralAnomaly: { 
        detected: false, 
        anomalies: [], 
        confidence: 0 
      },
      riskFactors: {
        device: 0.1,
        location: 0.1,
        transaction: 0.0,
        time: 0.1,
        network: 0.0,
        velocity: 0.0
      },
      recommendations: []
    };

    console.log('Login API: Returning session with requiresMFA =', mockSession.requiresMFA);
    
    // Check if username is already an email or just a username
    const email = username.includes('@') ? username : `${username}@example.com`;
    
    return NextResponse.json({
      success: true,
      user: { 
        id: username, 
        username,
        email: email
      },
      session: mockSession,
      message: 'Authentication successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
