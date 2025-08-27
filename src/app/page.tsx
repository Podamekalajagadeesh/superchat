'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-600/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(156, 146, 172, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex justify-center items-center h-16 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Superchat
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            The Ultimate Chatting App
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-lg text-gray-400">
            <span className="gradient-text font-semibold">Chat</span>
            <span className="text-gray-500">•</span>
            <span className="gradient-text font-semibold">Own</span>
            <span className="text-gray-500">•</span>
            <span className="gradient-text font-semibold">Earn</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mb-16 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Real-time Messaging */}
          <div className="card group">
            <div className="feature-icon mb-4 group-hover:scale-110 transition-transform duration-300">
              💬
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Messaging</h3>
            <p className="text-gray-400">Instant messaging with WebSocket technology for lightning-fast communication.</p>
          </div>

          {/* Web3 Integration */}
          <div className="card group">
            <div className="feature-icon mb-4 group-hover:scale-110 transition-transform duration-300">
              ⚡
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Web3 Integration</h3>
            <p className="text-gray-400">Connect your wallet, earn tokens, and experience decentralized messaging.</p>
          </div>

          {/* Multi-Platform Auth */}
          <div className="card group">
            <div className="feature-icon mb-4 group-hover:scale-110 transition-transform duration-300">
              🔐
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Multi-Platform Auth</h3>
            <p className="text-gray-400">Google, GitHub, Wallet, and traditional email authentication.</p>
          </div>

          {/* File Sharing */}
          <div className="card group">
            <div className="feature-icon mb-4 group-hover:scale-110 transition-transform duration-300">
              📁
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">File Sharing</h3>
            <p className="text-gray-400">Share images, documents, and media with IPFS decentralized storage.</p>
          </div>

          {/* Voice & Video */}
          <div className="card group">
            <div className="feature-icon mb-4 group-hover:scale-110 transition-transform duration-300">
              🎥
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Voice & Video</h3>
            <p className="text-gray-400">High-quality voice and video calls with WebRTC technology.</p>
          </div>

          {/* Token Rewards */}
          <div className="card group">
            <div className="feature-icon mb-4 group-hover:scale-110 transition-transform duration-300">
              🪙
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Token Rewards</h3>
            <p className="text-gray-400">Earn tokens for active participation and community engagement.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience the Future of Chat?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary">
              Get Started Now
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>

        {/* Environment Status */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="glass-effect rounded-lg p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">🚀 Environment Ready</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Google OAuth Configured</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>GitHub OAuth Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Web3Auth Integrated</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Email Service Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>WalletConnect Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Cloudinary Upload</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-16 text-center transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-gray-400">© 2024 Superchat. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
