import Header from '@/components/Header'
import Hero from '@/components/Hero'
import PropertyGrid from '@/components/PropertyGrid'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <PropertyGrid />
      <Footer />
    </main>
  )
}
