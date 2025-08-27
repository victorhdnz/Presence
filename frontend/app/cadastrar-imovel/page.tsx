'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { 
  Building2, Home, MapPin, DollarSign, Bed, Bath, Car, 
  Ruler, FileText, Upload, X, Plus, ArrowLeft 
} from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface PropertyForm {
  title: string
  purpose: 'venda' | 'aluguel'
  price: number
  neighborhood: string
  address: {
    street: string
    number: string
    complement: string
    city: string
    state: string
    zipCode: string
  }
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  landSize: number
  totalArea: number
  longDescription: string
  details: string[]
  features: string[]
}

export default function CadastrarImovelPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState<PropertyForm>({
    title: '',
    purpose: 'venda',
    price: 0,
    neighborhood: '',
    address: {
      street: '',
      number: '',
      complement: '',
      city: 'Uberlândia',
      state: 'MG',
      zipCode: ''
    },
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    landSize: 0,
    totalArea: 0,
    longDescription: '',
    details: [''],
    features: ['']
  })

  // Capturar o caminho anterior quando a página carrega
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Salvar o caminho atual antes de navegar
      const currentPath = window.location.pathname
      const previousPath = sessionStorage.getItem('previousPath')
      
      if (previousPath && previousPath !== currentPath) {
        sessionStorage.setItem('lastPreviousPath', previousPath)
      }
      
      // Salvar o caminho atual para a próxima navegação
      sessionStorage.setItem('previousPath', currentPath)
    }
  }, [])

  const handleGoBack = () => {
    // Tentar usar o histórico do navegador primeiro
    if (window.history.length > 1) {
      router.back()
    } else {
      // Se não houver histórico, usar o caminho salvo
      const lastPath = sessionStorage.getItem('lastPreviousPath')
      if (lastPath && lastPath !== '/cadastrar-imovel') {
        router.push(lastPath)
      } else {
        router.push('/')
      }
    }
  }

  // Redirecionar se não estiver logado, mas preservar o histórico
  if (!isAuthenticated) {
    // Em vez de redirecionar imediatamente, mostrar uma mensagem e botão para login
    return (
      <div className="min-h-screen">
        <Header />
        
        <div className="bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Building2 className="h-12 w-12 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Faça Login para Continuar
              </h1>
              <p className="text-gray-600 mb-6">
                Você precisa estar logado para cadastrar um imóvel. Após o login, você poderá enviar as informações do seu imóvel para nossas corretoras.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/login')}
                  className="btn-primary"
                >
                  Fazer Login
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="btn-secondary"
                >
                  Criar Conta
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PropertyForm] as any),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = value === '' ? 0 : Number(value)
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PropertyForm] as any),
          [child]: numValue
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }))
    }
  }

  const handleArrayChange = (index: number, field: 'details' | 'features', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'details' | 'features') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (index: number, field: 'details' | 'features') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.neighborhood || formData.price <= 0) {
      toast.error('Preencha os campos obrigatórios')
      return
    }

    try {
      setIsLoading(true)
      
      // Filtrar arrays vazios
      const cleanFormData = {
        ...formData,
        details: formData.details.filter(d => d.trim() !== ''),
        features: formData.features.filter(f => f.trim() !== '')
      }

      await api.post('/properties/submit', cleanFormData)
      
      toast.success('Imóvel cadastrado com sucesso! Aguardando aprovação.')
      router.push('/')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao cadastrar imóvel'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Building2 className="h-12 w-12 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cadastrar Imóvel
            </h1>
            <p className="text-gray-600">
              Preencha as informações do seu imóvel para anúncio
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informações Básicas */}
              <div className="form-section">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Informações Básicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="title" className="form-label">
                      Título do Anúncio *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Ex: Casa com 3 quartos em Pinheiros"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="purpose" className="form-label">
                      Finalidade *
                    </label>
                    <select
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="venda">Venda</option>
                      <option value="aluguel">Aluguel</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="price" className="form-label">
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleNumberChange}
                      className="input-field"
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="neighborhood" className="form-label">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Ex: Pinheiros, Vila Madalena"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="form-section">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Endereço
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="form-group md:col-span-2">
                    <label htmlFor="address.street" className="form-label">
                      Rua
                    </label>
                    <input
                      type="text"
                      id="address.street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Nome da rua"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.number" className="form-label">
                      Número
                    </label>
                    <input
                      type="text"
                      id="address.number"
                      name="address.number"
                      value={formData.address.number}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="123"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.complement" className="form-label">
                      Complemento
                    </label>
                    <input
                      type="text"
                      id="address.complement"
                      name="address.complement"
                      value={formData.address.complement}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Apto 45, Casa 2"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.zipCode" className="form-label">
                      CEP
                    </label>
                    <input
                      type="text"
                      id="address.zipCode"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="01234-567"
                    />
                  </div>
                </div>
              </div>

              {/* Características */}
              <div className="form-section">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Ruler className="h-5 w-5 mr-2" />
                  Características
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="form-group">
                    <label htmlFor="bedrooms" className="form-label">
                      Quartos *
                    </label>
                    <input
                      type="number"
                      id="bedrooms"
                      name="bedrooms"
                      value={formData.bedrooms || ''}
                      onChange={handleNumberChange}
                      className="input-field"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bathrooms" className="form-label">
                      Banheiros *
                    </label>
                    <input
                      type="number"
                      id="bathrooms"
                      name="bathrooms"
                      value={formData.bathrooms || ''}
                      onChange={handleNumberChange}
                      className="input-field"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="parkingSpaces" className="form-label">
                      Vagas de Garagem
                    </label>
                    <input
                      type="number"
                      id="parkingSpaces"
                      name="parkingSpaces"
                      value={formData.parkingSpaces || ''}
                      onChange={handleNumberChange}
                      className="input-field"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="totalArea" className="form-label">
                      Área Total (m²)
                    </label>
                    <input
                      type="number"
                      id="totalArea"
                      name="totalArea"
                      value={formData.totalArea || ''}
                      onChange={handleNumberChange}
                      className="input-field"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="landSize" className="form-label">
                    Tamanho do Terreno (m²)
                  </label>
                  <input
                    type="number"
                    id="landSize"
                    name="landSize"
                    value={formData.landSize || ''}
                    onChange={handleNumberChange}
                    className="input-field"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="form-section">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Descrição
                </h3>
                
                <div className="form-group">
                  <label htmlFor="longDescription" className="form-label">
                    Descrição Detalhada
                  </label>
                  <textarea
                    id="longDescription"
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleChange}
                    className="input-field"
                    rows={4}
                    placeholder="Descreva detalhadamente o imóvel, características especiais, localização, etc."
                  />
                </div>
              </div>

              {/* Detalhes */}
              <div className="form-section">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Detalhes Adicionais
                </h3>
                
                {formData.details.map((detail, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={detail}
                      onChange={(e) => handleArrayChange(index, 'details', e.target.value)}
                      className="input-field flex-1"
                      placeholder="Ex: Piscina, Academia, Portaria 24h"
                    />
                    {formData.details.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'details')}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('details')}
                  className="btn-secondary text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Detalhe
                </button>
              </div>

              {/* Características Especiais */}
              <div className="form-section">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Características Especiais
                </h3>
                
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange(index, 'features', e.target.value)}
                      className="input-field flex-1"
                      placeholder="Ex: Vista para o mar, Varanda gourmet, Home office"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'features')}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('features')}
                  className="btn-secondary text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Característica
                </button>
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Cadastrando...' : 'Cadastrar Imóvel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
