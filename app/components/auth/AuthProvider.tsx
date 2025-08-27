'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  username: string
  email?: string
  phone?: string
  avatar?: string
  walletAddress?: string
  isOnline: boolean
  lastSeen: Date
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithWallet: () => Promise<void>
  logout: () => void
  register: (userData: RegisterData) => Promise<void>
}

interface LoginCredentials {
  email?: string
  phone?: string
  password: string
}

interface RegisterData {
  username: string
  email?: string
  phone?: string
  password: string
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  loginWithWallet: async () => {},
  logout: () => {},
  register: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check localStorage for saved session
      const savedUser = localStorage.getItem('superchat_user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual API call
      // For now, simulate login
      const mockUser: User = {
        id: '1',
        username: 'demo_user',
        email: credentials.email,
        phone: credentials.phone,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isOnline: true,
        lastSeen: new Date(),
        createdAt: new Date(),
      }
      
      setUser(mockUser)
      localStorage.setItem('superchat_user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithWallet = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement wallet connection
      // Check if MetaMask is available
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const walletAddress = accounts[0]
        
        const mockUser: User = {
          id: '2',
          username: `user_${walletAddress.slice(2, 8)}`,
          walletAddress,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          isOnline: true,
          lastSeen: new Date(),
          createdAt: new Date(),
        }
        
        setUser(mockUser)
        localStorage.setItem('superchat_user', JSON.stringify(mockUser))
      } else {
        throw new Error('MetaMask not found')
      }
    } catch (error) {
      console.error('Wallet login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual API call
      const mockUser: User = {
        id: '3',
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isOnline: true,
        lastSeen: new Date(),
        createdAt: new Date(),
      }
      
      setUser(mockUser)
      localStorage.setItem('superchat_user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('superchat_user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      loginWithWallet,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
