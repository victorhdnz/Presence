'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import {
  Home, MapPin, Car, Bed, Bath, DollarSign, Star,
  Search, Filter, SlidersHorizontal, MessageCircle
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Property {
  _id: string
  title: string
  price: number
  neighborhood: string
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  totalArea?: number
  purpose: 'venda' | 'aluguel'
  images: Array<{ url: string; isMain: boolean }>
  isHighlighted: boolean
  status: string
  corretor?: {
    name: string
    whatsapp: string
    email: string
  }
  whatsappLink?: string
}

export default function ImoveisPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [purposeFilter, setPurposeFilter] = useState<'todos' | 'venda' | 'aluguel'>('todos')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties')
      setProperties(response.data)
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const handleWhatsAppContact = (property: Property) => {
    if (property.whatsappLink) {
      window.open(property.whatsappLink, '_blank')
    } else if (property.corretor?.whatsapp) {
      const phone = property.corretor.whatsapp.replace(/\D/g, '')
      const message = `Olá! Tenho interesse no imóvel: ${property.title} - ${property.neighborhood}`
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  const filteredProperties = properties.filter(property => {
    // Filtro por texto
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro por finalidade
    const matchesPurpose = purposeFilter === 'todos' || property.purpose === purposeFilter

    // Filtro por preço
    const matchesPrice = (!priceRange.min || property.price >= Number(priceRange.min)) &&
                        (!priceRange.max || property.price <= Number(priceRange.max))

    return matchesSearch && matchesPurpose && matchesPrice
  })

  const clearFilters = () => {
    setSearchTerm('')
    setPurposeFilter('todos')
    setPriceRange({ min: '', max: '' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="bg-gray-50 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Imóveis Disponíveis
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Encontre o imóvel perfeito para você
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-3 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Filter className="h-4 w-4" />
                  <span>{showFilters ? 'Ocultar' : 'Mostrar'}</span>
                </button>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
            
            {/* Filtros Mobile - Colapsáveis */}
            <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Busca */}
                <div className="sm:col-span-2 lg:col-span-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar imóveis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Finalidade */}
                <div className="relative">
                  <select
                    value={purposeFilter}
                    onChange={(e) => setPurposeFilter(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="todos">Todas as Finalidades</option>
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                  </select>
                </div>

                {/* Preço Mínimo */}
                <input
                  type="number"
                  placeholder="Preço mínimo"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />

                {/* Preço Máximo */}
                <input
                  type="number"
                  placeholder="Preço máximo"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {filteredProperties.length} imóveis encontrados
              </h2>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Filter className="h-4 w-4" />
                <span>
                  {searchTerm || purposeFilter !== 'todos' || priceRange.min || priceRange.max 
                    ? 'Filtros aplicados' 
                    : 'Sem filtros'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Grid de Imóveis */}
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros ou volte mais tarde.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredProperties.map((property) => (
                <div
                  key={property._id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                    property.isHighlighted ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  {/* Imagem */}
                  <div className="relative h-48 sm:h-56 bg-gray-200">
                    {property.images && property.images.length > 0 && property.images[0].url ? (
                      <img
                        src={property.images.find(img => img.isMain)?.url || property.images[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    ) : null}
                    <div className={`flex items-center justify-center h-full ${property.images && property.images.length > 0 && property.images[0].url ? 'hidden' : ''}`}>
                      <Home className="h-12 w-12 text-gray-400" />
                    </div>
                    
                    {property.isHighlighted && (
                      <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        <Star className="h-3 w-3 inline mr-1" />
                        Destaque
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2 bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {property.purpose === 'venda' ? 'Venda' : 'Aluguel'}
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm truncate">{property.neighborhood}</span>
                    </div>

                    {/* Preço */}
                    <div className="text-xl sm:text-2xl font-bold text-primary-600 mb-4">
                      {formatPrice(property.price)}
                    </div>

                    {/* Características */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Bed className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{property.bedrooms} quartos</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{property.bathrooms} banheiros</span>
                      </div>
                      <div className="flex items-center">
                        <Car className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{property.parkingSpaces} vagas</span>
                      </div>
                    </div>

                    {property.totalArea && (
                      <div className="text-xs sm:text-sm text-gray-600 mb-3">
                        <span className="font-medium">Área:</span> {property.totalArea}m²
                      </div>
                    )}

                    {/* Corretora responsável */}
                    {property.corretor && (
                      <div className="text-xs sm:text-sm text-gray-600 mb-3">
                        <span className="font-medium">Corretor:</span> {property.corretor.name}
                      </div>
                    )}

                    {/* Botões */}
                    <div className="space-y-2">
                      <Link
                        href={`/imovel?id=${property._id}`}
                        className="w-full btn-primary text-center block text-sm sm:text-base py-2 sm:py-3"
                      >
                        Ver Detalhes
                      </Link>
                      
                      <button
                        onClick={() => handleWhatsAppContact(property)}
                        className="w-full btn-secondary flex items-center justify-center space-x-2 text-sm sm:text-base py-2 sm:py-3"
                      >
                        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Entre em Contato</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
