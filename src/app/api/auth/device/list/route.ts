import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
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

    // Get user devices
    const devices = await prisma.device.findMany({
      where: {
        userId: payload.id,
      },
      orderBy: {
        lastUsed: 'desc',
      },
    });

    return NextResponse.json({
      devices: devices.map(device => ({
        id: device.id,
        name: device.name,
        type: device.type,
        deviceId: device.deviceId,
        isTrusted: device.isTrusted,
        lastUsed: device.lastUsed.toISOString(),
        ipAddress: device.ipAddress,
        userAgent: device.userAgent,
      })),
    });

  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
