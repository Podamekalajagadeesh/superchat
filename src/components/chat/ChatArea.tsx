'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useChat } from '@/contexts/ChatContext'
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Search,
  Users
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import MessageBubble from './MessageBubble'

export default function ChatArea() {
  const { user } = useAuth()
  const { 
    currentChat, 
    messages, 
    sendMessage, 
    startTyping, 
    stopTyping,
    typingUsers,
    isConnected 
  } = useChat()
  
  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle typing indicator
  useEffect(() => {
    if (messageInput.length > 0 && !isTyping) {
      setIsTyping(true)
      startTyping()
    } else if (messageInput.length === 0 && isTyping) {
      setIsTyping(false)
      stopTyping()
    }

    // Clear typing indicator after 2 seconds of no input
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    if (messageInput.length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        stopTyping()
      }, 2000)
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [messageInput, isTyping, startTyping, stopTyping])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput)
      setMessageInput('')
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!currentChat) return null

  const otherParticipants = currentChat.participants.filter(p => p.id !== user?.id)
  const typingUsersInChat = typingUsers.filter(t => t.chatId === currentChat.id)

  return (
    <div className="h-full flex flex-col bg-dark-700">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 bg-dark-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {currentChat.type === 'group' ? (
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {otherParticipants[0]?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-white font-semibold">
                {currentChat.type === 'group' ? currentChat.name : otherParticipants[0]?.name}
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-gray-400 text-sm">
                  {currentChat.type === 'group' 
                    ? `${currentChat.participants.length} members`
                    : (otherParticipants[0]?.status === 'online' ? 'Online' : 'Offline')
                  }
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Search size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Phone size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Video size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.sender.id === user?.id}
          />
        ))}
        
        {/* Typing Indicator */}
        {typingUsersInChat.length > 0 && (
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>
              {typingUsersInChat.map(t => t.username).join(', ')} 
              {typingUsersInChat.length === 1 ? ' is ' : ' are '} 
              typing...
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10 bg-dark-800">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors resize-none"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Paperclip size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Smile size={20} />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
