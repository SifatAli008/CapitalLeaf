import { NextRequest, NextResponse } from 'next/server';

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
    const mockSession = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      riskScore: Math.random() * 0.4, // Low risk for demo
      timestamp: new Date().toISOString(),
      requiresMFA: false,
      mfaMethods: [],
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

    return NextResponse.json({
      success: true,
      user: { 
        id: username, 
        username,
        email: `${username}@example.com`
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
