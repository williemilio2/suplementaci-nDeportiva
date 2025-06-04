import DOMPurify from "isomorphic-dompurify"

// Sanitizar HTML para prevenir XSS
export function sanitizeHtml(html: string): string {
  if (!html) return ""
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTR: [],
  })
}

// Validar entrada de usuario
export function validateInput(input: string, maxLength = 100): string {
  if (!input || typeof input !== "string") return ""

  // Remover caracteres peligrosos
  const cleaned = input
    .replace(/[<>"']/g, "") // Remover caracteres HTML peligrosos
    .replace(/javascript:/gi, "") // Remover javascript:
    .replace(/on\w+=/gi, "") // Remover event handlers
    .trim()

  return cleaned.substring(0, maxLength)
}

// Validar email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Validar números
export function validateNumber(value: unknown, min = 0, max: number = Number.MAX_SAFE_INTEGER): number {
  const num = typeof value === "number" ? value : Number(value)
  if (isNaN(num)) return min
  return Math.max(min, Math.min(max, num))
}


// Rate limiting simple (para uso en memoria)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(identifier: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

// Limpiar datos sensibles de logs
export function sanitizeForLogging<T extends Record<string, unknown>>(data: T): T {
  const sensitiveFields = ["password", "token", "email", "phone", "address"]

  if (typeof data !== "object" || data === null) return data

  // Creamos una copia mutable
  const sanitized: Record<string, unknown> = { ...data }

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = "[REDACTED]"
    }
  }

  return sanitized as T
}
