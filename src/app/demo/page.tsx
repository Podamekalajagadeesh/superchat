'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, Wallet, QrCode, Shield, Link as LinkIcon, Settings } from 'lucide-react';

export default function DemoPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'phone-otp',
      title: 'Phone OTP Authentication',
      description: 'Secure SMS-based authentication with 6-digit codes',
      icon: Phone,
      color: 'bg-blue-500',
      details: [
        'Send OTP to any phone number',
        '6-digit verification codes',
        '10-minute expiration time',
        'Automatic user creation',
        'Account linking support'
      ]
    },
    {
      id: 'email-magic',
      title: 'Email Magic Links',
      description: 'Passwordless authentication via email links',
      icon: Mail,
      color: 'bg-green-500',
      details: [
        'No passwords required',
        'Secure email links',
        '15-minute expiration',
        'Automatic sign-in',
        'Professional email templates'
      ]
    },
    {
      id: 'wallet-auth',
      title: 'Wallet Authentication',
      description: 'Sign-in with Ethereum using SIWE standard',
      icon: Wallet,
      color: 'bg-purple-500',
      details: [
        'Ethereum wallet support',
        'SIWE (Sign-In with Ethereum)',
        'MetaMask integration',
        'Cryptographic verification',
        'Web3 native experience'
      ]
    },
    {
      id: 'account-linking',
      title: 'Account Linking',
      description: 'Link multiple authentication methods to one account',
      icon: LinkIcon,
      color: 'bg-orange-500',
      details: [
        'Multiple phone numbers',
        'Multiple wallet addresses',
        'Multiple email addresses',
        'Unified account management',
        'Secure verification process'
      ]
    },
    {
      id: 'device-management',
      title: 'Device Management',
      description: 'Register and manage trusted devices with QR verification',
      icon: Shield,
      color: 'bg-red-500',
      details: [
        'Device registration',
        'QR code verification',
        'Device fingerprinting',
        'Trusted device tracking',
        'Secure device removal'
      ]
    },
    {
      id: 'qr-verification',
      title: 'QR Code Verification',
      description: 'Secure device verification using QR codes',
      icon: QrCode,
      color: 'bg-indigo-500',
      details: [
        'QR code generation',
        'Short-lived tokens',
        'Mobile device scanning',
        'Secure verification flow',
        'Device trust management'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-600/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(156, 146, 172, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
            <span className="text-3xl font-bold text-white">SuperChat</span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">
            Advanced Authentication System
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the future of authentication with phone OTP, email magic links, 
            wallet authentication, account linking, and device management.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="glass-effect rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
                
                {activeFeature === feature.id && (
                  <div className="mt-4 space-y-2">
                    {feature.details.map((detail, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-gray-300 text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              <Shield className="w-5 h-5 mr-2" />
              Try Authentication
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium border border-white/20"
            >
              <Settings className="w-5 h-5 mr-2" />
              View Settings
            </Link>
          </div>
          
          <p className="text-gray-400 text-sm">
            Click on any feature card above to see more details
          </p>
        </div>

        {/* Technical Details */}
        <div className="mt-16 glass-effect rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Technical Implementation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-white font-semibold mb-2">JWT Tokens</h3>
              <p className="text-gray-400 text-sm">
                Secure token-based authentication with configurable expiration
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🗄️</span>
              </div>
              <h3 className="text-white font-semibold mb-2">PostgreSQL</h3>
              <p className="text-gray-400 text-sm">
                Robust database with Prisma ORM for data management
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Next.js 15</h3>
              <p className="text-gray-400 text-sm">
                Modern React framework with API routes and server-side rendering
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Tailwind CSS</h3>
              <p className="text-gray-400 text-sm">
                Utility-first CSS framework for modern, responsive design
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Built with ❤️ using Next.js, TypeScript, and modern web technologies
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link href="/README.md" className="text-primary-400 hover:text-primary-300 text-sm">
              Documentation
            </Link>
            <Link href="/SETUP.md" className="text-primary-400 hover:text-primary-300 text-sm">
              Setup Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
