"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { authStorage } from '@/lib/auth'
import type { AuthState, User } from '@/types/auth'

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Verificar autenticação no carregamento inicial
    const token = authStorage.getToken()
    const user = authStorage.getUser()

    setAuthState({
      user,
      token,
      isAuthenticated: !!token,
      isLoading: false,
    })
  }, [])

  const login = (user: User, token: string) => {
    authStorage.setToken(token)
    authStorage.setUser(user)
    
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    })
  }

  const logout = () => {
    authStorage.clear()
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
    
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}