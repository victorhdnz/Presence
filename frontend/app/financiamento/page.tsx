'use client'

import { useState } from 'react'
import { 
  Building2, 
  Calculator, 
  FileText, 
  CheckCircle, 
  ExternalLink,
  ArrowRight,
  Home,
  DollarSign,
  Clock,
  Shield
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function FinanciamentoPage() {
  const [activeTab, setActiveTab] = useState('simuladores')

  const bancos = [
    {
      nome: 'Banco do Brasil',
      url: 'https://www.bb.com.br/site/pra-voce/financiamentos/financiamento-imobiliario/#',
      descricao: 'Simulador oficial do Banco do Brasil com opções de financiamento imobiliário'
    },
    {
      nome: 'Caixa Econômica Federal',
      url: 'https://www.caixa.gov.br/voce/habitacao/financiamento-de-imoveis/Paginas/default.aspx',
      descricao: 'Simulador da Caixa com programas habitacionais e financiamento imobiliário'
    },
    {
      nome: 'Santander',
      url: 'https://www.santander.com.br/banco/credito-financiamento-imobiliario',
      descricao: 'Simulador do Santander para crédito e financiamento imobiliário'
    },
    {
      nome: 'Itaú',
      url: 'https://www.itau.com.br/emprestimos-financiamentos/credito-imobiliario',
      descricao: 'Simulador do Itaú para empréstimos e financiamentos imobiliários'
    },
    {
      nome: 'Sicoob',
      url: 'https://www.sicoob.com.br/web/creditoimobiliario/simulador',
      descricao: 'Simulador do Sicoob para crédito imobiliário'
    },
    {
      nome: 'Banco BRB',
      url: 'https://novo.brb.com.br/para-voce/emprestimos-e-financiamentos/credito-imobiliario',
      descricao: 'Simulador do Banco BRB para empréstimos e financiamentos imobiliários'
    }
  ]

  const dicas = [
    {
      titulo: 'Documentação Necessária',
      descricao: 'RG, CPF, comprovante de renda, comprovante de residência e documentação do imóvel',
      icone: FileText
    },
    {
      titulo: 'Entrada Mínima',
      descricao: 'Geralmente 20% do valor do imóvel, mas pode variar conforme o banco e programa',
      icone: DollarSign
    },
    {
      titulo: 'Prazo de Pagamento',
      descricao: 'Pode chegar até 35 anos, dependendo da sua idade e capacidade de pagamento',
      icone: Clock
    },
    {
      titulo: 'Taxa de Juros',
      descricao: 'Compare as taxas entre os bancos, pois podem variar significativamente',
      icone: Calculator
    }
  ]

  const beneficios = [
    'Financiamento com juros menores que empréstimos pessoais',
    'Possibilidade de usar o FGTS para pagar a entrada',
    'Dedução dos juros no Imposto de Renda',
    'Flexibilidade para amortizar o financiamento antecipadamente',
    'Segurança jurídica com garantia real do imóvel'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Building2 className="h-16 w-16 sm:h-20 sm:w-20 text-primary-200" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Financiamento Imobiliário
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto">
            Realize o sonho da casa própria com as melhores condições de financiamento. 
            Compare simuladores dos principais bancos e encontre a opção ideal para você.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('simuladores')}
              className={`py-4 px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'simuladores'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calculator className="inline h-4 w-4 mr-2" />
              Simuladores de Bancos
            </button>
            <button
              onClick={() => setActiveTab('dicas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'dicas'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="inline h-4 w-4 mr-2" />
              Dicas e Documentação
            </button>
            <button
              onClick={() => setActiveTab('beneficios')}
              className={`py-4 px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'beneficios'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CheckCircle className="inline h-4 w-4 mr-2" />
              Benefícios
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Simuladores de Bancos */}
          {activeTab === 'simuladores' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Simuladores dos Principais Bancos
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Acesse os simuladores oficiais dos bancos para calcular seu financiamento 
                  e comparar as melhores condições disponíveis no mercado.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bancos.map((banco, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary-100 rounded-lg p-3">
                        <Building2 className="h-6 w-6 text-primary-600" />
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {banco.nome}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {banco.descricao}
                    </p>
                    
                    <a
                      href={banco.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group"
                    >
                      Acessar Simulador
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-lg p-2 mr-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Importante
                    </h3>
                    <p className="text-blue-800 text-sm">
                      Os simuladores são fornecidos pelos próprios bancos. Sempre confirme as informações 
                      diretamente com a instituição financeira escolhida. As condições podem variar 
                      conforme sua situação financeira e o programa de financiamento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dicas e Documentação */}
          {activeTab === 'dicas' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Dicas e Documentação Necessária
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Prepare-se para o processo de financiamento conhecendo os documentos necessários 
                  e as principais dicas para uma aprovação mais rápida.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Documentação Necessária
                  </h3>
                  <div className="space-y-4">
                    {dicas.map((dica, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="bg-primary-100 rounded-lg p-2 flex-shrink-0">
                          <dica.icone className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {dica.titulo}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {dica.descricao}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Dicas para Aprovação
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">
                        <CheckCircle className="inline h-4 w-4 mr-2" />
                        Organize sua documentação
                      </h4>
                      <p className="text-green-800 text-sm">
                        Tenha todos os documentos organizados e atualizados antes de iniciar o processo.
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        <CheckCircle className="inline h-4 w-4 mr-2" />
                        Compare as opções
                      </h4>
                      <p className="text-blue-800 text-sm">
                        Use os simuladores para comparar taxas, prazos e condições entre os bancos.
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-medium text-purple-900 mb-2">
                        <CheckCircle className="inline h-4 w-4 mr-2" />
                        Avalie sua capacidade de pagamento
                      </h4>
                      <p className="text-purple-800 text-sm">
                        Certifique-se de que as parcelas cabem no seu orçamento mensal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefícios */}
          {activeTab === 'beneficios' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Benefícios do Financiamento Imobiliário
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Conheça as vantagens de optar pelo financiamento imobiliário em vez de 
                  outras formas de crédito para adquirir seu imóvel.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beneficios.map((beneficio, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                    <div className="bg-primary-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-primary-600" />
                    </div>
                    <p className="text-gray-700 font-medium">
                      {beneficio}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-8 text-center">
                <Home className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary-900 mb-2">
                  Pronto para Realizar seu Sonho?
                </h3>
                <p className="text-primary-800 mb-6 max-w-2xl mx-auto">
                  Comece hoje mesmo a planejar seu financiamento imobiliário. 
                  Use os simuladores dos bancos para encontrar as melhores condições 
                  e transforme o sonho da casa própria em realidade.
                </p>
                <button
                  onClick={() => setActiveTab('simuladores')}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Ver Simuladores
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
