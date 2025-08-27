'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from './components/auth/AuthProvider'
import LoginForm from './components/auth/LoginForm'
import ChatLayout from './components/chat/ChatLayout'
import { 
  MessageCircle, 
  Shield, 
  Zap, 
  Users, 
  Video, 
  Camera, 
  Wallet, 
  Coins, 
  Bot, 
  Store,
  ArrowRight,
  Check,
  Star,
  Download,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react'

export default function Home() {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('messaging')

  const features = {
    messaging: [
      { icon: MessageCircle, title: '1:1 & Group Chats', desc: 'Support for 200k+ member groups' },
      { icon: Users, title: 'Broadcast Channels', desc: 'Like Telegram but better' },
      { icon: MessageCircle, title: 'Threads & Replies', desc: 'Organized conversations' },
      { icon: Shield, title: 'End-to-End Encryption', desc: 'Your messages are private' },
    ],
    media: [
      { icon: Camera, title: 'High-Quality Media', desc: 'Crystal clear images & videos' },
      { icon: Video, title: 'Video Calls', desc: 'E2EE calls up to 64 participants' },
      { icon: Camera, title: 'Stories & Posts', desc: '24h stories with reactions' },
      { icon: Store, title: 'File Sharing', desc: 'Up to 2GB files (8GB premium)' },
    ],
    web3: [
      { icon: Wallet, title: 'Wallet Login', desc: 'MetaMask, Coinbase, and more' },
      { icon: Coins, title: 'Token-Gated Chats', desc: 'NFT or token required to join' },
      { icon: Star, title: 'Collectible Posts', desc: 'Mint stories as NFTs' },
      { icon: Coins, title: 'Tips & Payments', desc: 'Crypto + fiat payments' },
    ],
    ai: [
      { icon: Bot, title: 'Smart Replies', desc: 'AI-powered message suggestions' },
      { icon: Globe, title: 'Translation', desc: 'Real-time message translation' },
      { icon: Shield, title: 'Scam Detection', desc: 'Client-side fraud alerts' },
      { icon: Bot, title: 'Voice-to-Text', desc: 'Automatic transcription' },
    ]
  }

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      features: ['Basic messaging', '1GB storage', 'Group chats up to 100', 'Basic calls'],
      popular: false
    },
    {
      name: 'Superchat Plus',
      price: '$5',
      period: '/month',
      features: ['8GB file uploads', 'AI tools', 'Vanity usernames', 'Advanced search', 'Priority support'],
      popular: true
    },
    {
      name: 'Business Suite',
      price: '$15',
      period: '/month',
      features: ['Verified accounts', 'CRM tools', 'Campaigns', 'Analytics', 'API access'],
      popular: false
    }
  ]

  // Show loading state
  if (isLoading) {
    console.log('Showing loading state...')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading Superchat...</p>
        </div>
      </div>
    )
  }

  // Show chat interface if user is logged in
  if (user) {
    console.log('User is logged in, showing chat layout')
    return <ChatLayout />
  }

  // Show welcome page if user is not logged in
  console.log('User is not logged in, showing welcome page')
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Superchat</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
              <a href="#download" className="text-white/80 hover:text-white transition-colors">Download</a>
              <button className="btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Superchat</span>
              <br />
              <span className="text-white">The Ultimate</span>
              <br />
              <span className="gradient-text">Chatting App</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Chat. Own. Earn. Replace all your existing chat apps with one unified platform that combines smooth Web2 experience with powerful Web3 features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn-primary flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download Now</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Try Web Version</span>
              </button>
            </div>
            
            {/* Login Form */}
            <div className="mt-16">
              <LoginForm />
            </div>
          </motion.div>

          {/* Platform Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 flex justify-center items-center space-x-8"
          >
            <div className="flex items-center space-x-2 text-white/60">
              <Smartphone className="w-6 h-6" />
              <span>iOS & Android</span>
            </div>
            <div className="flex items-center space-x-2 text-white/60">
              <Monitor className="w-6 h-6" />
              <span>Web & Desktop</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="gradient-text"> Chat Better</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              From basic messaging to advanced Web3 features, Superchat has everything to replace all your existing chat apps.
            </p>
          </motion.div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.keys(features).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'glass-effect text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Feature Grid */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features[activeTab as keyof typeof features].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="feature-icon mx-auto mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="gradient-text">Vision</span>
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              Superchat is designed to replace all existing chatting apps by combining smooth, reliable Web2 experience with powerful Web3 features, all while maintaining a revenue-first strategy that profits while users chat.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="feature-icon mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Web2 Experience</h3>
              <p className="text-white/70">Fast, familiar, and reliable messaging with all the features you expect from modern chat apps.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="feature-icon mx-auto mb-4">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Web3 Features</h3>
              <p className="text-white/70">Privacy, token-gated chats, NFT ownership, and creator monetization built-in.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="feature-icon mx-auto mb-4">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Revenue First</h3>
              <p className="text-white/70">Profit while users chat through subscriptions, creator monetization, and premium features.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your <span className="gradient-text">Plan</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Start free and upgrade as you need more features. Our revenue model ensures we profit while you chat.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card relative ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-white/60">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-primary-400 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Superchat</span>?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join millions of users who have already replaced their chat apps with Superchat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn-primary flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download for Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn-secondary">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Superchat</span>
            </div>
            <div className="flex space-x-6 text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/40">
            <p>&copy; 2024 Superchat. All rights reserved. Chat. Own. Earn.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
