'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { 
  Home, Users, Eye, Edit, Trash2, Plus, X, CheckCircle, XCircle, Star, Upload, MessageCircle
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Dados das corretoras
const CORRETORAS = [
  { name: 'Heloisa', whatsapp: '+55 34 8400-8321', email: 'consultoriapresence@gmail.com' },
  { name: 'Vânia', whatsapp: '+55 34 9687-7060', email: 'consultoriapresence@gmail.com' }
]

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'client'
  isActive: boolean
  lastLogin?: string
}

interface Property {
  _id: string
  title: string
  purpose: 'venda' | 'aluguel'
  price: number
  neighborhood: string
  address?: {
    street: string
    number: string
    complement?: string
    city: string
    state: string
    zipCode?: string
  }
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  landSize?: number
  totalArea: number
  longDescription?: string
  details?: string[]
  features?: string[]
  corretor: {
    name: string
    whatsapp: string
    email: string
  }
  submittedBy: {
    _id: string
    name: string
    email: string
    phone?: string
  }
  approvedBy?: {
    _id: string
    name: string
  }
  status: 'ativo' | 'inativo' | 'rejeitado'
  isHighlighted: boolean
  images?: Array<{
    url: string
    publicId: string
    isMain: boolean
  }>
  createdAt: string
  updatedAt?: string
  approvedAt?: string
}

interface NewProperty {
  title: string
  purpose: 'venda' | 'aluguel'
  price: string
  neighborhood: string
  address?: {
    street: string
    number: string
    complement?: string
    city: string
    state: string
    zipCode?: string
  }
  bedrooms: string
  bathrooms: string
  parkingSpaces: string
  landSize?: string
  totalArea: string
  longDescription: string
  details?: string[]
  features?: string[]
  corretor: {
    name: string
    whatsapp: string
    email: string
  }
}

interface PropertyImage {
  url: string
  file?: File
  isMain: boolean
}

