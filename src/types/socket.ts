import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    username: string
    image?: string
  }
  chatId: string
  timestamp: string
  type: 'text' | 'image' | 'file' | 'voice' | 'video'
  readBy?: string[]
  deliveredTo?: string[]
}

export interface Chat {
  id: string
  name?: string
  type: 'direct' | 'group' | 'channel'
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  avatar?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  username: string
  image?: string
  status: 'online' | 'offline' | 'away' | 'busy'
  lastSeen?: string
  socketId?: string
}

export interface TypingIndicator {
  userId: string
  username: string
  chatId: string
}

export interface ReadReceipt {
  messageId: string
  userId: string
  timestamp: string
}
