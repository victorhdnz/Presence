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

    // --- Estados para o Sistema de Filtros ---
    const [showFilters, setShowFilters] = useState(true);
    const [filters, setFilters] = useState({
        purpose: '',
        bedrooms: '',
        parkingSpaces: '',
        neighborhood: '',
        minPrice: '',
        maxPrice: '',
        minArea: '',
        maxArea: ''
    });

    // Seu useEffect original para buscar imóveis
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await api.get('/properties');
                console.log('Imóveis recebidos:', response.data);
                if (response.data.length > 0) {
                    console.log('Primeiro imóvel - Imagens:', response.data[0].images);
                    console.log('Primeiro imóvel - Corretor:', response.data[0].corretor);
                }
                setProperties(response.data);
            } catch (err) {
                console.error('Erro ao buscar imóveis:', err);
                setError('Falha ao buscar os imóveis.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, []);

    // --- Funções para o Sistema de Filtros ---
    
    // Obter bairros únicos para o filtro
    const uniqueNeighborhoods = Array.from(new Set(properties.map(prop => prop.neighborhood))).sort();

    // Função para limpar todos os filtros
    const clearFilters = () => {
        setFilters({
            purpose: '',
            bedrooms: '',
            parkingSpaces: '',
            neighborhood: '',
            minPrice: '',
            maxPrice: '',
            minArea: '',
            maxArea: ''
        });
    };

    // Função para mostrar/ocultar filtros
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Aplicar filtros aos imóveis
    const filteredProperties = properties.filter(prop => {
        // Filtro de finalidade
        if (filters.purpose && prop.purpose !== filters.purpose) return false;
        
        // Filtro de quartos
        if (filters.bedrooms) {
            const bedrooms = parseInt(filters.bedrooms);
            if (bedrooms === 4 && prop.bedrooms < 4) return false;
            if (bedrooms < 4 && prop.bedrooms !== bedrooms) return false;
        }
        
        // Filtro de vagas
        if (filters.parkingSpaces) {
            const parkingSpaces = parseInt(filters.parkingSpaces);
            if (parkingSpaces === 3 && prop.parkingSpaces < 3) return false;
            if (parkingSpaces < 3 && prop.parkingSpaces !== parkingSpaces) return false;
        }
        
        // Filtro de bairro
        if (filters.neighborhood && prop.neighborhood !== filters.neighborhood) return false;
        
        // Filtro de preço mínimo
        if (filters.minPrice && prop.price < parseFloat(filters.minPrice)) return false;
        
        // Filtro de preço máximo
        if (filters.maxPrice && prop.price > parseFloat(filters.maxPrice)) return false;
        
        // Filtro de área mínima
        if (filters.minArea && prop.totalArea && prop.totalArea < parseFloat(filters.minArea)) return false;
        
        // Filtro de área máxima
        if (filters.maxArea && prop.totalArea && prop.totalArea > parseFloat(filters.maxArea)) return false;
        
        return true;
    });

    // --- Função para ABRIR o modal e buscar os detalhes ---
    const handleViewDetails = async (propertyId: string) => {
        setShowDetailsModal(true);
        setIsLoadingDetails(true);
        setDetailsError(null);
        setSelectedProperty(null);

        try {
            console.log('Buscando detalhes do imóvel:', propertyId);
            const response = await api.get(`/properties/${propertyId}`);
            console.log('Detalhes recebidos:', response.data);
            console.log('Imagens do imóvel:', response.data.images);
            console.log('Corretor do imóvel:', response.data.corretor);
            setSelectedProperty(response.data);
        } catch (err) {
            console.error('Erro ao buscar detalhes:', err);
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

    // Função auxiliar para verificar se a URL da imagem é válida
    const isValidImageUrl = (url: string) => {
        if (!url) return false;
        
        // URLs do Cloudinary devem começar com https://res.cloudinary.com/
        const cloudinaryPattern = /^https:\/\/res\.cloudinary\.com\/.+/;
        return cloudinaryPattern.test(url);
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
                        {Object.values(filters).some(filter => filter !== '') && (
                            <div className="mt-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-primary-800">Filtros ativos:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {filters.purpose && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                    {filters.purpose === 'venda' ? 'Venda' : 'Aluguel'}
                                                </span>
                                            )}
                                            {filters.bedrooms && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                    {filters.bedrooms === '4' ? '4+ quartos' : `${filters.bedrooms} quarto${filters.bedrooms !== '1' ? 's' : ''}`}
                                                </span>
                                            )}
                                            {filters.neighborhood && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                    {filters.neighborhood}
                                                </span>
                                            )}
                                            {filters.minPrice && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                    Min: R$ {parseFloat(filters.minPrice).toLocaleString('pt-BR')}
                                                </span>
                                            )}
                                            {filters.maxPrice && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                    Max: R$ {parseFloat(filters.maxPrice).toLocaleString('pt-BR')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={clearFilters}
                                        className="text-primary-600 hover:text-primary-700 text-sm font-medium underline"
                                    >
                                        Limpar todos
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Sistema de Filtros */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Filtros de Busca</h2>
                            <button
                                onClick={toggleFilters}
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                            </button>
                        </div>
                        
                        {showFilters && (
                            <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* Filtro de Finalidade */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Finalidade</label>
                                <select 
                                    value={filters.purpose} 
                                    onChange={(e) => setFilters(prev => ({ ...prev, purpose: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="">Todas</option>
                                    <option value="venda">Venda</option>
                                    <option value="aluguel">Aluguel</option>
                                </select>
                            </div>

                            {/* Filtro de Quartos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quartos</label>
                                <select 
                                    value={filters.bedrooms} 
                                    onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="">Qualquer</option>
                                    <option value="1">1 quarto</option>
                                    <option value="2">2 quartos</option>
                                    <option value="3">3 quartos</option>
                                    <option value="4">4+ quartos</option>
                                </select>
                            </div>

                            {/* Filtro de Vagas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vagas</label>
                                <select 
                                    value={filters.parkingSpaces} 
                                    onChange={(e) => setFilters(prev => ({ ...prev, parkingSpaces: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="">Qualquer</option>
                                    <option value="0">Sem vaga</option>
                                    <option value="1">1 vaga</option>
                                    <option value="2">2 vagas</option>
                                    <option value="3">3+ vagas</option>
                                </select>
                            </div>

                            {/* Filtro de Bairro */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                                <select 
                                    value={filters.neighborhood} 
                                    onChange={(e) => setFilters(prev => ({ ...prev, neighborhood: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="">Todos</option>
                                    {uniqueNeighborhoods.map(neighborhood => (
                                        <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filtros de Preço e Área */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* Preço Mínimo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preço Mínimo</label>
                                <input
                                    type="number"
                                    placeholder="R$ 0"
                                    value={filters.minPrice} 
                                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            {/* Preço Máximo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preço Máximo</label>
                                <input
                                    type="number"
                                    placeholder="R$ 999.999"
                                    value={filters.maxPrice} 
                                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            {/* Área Mínima */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Área Mínima (m²)</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={filters.minArea} 
                                    onChange={(e) => setFilters(prev => ({ ...prev, minArea: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            {/* Área Máxima */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Área Máxima (m²)</label>
                                <input
                                    type="number"
                                    placeholder="9999"
                                    value={filters.maxArea} 
                                    onChange={(e) => setFilters(prev => ({ ...prev, maxArea: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                            <div className="text-sm text-gray-600">
                                {filteredProperties.length} de {properties.length} imóveis encontrados
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        </div>
                        </>
                        )}
                    </div>

                    {isLoading && (
                        <div className="flex justify-center items-center p-16">
                            <Loader2 className="animate-spin h-12 w-12 text-primary-600" />
                        </div>
                    )}
                    
                    {error && (
                        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
                    )}
                    
                    {!isLoading && !error && (
                        <>
                        {filteredProperties.length === 0 ? (
                            <div className="text-center py-16">
                                <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum imóvel encontrado</h3>
                                <p className="text-gray-600 mb-4">Tente ajustar os filtros de busca ou limpar todos os filtros.</p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                {filteredProperties.map((prop) => (
                                    <div key={prop._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105">
                                    <div className="relative h-48 sm:h-56 bg-gray-200">
                                        {prop.images && prop.images.length > 0 && prop.images.some(img => isValidImageUrl(img.url)) ? (
                                            <img
                                                src={prop.images.find(img => img.isMain && isValidImageUrl(img.url))?.url || 
                                                     prop.images.find(img => isValidImageUrl(img.url))?.url || 
                                                     prop.images[0]?.url}
                                                alt={prop.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.error('Erro ao carregar imagem:', {
                                                        imovel: prop.title,
                                                        url: e.currentTarget.src,
                                                        images: prop.images
                                                    });
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                                onLoad={(e) => {
                                                    console.log('Imagem carregada com sucesso:', {
                                                        imovel: prop.title,
                                                        url: e.currentTarget.src
                                                    });
                                                }}
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
                                        {prop.corretor && prop.corretor.name && (
                                            <div className="text-xs sm:text-sm text-gray-600 mb-3">
                                                <span className="font-medium">Corretor:</span> {prop.corretor.name}
                                            </div>
                                        )}
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
                        </>
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
                                        {selectedProperty.images && selectedProperty.images.length > 0 && selectedProperty.images.some(img => isValidImageUrl(img.url)) ? (
                                            <div className="space-y-4">
                                                {/* Imagem Principal */}
                                                <img 
                                                    src={selectedProperty.images.find(img => img.isMain && isValidImageUrl(img.url))?.url || 
                                                         selectedProperty.images.find(img => isValidImageUrl(img.url))?.url || 
                                                         selectedProperty.images[0]?.url} 
                                                    alt={selectedProperty.title} 
                                                    className="w-full h-80 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        console.error('Erro ao carregar imagem no modal:', {
                                                            imovel: selectedProperty.title,
                                                            url: e.currentTarget.src,
                                                            images: selectedProperty.images
                                                        });
                                                        e.currentTarget.style.display = 'none';
                                                        const placeholder = document.createElement('div');
                                                        placeholder.className = 'w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center';
                                                        placeholder.innerHTML = '<div class="text-center"><svg class="h-16 w-16 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg><p class="text-gray-500">Imagem não encontrada</p></div>';
                                                        e.currentTarget.parentNode?.appendChild(placeholder);
                                                    }}
                                                    onLoad={(e) => {
                                                        console.log('Imagem carregada no modal:', {
                                                            imovel: selectedProperty.title,
                                                            url: e.currentTarget.src
                                                        });
                                                    }}
                                                />
                                                
                                                {/* Miniaturas das Outras Imagens */}
                                                {selectedProperty.images.length > 1 && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-700 mb-3">Todas as Imagens ({selectedProperty.images.length})</h4>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {selectedProperty.images.map((image, index) => (
                                                                <div key={index} className="relative">
                                                                    <img 
                                                                        src={image.url} 
                                                                        alt={`${selectedProperty.title} - Imagem ${index + 1}`}
                                                                        className={`w-full h-20 object-cover rounded-lg cursor-pointer transition-all ${
                                                                            (image.isMain || index === 0) ? 'ring-2 ring-primary-500' : 'hover:ring-2 hover:ring-gray-300'
                                                                        }`}
                                                                        onError={(e) => {
                                                                            e.currentTarget.style.display = 'none';
                                                                            const placeholder = document.createElement('div');
                                                                            placeholder.className = 'w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center';
                                                                            placeholder.innerHTML = '<div class="text-center"><svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg></div>';
                                                                            e.currentTarget.parentNode?.appendChild(placeholder);
                                                                        }}
                                                                    />
                                                                    {image.isMain && (
                                                                        <div className="absolute top-1 left-1 bg-primary-600 text-white text-xs px-1 py-0.5 rounded">
                                                                            Principal
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <Home className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-gray-500">Nenhuma imagem disponível</p>
                                                </div>
                                            </div>
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
                                            <>
                                                <h4 className="font-bold text-lg mb-2">Corretor Responsável</h4>
                                                <div className="bg-primary-50 p-4 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-800 text-lg mb-2">{selectedProperty.corretor.name}</p>
                                                            {selectedProperty.corretor.whatsapp && (
                                                                <a 
                                                                    href={`https://wa.me/${selectedProperty.corretor.whatsapp.replace(/\D/g, '')}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center text-green-600 text-sm hover:text-green-700 hover:underline mr-4 mb-2"
                                                                >
                                                                    <MessageSquare className="h-4 w-4 mr-1" />
                                                                    Falar no WhatsApp
                                                                </a>
                                                            )}
                                                            {selectedProperty.corretor.email && (
                                                                <a 
                                                                    href={`mailto:${selectedProperty.corretor.email}`} 
                                                                    className="inline-flex items-center text-blue-600 text-sm hover:text-blue-700 hover:underline"
                                                                >
                                                                    <span>📧</span>
                                                                    <span className="ml-1">{selectedProperty.corretor.email}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                        <MessageSquare className="text-primary-400 flex-shrink-0" size={32}/>
                                                    </div>
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
            
            <Footer />
        </div>
    );
}
