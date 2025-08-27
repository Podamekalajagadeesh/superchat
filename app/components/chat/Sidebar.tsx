'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../auth/AuthProvider'
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Users, 
  Settings, 
  LogOut,
  User,
  Crown,
  Shield
} from 'lucide-react'

interface SidebarProps {
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
  onClose: () => void
}

// Mock data for chats
const mockChats = [
  {
    id: '1',
    name: 'General Chat',
    type: 'group' as const,
    lastMessage: 'Hey everyone! How is the project going?',
    lastMessageTime: '2 min ago',
    unreadCount: 3,
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Alice Johnson',
    type: 'direct' as const,
    lastMessage: 'Thanks for the help!',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Web3 Developers',
    type: 'group' as const,
    lastMessage: 'New NFT collection launching soon!',
    lastMessageTime: '3 hours ago',
    unreadCount: 12,
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'Bob Smith',
    type: 'direct' as const,
    lastMessage: 'Can you review the code?',
    lastMessageTime: '1 day ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
  },
]

export default function Sidebar({ selectedChat, onSelectChat, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'chats' | 'groups' | 'channels'>('chats')

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
            alt={user?.username}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-white">{user?.username}</h3>
            <p className="text-sm text-green-400 flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Online
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-colors text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chats'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <MessageCircle className="w-4 h-4 inline mr-2" />
          Chats
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'groups'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Groups
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'channels'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Crown className="w-4 h-4 inline mr-2" />
          Channels
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                onSelectChat(chat.id)
                onClose()
              }}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedChat === chat.id
                  ? 'bg-primary-500/20 border border-primary-500/30'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {chat.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-dark-800"></div>
                  )}
                  {chat.type === 'group' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-dark-800 flex items-center justify-center">
                      <Users className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white truncate">{chat.name}</h4>
                    <span className="text-xs text-white/40">{chat.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-white/60 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex space-x-2">
          <button className="flex-1 btn-secondary py-2 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </button>
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
