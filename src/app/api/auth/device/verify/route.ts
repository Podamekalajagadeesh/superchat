import { NextRequest, NextResponse } from 'next/server';
import { verifyDevice, generateDeviceQR, verifyJWT } from '@/lib/auth';
import { z } from 'zod';

const verifyDeviceSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId } = verifyDeviceSchema.parse(body);

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

    // Check if device is already trusted
    const isTrusted = await verifyDevice(payload.id, deviceId);

    if (isTrusted) {
      return NextResponse.json({
        message: 'Device is already trusted',
        isTrusted: true,
      });
    }

    // Generate QR code for device verification
    const qrCode = await generateDeviceQR(payload.id, deviceId);

    return NextResponse.json({
      message: 'QR code generated for device verification',
      qrCode,
      deviceId,
      isTrusted: false,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error verifying device:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
