"use client"

import { useState, useEffect } from "react"
import { Truck, Calculator, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useShipping } from "@/hooks/use-shipping"

interface ShippingCalculatorProps {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  onShippingCalculated: (cost: number, distance: string, estimatedTime: string) => void
}

export function ShippingCalculator({
  street,
  number,
  neighborhood,
  city,
  state,
  zipCode,
  onShippingCalculated,
}: ShippingCalculatorProps) {
  const { loading, shippingInfo, calculateShipping } = useShipping()
  const [hasCalculated, setHasCalculated] = useState(false)

  const isAddressComplete = street && number && neighborhood && city && state && zipCode

  const handleCalculateShipping = () => {
    if (isAddressComplete) {
      const fullAddress = `${street}, ${number}, ${neighborhood}, ${zipCode}`
      calculateShipping(fullAddress, city, state)
      setHasCalculated(true)
    }
  }

  // Notificar o componente pai quando o frete for calculado
  useEffect(() => {
    if (shippingInfo) {
      onShippingCalculated(shippingInfo.cost, shippingInfo.distance, shippingInfo.estimatedTime)
    }
  }, [shippingInfo, onShippingCalculated])

  if (!isAddressComplete) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center text-gray-500">
          <Truck className="mr-2 h-5 w-5" />
          <span className="text-sm">Complete o endereço para calcular o frete</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Truck className="mr-2 h-5 w-5 text-purple-600" />
          <h3 className="font-bold">Frete e Entrega</h3>
        </div>
        {!hasCalculated && (
          <Button size="sm" onClick={handleCalculateShipping} disabled={loading}>
            <Calculator className="mr-1 h-4 w-4" />
            Calcular
          </Button>
        )}
      </div>

      {loading && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
              <span className="text-sm text-gray-600">Calculando melhor rota...</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200"></div>
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      )}

      {shippingInfo && !loading && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Entrega disponível</p>
                <p className="text-xs text-green-600">Distância: {shippingInfo.distance}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-700">R$ {shippingInfo.cost.toFixed(2).replace(".", ",")}</p>
              <p className="text-xs text-green-600">{shippingInfo.estimatedTime}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">* Frete calculado com base na distância e localização</div>
        </div>
      )}
    </div>
  )
}
