'use client'

import { Building2, Users, Award, MapPin, Phone, Mail, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center">
              <Building2 className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 sm:mb-6 text-primary-200" />
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
                Sobre a Presence
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto px-4">
                Consultoria imobiliária de excelência, comprometida em realizar sonhos e construir futuros
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Nossa História */}
          <div className="mb-16 sm:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Nossa História
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                A Presence nasceu da paixão por conectar pessoas aos seus lares ideais
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Uma Jornada de Confiança e Excelência
                </h3>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                  <p>
                    Fundada com a missão de transformar o mercado imobiliário através de um atendimento 
                    personalizado e transparente, a Presence se tornou referência em Uberlândia.
                  </p>
                  <p>
                    Nossa equipe de corretores especializados trabalha com dedicação para entender 
                    as necessidades únicas de cada cliente, oferecendo soluções personalizadas que 
                    superam expectativas.
                  </p>
                  <p>
                    Ao longo dos anos, construímos uma reputação sólida baseada em resultados 
                    excepcionais e relacionamentos duradouros com nossos clientes.
                  </p>
                </div>
              </div>
                    <div className="order-1 lg:order-2 bg-gray-200 rounded-lg h-64 sm:h-80 flex items-center justify-center">
        <Building2 className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400" />
      </div>
            </div>
          </div>

          {/* Nossos Valores */}
          <div className="mb-16 sm:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Nossos Valores
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                Princípios que guiam cada decisão e ação da nossa empresa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  Transparência
                </h3>
                <p className="text-sm sm:text-base text-gray-600 px-2">
                  Agimos com honestidade e clareza em todas as nossas transações, 
                  construindo confiança através da transparência.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  Foco no Cliente
                </h3>
                <p className="text-sm sm:text-base text-gray-600 px-2">
                  Cada cliente é único e merece atenção especial. Nosso compromisso 
                  é superar expectativas e entregar resultados excepcionais.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  Excelência
                </h3>
                <p className="text-sm sm:text-base text-gray-600 px-2">
                  Buscamos constantemente aprimorar nossos serviços, mantendo 
                  os mais altos padrões de qualidade e profissionalismo.
                </p>
              </div>
            </div>
          </div>

          {/* Nossa Equipe */}
          <div className="mb-16 sm:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Nossa Equipe
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                Profissionais experientes e dedicados ao seu sucesso
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
!                        <div className="bg-gray-200 rounded-full w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
          <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
        </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Heloisa
                </h3>
                <p className="text-primary-600 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Corretora Especialista</p>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Especialista em imóveis residenciais de alto padrão, 
                  com mais de 40 anos de experiência no mercado.
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
                    <a href="https://wa.me/553484008321" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                      +55 34 8400-8321
                    </a>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
                    <span className="text-gray-700 break-all">consultoriapresence@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
                        <div className="bg-gray-200 rounded-full w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
          <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
        </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Vânia
                </h3>
                <p className="text-primary-600 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Corretora Especialista</p>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Especializada em investimentos imobiliários e 
                  consultoria para clientes corporativos, com mais de 40 anos de experiência.
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
                    <a href="https://wa.me/553496877060" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                      +55 34 9687-7060
                    </a>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
                    <span className="text-gray-700 break-all">consultoriapresence@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="mb-16 sm:mb-20">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">500+</div>
                  <div className="text-sm sm:text-base text-gray-600">Imóveis Vendidos</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">1000+</div>
                  <div className="text-sm sm:text-base text-gray-600">Clientes Satisfeitos</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">50+</div>
                  <div className="text-sm sm:text-base text-gray-600">Bairros Atendidos</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">40+</div>
                  <div className="text-sm sm:text-base text-gray-600">Anos de Experiência</div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
      
      <Footer />
    </div>
  )
}
