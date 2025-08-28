import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicLink, createJWT } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const verifySchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = verifySchema.parse(body);

    // Verify magic link
    const email = await verifyMagicLink(token);

    if (!email) {
      return NextResponse.json(
        { error: 'Invalid or expired magic link' },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          username: `user_${email.split('@')[0]}_${Date.now()}`,
          isVerified: true,
          emailVerified: new Date(),
        },
      });
    } else if (!user.emailVerified) {
      // Update email verification status
      user = await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    }

    // Create JWT token
    const jwtToken = await createJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
    });

    // Set cookie
    const response = NextResponse.json({
      message: 'Authentication successful',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    });

    response.cookies.set('auth-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error verifying magic link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
