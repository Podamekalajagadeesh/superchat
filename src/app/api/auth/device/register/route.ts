import { NextRequest, NextResponse } from 'next/server';
import { registerDevice, generateDeviceFingerprint, verifyJWT } from '@/lib/auth';
import { z } from 'zod';

const deviceSchema = z.object({
  name: z.string().min(1, 'Device name is required'),
  type: z.enum(['mobile', 'desktop', 'tablet', 'web']),
  deviceId: z.string().min(1, 'Device ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, deviceId } = deviceSchema.parse(body);

    // Get user from JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token);
    
    if (!payload?.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get client information
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Generate device fingerprint
    const fingerprint = generateDeviceFingerprint(userAgent, ipAddress);

    // Register device
    await registerDevice(payload.id, {
      name,
      type,
      deviceId,
      fingerprint,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      message: 'Device registered successfully',
      device: {
        name,
        type,
        deviceId,
        fingerprint,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error registering device:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
