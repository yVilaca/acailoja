"use client"

import { useState } from "react"

interface ShippingInfo {
  cost: number
  distance: string
  estimatedTime: string
}

interface ShippingState {
  loading: boolean
  shippingInfo: ShippingInfo | null
  error: string | null
}

export function useShipping() {
  const [shippingState, setShippingState] = useState<ShippingState>({
    loading: false,
    shippingInfo: null,
    error: null,
  })

  const calculateShipping = (address: string, city: string, state: string) => {
    const addressKey = `${address}-${city}-${state}`.toLowerCase().replace(/\s+/g, "")
    const savedShipping = localStorage.getItem(`shipping-${addressKey}`)

    // Se já temos o frete calculado para este endereço, usar o valor salvo
    if (savedShipping) {
      try {
        const parsedShipping = JSON.parse(savedShipping)
        setShippingState({
          loading: false,
          shippingInfo: parsedShipping,
          error: null,
        })
        return
      } catch (error) {
        console.error("Erro ao carregar frete salvo:", error)
      }
    }

    setShippingState((prev) => ({ ...prev, loading: true, error: null }))

    // Simular cálculo de frete com animação
    setTimeout(() => {
      // Gerar valores aleatórios baixos
      const cost = Math.random() * 8 + 2 // Entre R$ 2,00 e R$ 10,00
      const distanceKm = Math.random() * 8 + 1 // Entre 1km e 9km
      const baseTime = 20 + Math.random() * 20 // Entre 20 e 40 minutos

      const shippingInfo: ShippingInfo = {
        cost: Math.round(cost * 100) / 100,
        distance: `${distanceKm.toFixed(1)}km`,
        estimatedTime: `${Math.round(baseTime)}-${Math.round(baseTime + 10)} min`,
      }

      // Salvar no localStorage
      localStorage.setItem(`shipping-${addressKey}`, JSON.stringify(shippingInfo))

      setShippingState({
        loading: false,
        shippingInfo,
        error: null,
      })
    }, 2000) // 2 segundos de animação
  }

  const clearShipping = () => {
    setShippingState({
      loading: false,
      shippingInfo: null,
      error: null,
    })
  }

  return {
    ...shippingState,
    calculateShipping,
    clearShipping,
  }
}
