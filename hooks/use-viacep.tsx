"use client"

import { useState } from "react"

interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

interface AddressData {
  street: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export function useViaCep() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAddress = async (cep: string): Promise<AddressData | null> => {
    // Limpar CEP (remover caracteres não numéricos)
    const cleanCep = cep.replace(/\D/g, "")

    // Validar CEP
    if (cleanCep.length !== 8) {
      setError("CEP deve ter 8 dígitos")
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)

      if (!response.ok) {
        throw new Error("Erro ao consultar CEP")
      }

      const data: ViaCepResponse = await response.json()

      if (data.erro) {
        setError("CEP não encontrado")
        return null
      }

      const addressData: AddressData = {
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        zipCode: cep,
      }

      setLoading(false)
      return addressData
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      setError("Erro ao consultar CEP. Tente novamente.")
      setLoading(false)
      return null
    }
  }

  return { fetchAddress, loading, error }
}
