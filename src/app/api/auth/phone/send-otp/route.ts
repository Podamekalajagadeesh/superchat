import { NextRequest, NextResponse } from 'next/server';
import { createPhoneOTP } from '@/lib/auth';
import { sendOTP, sendOTPDev } from '@/lib/sms';
import { z } from 'zod';

const phoneSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  type: z.enum(['phone_verification', 'phone_login']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, type } = phoneSchema.parse(body);

    // Generate and store OTP
    const otp = await createPhoneOTP(phoneNumber, type);

    // Send OTP via SMS
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
      message: 'OTP sent successfully',
      phoneNumber: phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3'), // Mask phone number
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
