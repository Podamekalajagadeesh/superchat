'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Message, User, TypingIndicator, ReadReceipt } from '@/types/socket'

interface UseSocketReturn {
  socket: null
  isConnected: boolean
  sendMessage: (chatId: string, message: string) => void
  joinChat: (chatId: string) => void
  leaveChat: (chatId: string) => void
  startTyping: (chatId: string) => void
  stopTyping: (chatId: string) => void
  markMessageAsRead: (messageId: string, chatId: string) => void
  onlineUsers: User[]
  typingUsers: TypingIndicator[]
}

export function useSocket(): UseSocketReturn {
  const { user, isAuthenticated } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([])
  const socketRef = useRef<null>(null)

  useEffect(() => {
    if (!isAuthenticated || !user) return

    // Simulate connection for demo
    setIsConnected(true)
    
    // Mock online users
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        status: 'online'
      },
      {
        id: '2',
        name: 'Jane Smith',
        username: 'janesmith',
        status: 'online'
      }
    ]
    setOnlineUsers(mockUsers)

    return () => {
      setIsConnected(false)
    }
  }, [isAuthenticated, user])

  const sendMessage = (chatId: string, message: string) => {
    // Mock implementation - in real app this would send via Socket.IO
    console.log('Sending message:', { chatId, message })
  }

  const joinChat = (chatId: string) => {
    // Mock implementation
    console.log('Joining chat:', chatId)
  }

  const leaveChat = (chatId: string) => {
    // Mock implementation
    console.log('Leaving chat:', chatId)
  }

  const startTyping = (chatId: string) => {
    // Mock implementation
    console.log('Started typing in chat:', chatId)
  }

  const stopTyping = (chatId: string) => {
    // Mock implementation
    console.log('Stopped typing in chat:', chatId)
  }

  const markMessageAsRead = (messageId: string, chatId: string) => {
    // Mock implementation
    console.log('Marking message as read:', { messageId, chatId })
  }

  return {
    socket: null,
    isConnected,
    sendMessage,
    joinChat,
    leaveChat,
    startTyping,
    stopTyping,
    markMessageAsRead,
    onlineUsers,
    typingUsers
  }
}
