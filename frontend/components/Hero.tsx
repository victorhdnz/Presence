'use client'

import Link from 'next/link'
import { Search, MapPin, Home, Building2 } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Encontre o Imóvel dos Seus Sonhos
          </h1>
          
          {/* Descrição */}
          <p className="text-lg sm:text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
            A Presence Imobiliária oferece as melhores opções de imóveis em Uberlândia. 
            Comprar, alugar ou investir nunca foi tão fácil.
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Botão Ver Imóveis */}
            <Link
              href="/imoveis"
              className="group bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Search className="h-5 w-5 flex-shrink-0" />
              <span>Ver Imóveis</span>
            </Link>

            {/* Botão Cadastrar Imóvel */}
            <Link
              href="/cadastrar-imovel"
              className="group border-2 border-white text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200 flex items-center space-x-3"
            >
              <Building2 className="h-5 w-5 flex-shrink-0" />
              <span>Cadastrar Imóvel</span>
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="bg-white bg-opacity-10 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 sm:h-10 sm:w-10 text-primary-200" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">500+</div>
            <div className="text-primary-200 text-sm sm:text-base">Imóveis Disponíveis</div>
          </div>

          <div className="text-center">
            <div className="bg-white bg-opacity-10 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-primary-200" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">50+</div>
            <div className="text-primary-200 text-sm sm:text-base">Bairros Atendidos</div>
          </div>

          <div className="text-center">
            <div className="bg-white bg-opacity-10 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary-200" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-2">1000+</div>
            <div className="text-primary-200 text-sm sm:text-base">Clientes Satisfeitos</div>
          </div>
        </div>
      </div>
    </section>
  )
}
