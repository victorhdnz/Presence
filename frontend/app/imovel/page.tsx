'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { MapPin, Bed, Bath, Car, Ruler, Phone, Mail, ArrowLeft, Star } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function PropertyDetails() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const propertyId = searchParams.get('id')

  useEffect(() => {
    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/properties/${propertyId}`)
      setProperty(response.data)
    } catch (error) {
      toast.error('Erro ao carregar detalhes do imóvel')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (!propertyId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ID do imóvel não fornecido</h1>
          <button
            onClick={() => router.back()}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando imóvel...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Imóvel não encontrado</h1>
          <button
            onClick={() => router.back()}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Detalhes do Imóvel</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagens */}
          <div className="space-y-4">
            {/* Imagem principal */}
            <div className="relative">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images.find((img: any) => img.isMain)?.url || property.images[0].url}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Sem imagem</p>
                </div>
              )}
              
              {property.isHighlighted && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Destaque
                </div>
              )}
              
              <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                {property.purpose === 'venda' ? 'Venda' : 'Aluguel'}
              </div>
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-6">
            {/* Título e preço */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-2xl font-bold text-primary-600 mb-2">
                {formatPrice(property.price)}
              </p>
              <p className="text-gray-600 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {property.neighborhood}
              </p>
            </div>

            {/* Características principais */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <Bed className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Quartos</p>
                <p className="text-xl font-semibold text-gray-900">{property.bedrooms}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Bath className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Banheiros</p>
                <p className="text-xl font-semibold text-gray-900">{property.bathrooms}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Car className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Vagas</p>
                <p className="text-xl font-semibold text-gray-900">{property.parkingSpaces}</p>
              </div>
            </div>

            {/* Área */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Ruler className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="text-gray-600">Área Total:</span>
                </div>
                <span className="font-semibold text-gray-900">{property.totalArea}m²</span>
              </div>
            </div>

            {/* Descrição */}
            {property.longDescription && (
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                <p className="text-gray-600 leading-relaxed">{property.longDescription}</p>
              </div>
            )}

            {/* Corretor */}
            {property.corretor && (
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Corretor Responsável</h3>
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">{property.corretor.name}</p>
                  {property.corretor.whatsapp && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href={`https://wa.me/${property.corretor.whatsapp}`} className="hover:text-primary-600">
                        {property.corretor.whatsapp}
                      </a>
                    </div>
                  )}
                  {property.corretor.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${property.corretor.email}`} className="hover:text-primary-600">
                        {property.corretor.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
