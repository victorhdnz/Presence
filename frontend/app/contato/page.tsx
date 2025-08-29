'use client'

import { useState } from 'react'
import {
  Building2, MapPin, Phone, Mail, Clock, Send,
  MessageCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function ContatoPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Preencha os campos obrigatórios')
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem')
      }

      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 sm:mb-6 text-primary-200" />
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
                Entre em Contato
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto px-4">
                Estamos aqui para ajudar você a encontrar o imóvel dos seus sonhos
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16">
            {/* Informações de Contato */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                Informações de Contato
              </h2>
              
              <div className="space-y-6 sm:space-y-8">
                {/* Endereço */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-primary-100 rounded-lg p-2 sm:p-3 flex-shrink-0">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      Endereço
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      RUA IZAU RANGEL DE MENDONÇA, nº 920 - JARDIM FINOTTI<br />
                      UBERLÂNDIA / MG - CEP: 38408-136
                    </p>
                  </div>
                </div>

                {/* Telefones */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-primary-100 rounded-lg p-2 sm:p-3 flex-shrink-0">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      Telefones
                    </h3>
                    <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                      <div className="text-gray-600">
                        <span className="font-medium">Heloisa:</span> 
                        <a href="https://wa.me/553484008321" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 ml-1">
                          +55 34 8400-8321
                        </a>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Vânia:</span> 
                        <a href="https://wa.me/553496877060" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 ml-1">
                          +55 34 9687-7060
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E-mails */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-primary-100 rounded-lg p-2 sm:p-3 flex-shrink-0">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      E-mails
                    </h3>
                    <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                      <div className="text-gray-600">
                        <span className="font-medium">Heloisa:</span> consultoriapresence@gmail.com
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Vânia:</span> consultoriapresence@gmail.com
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Geral:</span> consultoriapresence@gmail.com
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horário de Funcionamento */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-primary-100 rounded-lg p-2 sm:p-3 flex-shrink-0">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                      Horário de Funcionamento
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      24 horas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário de Contato */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                Envie uma Mensagem
              </h2>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="(34) 99999-9999"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Assunto
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="compra">Compra de Imóvel</option>
                        <option value="venda">Venda de Imóvel</option>
                        <option value="aluguel">Aluguel</option>
                        <option value="consulta">Consulta</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Digite sua mensagem..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{isLoading ? 'Enviando...' : 'Enviar Mensagem'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="mt-16 sm:mt-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Nossa Localização
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.1234567890123!2d-48.2774!3d-18.9186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU1JzA2LjkiUyA0OMKwMTYnMzguNiJX!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Presence Consultoria Imobiliária - RUA IZAU RANGEL DE MENDONÇA, nº 920 - JARDIM FINOTTI - UBERLÂNDIA / MG"
                className="w-full h-64 sm:h-96"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
