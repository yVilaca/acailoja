"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Plus, Minus, ShoppingBag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/context/cart-context"

interface Product {
  id: number
  name: string
  description: string
  price: number
  salePrice: number
  image: string
  rating: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

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
        image: product.image,
      },
      quantity,
    )
  }

  const discount = Math.round(((product.price - product.salePrice) / product.price) * 100)

  return (
    <Card className="overflow-hidden border-gray-100 shadow-sm transition-all hover:shadow-md">
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={200}
            height={200}
            className="h-40 w-full object-cover object-top"
            style={{height:"180px"}}
          />
          {discount > 0 && (
            <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
              -{discount}%
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-3">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-800">{product.name}</h3>
          <p className="mb-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>
          <div className="mb-2 flex items-center">
            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-700">{product.rating}</span>
          </div>
          <div className="mb-3">
            {product.salePrice < product.price ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 line-through">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                <span className="text-lg font-bold text-purple-700">
                  R$ {product.salePrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-purple-700">R$ {product.price.toFixed(2).replace(".", ",")}</span>
            )}
          </div>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-lg border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none text-gray-600"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none text-gray-600"
              onClick={increaseQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={addToCart}>
            <ShoppingBag className="mr-1 h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
