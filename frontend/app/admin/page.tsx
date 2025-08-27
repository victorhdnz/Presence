'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { 
  Building2, Users, Home, Plus, Edit, Trash2, Eye, 
  Star, CheckCircle, XCircle, DollarSign, TrendingUp, MessageCircle,
  FileText, CheckSquare, UserCheck, Building, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Property {
  _id: string
  title: string
  price: number
  neighborhood: string
  status: string
  isHighlighted: boolean
  createdAt: string
  submittedBy: {
    name: string
    email: string
    role?: string
  }
  corretor?: {
    name: string
    whatsapp: string
    email: string
  }
  purpose?: string
  bedrooms?: number
  bathrooms?: number
  parkingSpaces?: number
  totalArea?: number
  landSize?: number
  longDescription?: string
  details?: string[]
  features?: string[]
  address?: {
    street: string
    number: string
    complement?: string
    city: string
    state: string
    zipCode?: string
  }
  images?: Array<{
    url: string
    isMain: boolean
  }>
}

interface User {
  _id: string
  name: string
  email: string
  role: string
  isActive: boolean
  lastLogin: string
  createdAt: string
}

// Dados das corretoras
const CORRETORAS = [
  {
    name: 'Helo',
    whatsapp: '5534999999999',
    email: 'helo@presence.com.br'
  },
  {
    name: 'Vânia',
    whatsapp: '5534888888888',
    email: 'vania@presence.com.br'
  }
]

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showPropertyDetails, setShowPropertyDetails] = useState(false)
  const [showEditPropertyForm, setShowEditPropertyForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [newProperty, setNewProperty] = useState({
    title: '',
    purpose: 'venda' as 'venda' | 'aluguel',
    price: '',
    neighborhood: '',
    bedrooms: '',
    bathrooms: '',
    parkingSpaces: '',
    totalArea: '',
    longDescription: '',
    corretor: CORRETORAS[0]
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchData()
  }, [isAuthenticated, user, router])

  const fetchData = async () => {
    try {
      const [propertiesRes, usersRes] = await Promise.all([
        api.get('/properties/admin/all'),
        api.get('/auth/users')
      ])
      setProperties(propertiesRes.data)
      setUsers(usersRes.data)
          } catch (error) {
        toast.error('Erro ao carregar dados do dashboard')
        console.error('Erro ao buscar dados:', error)
      } finally {
      setIsLoading(false)
    }
  }

  const handlePropertyStatus = async (propertyId: string, status: string) => {
    try {
      await api.patch(`/properties/${propertyId}/approve`, { 
        status, 
        approved: status === 'ativo' 
      })
      toast.success(`Imóvel ${status === 'ativo' ? 'aprovado' : 'rejeitado'} com sucesso!`)
      fetchData()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      toast.error('Erro ao alterar status do imóvel')
    }
  }

  const handleHighlight = async (propertyId: string, isHighlighted: boolean) => {
    try {
      await api.patch(`/properties/${propertyId}/highlight`, { isHighlighted })
      toast.success(`Imóvel ${isHighlighted ? 'destacado' : 'desdestacado'} com sucesso!`)
      fetchData()
    } catch (error) {
      console.error('Erro ao alterar destaque:', error)
      toast.error('Erro ao alterar destaque do imóvel')
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

  const handleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/auth/users/${userId}/status`, { isActive })
      toast.success(`Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso!`)
      fetchData()
    } catch (error) {
      toast.error('Erro ao alterar status do usuário')
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${userName}"? Esta ação não pode ser desfeita.`)) return
    
    try {
      await api.delete(`/auth/users/${userId}`)
      toast.success('Usuário excluído com sucesso!')
      fetchData()
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao excluir usuário'
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
    try {
      const response = await api.get(`/properties/${propertyId}`)
      setEditingProperty(response.data)
      setShowEditPropertyForm(true)
    } catch (error) {
      toast.error('Erro ao carregar dados do imóvel para edição')
    }
  }

  const handleUpdateProperty = async (updatedData: any) => {
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

  const handleCreateProperty = async () => {
    try {
      const propertyData = {
        ...newProperty,
        price: Number(newProperty.price),
        bedrooms: Number(newProperty.bedrooms),
        bathrooms: Number(newProperty.bathrooms),
        parkingSpaces: Number(newProperty.parkingSpaces),
        totalArea: Number(newProperty.totalArea),
        corretor: newProperty.corretor
      }

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
      fetchData()
    } catch (error) {
      toast.error('Erro ao criar imóvel')
    }
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

  const activeProperties = properties.filter(p => p.status === 'ativo')
  const pendingProperties = properties.filter(p => p.status === 'inativo')
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.isActive).length

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
                <p className="text-gray-600">Bem-vindo, {user?.name}!</p>
              </div>
              <button
                onClick={() => setShowNewPropertyForm(true)}
                className="btn-primary"
              >
                <Plus className="h-5 w-5 mr-2" />
                Novo Imóvel
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Visão Geral', icon: TrendingUp },
                { id: 'client-properties', name: 'Imóveis de Clientes', icon: UserCheck },
                { id: 'admin-properties', name: 'Imóveis das Corretoras', icon: Building },
                { id: 'users', name: 'Usuários', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Modal Novo Imóvel */}
          {showNewPropertyForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 sm:p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Criar Novo Imóvel</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                    <div className="relative">
                      <select
                        value={newProperty.purpose}
                        onChange={(e) => setNewProperty(prev => ({ ...prev, purpose: e.target.value as 'venda' | 'aluguel' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                      >
                        <option value="venda">Venda</option>
                        <option value="aluguel">Aluguel</option>
                      </select>
                    </div>
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
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Corretor Responsável *</label>
                  <div className="relative">
                    <select
                      value={newProperty.corretor.name}
                      onChange={(e) => {
                        const corretor = CORRETORAS.find(c => c.name === e.target.value)
                        if (corretor) {
                          setNewProperty(prev => ({ ...prev, corretor }))
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                    >
                      {CORRETORAS.map(corretor => (
                        <option key={corretor.name} value={corretor.name}>
                          {corretor.name} - {corretor.whatsapp}
                        </option>
                      ))}
                    </select>
                  </div>
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
          )}

          {/* Conteúdo das Tabs */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      {properties.slice(0, 5).map((property) => (
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
                              onClick={() => router.push(`/admin/imovel/${property._id}`)}
                              className="text-primary-600 hover:text-primary-900 mr-3"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => router.push(`/admin/editar-imovel/${property._id}`)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit className="h-4 w-4" />
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
                    {properties.filter(p => p.submittedBy && p.submittedBy.role !== 'admin' && p.status !== 'rejeitado').map((property) => (
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {properties.filter(p => p.submittedBy && p.submittedBy.role !== 'admin' && p.status !== 'rejeitado').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum imóvel de cliente
                  </div>
                )}
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
                    {properties.filter(p => p.submittedBy?.role === 'admin' || (p.status === 'ativo' && !p.submittedBy?.role)).map((property) => (
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
                </table>
                {properties.filter(p => p.submittedBy?.role === 'admin' || (p.status === 'ativo' && !p.submittedBy?.role)).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum imóvel das corretoras
                  </div>
                )}
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
        </div>
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
                    <p className="text-gray-900 capitalize">{selectedProperty.purpose}</p>
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
                    <p className="text-gray-900">{selectedProperty.totalArea} m²</p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              {selectedProperty.address && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Endereço</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">
                      {selectedProperty.address.street}, {selectedProperty.address.number}
                      {selectedProperty.address.complement && `, ${selectedProperty.address.complement}`}
                    </p>
                    <p className="text-gray-900">
                      {selectedProperty.address.city} - {selectedProperty.address.state}
                      {selectedProperty.address.zipCode && ` | CEP: ${selectedProperty.address.zipCode}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Descrição */}
              {selectedProperty.longDescription && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Descrição</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedProperty.longDescription}</p>
                  </div>
                </div>
              )}

              {/* Detalhes */}
              {selectedProperty.details && selectedProperty.details.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Detalhes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside space-y-1">
                      {selectedProperty.details.map((detail, index) => (
                        <li key={index} className="text-gray-900">{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Características */}
              {selectedProperty.features && selectedProperty.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Características Especiais</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside space-y-1">
                      {selectedProperty.features.map((feature, index) => (
                        <li key={index} className="text-gray-900">{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Corretor */}
              {selectedProperty.corretor && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Corretor Responsável</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Nome:</span>
                        <p className="text-gray-900">{selectedProperty.corretor.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">WhatsApp:</span>
                        <p className="text-gray-900">{selectedProperty.corretor.whatsapp}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Email:</span>
                        <p className="text-gray-900">{selectedProperty.corretor.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Informações do Envio */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informações do Envio</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Enviado por:</span>
                      <p className="text-gray-900">{selectedProperty.submittedBy.name}</p>
                      <p className="text-gray-600 text-sm">{selectedProperty.submittedBy.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Data de Envio:</span>
                      <p className="text-gray-900">
                        {new Date(selectedProperty.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Imagens */}
              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Imagens</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedProperty.images.map((image, index) => (
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
            </div>

            {/* Footer do Modal */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowPropertyDetails(false)}
                className="btn-secondary"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição do Imóvel */}
      {showEditPropertyForm && editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const updatedData = {
                title: formData.get('title'),
                price: Number(formData.get('price')),
                neighborhood: formData.get('neighborhood'),
                bedrooms: Number(formData.get('bedrooms')),
                bathrooms: Number(formData.get('bathrooms')),
                parkingSpaces: Number(formData.get('parkingSpaces')),
                totalArea: Number(formData.get('totalArea')),
                longDescription: formData.get('longDescription'),
                purpose: formData.get('purpose')
              }
              handleUpdateProperty(updatedData)
            }}>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingProperty.title}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Finalidade *
                    </label>
                    <select
                      name="purpose"
                      defaultValue={editingProperty.purpose}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="venda">Venda</option>
                      <option value="aluguel">Aluguel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço *
                    </label>
                    <input
                      type="number"
                      name="price"
                      defaultValue={editingProperty.price}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      defaultValue={editingProperty.neighborhood}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quartos
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      defaultValue={editingProperty.bedrooms}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banheiros
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      defaultValue={editingProperty.bathrooms}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vagas
                    </label>
                    <input
                      type="number"
                      name="parkingSpaces"
                      defaultValue={editingProperty.parkingSpaces}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Área Total (m²)
                    </label>
                    <input
                      type="number"
                      name="totalArea"
                      defaultValue={editingProperty.totalArea}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    name="longDescription"
                    defaultValue={editingProperty.longDescription}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Footer do Modal */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowEditPropertyForm(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}
