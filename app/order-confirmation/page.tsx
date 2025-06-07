"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Clock, Home, MapPin, Truck, QrCode, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface DeliveryAddress {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  phone: string
  shippingCost?: number
  shippingDistance?: string
  estimatedTime?: string
  pixData?: {
    pixCode: string
    qrCodeUrl: string
    transactionId: string
    amount: string
    product: string
    customer: { name: string; email: string; phone: string; cpf: string }
    transactionToken: string
  }
}

export default function OrderConfirmationPage() {
  const { toast } = useToast()
  const [minutes, setMinutes] = useState(35)
  const [seconds, setSeconds] = useState(0)
  const [address, setAddress] = useState<DeliveryAddress | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      } else if (minutes > 0) {
        setMinutes(minutes - 1)
        setSeconds(59)
      } else {
        clearInterval(timer)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [minutes, seconds])

  useEffect(() => {
    const savedAddress = localStorage.getItem("deliveryAddress")
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress)
        setAddress(parsedAddress)
      } catch (error) {
        console.error("Erro ao carregar endereço:", error)
      }
    }
  }, [])

  const formatAddress = () => {
    if (!address) return "Endereço não disponível"
    let formattedAddress = `${address.street}, ${address.number}`
    if (address.complement) formattedAddress += ` - ${address.complement}`
    formattedAddress += `\n${address.neighborhood}`
    formattedAddress += `\n${address.city} - ${address.state}`
    formattedAddress += `\nCEP: ${address.zipCode}`
    return formattedAddress
  }

  const copyPixCode = () => {
    if (!address?.pixData) return
    navigator.clipboard.writeText(address.pixData.pixCode)
    toast({
      title: "Código copiado!",
      description: "O código PIX foi copiado para a área de transferência.",
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-100 bg-white p-6 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold">Pedido Confirmado!</h1>
        <p className="mb-6 text-gray-600">Seu pedido #{address?.pixData?.transactionId || "12345"} foi recebido e está aguardando pagamento.</p>

        {address?.pixData && (
          <div className="rounded-lg border border-gray-200 p-4 mb-6">
            <h2 className="mb-3 flex items-center font-bold">
              <QrCode className="mr-2 h-4 w-4 text-purple-600" />
              Detalhes do Pagamento PIX
            </h2>
            <p className="text-lg font-bold mb-2">R$ {address.pixData.amount}</p>
            <p className="text-sm text-gray-600 mb-4">{address.pixData.product}</p>
            <div className="mb-4">
              <img src={address.pixData.qrCodeUrl} alt="QR Code PIX" className="mx-auto w-48 h-48 rounded-lg shadow-sm" />
            </div>
            <div className="mb-4">
              <textarea
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm resize-none"
                rows={4}
                value={address.pixData.pixCode}
              />
              <Button
                onClick={copyPixCode}
                className="mt-2 bg-purple-600 hover:bg-purple-700"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Código PIX
              </Button>
            </div>
            <div className="flex items-center justify-center bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="font-medium">
                {minutes > 0 || seconds > 0
                  ? `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} para pagar`
                  : "Expirado"}
              </span>
            </div>
          </div>
        )}

        <div className="mb-6 space-y-4">
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="mb-3 flex items-center font-bold">
              <MapPin className="mr-2 h-4 w-4 text-purple-600" />
              Endereço de Entrega
            </h2>
            <p className="whitespace-pre-line text-left text-sm text-gray-600">{formatAddress()}</p>
            {address?.phone && <p className="mt-2 text-left text-sm text-gray-600">Telefone: {address.phone}</p>}
          </div>

          {address?.shippingCost && (
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 flex items-center font-bold">
                <Truck className="mr-2 h-4 w-4 text-purple-600" />
                Informações de Entrega
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Distância:</span>
                  <span className="font-medium">{address.shippingDistance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tempo estimado:</span>
                  <span className="font-medium">{address.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Custo do frete:</span>
                  <span className="font-medium">R$ {address.shippingCost.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Link href="/" className="block w-full">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Home className="mr-2 h-4 w-4" />
              Voltar para a Loja
            </Button>
          </Link>
          <p className="text-sm text-gray-500">Obrigado por escolher o Rei do Açai Delivery!</p>
        </div>
      </div>
    </main>
  )
}