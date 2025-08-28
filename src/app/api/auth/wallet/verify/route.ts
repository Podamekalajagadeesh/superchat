import { NextRequest, NextResponse } from 'next/server';
import { verifyWalletSignature, findOrCreateUserByWallet, createJWT } from '@/lib/auth';
import { z } from 'zod';

const verifySchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  message: z.string().min(1, 'Message is required'),
  signature: z.string().min(1, 'Signature is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, message, signature } = verifySchema.parse(body);

    // Verify wallet signature
    const isValid = await verifyWalletSignature(walletAddress, message, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Find or create user
    const user = await findOrCreateUserByWallet(walletAddress);

    // Create JWT token
    const token = await createJWT({
      id: user.id,
      walletAddress: user.walletAddress,
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
        walletAddress: user.walletAddress,
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

    console.error('Error verifying wallet signature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
