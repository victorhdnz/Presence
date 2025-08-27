'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  role: 'client' | 'admin'
  phone?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há token salvo
    const savedToken = localStorage.getItem('presence_token')
    if (savedToken) {
      setToken(savedToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
      fetchUserProfile()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile')
      setUser(response.data)
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      localStorage.removeItem('presence_token')
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await api.post('/auth/login', { email, password })
      
      const { token: newToken, user: userData } = response.data
      
      localStorage.setItem('presence_token', newToken)
      setToken(newToken)
      setUser(userData)
      
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      toast.success('Login realizado com sucesso!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      setIsLoading(true)
      const response = await api.post('/auth/register', { name, email, password, phone })
      
      const { token: newToken, user: userData } = response.data
      
      localStorage.setItem('presence_token', newToken)
      setToken(newToken)
      setUser(userData)
      
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      toast.success('Conta criada com sucesso!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar conta'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('presence_token')
    setToken(null)
    setUser(null)
    delete api.defaults.headers.common['Authorization']
    toast.success('Logout realizado com sucesso!')
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
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
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
