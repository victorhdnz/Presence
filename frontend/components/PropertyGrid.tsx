'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Ruler,
  Home,
  Star,
  X,
  Loader2,
  MessageSquare
} from 'lucide-react'
import { api } from '@/lib/api'

interface Property {
  _id: string
  title: string
  purpose: 'venda' | 'aluguel'
  price: number
  neighborhood: string
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  suites: number
  totalArea?: number
  images: Array<{ url: string; isMain: boolean }>
  longDescription?: string
  isHighlighted: boolean
  corretor?: {
    name: string
    whatsapp: string
    email: string
  }
}

export default function PropertyGrid() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para o modal
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties?limit=6')
        setProperties(response.data)
      } catch (err) {
        setError('Falha ao carregar os imóveis em destaque.')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Função para abrir o modal e buscar os detalhes
  const handleViewDetails = async (propertyId: string) => {
    setShowDetailsModal(true)
    setIsLoadingDetails(true)
    setDetailsError(null)
    setSelectedProperty(null)

    try {
      const response = await api.get(`/properties/${propertyId}`)
      setSelectedProperty(response.data)
    } catch (err) {
      setDetailsError('Não foi possível carregar os detalhes deste imóvel.')
    } finally {
      setIsLoadingDetails(false)
    }
  }

  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowDetailsModal(false)
    setSelectedProperty(null)
  }

  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  // Função para contato WhatsApp
  const handleWhatsAppContact = (property: Property) => {
    if (property.corretor?.whatsapp) {
      const phone = property.corretor.whatsapp.replace(/\D/g, '')
      const message = `Olá! Tenho interesse no imóvel: ${property.title} - ${property.neighborhood}`
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  if (loading) {
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

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Imóveis em Destaque
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Confira nossas melhores opções de imóveis para venda e aluguel
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum imóvel disponível no momento
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
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
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      <span>{property.suites} suítes</span>
                    </div>
                  </div>

                  {property.totalArea && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Área:</span> {property.totalArea}m²
                    </div>
                  )}

                  {/* Botões */}
                  <div className="space-y-2 mt-4">
                    <button
                      onClick={() => handleViewDetails(property._id)}
                      className="w-full btn-primary text-center block"
                    >
                      Ver Detalhes
                    </button>
                    
                    <button
                      onClick={() => handleWhatsAppContact(property)}
                      className="w-full btn-secondary flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Entre em Contato</span>
                    </button>
                  </div>
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

      {/* Modal de Detalhes do Imóvel */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Detalhes do Imóvel</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800">
                <X size={28} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {isLoadingDetails && (
                <div className="flex justify-center items-center h-96">
                  <Loader2 className="animate-spin h-12 w-12 text-primary-600" />
                </div>
              )}
              {detailsError && (
                <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg h-96 flex justify-center items-center">
                  {detailsError}
                </div>
              )}
              {selectedProperty && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    {selectedProperty.images && selectedProperty.images.length > 0 ? (
                      <img 
                        src={selectedProperty.images.find(img => img.isMain)?.url || selectedProperty.images[0].url} 
                        alt={selectedProperty.title} 
                        className="w-full h-80 object-cover rounded-lg mb-4" 
                      />
                    ) : (
                      <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Home className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">{selectedProperty.title}</h3>
                    <div className="flex items-center text-gray-600 my-3">
                      <MapPin size={18} className="mr-2" />
                      <span>{selectedProperty.neighborhood}</span>
                    </div>
                    <div className="text-4xl font-bold text-primary-600 mb-6">
                      {formatPrice(selectedProperty.price)}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-center">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Bed className="mx-auto mb-1" /> {selectedProperty.bedrooms} Quartos
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Bath className="mx-auto mb-1" /> {selectedProperty.bathrooms} Banheiros
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Car className="mx-auto mb-1" /> {selectedProperty.parkingSpaces} Vagas
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Star className="mx-auto mb-1" /> {selectedProperty.suites} Suítes
                      </div>
                      {selectedProperty.totalArea && (
                        <div className="bg-gray-100 p-3 rounded-lg col-span-2 sm:col-span-4">
                          <Ruler className="mx-auto mb-1" /> {selectedProperty.totalArea} m²
                        </div>
                      )}
                    </div>

                    {selectedProperty.longDescription && (
                      <>
                        <h4 className="font-bold text-lg mb-2">Descrição</h4>
                        <p className="text-gray-600 mb-6">{selectedProperty.longDescription}</p>
                      </>
                    )}

                    {selectedProperty.corretor && (
                      <>
                        <h4 className="font-bold text-lg mb-2">Corretor Responsável</h4>
                        <div className="bg-primary-50 p-4 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">{selectedProperty.corretor.name}</p>
                            {selectedProperty.corretor.whatsapp && (
                              <a href={`https://wa.me/${selectedProperty.corretor.whatsapp.replace(/\D/g, '')}`} target="_blank" className="text-green-600 text-sm hover:underline">
                                Falar no WhatsApp
                              </a>
                            )}
                            {selectedProperty.corretor.email && (
                              <a href={`mailto:${selectedProperty.corretor.email}`} className="text-blue-600 text-sm hover:underline block">
                                {selectedProperty.corretor.email}
                              </a>
                            )}
                          </div>
                          <MessageSquare className="text-primary-400" size={32}/>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

