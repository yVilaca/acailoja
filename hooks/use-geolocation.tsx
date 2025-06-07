"use client"

import { useState } from "react"

interface GeolocationState {
  loading: boolean
  error: string | null
  location: {
    city: string
    state: string
    latitude: number
    longitude: number
  } | null
}

// Lista de cidades brasileiras para fallback
const cidadesBrasileiras = [
  { city: "São Paulo", state: "SP" },
  { city: "Rio de Janeiro", state: "RJ" },
  { city: "Brasília", state: "DF" },
  { city: "Salvador", state: "BA" },
  { city: "Fortaleza", state: "CE" },
  { city: "Belo Horizonte", state: "MG" },
  { city: "Manaus", state: "AM" },
  { city: "Curitiba", state: "PR" },
  { city: "Recife", state: "PE" },
  { city: "Porto Alegre", state: "RS" },
  { city: "Belém", state: "PA" },
  { city: "Goiânia", state: "GO" },
  { city: "Guarulhos", state: "SP" },
  { city: "Campinas", state: "SP" },
  { city: "São Luís", state: "MA" },
  { city: "São Gonçalo", state: "RJ" },
  { city: "Maceió", state: "AL" },
  { city: "Duque de Caxias", state: "RJ" },
  { city: "Natal", state: "RN" },
  { city: "Teresina", state: "PI" },
]

export function useGeolocation() {
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    loading: false,
    error: null,
    location: null,
  })

  const getLocation = () => {
    // Verificar se já temos localização salva no localStorage
    const savedLocation = localStorage.getItem("userLocation")
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation) as GeolocationState["location"]
        if (parsedLocation?.city && parsedLocation?.state) {
          setGeolocation({
            loading: false,
            error: null,
            location: parsedLocation,
          })
          return
        }
      } catch (error) {
        console.error("Erro ao carregar localização:", error)
        localStorage.removeItem("userLocation") // Clean invalid data
      }
    }

    if (!navigator.geolocation) {
      setGeolocation({
        loading: false,
        error: "Geolocalização não é suportada neste navegador",
        location: null,
      })
      return
    }

    setGeolocation((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Usar a API de geocodificação reversa para obter cidade e estado
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=pt-BR`,
          )

          if (!response.ok) {
            throw new Error("Falha ao obter detalhes da localização")
          }

          const data = await response.json()

          // Extrair cidade e estado dos dados retornados
          let city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.municipality ||
            data.address?.county ||
            data.address?.suburb

          let state = data.address?.state

          // Se não conseguir extrair cidade/estado, usar fallback
          if (!city || !state) {
            const randomCity = cidadesBrasileiras[Math.floor(Math.random() * cidadesBrasileiras.length)]
            city = randomCity.city
            state = randomCity.state
          }

          // Normalizar o estado para sigla
          const stateMap: { [key: string]: string } = {
            "São Paulo": "SP",
            "Rio de Janeiro": "RJ",
            "Minas Gerais": "MG",
            Bahia: "BA",
            Paraná: "PR",
            "Rio Grande do Sul": "RS",
            Pernambuco: "PE",
            Ceará: "CE",
            Pará: "PA",
            "Santa Catarina": "SC",
            Goiás: "GO",
            Maranhão: "MA",
            "Espírito Santo": "ES",
            Paraíba: "PB",
            Amazonas: "AM",
            "Mato Grosso": "MT",
            "Rio Grande do Norte": "RN",
            Alagoas: "AL",
            Piauí: "PI",
            "Distrito Federal": "DF",
            "Mato Grosso do Sul": "MS",
            Sergipe: "SE",
            Rondônia: "RO",
            Acre: "AC",
            Amapá: "AP",
            Roraima: "RR",
            Tocantins: "TO",
          }

          const normalizedState = stateMap[state] || state

          const locationData = {
            city,
            state: normalizedState,
            latitude,
            longitude,
          }

          // Salvar no localStorage
          localStorage.setItem("userLocation", JSON.stringify(locationData))

          setGeolocation({
            loading: false,
            error: null,
            location: locationData,
          })
        } catch (error) {
          console.error("Erro ao obter localização:", error)
          // Fallback para uma cidade aleatória em caso de erro
          const randomCity = cidadesBrasileiras[Math.floor(Math.random() * cidadesBrasileiras.length)]
          const locationData = {
            city: randomCity.city,
            state: randomCity.state,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }

          localStorage.setItem("userLocation", JSON.stringify(locationData))

          setGeolocation({
            loading: false,
            error: null,
            location: locationData,
          })
        }
      },
      (error) => {
        console.error("Erro de geolocalização:", error)
        let errorMessage = "Erro ao obter localização"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permissão de localização negada"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Localização indisponível"
            break
          case error.TIMEOUT:
            errorMessage = "Tempo limite para obter localização"
            break
        }

        // Fallback para uma cidade aleatória em caso de erro de permissão
        const randomCity = cidadesBrasileiras[Math.floor(Math.random() * cidadesBrasileiras.length)]
        const locationData = {
          city: randomCity.city,
          state: randomCity.state,
          latitude: 0,
          longitude: 0,
        }

        localStorage.setItem("userLocation", JSON.stringify(locationData))

        setGeolocation({
          loading: false,
          error: null, // Não mostrar erro, usar fallback
          location: locationData,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000, // 5 minutos
      },
    )
  }

  const clearLocation = () => {
    localStorage.removeItem("userLocation")
    localStorage.removeItem("showProducts")
    setGeolocation({
      loading: false,
      error: null,
      location: null,
    })
  }

  return { ...geolocation, getLocation, clearLocation }
}
