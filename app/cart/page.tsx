"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Trash2, Plus, Minus, CreditCard, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const router = useRouter()

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">Minha Sacola</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <Trash2 className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold">Sua sacola está vazia</h2>
          <p className="mb-6 text-gray-500">Adicione produtos para continuar</p>
          <Link href="/">
            <Button className="bg-purple-600 hover:bg-purple-700">Continuar comprando</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Minha Sacola</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        {/* Items */}
        <div className="flex-1 p-4">
          <div className="mb-6 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-4 font-bold">Itens ({items.reduce((sum, item) => sum + item.quantity, 0)})</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-700">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </span>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full border-gray-300"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-2 w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full border-gray-300"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Entrega */}
          <div className="mb-6 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Truck className="mr-2 h-5 w-5 text-purple-600" />
                <h2 className="font-bold">Entrega</h2>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {localStorage.getItem("userLocation") ? (
                <div>
                  <p>Entrega disponível em sua região</p>
                  <p className="mt-1 text-xs text-purple-600">
                    * Frete será calculado no checkout após informar o endereço completo
                  </p>
                </div>
              ) : (
                "Endereço será solicitado no checkout"
              )}
            </div>
          </div>

          {/* Pagamento */}
          <div className="mb-6 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-4 font-bold">Forma de Pagamento</h2>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="credit" id="credit" />
                <Label htmlFor="credit" className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-purple-600" />
                  Cartão de Crédito
                </Label>
              </div>

              <div className="mt-2 flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-purple-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.5 10L4.5 15L9.5 20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.5 4L19.5 9L14.5 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  PIX
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Resumo */}
        <div className="sticky bottom-0 bg-white p-4 shadow-md">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="mb-2 flex justify-between text-sm text-gray-500">
            <span>Taxa de entrega</span>
            <span>A calcular</span>
          </div>
          <Separator className="my-2" />
          <div className="mb-4 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-lg text-purple-700">R$ {subtotal.toFixed(2).replace(".", ",")} + frete</span>
          </div>
          <Link href="/checkout">
            <Button className="w-full bg-purple-600 py-6 text-lg font-bold hover:bg-purple-700">
              Finalizar Pedido
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
