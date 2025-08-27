'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useChat } from '@/contexts/ChatContext'
import { 
  Search, 
  Plus, 
  Users, 
  MessageCircle, 
  MoreVertical,
  LogOut,
  Settings
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ChatSidebarProps {
  onClose: () => void
}

export default function ChatSidebar({ onClose }: ChatSidebarProps) {
  const { user, logout } = useAuth()
  const { 
    chats, 
    currentChat, 
    selectChat, 
    onlineUsers, 
    isConnected,
    createDirectChat 
  } = useChat()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'chats' | 'users'>('chats')

  const filteredChats = chats.filter(chat => 
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const filteredUsers = onlineUsers.filter(onlineUser => 
    onlineUser.id !== user?.id &&
    (onlineUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     onlineUser.username.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="h-full flex flex-col bg-dark-800">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-white font-semibold">{user?.name}</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-gray-400 text-sm">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings size={16} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search chats or users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'chats'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <MessageCircle size={16} />
            <span>Chats</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Users size={16} />
            <span>Users</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' ? (
          <div className="p-4 space-y-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  selectChat(chat)
                  onClose()
                }}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${currentChat?.id === chat.id
                    ? 'bg-primary-500/20 border border-primary-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {chat.type === 'group' ? (
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Users size={20} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {chat.participants.find(p => p.id !== user?.id)?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {chat.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium truncate">
                        {chat.type === 'group' ? chat.name : chat.participants.find(p => p.id !== user?.id)?.name}
                      </h4>
                      {chat.lastMessage && (
                        <span className="text-gray-400 text-xs">
                          {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <p className="text-gray-400 text-sm truncate">
                        {chat.lastMessage.sender.id === user?.id ? 'You: ' : ''}
                        {chat.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredUsers.map((onlineUser) => (
              <div
                key={onlineUser.id}
                onClick={() => {
                  createDirectChat(onlineUser)
                  onClose()
                }}
                className="p-3 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-200 border border-transparent"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {onlineUser.image ? (
                      <img
                        src={onlineUser.image}
                        alt={onlineUser.name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {onlineUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-800 ${
                      onlineUser.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{onlineUser.name}</h4>
                    <p className="text-gray-400 text-sm">@{onlineUser.username}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
