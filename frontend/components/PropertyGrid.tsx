'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Home, MapPin, Car, Bed, Bath, DollarSign, Star } from 'lucide-react'

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
}

export default function PropertyGrid() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando imóveis...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Imóveis em Destaque
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra as melhores oportunidades de compra e aluguel em São Paulo
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum imóvel encontrado
            </h3>
            <p className="text-gray-600">
              Em breve teremos imóveis disponíveis para você.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property._id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  property.isHighlighted ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                {/* Imagem */}
                <div className="relative h-48 bg-gray-200">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images.find(img => img.isMain)?.url || property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Home className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
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
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.neighborhood}</span>
                  </div>

                  {/* Preço */}
                  <div className="text-2xl font-bold text-primary-600 mb-4">
                    {formatPrice(property.price)}
                  </div>

                  {/* Características */}
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.bedrooms} quartos</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.bathrooms} banheiros</span>
                    </div>
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-1" />
                      <span>{property.parkingSpaces} vagas</span>
                    </div>
                  </div>

                  {property.totalArea && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Área:</span> {property.totalArea}m²
                    </div>
                  )}

                  {/* Botão */}
                  <Link
                    href={`/imovel/${property._id}`}
                    className="mt-4 w-full btn-primary text-center block"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão Ver Todos */}
        <div className="text-center mt-12">
          <Link href="/imoveis" className="btn-secondary text-lg px-8 py-3">
            Ver Todos os Imóveis
          </Link>
        </div>
      </div>
    </section>
  )
}
