"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  userLocation: { city: string; state: string } | null
  onConfirm: () => void
}

export function LocationModal({ isOpen, onClose, userLocation, onConfirm }: LocationModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && userLocation) {
      // Se já temos a localização, podemos confirmar automaticamente após um breve delay
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isOpen, userLocation])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white p-0 sm:rounded-lg">
        <div className="bg-purple-600 p-6 text-white sm:rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-white">Localização Detectada</DialogTitle>
          </DialogHeader>

          <div className="mt-4 text-center text-sm text-white/80">Baseado na sua localização atual</div>

          <div className="mt-2 flex items-center justify-center gap-2 text-center font-medium">
            <MapPin className="h-5 w-5" />
            {userLocation ? (
              <span>
                {userLocation.city}, {userLocation.state}
              </span>
            ) : (
              <span>Localizando...</span>
            )}
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <Navigation className="h-8 w-8 animate-pulse text-purple-500" />
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">Confirmando sua localização...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-700">
                Encontramos lojas que entregam em sua região. Deseja continuar com esta localização?
              </p>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Alterar
                </Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={onConfirm}>
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
