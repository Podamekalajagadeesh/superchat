'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video,
  ArrowLeft
} from 'lucide-react'

interface ChatAreaProps {
  selectedChat: string | null
  onBack: () => void
}

// Mock data for messages
const mockMessages = {
  '1': [
    {
      id: '1',
      sender: 'Alice Johnson',
      content: 'Hey everyone! How is the project going?',
      timestamp: new Date(Date.now() - 120000),
      isOwn: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '2',
      sender: 'You',
      content: 'Great! Just finished the authentication system.',
      timestamp: new Date(Date.now() - 60000),
      isOwn: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '3',
      sender: 'Bob Smith',
      content: 'Awesome! Can you share the code?',
      timestamp: new Date(Date.now() - 30000),
      isOwn: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
  ],
  '2': [
    {
      id: '1',
      sender: 'Alice Johnson',
      content: 'Thanks for the help with the Web3 integration!',
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '2',
      sender: 'You',
      content: 'No problem! Let me know if you need anything else.',
      timestamp: new Date(Date.now() - 3500000),
      isOwn: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    },
  ],
}

const chatNames = {
  '1': 'General Chat',
  '2': 'Alice Johnson',
  '3': 'Web3 Developers',
  '4': 'Bob Smith',
}

export default function ChatArea({ selectedChat, onBack }: ChatAreaProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(mockMessages[selectedChat as keyof typeof mockMessages] || [])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMessages(mockMessages[selectedChat as keyof typeof mockMessages] || [])
  }, [selectedChat])

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return

    const newMessage = {
      id: Date.now().toString(),
      sender: 'You',
      content: message,
      timestamp: new Date(),
      isOwn: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-12 h-12 text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Select a Chat</h3>
          <p className="text-white/60">Choose a conversation to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Chat"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-white">{chatNames[selectedChat as keyof typeof chatNames]}</h3>
              <p className="text-sm text-green-400">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {!msg.isOwn && (
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              )}
              <div className={`rounded-2xl px-4 py-2 ${
                msg.isOwn 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white/10 text-white'
              }`}>
                {!msg.isOwn && (
                  <p className="text-xs text-white/60 mb-1">{msg.sender}</p>
                )}
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-colors resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              <button className="p-1 text-white/40 hover:text-white transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-1 text-white/40 hover:text-white transition-colors">
                <Smile className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
