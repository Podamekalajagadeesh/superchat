'use client'

import { Message } from '@/types/socket'
import { formatDistanceToNow } from 'date-fns'
import { MoreVertical, Check, CheckCheck } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
  isOwnMessage: boolean
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        {/* Sender info for group chats */}
        {!isOwnMessage && message.chatId === '1' && (
          <div className="mb-1 ml-2">
            <span className="text-xs text-gray-400 font-medium">
              {message.sender.name}
            </span>
          </div>
        )}
        
        <div className={`flex items-end space-x-2 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {/* Avatar */}
          {!isOwnMessage && (
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {message.sender.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          {/* Message Content */}
          <div className={`relative group ${isOwnMessage ? 'order-1' : 'order-2'}`}>
            <div
              className={`
                px-4 py-2 rounded-2xl max-w-full break-words
                ${isOwnMessage 
                  ? 'bg-primary-500 text-white rounded-br-md' 
                  : 'bg-white/10 text-white rounded-bl-md'
                }
              `}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            
            {/* Message Actions */}
            <div className={`
              absolute top-0 ${isOwnMessage ? '-left-8' : '-right-8'} 
              opacity-0 group-hover:opacity-100 transition-opacity
            `}>
              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                <MoreVertical size={14} />
              </button>
            </div>
          </div>
          
          {/* Timestamp and Status */}
          <div className={`flex items-center space-x-1 ${isOwnMessage ? 'order-2' : 'order-1'}`}>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </span>
            {isOwnMessage && (
              <div className="flex items-center">
                {message.readBy && message.readBy.length > 0 ? (
                  <CheckCheck size={12} className="text-blue-400" />
                ) : (
                  <Check size={12} className="text-gray-400" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
