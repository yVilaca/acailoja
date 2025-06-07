"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Star, Plus, Minus, ShoppingBag, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/context/cart-context"

// Lista de produtos (mesma usada em app/page.tsx)
const featuredProducts = [
  {
    id: 1,
    name: "Açaí Tradicional 500ml",
    description: "Açaí 500ml, granola, leite em pó e banana",
    longDescription:
      "Nosso açaí tradicional é preparado com as melhores frutas da Amazônia, batido na hora para garantir a cremosidade perfeita. Acompanha granola crocante e banana fresca fatiada. Uma explosão de sabor e energia para o seu dia!",
    price: 18.9,
    salePrice: 15.9,
    image: "/tradicional500ml.avif",
    images: [
      "/tradicional500ml.avif",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    rating: 4.8,
    reviews: 127,
    ingredients: "Polpa de açaí, xarope de guaraná, granola, banana.",
    nutritionalInfo: "Porção de 100g: Calorias: 58kcal, Carboidratos: 6g, Proteínas: 0.8g, Gorduras: 3.8g, Fibras: 2g",
    additionalInfo:
      "Produto 100% natural, sem conservantes. Contém glúten na granola. Alérgicos: pode conter traços de castanhas.",
    category: "tradicionais",
  },
  {
    id: 2,
    name: "Açaí com Morango 500ml",
    description: "Açaí 500ml com granola, leite condensado e muitooo morango.",
    longDescription:
      "Um açaí especial com morangos frescos, granola crocante e um toque de leite condensado para adoçar seu dia. Perfeito para quem ama sabores intensos e refrescantes!",
    price: 22.9,
    salePrice: 19.9,
    image: "/morango.avif",
    images: ["/morango.avif", "/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    rating: 4.9,
    reviews: 150,
    ingredients: "Polpa de açaí, morango, leite condensado, granola.",
    nutritionalInfo: "Porção de 100g: Calorias: 70kcal, Carboidratos: 10g, Proteínas: 1g, Gorduras: 4g, Fibras: 1.5g",
    additionalInfo: "Contém lactose. Alérgicos: pode conter traços de castanhas.",
    category: "especiais",
  },
  {
    id: 3,
    name: "Açaí Fitness 300ml",
    description: "Açaí puro 0 açúcar",
    longDescription:
      "Açaí puro, sem açúcar, ideal para quem busca uma opção saudável e leve. Perfeito para dietas fitness, acompanhado apenas de ingredientes naturais.",
    price: 16.9,
    salePrice: 14.9,
    image: "/0acucar.avif",
    images: ["/0acucar.avif", "/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    rating: 4.7,
    reviews: 90,
    ingredients: "Polpa de açaí pura, sem adição de açúcar.",
    nutritionalInfo: "Porção de 100g: Calorias: 50kcal, Carboidratos: 5g, Proteínas: 0.7g, Gorduras: 3.5g, Fibras: 2.5g",
    additionalInfo: "Produto vegano, sem glúten, sem lactose.",
    category: "fitness",
  },
  {
    id: 4,
    name: "Açaí com Nutella 500ml",
    description: "Açaí cremoso com Nutella e morango",
    longDescription:
      "Uma combinação irresistível de açaí cremoso com Nutella e morangos frescos. Um verdadeiro deleite para os amantes de sobremesas!",
    price: 24.9,
    salePrice: 21.9,
    image: "/nutela.avif",
    images: ["/nutela.avif", "/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    rating: 4.9,
    reviews: 200,
    ingredients: "Polpa de açaí, Nutella, morango, granola.",
    nutritionalInfo: "Porção de 100g: Calorias: 80kcal, Carboidratos: 12g, Proteínas: 1.2g, Gorduras: 5g, Fibras: 1.8g",
    additionalInfo: "Contém glúten e lactose. Alérgicos: contém castanhas.",
    category: "especiais",
  },
  {
    id: 5,
    name: "Açaí Tradicional 300ml",
    description: "Açaí 300ml, granola, leite em pó e banana",
    longDescription:
      "Açaí tradicional em porção menor, perfeito para um lanche rápido. Acompanha granola, leite em pó e banana fatiada.",
    price: 14.9,
    salePrice: 12.9,
    image: "/tradicional500ml.avif",
    images: ["/tradicional500ml.avif", "/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    rating: 4.6,
    reviews: 110,
    ingredients: "Polpa de açaí, xarope de guaraná, granola, banana, leite em pó.",
    nutritionalInfo: "Porção de 100g: Calorias: 60kcal, Carboidratos: 7g, Proteínas: 0.9g, Gorduras: 4g, Fibras: 2g",
    additionalInfo: "Contém glúten e lactose. Alérgicos: pode conter traços de castanhas.",
    category: "tradicionais",
  },
  {
    id: 6,
    name: "Açaí Com Creme Ninho",
    description: "Açaí com um delicioso creme Ninho meio a meio",
    longDescription:
      "Açaí cremoso combinado com um delicioso creme de leite Ninho, perfeito para quem busca uma sobremesa indulgente.",
    price: 23.9,
    salePrice: 20.9,
    image: "/ninho.avif",
    images: ["/ninho.avif", "/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    rating: 4.8,
    reviews: 135,
    ingredients: "Polpa de açaí, creme de leite Ninho, granola.",
    nutritionalInfo: "Porção de 100g: Calorias: 75kcal, Carboidratos: 11g, Proteínas: 1.1g, Gorduras: 4.5g, Fibras: 1.7g",
    additionalInfo: "Contém glúten e lactose. Alérgicos: pode conter traços de castanhas.",
    category: "especiais",
  },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addItem } = useCart()

  // Encontrar o produto com base no ID
  const product = featuredProducts.find((p) => p.id === parseInt(params.id))

  // Se o produto não for encontrado, exibir página 404
  if (!product) {
    notFound()
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const addToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images[0] || product.image,
      },
      quantity,
    )
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const discount = Math.round(((product.price - product.salePrice) / product.price) * 100)

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-bold">Detalhes do Produto</h1>
          <Button variant="ghost" size="icon" onClick={toggleFavorite} className={isFavorite ? "text-red-500" : ""}>
            <Heart className={`h-6 w-6 ${isFavorite ? "fill-red-500" : ""}`} />
          </Button>
        </div>
      </header>

      <div className="flex-1">
        {/* Imagens do produto */}
        <div className="relative bg-white">
          <div className="relative h-80 w-full">
            <Image
              src={product.images[activeImage] || product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
            />
            {discount > 0 && (
              <div className="absolute left-4 top-4 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                -{discount}%
              </div>
            )}
          </div>

          {/* Miniaturas */}
          <div className="flex justify-center space-x-2 p-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative h-16 w-16 overflow-hidden rounded-md border-2 ${
                  activeImage === index ? "border-purple-500" : "border-transparent"
                }`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - imagem ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Informações do produto */}
        <div className="p-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>

          <div className="mb-2 mt-1 flex items-center">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="mr-1 font-medium">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({product.reviews} avaliações)</span>
          </div>

          <div className="mb-4 flex items-center">
            {product.salePrice < product.price ? (
              <>
                <span className="mr-2 text-sm text-gray-500 line-through">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                <span className="text-2xl font-bold text-purple-700">
                  R$ {product.salePrice.toFixed(2).replace(".", ",")}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-purple-700">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>

          <p className="mb-4 text-gray-600">{product.description}</p>

          {/* Quantidade e botão de adicionar */}
          <div className="mb-6 flex items-center">
            <div className="mr-4 flex items-center rounded-lg border">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none text-gray-600"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none text-gray-600"
                onClick={increaseQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button className="flex-1 bg-purple-600 py-6 text-lg font-bold hover:bg-purple-700" onClick={addToCart}>
              <ShoppingBag className="mr-2 h-5 w-5" />
              Adicionar à Sacola
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Detalhes em abas */}
          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">
                Descrição
              </TabsTrigger>
              <TabsTrigger value="ingredients" className="flex-1">
                Ingredientes
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex-1">
                Nutrição
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 text-gray-600">
              <p>{product.longDescription}</p>
              <p className="mt-4">{product.additionalInfo}</p>
            </TabsContent>
            <TabsContent value="ingredients" className="mt-4 text-gray-600">
              <p>{product.ingredients}</p>
            </TabsContent>
            <TabsContent value="nutrition" className="mt-4 text-gray-600">
              <p>{product.nutritionalInfo}</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}