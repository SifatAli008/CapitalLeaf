import { NextRequest, NextResponse } from 'next/server';
import { getUserDevices, removeDeviceFromUser, updateDeviceInUser } from '@/lib/mock-data-store';

// GET /api/auth/devices - List user's devices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo_user';

    const user = getUserDevices(userId);
    const activeDevices = user.deviceFingerprints.filter(device => device.isActive);

    return NextResponse.json({
      success: true,
      devices: activeDevices,
      deviceCount: activeDevices.length,
      maxDevices: user.maxDevices,
      canAddDevice: activeDevices.length < user.maxDevices
    });

  } catch (error) {
    console.error('Get devices error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve devices' },
      { status: 500 }
    );
  }
}

// DELETE /api/auth/devices - Remove a device
export async function DELETE(request: NextRequest) {
  try {
    const { deviceFingerprint, userId } = await request.json();

    if (!deviceFingerprint) {
      return NextResponse.json(
        { success: false, message: 'Device fingerprint is required' },
        { status: 400 }
      );
    }

    const demoUserId = userId || 'demo_user';
    const user = getUserDevices(demoUserId);
    
    const device = user.deviceFingerprints.find(
      device => device.fingerprint === deviceFingerprint
    );

    if (!device) {
      return NextResponse.json(
        { success: false, message: 'Device not found' },
        { status: 404 }
      );
    }

    // Remove device using shared function
    removeDeviceFromUser(demoUserId, deviceFingerprint);

    return NextResponse.json({
      success: true,
      message: 'Device removed successfully',
      deviceCount: user.deviceFingerprints.filter(device => device.isActive).length,
      maxDevices: user.maxDevices
    });

  } catch (error) {
    console.error('Remove device error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove device' },
      { status: 500 }
    );
  }
}

// PUT /api/auth/devices - Update device information
export async function PUT(request: NextRequest) {
  try {
    const { deviceFingerprint, deviceName, userId } = await request.json();

    if (!deviceFingerprint || !deviceName) {
      return NextResponse.json(
        { success: false, message: 'Device fingerprint and name are required' },
        { status: 400 }
      );
    }

    const demoUserId = userId || 'demo_user';
    const user = getUserDevices(demoUserId);
    
    const device = user.deviceFingerprints.find(
      device => device.fingerprint === deviceFingerprint
    );

    if (!device) {
      return NextResponse.json(
        { success: false, message: 'Device not found' },
        { status: 404 }
      );
    }

    // Update device using shared function
    updateDeviceInUser(demoUserId, deviceFingerprint, {
      deviceName,
      lastUsed: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Device updated successfully',
      device: {
        fingerprint: device.fingerprint,
        deviceName: deviceName,
        deviceType: device.deviceType,
        isTrusted: device.isTrusted,
        lastUsed: new Date().toISOString(),
        registeredAt: device.registeredAt
      }
    });

  } catch (error) {
    console.error('Update device error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update device' },
      { status: 500 }
    );
  }
}
