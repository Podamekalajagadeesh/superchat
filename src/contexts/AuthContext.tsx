'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  username: string
  image?: string
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signInWithCredentials: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGitHub: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  username: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    if (session?.user) {
      setUser({
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        username: session.user.username || '',
        image: session.user.image || undefined,
        isVerified: true
      })
    } else {
      setUser(null)
    }

    setIsLoading(false)
  }, [session, status])

  const signInWithCredentials = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      throw error
    }
  }

  const signInWithGitHub = async () => {
    try {
      await signIn('github', { callbackUrl: '/dashboard' })
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      // Auto sign in after registration
      await signInWithCredentials(data.email, data.password)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      setUser(null)
      router.push('/')
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithCredentials,
    signInWithGoogle,
    signInWithGitHub,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
