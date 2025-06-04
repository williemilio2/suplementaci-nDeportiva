"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import Cookies from "js-cookie"
import { validateInput, clientRateLimit } from "@/src/lib/enhanced-security"

interface EliteContextType {
  isElite: boolean
  isLoading: boolean
  error: string | null
  checkEliteStatus: () => Promise<void>
}

const EliteContext = createContext<EliteContextType | undefined>(undefined)

export function EliteProvider({ children }: { children: React.ReactNode }) {
  const [isElite, setIsElite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkEliteStatus = async () => {
    // Rate limiting para evitar spam de requests
    if (!clientRateLimit("elite_status_check", 10, 60000)) {
      console.warn("Rate limit excedido para verificación de estatus Elite")
      setIsLoading(false)
      return
    }

    const token = Cookies.get("token")
    if (!token) {
      setIsElite(false)
      setIsLoading(false)
      return
    }

    // Validar token básicamente (longitud y caracteres)
    const sanitizedToken = validateInput(token, 500)
    if (sanitizedToken !== token || token.length < 10) {
      console.warn("Token inválido detectado")
      Cookies.remove("token") // Limpiar token corrupto
      setIsElite(false)
      setIsLoading(false)
      setError("Token de sesión inválido")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Añadir timeout a la request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout

      const response = await fetch("/api/comrpobarUsuarioClubAfiliados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // Protección CSRF básica
        },
        body: JSON.stringify({ token: sanitizedToken }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Validar respuesta del servidor
      if (typeof data.resultado !== "boolean" || typeof data.resultadoAmedias !== "boolean") {
        throw new Error("Respuesta del servidor inválida")
      }

      setIsElite(data.resultado && data.resultadoAmedias)

      // Log de actividad (solo en desarrollo)
      if (process.env.NODE_ENV === "development") {
        console.log("Elite status checked:", {
          isElite: data.resultado && data.resultadoAmedias,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Error verificando estatus Elite:", error)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setError("Timeout al verificar estatus Elite")
        } else {
          setError("Error al verificar estatus Elite")
        }
      } else {
        setError("Error desconocido")
      }

      setIsElite(false)

      // Reportar error si es crítico
      if (clientRateLimit("elite_error_report", 3, 300000)) {
        fetch("/api/security/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "elite_status_error",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          }),
        }).catch(console.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkEliteStatus()
  }, [])

  // Escuchar cambios en el token (login/logout)
  useEffect(() => {
    const handleStorageChange = (event?: StorageEvent) => {
      // Solo reaccionar a cambios relevantes
      if (event && event.key && !event.key.includes("token") && !event.key.includes("auth")) {
        return
      }

      // Debounce para evitar múltiples calls
      const timeoutId = setTimeout(() => {
        checkEliteStatus()
      }, 500)

      return () => clearTimeout(timeoutId)
    }

    const handleCustomEvents = () => {
      // Debounce para eventos personalizados también
      const timeoutId = setTimeout(() => {
        checkEliteStatus()
      }, 500)

      return () => clearTimeout(timeoutId)
    }

    // Escuchar cambios en localStorage
    window.addEventListener("storage", handleStorageChange)

    // Escuchar eventos personalizados de login/logout
    window.addEventListener("userLogin", handleCustomEvents)
    window.addEventListener("userLogout", handleCustomEvents)

    // Verificar periódicamente el estatus (cada 5 minutos)
    const intervalId = setInterval(() => {
      if (!isLoading && clientRateLimit("elite_periodic_check", 1, 300000)) {
        checkEliteStatus()
      }
    }, 300000) // 5 minutos

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userLogin", handleCustomEvents)
      window.removeEventListener("userLogout", handleCustomEvents)
      clearInterval(intervalId)
    }
  }, [isLoading])

  // Detectar cambios en cookies de manera segura
  useEffect(() => {
    let lastToken = Cookies.get("token")

    const checkTokenChange = () => {
      const currentToken = Cookies.get("token")
      if (currentToken !== lastToken) {
        lastToken = currentToken
        checkEliteStatus()
      }
    }

    // Verificar cambios en cookies cada 30 segundos
    const intervalId = setInterval(checkTokenChange, 30000)

    return () => clearInterval(intervalId)
  }, [])

  const value: EliteContextType = {
    isElite,
    isLoading,
    error,
    checkEliteStatus,
  }

  return <EliteContext.Provider value={value}>{children}</EliteContext.Provider>
}

export function useElite() {
  const context = useContext(EliteContext)
  if (context === undefined) {
    throw new Error("useElite must be used within an EliteProvider")
  }
  return context
}
