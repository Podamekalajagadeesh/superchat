'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Phone, Wallet, Mail, Link, Unlink } from 'lucide-react';

interface AccountLinkingProps {
  user: {
    id: string;
    email?: string;
    phoneNumber?: string;
    walletAddress?: string;
  };
}

export default function AccountLinking({ user }: AccountLinkingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState<'phone' | 'wallet' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletMessage, setWalletMessage] = useState('');

  const handleLinkPhone = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/link/phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpSent(true);
      toast.success('OTP sent successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (!otpCode) {
      toast.error('Please enter the OTP code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/link/phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({ phoneNumber, code: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      toast.success('Phone number linked successfully!');
      setActiveMethod(null);
      setPhoneNumber('');
      setOtpCode('');
      setOtpSent(false);
      // Refresh user data or update UI
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OTP verification failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkWallet = async () => {
    if (!walletAddress) {
      toast.error('Please enter a wallet address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/link/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate signature request');
      }

      setWalletMessage(data.message);

      // Request signature from user
      if (window.ethereum) {
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [data.message, walletAddress],
        });

        // Verify signature
        const verifyResponse = await fetch('/api/auth/link/wallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
          },
          body: JSON.stringify({
            walletAddress,
            message: data.message,
            signature,
          }),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok) {
          throw new Error(verifyData.error || 'Wallet linking failed');
        }

        toast.success('Wallet linked successfully!');
        setActiveMethod(null);
        setWalletAddress('');
        setWalletMessage('');
        // Refresh user data or update UI
      } else {
        throw new Error('MetaMask not found. Please install MetaMask.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Wallet linking failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Link Accounts</h3>
      
      {/* Email (if not linked) */}
      {!user.email && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-gray-400 text-sm">Not linked</p>
              </div>
            </div>
            <button
              onClick={() => setActiveMethod('phone')} // Using phone method for email linking
              className="flex items-center space-x-2 text-primary-400 hover:text-primary-300"
            >
              <Link className="w-4 h-4" />
              <span>Link</span>
            </button>
          </div>
        </div>
      )}

      {/* Phone Number */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-white font-medium">Phone Number</p>
              <p className="text-gray-400 text-sm">
                {user.phoneNumber ? user.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3') : 'Not linked'}
              </p>
            </div>
          </div>
          {user.phoneNumber ? (
            <button className="flex items-center space-x-2 text-red-400 hover:text-red-300">
              <Unlink className="w-4 h-4" />
              <span>Unlink</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveMethod('phone')}
              className="flex items-center space-x-2 text-primary-400 hover:text-primary-300"
            >
              <Link className="w-4 h-4" />
              <span>Link</span>
            </button>
          )}
        </div>

        {/* Phone Linking Form */}
        {activeMethod === 'phone' && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                placeholder="+1234567890"
              />
            </div>

            {!otpSent ? (
              <button
                onClick={handleLinkPhone}
                disabled={isLoading}
                className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Enter OTP Code
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleVerifyPhoneOTP}
                    disabled={isLoading}
                    className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    onClick={() => {
                      setActiveMethod(null);
                      setPhoneNumber('');
                      setOtpCode('');
                      setOtpSent(false);
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wallet Address */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wallet className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-white font-medium">Wallet Address</p>
              <p className="text-gray-400 text-sm">
                {user.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 'Not linked'}
              </p>
            </div>
          </div>
          {user.walletAddress ? (
            <button className="flex items-center space-x-2 text-red-400 hover:text-red-300">
              <Unlink className="w-4 h-4" />
              <span>Unlink</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveMethod('wallet')}
              className="flex items-center space-x-2 text-primary-400 hover:text-primary-300"
            >
              <Link className="w-4 h-4" />
              <span>Link</span>
            </button>
          )}
        </div>

        {/* Wallet Linking Form */}
        {activeMethod === 'wallet' && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                placeholder="0x..."
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleLinkWallet}
                disabled={isLoading}
                className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {isLoading ? 'Linking...' : 'Link Wallet'}
              </button>
              <button
                onClick={() => {
                  setActiveMethod(null);
                  setWalletAddress('');
                  setWalletMessage('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            {walletMessage && (
              <div className="text-sm text-gray-400">
                <p>Please sign the message in MetaMask to verify your wallet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
