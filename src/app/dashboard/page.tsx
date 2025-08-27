'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { LogOut, User, Settings, MessageCircle } from 'lucide-react'

export default function Dashboard() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-600/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(156, 146, 172, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white text-xl font-bold">S</span>
              </div>
              <span className="text-2xl font-bold text-white">Superchat</span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="text-right">
                  <p className="text-white font-medium">{user?.name}</p>
                  <p className="text-gray-400 text-sm">@{user?.username}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Superchat, {user?.name}! 🎉
          </h1>
          <p className="text-xl text-gray-400">
            Your account is ready. Chat features coming soon!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">0</div>
            <div className="text-gray-400">Total Messages</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">0</div>
            <div className="text-gray-400">Active Chats</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">0</div>
            <div className="text-gray-400">Tokens Earned</div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/chat" className="card hover:bg-white/15 transition-all duration-300">
            <div className="feature-icon mb-4">
              💬
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Chat</h3>
            <p className="text-gray-400 mb-4">Start conversations with friends and family instantly.</p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-green-400">Live Now</div>
              <MessageCircle className="w-4 h-4 text-primary-400" />
            </div>
          </Link>

          <div className="card">
            <div className="feature-icon mb-4">
              ⚡
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Web3 Features</h3>
            <p className="text-gray-400 mb-4">Connect your wallet and earn tokens for participation.</p>
            <div className="text-xs text-gray-500">Coming Soon</div>
          </div>

          <div className="card">
            <div className="feature-icon mb-4">
              🎥
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Voice & Video</h3>
            <p className="text-gray-400 mb-4">High-quality calls with WebRTC technology.</p>
            <div className="text-xs text-gray-500">Coming Soon</div>
          </div>

          <div className="card">
            <div className="feature-icon mb-4">
              📁
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">File Sharing</h3>
            <p className="text-gray-400 mb-4">Share files with IPFS decentralized storage.</p>
            <div className="text-xs text-gray-500">Coming Soon</div>
          </div>

          <div className="card">
            <div className="feature-icon mb-4">
              🪙
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Token Rewards</h3>
            <p className="text-gray-400 mb-4">Earn tokens for active participation.</p>
            <div className="text-xs text-gray-500">Coming Soon</div>
          </div>

          <div className="card">
            <div className="feature-icon mb-4">
              🔐
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Security</h3>
            <p className="text-gray-400 mb-4">End-to-end encryption and secure authentication.</p>
            <div className="text-xs text-gray-500">Coming Soon</div>
          </div>
        </div>
      </main>
    </div>
  )
}
