"use client"

import { useState, useEffect } from "react"
import { Check, ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Lista de notificações falsas de compras
const fakeNotifications = [
  {
    name: "Ana L.",
    product: "Açaí Tradicional 500ml",
    location: "São Paulo, SP",
    time: "agora mesmo",
  },
  {
    name: "Carlos M.",
    product: "2 Açaí 500ml (Combo Duplo)",
    location: "Rio de Janeiro, RJ",
    time: "2 min atrás",
  },
  {
    name: "Juliana S.",
    product: "Açaí com Morango 500ml",
    location: "Belo Horizonte, MG",
    time: "5 min atrás",
  },
  {
    name: "Roberto P.",
    product: "Açaí Fitness 300ml",
    location: "Curitiba, PR",
    time: "7 min atrás",
  },
  {
    name: "Fernanda K.",
    product: "Açaí Tradicional 500ml",
    location: "Brasília, DF",
    time: "10 min atrás",
  },
  {
    name: "Marcelo T.",
    product: "2 Açaí 500ml (Combo Duplo)",
    location: "Salvador, BA",
    time: "12 min atrás",
  },
  {
    name: "Patrícia R.",
    product: "Açaí com Morango 500ml",
    location: "Recife, PE",
    time: "15 min atrás",
  },
]

export function FakeNotifications() {
  const [currentNotification, setCurrentNotification] = useState<number | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Mostrar primeira notificação após 3 segundos
    const initialTimeout = setTimeout(() => {
      showRandomNotification()
    }, 3000)

    return () => clearTimeout(initialTimeout)
  }, [])

  const showRandomNotification = () => {
    // Escolher uma notificação aleatória
    const randomIndex = Math.floor(Math.random() * fakeNotifications.length)
    setCurrentNotification(randomIndex)
    setVisible(true)

    // Esconder após 5 segundos
    const hideTimeout = setTimeout(() => {
      setVisible(false)

      // Programar próxima notificação após um intervalo aleatório (entre 10 e 30 segundos)
      const nextNotificationTimeout = setTimeout(
        () => {
          showRandomNotification()
        },
        Math.random() * 20000 + 10000,
      )

      return () => clearTimeout(nextNotificationTimeout)
    }, 5000)

    return () => clearTimeout(hideTimeout)
  }

  if (currentNotification === null) return null

  const notification = fakeNotifications[currentNotification]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 10, x: -20 }}
          className="fixed bottom-4 left-4 z-50 max-w-xs rounded-lg bg-white p-4 shadow-lg"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Nova compra!</p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{notification.name}</span> acabou de comprar{" "}
                <span className="font-medium">{notification.product}</span>
              </p>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <ShoppingBag className="mr-1 h-3 w-3" />
                <span>
                  {notification.location} • {notification.time}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
