"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import Cookies from "js-cookie"

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
    const token = Cookies.get("token")
    if (!token) {
      setIsElite(false)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/comrpobarUsuarioClubAfiliados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()
      setIsElite(data.resultado && data.resultadoAmedias)
    } catch (error) {
      console.error("Error verificando estatus Elite:", error)
      setError("Error al verificar estatus Elite")
      setIsElite(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkEliteStatus()
  }, [])

  // Escuchar cambios en el token (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      checkEliteStatus()
    }

    // Escuchar cambios en cookies/localStorage
    window.addEventListener("storage", handleStorageChange)

    // Escuchar eventos personalizados de login/logout
    window.addEventListener("userLogin", handleStorageChange)
    window.addEventListener("userLogout", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userLogin", handleStorageChange)
      window.removeEventListener("userLogout", handleStorageChange)
    }
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
