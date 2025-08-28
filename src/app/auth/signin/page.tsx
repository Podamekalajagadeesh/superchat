'use client'

import Link from 'next/link'
import AuthTabs from '@/components/auth/AuthTabs'

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-600/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(156, 146, 172, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <span className="text-2xl font-bold text-white">Superchat</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>

        {/* Authentication Tabs */}
        <div className="glass-effect rounded-xl p-8">
          <AuthTabs mode="signin" />
          
          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link href="/auth/forgot-password" className="text-sm text-gray-400 hover:text-white transition-colors">
              Forgot your password?
            </Link>
            <div className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
