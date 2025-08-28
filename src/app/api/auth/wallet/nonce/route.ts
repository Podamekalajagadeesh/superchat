import { NextRequest, NextResponse } from 'next/server';
import { createWalletNonce, createSiweMessage } from '@/lib/auth';
import { z } from 'zod';

const walletSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = walletSchema.parse(body);

    // Generate nonce
    const nonce = await createWalletNonce(walletAddress);

    // Create SIWE message
    const message = createSiweMessage(walletAddress, nonce);

    return NextResponse.json({
      nonce,
      message,
      walletAddress,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error generating nonce:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
