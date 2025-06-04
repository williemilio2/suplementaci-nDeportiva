import { validateInput } from "./security"

// Mejorar la función de rate limiting para usar localStorage en el cliente
export function clientRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
  if (typeof window === "undefined") return true

  try {
    const key = `rate_limit_${identifier}`
    const stored = localStorage.getItem(key)
    const now = Date.now()

    if (!stored) {
      localStorage.setItem(key, JSON.stringify({ count: 1, resetTime: now + windowMs }))
      return true
    }

    const data = JSON.parse(stored)

    if (now > data.resetTime) {
      localStorage.setItem(key, JSON.stringify({ count: 1, resetTime: now + windowMs }))
      return true
    }

    if (data.count >= maxRequests) {
      return false
    }

    data.count++
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error("Error en rate limiting:", error)
    return true // Permitir en caso de error
  }
}

// Función para limpiar localStorage de datos antiguos
export function cleanupLocalStorage(): void {
  if (typeof window === "undefined") return

  try {
    const keys = Object.keys(localStorage)
    const now = Date.now()

    keys.forEach((key) => {
      if (key.startsWith("rate_limit_")) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "{}")
          if (data.resetTime && now > data.resetTime) {
            localStorage.removeItem(key)
          }
        } catch {
          localStorage.removeItem(key)
        }
      }
    })
  } catch (error) {
    console.error("Error limpiando localStorage:", error)
  }
}

// Función para validar formularios de manera segura
export function validateForm(formData: FormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validar cada campo
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      const sanitized = validateInput(value, 1000)
      if (sanitized !== value) {
        errors.push(`Campo ${key} contiene caracteres no válidos`)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Función para detectar bots simples
export function detectBot(): boolean {
  if (typeof window === "undefined") return false

  // Verificar user agent
  const userAgent = navigator.userAgent.toLowerCase()
  const botPatterns = ["bot", "crawler", "spider", "scraper"]

  if (botPatterns.some((pattern) => userAgent.includes(pattern))) {
    return true
  }

  // Verificar si webdriver está presente
  if ("webdriver" in navigator) {
    return true
  }

  // Verificar propiedades sospechosas
  if (window.outerHeight === 0 || window.outerWidth === 0) {
    return true
  }

  return false
}

// Función para sanitizar URLs
export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)

    // Solo permitir protocolos seguros
    if (!["http:", "https:", "mailto:", "tel:"].includes(urlObj.protocol)) {
      return "#"
    }

    return urlObj.toString()
  } catch {
    return "#"
  }
}

// Función para validar tokens JWT básicamente
export function validateJWTFormat(token: string): boolean {
  if (!token || typeof token !== "string") return false

  const parts = token.split(".")
  if (parts.length !== 3) return false

  // Verificar que cada parte sea base64 válido
  try {
    parts.forEach((part) => {
      atob(part.replace(/-/g, "+").replace(/_/g, "/"))
    })
    return true
  } catch {
    return false
  }
}

// Re-exportar funciones de security.ts para conveniencia
export { sanitizeForLogging, validateInput, validateEmail, validateNumber } from "./security"
