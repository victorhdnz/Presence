'use client';

import React, { useState, useEffect } from 'react';
import { 
    MapPin, 
    Bed, 
    Bath, 
    Car, 
    Ruler, 
    Loader2, 
    X,
    Home,
    MessageSquare,
    Star
} from 'lucide-react';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Tipagem para os dados dos imóveis (Sua estrutura original) ---
interface Property {
    _id: string;
    title: string;
    purpose: 'venda' | 'aluguel';
    price: number;
    neighborhood: string;
    bedrooms: number;
    bathrooms: number;
    parkingSpaces: number;
    totalArea?: number;
    images: Array<{ url: string; isMain: boolean }>;
    longDescription?: string;
    details?: string[];
    features?: string[];
    isHighlighted: boolean;
    corretor?: {
        name: string;
        whatsapp: string;
        email: string;
    };
}

// --- Componente Principal da Página de Imóveis ---
export default function PropertiesPage() {
    // Seus estados originais
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Estados para o Modal de Detalhes (Integrados ao seu código) ---
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);

    // Seu useEffect original para buscar imóveis
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await api.get('/properties');
                setProperties(response.data);
            } catch (err) {
                setError('Falha ao buscar os imóveis.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, []);

    // --- Função para ABRIR o modal e buscar os detalhes ---
    const handleViewDetails = async (propertyId: string) => {
        setShowDetailsModal(true);
        setIsLoadingDetails(true);
        setDetailsError(null);
        setSelectedProperty(null);

        try {
            const response = await api.get(`/properties/${propertyId}`);
            setSelectedProperty(response.data);
        } catch (err) {
            setDetailsError('Não foi possível carregar os detalhes deste imóvel.');
        } finally {
            setIsLoadingDetails(false);
        }
    };

    // --- Função para FECHAR o modal ---
    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setSelectedProperty(null);
    };

    // Suas funções helper originais
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const handleWhatsAppContact = (property: Property) => {
        if (property.corretor?.whatsapp) {
            const phone = property.corretor.whatsapp.replace(/\D/g, '');
            const message = `Olá! Tenho interesse no imóvel: ${property.title} - ${property.neighborhood}`;
            const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    return (
        <div className="min-h-screen">
            <Header />
            
            <div className="bg-gray-50">
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
                    {isLoading && (
                        <div className="flex justify-center items-center p-16">
                            <Loader2 className="animate-spin h-12 w-12 text-primary-600" />
                        </div>
                    )}
                    
                    {error && (
                        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
                    )}
                    
                    {!isLoading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            {properties.map((prop) => (
                                <div key={prop._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105">
                                    <div className="relative h-48 sm:h-56 bg-gray-200">
                                        {prop.images && prop.images.length > 0 ? (
                                            <img
                                                src={prop.images.find(img => img.isMain)?.url || prop.images[0].url}
                                                alt={prop.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Home className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                        {prop.isHighlighted && (
                                            <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                <Star className="h-3 w-3 inline mr-1" /> Destaque
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2 bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                            {prop.purpose === 'venda' ? 'Venda' : 'Aluguel'}
                                        </div>
                                    </div>
                                    <div className="p-4 sm:p-6">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{prop.title}</h3>
                                        <div className="flex items-center text-gray-600 mb-3">
                                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                            <span className="text-sm truncate">{prop.neighborhood}</span>
                                        </div>
                                        <div className="text-xl sm:text-2xl font-bold text-primary-600 mb-4">{formatPrice(prop.price)}</div>
                                        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                                            <div className="flex items-center"><Bed className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" /> <span className="truncate">{prop.bedrooms} quartos</span></div>
                                            <div className="flex items-center"><Bath className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" /> <span className="truncate">{prop.bathrooms} banheiros</span></div>
                                            <div className="flex items-center"><Car className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" /> <span className="truncate">{prop.parkingSpaces} vagas</span></div>
                                        </div>
                                        {prop.totalArea && <div className="text-xs sm:text-sm text-gray-600 mb-3"><span className="font-medium">Área:</span> {prop.totalArea}m²</div>}
                                        {prop.corretor && <div className="text-xs sm:text-sm text-gray-600 mb-3"><span className="font-medium">Corretor:</span> {prop.corretor.name}</div>}
                                        <div className="space-y-2">
                                            {/* A CORREÇÃO ESTÁ AQUI: O onClick chama a função handleViewDetails */}
                                            <button
                                                onClick={() => handleViewDetails(prop._id)}
                                                className="w-full btn-primary text-center block text-sm sm:text-base py-2 sm:py-3"
                                            >
                                                Ver Detalhes
                                            </button>
                                            <button
                                                onClick={() => handleWhatsAppContact(prop)}
                                                className="w-full btn-secondary flex items-center justify-center space-x-2 text-sm sm:text-base py-2 sm:py-3"
                                            >
                                                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
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

            {/* --- Modal de Detalhes do Imóvel (Integrado) --- */}
            {showDetailsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">Detalhes do Imóvel</h2>
                            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800"><X size={28} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {isLoadingDetails && <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-12 w-12 text-primary-600" /></div>}
                            {detailsError && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg h-96 flex justify-center items-center">{detailsError}</div>}
                            {selectedProperty && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        {selectedProperty.images && selectedProperty.images.length > 0 ? (
                                            <img src={selectedProperty.images.find(img => img.isMain)?.url || selectedProperty.images[0].url} alt={selectedProperty.title} className="w-full h-80 object-cover rounded-lg mb-4" />
                                        ) : (
                                            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center"><Home className="h-16 w-16 text-gray-400" /></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900">{selectedProperty.title}</h3>
                                        <div className="flex items-center text-gray-600 my-3"><MapPin size={18} className="mr-2" /><span>{selectedProperty.neighborhood}</span></div>
                                        <div className="text-4xl font-bold text-primary-600 mb-6">{formatPrice(selectedProperty.price)}</div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-center">
                                            <div className="bg-gray-100 p-3 rounded-lg"><Bed className="mx-auto mb-1" /> {selectedProperty.bedrooms} Quartos</div>
                                            <div className="bg-gray-100 p-3 rounded-lg"><Bath className="mx-auto mb-1" /> {selectedProperty.bathrooms} Banheiros</div>
                                            <div className="bg-gray-100 p-3 rounded-lg"><Car className="mx-auto mb-1" /> {selectedProperty.parkingSpaces} Vagas</div>
                                            {selectedProperty.totalArea && <div className="bg-gray-100 p-3 rounded-lg col-span-2 sm:col-span-3"><Ruler className="mx-auto mb-1" /> {selectedProperty.totalArea} m²</div>}
                                        </div>
                                        {selectedProperty.longDescription && (
                                            <><h4 className="font-bold text-lg mb-2">Descrição</h4><p className="text-gray-600 mb-6">{selectedProperty.longDescription}</p></>
                                        )}
                                        {selectedProperty.details && selectedProperty.details.length > 0 && (
                                            <><h4 className="font-bold text-lg mb-2">Detalhes Adicionais</h4><ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">{selectedProperty.details.map((detail, index) => (<li key={index}>{detail}</li>))}</ul></>
                                        )}
                                        {selectedProperty.features && selectedProperty.features.length > 0 && (
                                            <><h4 className="font-bold text-lg mb-2">Características Especiais</h4><ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">{selectedProperty.features.map((feature, index) => (<li key={index}>{feature}</li>))}</ul></>
                                        )}
                                        {selectedProperty.corretor && (
                                            <><h4 className="font-bold text-lg mb-2">Corretor Responsável</h4><div className="bg-primary-50 p-4 rounded-lg flex items-center justify-between"><div><p className="font-semibold text-gray-800">{selectedProperty.corretor.name}</p>{selectedProperty.corretor.whatsapp && <a href={`https://wa.me/${selectedProperty.corretor.whatsapp.replace(/\D/g, '')}`} target="_blank" className="text-green-600 text-sm hover:underline">Falar no WhatsApp</a>}{selectedProperty.corretor.email && <a href={`mailto:${selectedProperty.corretor.email}`} className="text-blue-600 text-sm hover:underline block">{selectedProperty.corretor.email}</a>}</div><MessageSquare className="text-primary-400" size={32}/></div></>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <Footer />
        </div>
    );
}
