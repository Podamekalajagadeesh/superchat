import { NextRequest, NextResponse } from 'next/server';
import { verifyPhoneOTP, linkPhoneToAccount, createPhoneOTP } from '@/lib/auth';
import { sendOTP, sendOTPDev } from '@/lib/sms';
import { verifyJWT } from '@/lib/auth';
import { z } from 'zod';

const linkPhoneSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  code: z.string().length(6, 'OTP must be 6 digits').optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, code } = linkPhoneSchema.parse(body);

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

    // If no code provided, send OTP
    if (!code) {
      const otp = await createPhoneOTP(phoneNumber, 'phone_verification');
      
      const isDev = process.env.NODE_ENV === 'development';
      const success = isDev 
        ? await sendOTPDev(phoneNumber, otp)
        : await sendOTP(phoneNumber, otp);

      if (!success) {
        return NextResponse.json(
          { error: 'Failed to send OTP' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'OTP sent for phone linking',
        phoneNumber: phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3'),
      });
    }

    // Verify OTP and link phone
    const isValid = await verifyPhoneOTP(phoneNumber, code, 'phone_verification');

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Link phone to account
    await linkPhoneToAccount(payload.id, phoneNumber);

    return NextResponse.json({
      message: 'Phone number linked successfully',
      phoneNumber: phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3'),
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error linking phone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
