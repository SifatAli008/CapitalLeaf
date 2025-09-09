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
        lastName
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
