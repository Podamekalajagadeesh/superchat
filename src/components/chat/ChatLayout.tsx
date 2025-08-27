'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useChat } from '@/contexts/ChatContext'
import ChatSidebar from './ChatSidebar'
import ChatArea from './ChatArea'
import { Menu, X } from 'lucide-react'

export default function ChatLayout() {
  const { user } = useAuth()
  const { currentChat } = useChat()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-500 rounded-lg text-white"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:block z-40 h-full
        ${sidebarOpen ? 'block' : 'hidden'}
        w-80 bg-dark-800 border-r border-white/10
      `}>
        <ChatSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <ChatArea />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">💬</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Superchat</h2>
              <p className="text-gray-400 mb-6">Select a chat to start messaging</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Real-time messaging ready</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
