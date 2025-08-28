import { NextRequest, NextResponse } from 'next/server';
import { verifyPhoneOTP, findOrCreateUserByPhone, createJWT } from '@/lib/auth';
import { z } from 'zod';

const verifySchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  code: z.string().length(6, 'OTP must be 6 digits'),
  type: z.enum(['phone_verification', 'phone_login']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, code, type } = verifySchema.parse(body);

    // Verify OTP
    const isValid = await verifyPhoneOTP(phoneNumber, code, type);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Find or create user
    const user = await findOrCreateUserByPhone(phoneNumber);

    // Create JWT token
    const token = await createJWT({
      id: user.id,
      phoneNumber: user.phoneNumber,
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
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified,
      },
    });

    response.cookies.set('auth-token', token, {
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

    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
