import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

const prisma = new PrismaClient();

// JWT Secret
const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret');

// OTP Generation
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Magic Link Token Generation
export const generateMagicLinkToken = (): string => {
  return randomBytes(32).toString('hex');
};

// Device Fingerprint Generation
export const generateDeviceFingerprint = (userAgent: string, ipAddress: string): string => {
  const data = `${userAgent}-${ipAddress}`;
  return createHash('sha256').update(data).digest('hex');
};

// JWT Token Management
export const createJWT = async (payload: any, expiresIn: string = '1h'): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
};

export const verifyJWT = async (token: string): Promise<any> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
};

// Phone OTP Management
export const createPhoneOTP = async (phoneNumber: string, type: 'phone_verification' | 'phone_login'): Promise<string> => {
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.oTPCode.create({
    data: {
      phoneNumber,
      code,
      type,
      expiresAt,
    },
  });

  return code;
};

export const verifyPhoneOTP = async (phoneNumber: string, code: string, type: string): Promise<boolean> => {
  const otpRecord = await prisma.oTPCode.findFirst({
    where: {
      phoneNumber,
      code,
      type,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!otpRecord) {
    return false;
  }

  // Mark as used
  await prisma.oTPCode.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  return true;
};

// Magic Link Management
export const createMagicLink = async (email: string): Promise<string> => {
  const token = generateMagicLinkToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.magicLink.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  return token;
};

export const verifyMagicLink = async (token: string): Promise<string | null> => {
  const magicLink = await prisma.magicLink.findFirst({
    where: {
      token,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!magicLink) {
    return null;
  }

  // Mark as used
  await prisma.magicLink.update({
    where: { id: magicLink.id },
    data: { used: true },
  });

  return magicLink.email;
};

// Wallet Authentication
export const createWalletNonce = async (walletAddress: string): Promise<string> => {
  const nonce = randomBytes(32).toString('hex');
  
  // Store nonce in session or temporary storage
  // For simplicity, we'll use a simple in-memory store
  // In production, use Redis or similar
  return nonce;
};

export const verifyWalletSignature = async (
  walletAddress: string,
  message: string,
  signature: string
): Promise<boolean> => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    return false;
  }
};

export const createSiweMessage = (walletAddress: string, nonce: string): string => {
  const message = new SiweMessage({
    domain: process.env.NEXTAUTH_URL || 'localhost:3000',
    address: walletAddress,
    statement: 'Sign in to SuperChat',
    uri: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    version: '1',
    chainId: 1,
    nonce,
  });

  return message.prepareMessage();
};

// Device Management
export const registerDevice = async (
  userId: string,
  deviceInfo: {
    name: string;
    type: string;
    deviceId: string;
    fingerprint: string;
    ipAddress: string;
    userAgent: string;
  }
): Promise<void> => {
  await prisma.device.create({
    data: {
      userId,
      ...deviceInfo,
    },
  });
};

export const verifyDevice = async (userId: string, deviceId: string): Promise<boolean> => {
  const device = await prisma.device.findFirst({
    where: {
      userId,
      deviceId,
      isTrusted: true,
    },
  });

  return !!device;
};

export const generateDeviceQR = async (userId: string, deviceId: string): Promise<string> => {
  const qrData = {
    userId,
    deviceId,
    timestamp: Date.now(),
    token: await createJWT({ userId, deviceId }, '5m'),
  };

  return await QRCode.toDataURL(JSON.stringify(qrData));
};

// Account Linking
export const linkPhoneToAccount = async (userId: string, phoneNumber: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      phoneNumber,
      phoneVerified: new Date(),
    },
  });
};

export const linkWalletToAccount = async (userId: string, walletAddress: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      walletAddress,
      walletVerified: new Date(),
    },
  });
};

export const linkEmailToAccount = async (userId: string, email: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      email,
      emailVerified: new Date(),
    },
  });
};

// User Management
export const findOrCreateUserByPhone = async (phoneNumber: string, name?: string): Promise<any> => {
  let user = await prisma.user.findUnique({
    where: { phoneNumber },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phoneNumber,
        name: name || `User-${phoneNumber.slice(-4)}`,
        username: `user_${phoneNumber.slice(-4)}_${Date.now()}`,
        isVerified: true,
        phoneVerified: new Date(),
      },
    });
  }

  return user;
};

export const findOrCreateUserByWallet = async (walletAddress: string): Promise<any> => {
  let user = await prisma.user.findUnique({
    where: { walletAddress },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress,
        name: `Wallet-${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        username: `wallet_${walletAddress.slice(2, 8)}_${Date.now()}`,
        isVerified: true,
        walletVerified: new Date(),
      },
    });
  }

  return user;
};

// Cleanup expired tokens
export const cleanupExpiredTokens = async (): Promise<void> => {
  await prisma.oTPCode.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  await prisma.magicLink.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
};
