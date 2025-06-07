"use client"

import { useState, useEffect } from "react"
import { MapPin, ShoppingBag, Clock, Star, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LocationModal } from "@/components/location-modal"
import { ProductCard } from "@/components/product-card"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useCart } from "@/context/cart-context"
import { FakeNotifications } from "@/components/fake-notifications"

export default function Home() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [showLocationScreen, setShowLocationScreen] = useState(false)
  const [showProducts, setShowProducts] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ city: string; state: string } | null>(null)
  const { loading, error, location, getLocation, clearLocation } = useGeolocation()
  const { itemCount, addItem } = useCart()
  const [activeCategory, setActiveCategory] = useState("todos")

  // Verificar se já temos localização salva ao carregar a página
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation")

    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation)
        if (parsedLocation && parsedLocation.city && parsedLocation.state) {
          // Se já temos localização salva, definir estado e mostrar produtos diretamente
          setCurrentLocation({ city: parsedLocation.city, state: parsedLocation.state })
          setShowProducts(true)
          setShowLocationScreen(false)
          return
        }
      } catch (error) {
        console.error("Erro ao carregar localização:", error)
      }
    }

    // Se não temos localização, mostrar tela de localização
    setShowLocationScreen(true)
    setShowProducts(false)
  }, [])

  // Atualizar currentLocation quando location mudar
  useEffect(() => {
    if (location) {
      setCurrentLocation({ city: location.city, state: location.state })
    }
  }, [location])

  const detectLocation = () => {
    getLocation()
  }

  // Abrir modal quando a localização for obtida pela primeira vez
  useEffect(() => {
    if (location && showLocationScreen) {
      setIsLocationModalOpen(true)
    }
  }, [location, showLocationScreen])

  const handleLocationChange = () => {
    clearLocation()
    setCurrentLocation(null)
    setShowProducts(false)
    setShowLocationScreen(true)
  }

  const handleLocationConfirm = () => {
    setIsLocationModalOpen(false)
    setShowLocationScreen(false)
    setShowProducts(true)
    // currentLocation já foi atualizado pelo useEffect acima
  }

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setActiveCategory(categoryId)
  }

  const categories = [
    { id: "promocoes", name: "Promoções" },
    { id: "tradicionais", name: "Tradicionais" },
    { id: "especiais", name: "Especiais" },
    { id: "fitness", name: "Fitness" },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "Açaí Tradicional 500ml",
      description: "Açaí 500ml, granola, leite em pó e banana",
      price: 18.9,
      salePrice: 15.9,
      image: "/tradicional500ml.avif",
      rating: 4.8,
      category: "tradicionais",
    },
    {
      id: 2,
      name: "Açaí com Morango 500ml",
      description: "Açaí 500ml com granola, leite condensado e muitooo morango.",
      price: 22.9,
      salePrice: 19.9,
      image: "/morango.avif",
      rating: 4.9,
      category: "especiais",
    },
    {
      id: 3,
      name: "Açaí Fitness 300ml",
      description: "Açaí puro 0 açúcar",
      price: 16.9,
      salePrice: 14.9,
      image: "/0acucar.avif",
      rating: 4.7,
      category: "fitness",
    },
    {
      id: 4,
      name: "Açaí com Nutella 500ml",
      description: "Açaí cremoso com Nutella e morango",
      price: 24.9,
      salePrice: 21.9,
      image: "/nutela.avif",
      rating: 4.9,
      category: "especiais",
    },
    {
      id: 5,
      name: "Açaí Tradicional 300ml",
      description: "Açaí 300ml, granola, leite em pó e banana",
      price: 14.9,
      salePrice: 12.9,
      image: "/tradicional500ml.avif",
      rating: 4.6,
      category: "tradicionais",
    },
    {
      id: 6,
      name: "Açaí Com Creme Ninho",
      description: "Açaí com um delicioso creme Ninho meio a meio",
      price: 23.9,
      salePrice: 20.9,
      image: "/ninho.avif",
      rating: 4.8,
      category: "especiais",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col bg-white text-gray-800">
      {/* Header */}
      {showProducts && currentLocation && (
        <header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-700">Rei do Açai Delivery</h1>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-6 w-6 text-gray-700" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Categorias como âncoras no topo - apenas quando produtos estão visíveis */}
          <div className="mt-4 overflow-x-auto">
            <div className="flex space-x-2 pb-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* Tela de Localização - apenas quando necessário */}
      {showLocationScreen && (
        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
          <div className="w-full max-w-lg">
            {/* Imagem/Logo */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-purple-100 sm:h-40 sm:w-40">
                <Image
                  src="/logo.avif"
                  alt="Açaí delicioso"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-purple-900 sm:text-3xl">O Melhor Açaí do Brasil</h2>
              <p className="text-base text-purple-800 sm:text-lg">
                O melhor açaí do Brasil agora em delivery 
              </p>
            </div>

            {/* Card de Localização */}
            <div className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-800 sm:text-xl">Descubra lojas próximas a você</h3>
                <p className="text-sm text-gray-600 sm:text-base">
                  Precisamos da sua localização para encontrar as melhores opções de entrega
                </p>
              </div>

              <Button
                onClick={detectLocation}
                className="w-full bg-purple-600 py-4 text-base font-bold hover:bg-purple-700 sm:py-6 sm:text-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Localizando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Usar minha localização atual
                  </span>
                )}
              </Button>

              <p className="mt-3 text-center text-xs text-gray-500 sm:text-sm">
                Utilizamos sua localização apenas para encontrar lojas próximas
              </p>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3">
                  <p className="text-center text-sm text-red-600">{error}. Por favor, tente novamente.</p>
                </div>
              )}
            </div>

            {/* Benefícios */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Entrega Rápida</p>
                <p className="text-xs text-gray-500">Em até 30 minutos</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Qualidade</p>
                <p className="text-xs text-gray-500">Ingredientes frescos</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Cobertura</p>
                <p className="text-xs text-gray-500">Toda a cidade</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Produtos - apenas quando localização estiver definida */}
      {showProducts && currentLocation && (
        <>
          {/* Localização do usuário */}
          <div className="bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Entregando em</p>
                  <p className="text-sm text-gray-600">
                    {currentLocation.city}, {currentLocation.state}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLocationChange}>
                Alterar
              </Button>
            </div>
          </div>

          {/* Promoção do dia */}
          <section id="promocoes" className="p-4">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Promoções</h2>
            <Card className="overflow-hidden border-gray-100 shadow-md">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="flex-1 p-4">
                    <div className="mb-1 inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
                      OFERTA DO DIA
                    </div>
                    <h3 className="mb-1 text-xl font-bold">2 Açaí 500ml (Combo Duplo)</h3>
                    <div className="mb-2 flex items-center">
                      <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.9 (243 avaliações)</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm text-gray-500 line-through">R$ 49,90</span>
                      <span className="ml-2 text-2xl font-bold text-purple-700">R$ 39,90</span>
                    </div>
                    <div className="mb-2 text-xs text-gray-600">
                      <p>Ingredientes:</p>
                      <ul className="ml-2 list-disc pl-3">
                        <li>Açaí</li>
                        <li>Banana</li>
                        <li>Morango</li>
                        <li>Granola</li>
                        <li>Leite em pó</li>
                        <li>Leite condensado</li>
                      </ul>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-1 h-4 w-4 text-purple-600" />
                      <span className="text-purple-600">Oferta válida por mais 2h35min</span>
                    </div>
                  </div>
                  <div className="relative h-auto w-1/3">
                    <Image
                      src="/combo500ml.avif"
                      alt="Promoção especial"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <Button
                  className="w-full rounded-none bg-purple-600 py-3 text-lg font-bold hover:bg-purple-700"
                  onClick={() => {
                    addItem(
                      {
                        id: 999,
                        name: "2 Açaí 500ml (Combo Duplo)",
                        price: 39.9,
                        image: "/combo500ml.avif",
                      },
                      1,
                    )
                  }}
                >
                  APROVEITAR AGORA
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Produtos Tradicionais */}
          <section id="tradicionais" className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Tradicionais</h2>
              <Link href="/category/tradicionais" className="flex items-center text-sm text-purple-600">
                Ver todos <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {featuredProducts
                .filter((product) => product.category === "tradicionais")
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </section>

          {/* Produtos Especiais */}
          <section id="especiais" className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Especiais</h2>
              <Link href="/category/especiais" className="flex items-center text-sm text-purple-600">
                Ver todos <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {featuredProducts
                .filter((product) => product.category === "especiais")
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </section>

          {/* Produtos Fitness */}
          <section id="fitness" className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Fitness</h2>
              <Link href="/category/fitness" className="flex items-center text-sm text-purple-600">
                Ver todos <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {featuredProducts
                .filter((product) => product.category === "fitness")
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </section>
        </>
      )}

      {/* Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        userLocation={location}
        onConfirm={handleLocationConfirm}
      />

      {/* Notificações falsas - apenas quando produtos estão visíveis */}
      {showProducts && <FakeNotifications />}
    </main>
  )
}
