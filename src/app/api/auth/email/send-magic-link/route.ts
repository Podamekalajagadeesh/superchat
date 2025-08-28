import { NextRequest, NextResponse } from 'next/server';
import { createMagicLink } from '@/lib/auth';
import { sendMagicLink, sendMagicLinkDev } from '@/lib/email';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = emailSchema.parse(body);

    // Generate and store magic link
    const token = await createMagicLink(email);

    // Send magic link via email
    const isDev = process.env.NODE_ENV === 'development';
    const success = isDev 
      ? await sendMagicLinkDev(email, token)
      : await sendMagicLink(email, token);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send magic link' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Magic link sent successfully',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error sending magic link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
