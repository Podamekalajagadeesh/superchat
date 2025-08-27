'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../auth/AuthProvider'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import { Menu, X } from 'lucide-react'

export default function ChatLayout() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState<string | null>('1') // Default to first chat

  if (!user) {
    return null
  }

  return (
    <div className="h-screen flex bg-dark-900">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`fixed md:relative z-40 w-80 h-full bg-dark-800 border-r border-white/10 ${
          sidebarOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <Sidebar
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onClose={() => setSidebarOpen(false)}
        />
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatArea
          selectedChat={selectedChat}
          onBack={() => setSidebarOpen(true)}
        />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
