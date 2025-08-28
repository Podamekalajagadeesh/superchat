import { NextRequest, NextResponse } from 'next/server';
import { verifyWalletSignature, linkWalletToAccount, createWalletNonce, createSiweMessage } from '@/lib/auth';
import { verifyJWT } from '@/lib/auth';
import { z } from 'zod';

const linkWalletSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  message: z.string().optional(),
  signature: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, message, signature } = linkWalletSchema.parse(body);

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

    // If no signature provided, generate nonce and message
    if (!signature || !message) {
      const nonce = await createWalletNonce(walletAddress);
      const siweMessage = createSiweMessage(walletAddress, nonce);

      return NextResponse.json({
        message: 'Signature required for wallet linking',
        nonce,
        message: siweMessage,
        walletAddress,
      });
    }

    // Verify wallet signature
    const isValid = await verifyWalletSignature(walletAddress, message, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Link wallet to account
    await linkWalletToAccount(payload.id, walletAddress);

    return NextResponse.json({
      message: 'Wallet linked successfully',
      walletAddress: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error linking wallet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
