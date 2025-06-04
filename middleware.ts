import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimit } from "./src/lib/security"
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim() // Primera IP de la cadena
  }
  return "unknown"
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Generar nonce para CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://vercel.live;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://vercel.live;
    media-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim()

  // Headers de seguridad
  response.headers.set("Content-Security-Policy", cspHeader)
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.headers.set("X-Nonce", nonce)

  // HSTS (solo en producción)
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  }

  // Rate limiting básico
  const ip = getClientIp(request)
  if (!rateLimit(ip, 1000, 60000)) {
    return new NextResponse("Too Many Requests", { status: 429 })
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
