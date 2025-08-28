import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const trustDeviceSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  token: z.string().min(1, 'Verification token is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, token } = trustDeviceSchema.parse(body);

    // Verify the QR token
    const payload = await verifyJWT(token);
    
    if (!payload?.userId || !payload?.deviceId || payload.deviceId !== deviceId) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Mark device as trusted
    await prisma.device.updateMany({
      where: {
        userId: payload.userId,
        deviceId: deviceId,
      },
      data: {
        isTrusted: true,
        lastUsed: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Device trusted successfully',
      deviceId,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error trusting device:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
