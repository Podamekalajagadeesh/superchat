'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { useAuth } from '@/contexts/AuthContext'
import { Message, Chat, User } from '@/types/socket'

interface ChatContextType {
  chats: Chat[]
  currentChat: Chat | null
  messages: Message[]
  onlineUsers: User[]
  typingUsers: { userId: string; username: string; chatId: string }[]
  isConnected: boolean
  selectChat: (chat: Chat) => void
  sendMessage: (content: string) => void
  startTyping: () => void
  stopTyping: () => void
  createDirectChat: (user: User) => void
  createGroupChat: (name: string, participants: User[]) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { 
    isConnected, 
    sendMessage: socketSendMessage, 
    joinChat, 
    leaveChat, 
    startTyping: socketStartTyping, 
    stopTyping: socketStopTyping,
    onlineUsers,
    typingUsers
  } = useSocket()

  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Mock data for demonstration
  useEffect(() => {
    if (user) {
      const mockChats: Chat[] = [
        {
          id: '1',
          name: 'General Chat',
          type: 'group',
          participants: [
            { id: '1', name: 'John Doe', username: 'johndoe', status: 'online' },
            { id: '2', name: 'Jane Smith', username: 'janesmith', status: 'online' },
            { id: user.id, name: user.name, username: user.username, status: 'online' }
          ],
          lastMessage: {
            id: '1',
            content: 'Welcome to Superchat!',
            sender: { id: '1', name: 'John Doe', username: 'johndoe' },
            chatId: '1',
            timestamp: new Date().toISOString(),
            type: 'text'
          },
          unreadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'direct',
          participants: [
            { id: '2', name: 'Jane Smith', username: 'janesmith', status: 'online' },
            { id: user.id, name: user.name, username: user.username, status: 'online' }
          ],
          lastMessage: {
            id: '2',
            content: 'Hey there!',
            sender: { id: '2', name: 'Jane Smith', username: 'janesmith' },
            chatId: '2',
            timestamp: new Date().toISOString(),
            type: 'text'
          },
          unreadCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      setChats(mockChats)
    }
  }, [user])

  // Mock messages for demonstration
  useEffect(() => {
    if (currentChat) {
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Welcome to Superchat!',
          sender: { id: '1', name: 'John Doe', username: 'johndoe' },
          chatId: currentChat.id,
          timestamp: new Date(Date.now() - 60000).toISOString(),
          type: 'text'
        },
        {
          id: '2',
          content: 'This is a real-time chat application!',
          sender: { id: '2', name: 'Jane Smith', username: 'janesmith' },
          chatId: currentChat.id,
          timestamp: new Date(Date.now() - 30000).toISOString(),
          type: 'text'
        },
        {
          id: '3',
          content: 'Amazing! I love the interface.',
          sender: { id: user?.id || '3', name: user?.name || 'You', username: user?.username || 'you' },
          chatId: currentChat.id,
          timestamp: new Date().toISOString(),
          type: 'text'
        }
      ]
      setMessages(mockMessages)
    }
  }, [currentChat, user])

  const selectChat = (chat: Chat) => {
    if (currentChat) {
      leaveChat(currentChat.id)
    }
    setCurrentChat(chat)
    joinChat(chat.id)
  }

  const sendMessage = (content: string) => {
    if (!currentChat || !content.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: {
        id: user?.id || '',
        name: user?.name || '',
        username: user?.username || '',
        image: user?.image
      },
      chatId: currentChat.id,
      timestamp: new Date().toISOString(),
      type: 'text'
    }

    setMessages(prev => [...prev, newMessage])
    socketSendMessage(currentChat.id, content.trim())
    stopTyping()
  }

  const startTyping = () => {
    if (!currentChat) return
    
    socketStartTyping(currentChat.id)
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  const stopTyping = () => {
    if (!currentChat) return
    
    socketStopTyping(currentChat.id)
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  const createDirectChat = (participant: User) => {
    const existingChat = chats.find(chat => 
      chat.type === 'direct' && 
      chat.participants.some(p => p.id === participant.id)
    )

    if (existingChat) {
      selectChat(existingChat)
      return
    }

    const newChat: Chat = {
      id: Date.now().toString(),
      type: 'direct',
      participants: [participant, { 
        id: user?.id || '', 
        name: user?.name || '', 
        username: user?.username || '', 
        status: 'online' 
      }],
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setChats(prev => [...prev, newChat])
    selectChat(newChat)
  }

  const createGroupChat = (name: string, participants: User[]) => {
    const newChat: Chat = {
      id: Date.now().toString(),
      name,
      type: 'group',
      participants: [...participants, { 
        id: user?.id || '', 
        name: user?.name || '', 
        username: user?.username || '', 
        status: 'online' 
      }],
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setChats(prev => [...prev, newChat])
    selectChat(newChat)
  }

  const value = {
    chats,
    currentChat,
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    selectChat,
    sendMessage,
    startTyping,
    stopTyping,
    createDirectChat,
    createGroupChat
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
