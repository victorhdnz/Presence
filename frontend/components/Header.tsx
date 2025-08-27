'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, X, User, Home, Building2, LogOut, ArrowLeft } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const handleGoBack = () => {
    // Verificar se há histórico para voltar
    if (window.history.length > 1) {
      // Tentar voltar usando router.back()
      try {
        router.back()
      } catch (error) {
        // Se der erro, ir para a página inicial
        router.push('/')
      }
    } else {
      // Se não houver histórico, ir para a página inicial
      router.push('/')
    }
    setIsMenuOpen(false)
  }

  const showBackButton = pathname !== '/'

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Botão Voltar */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {showBackButton && (
              <button
                onClick={handleGoBack}
                className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                title="Voltar"
                aria-label="Voltar para página anterior"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              <span className="text-lg sm:text-xl font-bold text-gray-900">Presence</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Início
            </Link>
            <Link href="/imoveis" className="text-gray-700 hover:text-primary-600 transition-colors">
              Imóveis
            </Link>
            <Link href="/sobre" className="text-gray-700 hover:text-primary-600 transition-colors">
              Sobre
            </Link>
            <Link href="/contato" className="text-gray-700 hover:text-primary-600 transition-colors">
              Contato
            </Link>
          </nav>

          {/* Auth Section - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' && (
                  <Link href="/admin" className="btn-primary">
                    Dashboard
                  </Link>
                )}
                {user?.role !== 'admin' && (
                  <Link href="/cadastrar-imovel" className="btn-secondary">
                    Cadastrar Imóvel
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Entrar
                </Link>
                <Link href="/register" className="btn-primary">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              <Link 
                href="/" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                href="/imoveis" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Imóveis
              </Link>
              <Link 
                href="/sobre" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link 
                href="/contato" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
            </nav>

            <div className="border-t border-gray-200 mt-4 pt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  {user?.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="block px-3 py-2 bg-primary-600 text-white rounded-md font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {user?.role !== 'admin' && (
                    <Link 
                      href="/cadastrar-imovel" 
                      className="block px-3 py-2 bg-gray-200 text-gray-800 rounded-md font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cadastrar Imóvel
                    </Link>
                  )}
                  <div className="px-3 py-2 text-gray-700">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <span>{user?.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link 
                    href="/login" 
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link 
                    href="/register" 
                    className="block px-3 py-2 bg-primary-600 text-white rounded-md font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
