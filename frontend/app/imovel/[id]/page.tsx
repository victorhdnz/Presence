'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Building2, Home, MapPin, DollarSign, Bed, Bath, Car, Ruler, Phone, Mail, ArrowLeft, Star } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface Property {
  _id: string
  title: string
  purpose: 'venda' | 'aluguel'
  price: number
  neighborhood: string
  address: string
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  landSize?: number
  totalArea: number
  images: Array<{
    url: string
    isMain: boolean
  }>
  longDescription: string
  details: {
    type: string
    age: string
    condition: string
    features: string[]
  }
  features: string[]
  status: string
  isHighlighted: boolean
  corretor: {
    name: string
    whatsapp: string
    email: string
  }
  createdAt: string
}

export default function PropertyDetails() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImageIndex, setMainImageIndex] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/properties/${params.id}`)
      setProperty(response.data)
      
      // Encontrar índice da imagem principal
      const mainImageIndex = response.data.images.findIndex((img: any) => img.isMain)
      setMainImageIndex(mainImageIndex >= 0 ? mainImageIndex : 0)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
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
              <img
                src={property.images[mainImageIndex]?.url || '/placeholder-property.jpg'}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
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

            {/* Miniaturas */}
            {property.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImageIndex(index)}
                    className={`relative overflow-hidden rounded-lg ${
                      index === mainImageIndex ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${property.title} - Imagem ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                    {image.isMain && (
                      <div className="absolute top-1 right-1 bg-primary-600 text-white rounded-full p-1">
                        <Star className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
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
                {property.neighborhood}, {property.address}
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
              {property.landSize && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600">Área do Terreno:</span>
                  <span className="font-semibold text-gray-900">{property.landSize}m²</span>
                </div>
              )}
            </div>

            {/* Descrição */}
            {property.longDescription && (
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                <p className="text-gray-600 leading-relaxed">{property.longDescription}</p>
              </div>
            )}

            {/* Detalhes */}
            {property.details && (
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Detalhes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.details.type && (
                    <div>
                      <span className="text-gray-600">Tipo:</span>
                      <span className="ml-2 font-medium">{property.details.type}</span>
                    </div>
                  )}
                  {property.details.age && (
                    <div>
                      <span className="text-gray-600">Idade:</span>
                      <span className="ml-2 font-medium">{property.details.age}</span>
                    </div>
                  )}
                  {property.details.condition && (
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <span className="ml-2 font-medium">{property.details.condition}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Características */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Características</h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Corretor */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-3">Corretor Responsável</h3>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">{property.corretor.name}</p>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`https://wa.me/${property.corretor.whatsapp}`} className="hover:text-primary-600">
                    {property.corretor.whatsapp}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${property.corretor.email}`} className="hover:text-primary-600">
                    {property.corretor.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Data de criação */}
            <div className="text-sm text-gray-500 text-center">
              Anúncio criado em {formatDate(property.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
