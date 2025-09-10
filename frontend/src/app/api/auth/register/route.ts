import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, confirmPassword, firstName, lastName } = await request.json();

    // Validation
    if (!username || !email || !password || !confirmPassword || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Check if username/email already exists
    // 2. Hash the password
    // 3. Store user in database
    // 4. Send verification email

    // For demo purposes, we'll always succeed
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: username,
        username,
        email,
        firstName,
        lastName,
        role: 'user'
      },
      session: {
        sessionId: `session_${username}_${Date.now()}`,
        riskScore: 0.1,
        requiresMFA: false,
        mfaMethods: [],
        deviceTrusted: true,
        behavioralAnomaly: {
          detected: false,
          anomalies: [],
          confidence: 0.0
        },
        riskFactors: {
          device: 0.1,
          location: 0.1,
          transaction: 0.1,
          time: 0.1,
          network: 0.1,
          velocity: 0.1
        },
        recommendations: ['Welcome to CapitalLeaf! Your account is secure.'],
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}
