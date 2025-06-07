"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  // Carregar carrinho do localStorage quando o componente montar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error)
      }
    }
  }, [])

  // Salvar carrinho no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (item: Omit<CartItem, "quantity">, quantity: number) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // Item já existe, atualizar quantidade
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity

        toast({
          title: "Quantidade atualizada",
          description: `${updatedItems[existingItemIndex].name} (${updatedItems[existingItemIndex].quantity}x)`,
          variant: "default",
        })

        return updatedItems
      } else {
        // Adicionar novo item
        toast({
          title: "Produto adicionado",
          description: `${item.name} (${quantity}x)`,
          variant: "default",
        })

        return [...prevItems, { ...item, quantity }]
      }
    })
  }

  const removeItem = (id: number) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id)
      if (itemToRemove) {
        toast({
          title: "Produto removido",
          description: `${itemToRemove.name} foi removido da sacola`,
          variant: "destructive",
        })
      }
      return prevItems.filter((item) => item.id !== id)
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    // Limpar também dados relacionados ao pedido
    localStorage.removeItem("deliveryAddress")
    toast({
      title: "Sacola esvaziada",
      description: "Todos os produtos foram removidos",
      variant: "destructive",
    })
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
