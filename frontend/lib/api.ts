import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    // Verificar se está no browser antes de acessar localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('presence_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('Token anexado à requisição:', token.substring(0, 20) + '...')
      } else {
        console.log('Nenhum token encontrado no localStorage')
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('presence_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
