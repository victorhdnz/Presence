'use client'

import Link from 'next/link'
import { Building2, Phone, Mail, MapPin, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary-400" />
              <span className="text-xl sm:text-2xl font-bold">Presence</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md text-sm sm:text-base">
              Consultoria imobiliária de excelência em Uberlândia. 
              Conectamos você ao imóvel dos seus sonhos com profissionalismo e dedicação.
            </p>
          </div>

          {/* Informações de Contato e Redes Sociais */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contato</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm sm:text-base">
                  RUA IZAU RANGEL DE MENDONÇA, nº 920 - JARDIM FINOTTI - UBERLÂNDIA / MG - CEP: 38408-136
                </span>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm sm:text-base">CRECI: 21002/MG</span>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm sm:text-base break-all">consultoriapresence@gmail.com</span>
              </div>
            </div>

            {/* Corretoras */}
            <div className="mt-4 sm:mt-6">
              <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Corretoras</h4>
              <div className="space-y-2">
                <a 
                  href="https://wa.me/553484008321"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors duration-200"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-gray-300 hover:text-white transition-colors duration-200">Heloisa: +55 34 8400-8321</span>
                </a>
                <a 
                  href="https://wa.me/553496877060"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors duration-200"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-gray-300 hover:text-white transition-colors duration-200">Vânia: +55 34 9687-7060</span>
                </a>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="mt-4 sm:mt-6">
              <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Redes Sociais</h4>
              <a 
                href="https://www.instagram.com/presenceimobiliaria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors duration-200"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-gray-300 hover:text-white transition-colors duration-200">@presenceimobiliaria</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            © 2025 Presence Imobiliária. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
