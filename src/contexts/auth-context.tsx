import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing auth token on mount
  useEffect(() => {
    const authToken = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')
    
    if (authToken && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Please fill in all fields')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email')
    }

    // Simulate API call
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
    }

    localStorage.setItem('authToken', 'demo-token-' + Date.now())
    localStorage.setItem('user', JSON.stringify(mockUser))
    setUser(mockUser)
  }

  const register = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      throw new Error('Please fill in all fields')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Simulate API call
    const mockUser: User = {
      id: '1',
      email,
      name,
    }

    localStorage.setItem('authToken', 'demo-token-' + Date.now())
    localStorage.setItem('user', JSON.stringify(mockUser))
    setUser(mockUser)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