function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false)
  const [showPropertyDetails, setShowPropertyDetails] = useState(false)
  const [showEditPropertyForm, setShowEditPropertyForm] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [newProperty, setNewProperty] = useState<NewProperty>({
    title: '',
    purpose: 'venda',
    price: '',
    neighborhood: '',
    bedrooms: '',
    bathrooms: '',
    parkingSpaces: '',
    totalArea: '',
    longDescription: '',
    corretor: CORRETORAS[0]
  })
  const [newPropertyImages, setNewPropertyImages] = useState<PropertyImage[]>([])
  const [showUserManagementModal, setShowUserManagementModal] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client' as 'admin' | 'client'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<any[]>([])
  const [showMessageDetails, setShowMessageDetails] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('presence_token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await api.get('/auth/profile')
      if (response.data.role !== 'admin') {
        router.push('/')
        return
      }
    } catch (error) {
      router.push('/login')
    }
  }

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [usersResponse, propertiesResponse, messagesResponse] = await Promise.all([
        api.get('/auth/users'),
        api.get('/properties/admin/all'),
        api.get('/messages')
      ])

      // Verificações de segurança antes de setar os dados
      if (usersResponse?.data && Array.isArray(usersResponse.data)) {
        setUsers(usersResponse.data)
      } else {
        setUsers([])
      }

      if (propertiesResponse?.data && Array.isArray(propertiesResponse.data)) {
        setProperties(propertiesResponse.data)
      } else {
        setProperties([])
      }

      if (messagesResponse?.data && Array.isArray(messagesResponse.data)) {
        setMessages(messagesResponse.data)
      } else {
        setMessages([])
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados do dashboard')
      // Garantir que os arrays não fiquem undefined
      setUsers([])
      setProperties([])
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const url = event.target?.result as string
          setNewPropertyImages(prev => [...prev, {
            url,
            file,
            isMain: prev.length === 0
          }])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index: number) => {
    setNewPropertyImages(prev => prev.filter((_, i) => i !== index))
  }

  const setMainImage = (index: number) => {
    setNewPropertyImages(prev => prev.map((img, i) => ({
      ...img,
      isMain: i === index
    })))
  }

  const handleCreateProperty = async () => {
    try {
      console.log('Iniciando criação de imóvel...')
      console.log('Imagens para upload:', newPropertyImages)
      
      // Upload das imagens primeiro
      const uploadedImages = []
      for (const image of newPropertyImages) {
        if (image.file) {
          console.log('Fazendo upload da imagem:', image.file.name)
          const formDataImage = new FormData()
          formDataImage.append('images', image.file)

          const response = await api.post('/upload/images', formDataImage, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })

          console.log('Resposta do upload:', response.data)

          // CORREÇÃO IMPORTANTE: response.data.images[0].url em vez de response.data.url
          const uploadedImage = {
            url: response.data.images[0].url,
            caption: '',
            isMain: image.isMain
          }
          console.log('Imagem processada:', uploadedImage)
          uploadedImages.push(uploadedImage)
        }
      }
      
      console.log('Todas as imagens processadas:', uploadedImages)

      const propertyData = {
        ...newProperty,
        price: Number(newProperty.price),
        bedrooms: Number(newProperty.bedrooms),
        bathrooms: Number(newProperty.bathrooms),
        parkingSpaces: Number(newProperty.parkingSpaces),
        totalArea: Number(newProperty.totalArea),
        corretor: newProperty.corretor,
        images: uploadedImages
      }

      console.log('Dados do imóvel a serem enviados:', propertyData)
      console.log('Corretor selecionado:', propertyData.corretor)

      await api.post('/properties', propertyData)
      toast.success('Imóvel criado com sucesso!')
      setShowNewPropertyForm(false)
      setNewProperty({
        title: '',
        purpose: 'venda',
        price: '',
        neighborhood: '',
        bedrooms: '',
        bathrooms: '',
        parkingSpaces: '',
        totalArea: '',
        longDescription: '',
        corretor: CORRETORAS[0]
      })
      setNewPropertyImages([])
      fetchData()
    } catch (error: any) {
      console.error('Erro ao criar imóvel:', error)
      const message = error.response?.data?.message || 'Erro ao criar imóvel'
      toast.error(message)
    }
  }

  const handleViewDetails = async (propertyId: string) => {
    try {
      const response = await api.get(`/properties/${propertyId}`)
      setSelectedProperty(response.data)
      setShowPropertyDetails(true)
    } catch (error) {
      toast.error('Erro ao carregar detalhes do imóvel')
    }
  }

  const handleEditProperty = async (propertyId: string) => {
    const property = properties.find(p => p._id === propertyId)
    if (property) {
      setEditingProperty(property)
      setShowEditPropertyForm(true)
    }
  }

  const handleUpdateProperty = async (updatedData: Partial<Property>) => {
    if (!editingProperty) return

    try {
      await api.put(`/properties/${editingProperty._id}`, updatedData)
      toast.success('Imóvel atualizado com sucesso!')
      setShowEditPropertyForm(false)
      setEditingProperty(null)
      fetchData()
    } catch (error) {
      toast.error('Erro ao atualizar imóvel')
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return

    try {
      await api.delete(`/properties/${propertyId}`)
      toast.success('Imóvel excluído com sucesso!')
      fetchData()
    } catch (error) {
      toast.error('Erro ao excluir imóvel')
    }
  }

  const handlePropertyStatus = async (propertyId: string, status: 'ativo' | 'rejeitado') => {
    try {
      await api.patch(`/properties/${propertyId}/approve`, { status, approved: status === 'ativo' })
      toast.success(`Imóvel ${status === 'ativo' ? 'aprovado' : 'rejeitado'} com sucesso!`)
      fetchData()
    } catch (error) {
      toast.error('Erro ao atualizar imóvel')
    }
  }

  const handleHighlight = async (propertyId: string, isHighlighted: boolean) => {
    try {
      await api.patch(`/properties/${propertyId}/highlight`, { isHighlighted })
      toast.success(`Imóvel ${isHighlighted ? 'destacado' : 'desdestacado'} com sucesso!`)
      fetchData()
    } catch (error) {
      toast.error('Erro ao destacar imóvel')
    }
  }

  const handleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/auth/users/${userId}/status`, { isActive })
      toast.success(`Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso!`)
      fetchData()
    } catch (error) {
      toast.error('Erro ao atualizar usuário')
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${userName}?`)) return

    try {
      await api.delete(`/auth/users/${userId}`)
      toast.success('Usuário excluído com sucesso!')
      fetchData()
    } catch (error) {
      toast.error('Erro ao excluir usuário')
    }
  }

  const handleCreateUser = async () => {
    try {
      await api.post('/auth/register', newUser)
      toast.success('Usuário criado com sucesso!')
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'client'
      })
      fetchData()
    } catch (error) {
      toast.error('Erro ao criar usuário')
    }
  }

  const handleToggleUserStatus = async (userId: string) => {
    const user = users.find(u => u._id === userId)
    if (!user) return

    try {
      await api.patch(`/auth/users/${userId}/status`, { isActive: !user.isActive })
      toast.success(`Usuário ${!user.isActive ? 'ativado' : 'desativado'} com sucesso!`)
      fetchData()
    } catch (error) {
      toast.error('Erro ao atualizar usuário')
    }
  }

  // Funções para gerenciar mensagens
  const handleViewMessage = (message: any) => {
    setSelectedMessage(message)
    setShowMessageDetails(true)
  }

  const handleToggleMessageStatus = async (messageId: string, status: string) => {
    try {
      const corretor = CORRETORAS[0] // Por padrão, usar a primeira corretora
      await api.patch(`/messages/${messageId}/status`, { 
        status, 
        respondedBy: { 
          name: corretor.name, 
          email: corretor.email 
        } 
      })
      toast.success(`Mensagem marcada como ${status}`)
      fetchData()
    } catch (error) {
      toast.error('Erro ao atualizar status da mensagem')
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return

    try {
      await api.delete(`/messages/${messageId}`)
      toast.success('Mensagem excluída com sucesso!')
      fetchData()
    } catch (error) {
      toast.error('Erro ao excluir mensagem')
    }
  }

  // Filtrar propriedades com verificações de segurança
  const activeProperties = properties.filter(p => p?.status === 'ativo')
  const pendingProperties = properties.filter(p => p?.status === 'inativo')
  
  // Buscar o usuário completo para verificar o role (com verificações de segurança)
  const adminProperties = properties.filter(p => {
    if (!p?.submittedBy?._id || !users?.length) return false
    const user = users.find(u => u?._id === p.submittedBy._id)
    return user?.role === 'admin'
  })
  
  const clientProperties = properties.filter(p => {
    if (!p?.submittedBy?._id || !users?.length) return false
    const user = users.find(u => u?._id === p.submittedBy._id)
    return user?.role === 'client'
  })
  
  const activeUsers = users?.filter(u => u?.isActive)?.length || 0

  // Mostrar loading enquanto carrega os dados
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header da Página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="mt-2 text-gray-600">Gerencie imóveis, usuários e configurações do sistema</p>
        </div>

        {/* Tabs de Navegação */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Home },
              { id: 'client-properties', label: 'Imóveis de Clientes', icon: Eye },
              { id: 'admin-properties', label: 'Imóveis das Corretoras', icon: Home },
              { id: 'all-properties', label: 'Todos os Imóveis', icon: Eye },
              { id: 'messages', label: 'Mensagens', icon: MessageCircle },
              { id: 'users', label: 'Usuários', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Botão de Criar Novo Imóvel */}
        {activeTab === 'admin-properties' && (
          <div className="mb-6">
            <button
              onClick={() => setShowNewPropertyForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Imóvel</span>
            </button>
          </div>
        )}

        {/* Formulário de Novo Imóvel */}
        {showNewPropertyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header do Modal */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Criar Novo Imóvel</h2>
                <button
                  onClick={() => setShowNewPropertyForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Formulário */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                    <input
                      type="text"
                      value={newProperty.title}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Título do imóvel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Finalidade *</label>
                    <select
                      value={newProperty.purpose}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, purpose: e.target.value as 'venda' | 'aluguel' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="venda">Venda</option>
                      <option value="aluguel">Aluguel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preço *</label>
                    <input
                      type="number"
                      value={newProperty.price}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bairro *</label>
                    <input
                      type="text"
                      value={newProperty.neighborhood}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, neighborhood: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nome do bairro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quartos *</label>
                    <input
                      type="number"
                      value={newProperty.bedrooms}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, bedrooms: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Banheiros *</label>
                    <input
                      type="number"
                      value={newProperty.bathrooms}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, bathrooms: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vagas</label>
                    <input
                      type="number"
                      value={newProperty.parkingSpaces}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, parkingSpaces: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Área Total (m²)</label>
                    <input
                      type="number"
                      value={newProperty.totalArea}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, totalArea: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Campos de Endereço */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Endereço (Opcional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                      <input
                        type="text"
                        value={newProperty.address?.street || ''}
                        onChange={(e) => setNewProperty(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, street: e.target.value, city: prev.address?.city || '', state: prev.address?.state || '' }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Nome da rua"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                      <input
                        type="text"
                        value={newProperty.address?.number || ''}
                        onChange={(e) => setNewProperty(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, number: e.target.value, city: prev.address?.city || '', state: prev.address?.state || '', street: prev.address?.street || '' }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                      <input
                        type="text"
                        value={newProperty.address?.complement || ''}
                        onChange={(e) => setNewProperty(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, complement: e.target.value, city: prev.address?.city || '', state: prev.address?.state || '', street: prev.address?.street || '', number: prev.address?.number || '' }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Apto 101, Bloco A"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                      <input
                        type="text"
                        value={newProperty.address?.city || ''}
                        onChange={(e) => setNewProperty(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, city: e.target.value, state: prev.address?.state || '', street: prev.address?.street || '', number: prev.address?.number || '' }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="São Paulo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <input
                        type="text"
                        value={newProperty.address?.state || ''}
                        onChange={(e) => setNewProperty(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, state: e.target.value, city: prev.address?.city || '', street: prev.address?.street || '', number: prev.address?.number || '' }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="SP"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                      <input
                        type="text"
                        value={newProperty.address?.zipCode || ''}
                        onChange={(e) => setNewProperty(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, zipCode: e.target.value, city: prev.address?.city || '', state: prev.address?.state || '', street: prev.address?.street || '', number: prev.address?.number || '' }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Corretor Responsável *</label>
                  <select
                    value={newProperty.corretor.name}
                    onChange={(e) => {
                      const corretor = CORRETORAS.find(c => c.name === e.target.value)
                      if (corretor) {
                        setNewProperty(prev => ({ ...prev, corretor }))
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {CORRETORAS.map(corretor => (
                      <option key={corretor.name} value={corretor.name}>
                        {corretor.name} - {corretor.whatsapp}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={newProperty.longDescription}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, longDescription: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Descrição detalhada do imóvel"
                  />
                </div>

                {/* Campos de Detalhes e Características */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Detalhes e Características (Opcional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Detalhes</label>
                      <textarea
                        value={newProperty.details?.join('\n') || ''}
                        onChange={(e) => setNewProperty(prev => ({ 
                          ...prev, 
                          details: e.target.value.split('\n').filter(item => item.trim() !== '')
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={4}
                        placeholder="Digite cada detalhe em uma linha separada&#10;Ex: Piso laminado&#10;Cozinha planejada&#10;Sacada com churrasqueira"
                      />
                      <p className="text-xs text-gray-500 mt-1">Digite cada detalhe em uma linha separada</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Características</label>
                      <textarea
                        value={newProperty.features?.join('\n') || ''}
                        onChange={(e) => setNewProperty(prev => ({ 
                          ...prev, 
                          features: e.target.value.split('\n').filter(item => item.trim() !== '')
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={4}
                        placeholder="Digite cada característica em uma linha separada&#10;Ex: Piscina&#10;Academia&#10;Portaria 24h"
                      />
                      <p className="text-xs text-gray-500 mt-1">Digite cada característica em uma linha separada</p>
                    </div>
                  </div>
                </div>

                {/* Upload de Imagens */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fotos do Imóvel</label>
                  <div className="space-y-4">
                    {/* Área de Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"> 
                      <input
                        type="file"
                        id="admin-images"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="admin-images"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Clique para adicionar fotos ou arraste aqui
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, JPEG até 10MB cada
                        </span>
                      </label>
                    </div>

                    {/* Preview das Imagens */}
                    {newPropertyImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {newPropertyImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />

                            {/* Badge de Foto Principal */}
                            {image.isMain && (
                              <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                                Principal
                              </div>
                            )}

                            {/* Botões de Ação */}
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                              {!image.isMain && (
                                <button
                                  type="button"
                                  onClick={() => setMainImage(index)}
                                  className="bg-blue-600 text-white p-2 rounded text-xs hover:bg-blue-700"
                                  title="Definir como principal"
                                >
                                  <Star className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="bg-red-600 text-white p-2 rounded text-xs hover:bg-red-700"
                                title="Remover imagem"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {newPropertyImages.length > 0 && (
                      <p className="text-sm text-gray-600">
                        {newPropertyImages.length} foto(s) selecionada(s).
                        {newPropertyImages.find(img => img.isMain) ? ' A foto principal está marcada.' : ' Clique na estrela para definir a foto principal.'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowNewPropertyForm(false)}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateProperty}
                    className="btn-primary"
                  >
                    Criar Imóvel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo das Tabs */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Imóveis</p>
                    <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Imóveis Ativos</p>
                    <p className="text-2xl font-bold text-gray-900">{activeProperties.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Eye className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Aguardando Aprovação</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingProperties.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                    <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Mensagens Não Respondidas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {messages.filter(m => m.status === 'não respondida').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Imóveis Recentes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Imóveis Recentes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Imóvel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Corretor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeProperties.slice(0, 5).map((property) => (
                      <tr key={property._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{property.title}</div>
                            <div className="text-sm text-gray-500">{property.neighborhood}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {property.corretor?.name || 'Não definido'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            property.status === 'ativo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {property.status === 'ativo' ? 'Ativo' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {property.price.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(property._id)}
                            className="text-primary-600 hover:text-primary-900 mr-3"
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'client-properties' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Imóveis de Clientes</h3>
              <p className="text-sm text-gray-600 mt-1">Imóveis enviados pelos clientes para cadastro</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imóvel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientProperties.map((property) => (
                    <tr key={property._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">{property.neighborhood}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.submittedBy.name}</div>
                        <div className="text-sm text-gray-500">{property.submittedBy.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          property.status === 'ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status === 'ativo' ? 'Aprovado' : 'Aguardando'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {property.price.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {property.status === 'inativo' && (
                            <>
                              <button
                                onClick={() => handlePropertyStatus(property._id, 'ativo')}
                                className="text-green-600 hover:text-green-900"
                                title="Aprovar"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handlePropertyStatus(property._id, 'rejeitado')}
                                className="text-red-600 hover:text-red-900"
                                title="Rejeitar"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleViewDetails(property._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {clientProperties.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum imóvel de cliente
                  </div>
                )}
              </table>
            </div>
          </div>
        )}

        {activeTab === 'admin-properties' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Imóveis das Corretoras</h3>
              <p className="text-sm text-gray-600 mt-1">Imóveis cadastrados diretamente pelas corretoras</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imóvel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enviado por
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminProperties.map((property) => (
                    <tr key={property._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">{property.neighborhood}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.submittedBy.name}</div>
                        <div className="text-sm text-gray-500">{property.submittedBy.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Ativo
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {property.price.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleHighlight(property._id, !property.isHighlighted)}
                            className={`${property.isHighlighted ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-600`}
                            title={property.isHighlighted ? 'Remover destaque' : 'Destacar'}
                          >
                            <Star className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleViewDetails(property._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditProperty(property._id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {adminProperties.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum imóvel das corretoras
                  </div>
                )}
              </table>
            </div>
          </div>
        )}

        {activeTab === 'all-properties' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Todos os Imóveis</h3>
              <p className="text-sm text-gray-600 mt-1">Lista completa de todos os imóveis cadastrados no sistema</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imóvel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enviado por
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">{property.neighborhood}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {property.submittedBy?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.submittedBy?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          property.status === 'ativo'
                            ? 'bg-green-100 text-green-800'
                            : property.status === 'inativo'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {property.status === 'ativo' ? 'Ativo' : property.status === 'inativo' ? 'Pendente' : 'Rejeitado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {property.price.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(property._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {properties.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum imóvel cadastrado
                  </div>
                )}
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Gerenciar Usuários</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Função
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString('pt-BR')
                          : 'Nunca'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleUserStatus(user._id, !user.isActive)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              user.isActive
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                            title={user.isActive ? 'Desativar usuário temporariamente' : 'Ativar usuário'}
                          >
                            {user.isActive ? 'Desativar' : 'Ativar'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                            title="Excluir usuário permanentemente"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Gerenciar Mensagens</h3>
              <p className="text-sm text-gray-600 mt-1">Mensagens enviadas através do formulário de contato</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assunto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map((message) => (
                    <tr key={message._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                          {message.phone && (
                            <div className="text-sm text-gray-500">{message.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{message.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          message.status === 'respondida'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {message.status === 'respondida' ? 'Respondida' : 'Não Respondida'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewMessage(message)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {message.status === 'não respondida' ? (
                            <button
                              onClick={() => handleToggleMessageStatus(message._id, 'respondida')}
                              className="text-green-600 hover:text-green-900"
                              title="Marcar como respondida"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleMessageStatus(message._id, 'não respondida')}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Marcar como não respondida"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {messages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma mensagem recebida
                  </div>
                )}
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Imóvel */}
      {showPropertyDetails && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Detalhes do Imóvel</h2>
              <button
                onClick={() => setShowPropertyDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="px-6 py-4 space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Título:</span>
                    <p className="text-gray-900">{selectedProperty.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Finalidade:</span>
                    <p className="text-gray-900">{selectedProperty.purpose === 'venda' ? 'Venda' : 'Aluguel'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Preço:</span>
                    <p className="text-gray-900">R$ {selectedProperty.price.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Bairro:</span>
                    <p className="text-gray-900">{selectedProperty.neighborhood}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Quartos:</span>
                    <p className="text-gray-900">{selectedProperty.bedrooms}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Banheiros:</span>
                    <p className="text-gray-900">{selectedProperty.bathrooms}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Vagas:</span>
                    <p className="text-gray-900">{selectedProperty.parkingSpaces}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Área Total:</span>
                    <p className="text-gray-900">{selectedProperty.totalArea}m²</p>
                  </div>
                </div>

                {selectedProperty.longDescription && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Descrição</h3>
                    <p className="text-gray-700">{selectedProperty.longDescription}</p>
                  </div>
                )}

                {/* Detalhes Adicionais */}
                {selectedProperty.details && selectedProperty.details.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Detalhes Adicionais</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedProperty.details.map((detail, index) => (
                        <li key={index} className="text-gray-700">{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Características Especiais */}
                {selectedProperty.features && selectedProperty.features.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Características Especiais</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedProperty.features.map((feature, index) => (
                        <li key={index} className="text-gray-700">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProperty.images && selectedProperty.images.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Imagens</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedProperty.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.url}
                            alt={`Imagem ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          {image.isMain && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                              Principal
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gerenciar Usuários */}
      {showUserManagementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Gerenciar Usuários</h2>
              <button
                onClick={() => setShowUserManagementModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Criar Novo Usuário</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Senha"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Função
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'client' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="client">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleCreateUser}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Criar Usuário
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Usuários Existentes</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Função
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleToggleUserStatus(user._id)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                  user.isActive
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {user.isActive ? 'Desativar' : 'Ativar'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id, user.name)}
                                className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Propriedade */}
      {showEditPropertyForm && editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Editar Imóvel</h2>
              <button
                onClick={() => setShowEditPropertyForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Formulário de Edição */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                  <input
                    type="text"
                    value={editingProperty.title}
                    onChange={(e) => setEditingProperty(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Finalidade *</label>
                  <select
                    value={editingProperty.purpose}
                    onChange={(e) => setEditingProperty(prev => prev ? { ...prev, purpose: e.target.value as 'venda' | 'aluguel' } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preço *</label>
                  <input
                    type="number"
                    value={editingProperty.price}
                    onChange={(e) => setEditingProperty(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro *</label>
                  <input
                    type="text"
                    value={editingProperty.neighborhood}
                    onChange={(e) => setEditingProperty(prev => prev ? { ...prev, neighborhood: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quartos *</label>
                  <input
                    type="number"
                    value={editingProperty.bedrooms}
                    onChange={(e) => setEditingProperty(prev => prev ? { ...prev, bedrooms: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banheiros *</label>
                  <input
                    type="number"
                    value={editingProperty.bathrooms}
                    onChange={(e) => setEditingProperty(prev => prev ? { ...prev, bathrooms: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vagas</label>
                  <input
                    type="number"
                    value={editingProperty.parkingSpaces}
                    onChange={(e) => setEditingProperty(prev => prev ? { ...prev, parkingSpaces: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Área Total (m²)</label>
                  <input
                    type="number"
                    value={editingProperty.totalArea}
                    onChange={(e) => setEditingProperty(prev => prev ? { ...prev, totalArea: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Campos de Endereço */}
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Endereço (Opcional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                    <input
                      type="text"
                      value={editingProperty.address?.street || ''}
                      onChange={(e) => setEditingProperty(prev => prev ? { 
                        ...prev, 
                        address: { ...prev.address, street: e.target.value, city: prev.address?.city || '', state: prev.address?.state || '', number: prev.address?.number || '' }
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nome da rua"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                    <input
                      type="text"
                      value={editingProperty.address?.number || ''}
                      onChange={(e) => setEditingProperty(prev => prev ? { 
                        ...prev, 
                        address: { ...prev.address, number: e.target.value, city: prev.address?.city || '', state: prev.address?.state || '', street: prev.address?.street || '' }
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                    <input
                      type="text"
                      value={editingProperty.address?.complement || ''}
                      onChange={(e) => setEditingProperty(prev => prev ? { 
                        ...prev, 
                        address: { ...prev.address, complement: e.target.value, city: prev.address?.city || '', state: prev.address?.state || '', street: prev.address?.street || '', number: prev.address?.number || '' }
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Apto 101, Bloco A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                    <input
                      type="text"
                      value={editingProperty.address?.city || ''}
                      onChange={(e) => setEditingProperty(prev => prev ? { 
                        ...prev, 
                        address: { ...prev.address, city: e.target.value, state: prev.address?.state || '', street: prev.address?.street || '', number: prev.address?.number || '' }
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="São Paulo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <input
                      type="text"
                      value={editingProperty.address?.state || ''}
                      onChange={(e) => setEditingProperty(prev => prev ? { 
                        ...prev, 
                        address: { ...prev.address, state: e.target.value, city: prev.address?.city || '', street: prev.address?.street || '', number: prev.address?.number || '' }
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="SP"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                    <input
                      type="text"
                      value={editingProperty.address?.zipCode || ''}
                      onChange={(e) => setEditingProperty(prev => prev ? { 
                        ...prev, 
                        address: { ...prev.address, zipCode: e.target.value, city: prev.address?.city || '', state: prev.address?.state || '', street: prev.address?.street || '', number: prev.address?.number || '' }
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Corretor Responsável *</label>
                <select
                  value={editingProperty.corretor?.name || ''}
                  onChange={(e) => {
                    const corretor = CORRETORAS.find(c => c.name === e.target.value)
                    if (corretor) {
                      setEditingProperty(prev => prev ? { ...prev, corretor } : null)
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {CORRETORAS.map(corretor => (
                    <option key={corretor.name} value={corretor.name}>
                      {corretor.name} - {corretor.whatsapp}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={editingProperty.longDescription || ''}
                  onChange={(e) => setEditingProperty(prev => prev ? { ...prev, longDescription: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Campos de Detalhes e Características */}
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Detalhes e Características (Opcional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Detalhes</label>
                    <textarea
                      value={editingProperty.details?.join('\n') || ''}
                      onChange={(e) => setEditingProperty(prev => prev ? { 
                        ...prev, 
                        details: e.target.value.split('\n').filter(item => item.trim() !== '')
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={4}
                      placeholder="Digite cada detalhe em uma linha separada&#10;Ex: Piso laminado&#10;Cozinha planejada&#10;Sacada com churrasqueira"
                    />
                    <p className="text-xs text-gray-500 mt-1">Digite cada detalhe em uma linha separada</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Características</label>
                    <textarea
                      value={editingProperty.features?.join('\n') || ''}
                      onChange={(e) => setEditingProperty(prev => prev ? { 
                        ...prev, 
                        features: e.target.value.split('\n').filter(item => item.trim() !== '')
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={4}
                      placeholder="Digite cada característica em uma linha separada&#10;Ex: Piscina&#10;Academia&#10;Portaria 24h"
                    />
                    <p className="text-xs text-gray-500 mt-1">Digite cada característica em uma linha separada</p>
                  </div>
                </div>
              </div>

              {/* Imagens Existentes */}
              {editingProperty.images && editingProperty.images.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagens Atuais</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {editingProperty.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        {image.isMain && (
                          <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowEditPropertyForm(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleUpdateProperty(editingProperty)}
                  className="btn-primary"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Mensagem */}
      {showMessageDetails && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Detalhes da Mensagem</h2>
              <button
                onClick={() => setShowMessageDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="px-6 py-4 space-y-6">
              {/* Informações do Cliente */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informações do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Nome:</span>
                    <p className="text-gray-900">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">E-mail:</span>
                    <p className="text-gray-900">{selectedMessage.email}</p>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Telefone:</span>
                      <p className="text-gray-900">{selectedMessage.phone}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-600">Assunto:</span>
                    <p className="text-gray-900">{selectedMessage.subject}</p>
                  </div>
                </div>
              </div>

              {/* Mensagem */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Mensagem</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Status e Resposta */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Status e Resposta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                      selectedMessage.status === 'respondida'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedMessage.status === 'respondida' ? 'Respondida' : 'Não Respondida'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Data de Envio:</span>
                    <p className="text-gray-900">{new Date(selectedMessage.createdAt).toLocaleString('pt-BR')}</p>
                  </div>
                  {selectedMessage.respondedBy && (
                    <>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Respondida por:</span>
                        <p className="text-gray-900">{selectedMessage.respondedBy.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Data da Resposta:</span>
                        <p className="text-gray-900">{selectedMessage.respondedAt ? new Date(selectedMessage.respondedAt).toLocaleString('pt-BR') : 'N/A'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowMessageDetails(false)}
                  className="btn-secondary"
                >
                  Fechar
                </button>
                {selectedMessage.status === 'não respondida' ? (
                  <button
                    onClick={() => handleToggleMessageStatus(selectedMessage._id, 'respondida')}
                    className="btn-primary"
                  >
                    Marcar como Respondida
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleMessageStatus(selectedMessage._id, 'não respondida')}
                    className="btn-secondary"
                  >
                    Marcar como Não Respondida
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default AdminPage