"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import TopBar from "./TopBar"
import Header from "./Header"
import Navigation from "./Navigation"
import Footer from "./footer"
import { sanitizeForLogging, clientRateLimit } from "@/src/lib/enhanced-security"

type Props = {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: Props) {
  const pathname = usePathname()

  useEffect(() => {
    // Log de seguridad básico (solo en desarrollo)
    if (process.env.NODE_ENV === "development") {
      console.log(
        "Layout mounted",
        sanitizeForLogging({
          timestamp: new Date().toISOString(),
          pathname,
        }),
      )
    }

    // Detectar intentos de manipulación del DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element

              // Detectar scripts maliciosos
              if (element.tagName === "SCRIPT" && !element.hasAttribute("nonce")) {
                console.warn("Script no autorizado detectado:", element)
                element.remove()

                // Reportar incidente si no excede rate limit
                if (clientRateLimit("malicious_script", 3, 300000)) {
                  fetch("/api/security/report", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      type: "unauthorized_script",
                      pathname,
                      timestamp: new Date().toISOString(),
                    }),
                  }).catch(console.error)
                }
              }

              // Detectar iframes sospechosos
              if (element.tagName === "IFRAME") {
                const src = element.getAttribute("src")
                if (src && !src.startsWith(window.location.origin) && !isAllowedDomain(src)) {
                  console.warn("Iframe sospechoso detectado:", src)
                  element.remove()
                }
              }
            }
          })
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Monitorear eventos sospechosos
    const handleSuspiciousActivity = (event: Event) => {
      const target = event.target as Element

      // Detectar intentos de inyección en inputs
      if (target && target.tagName === "INPUT") {
        const input = target as HTMLInputElement
        if (/<script|javascript:|on\w+=/i.test(input.value)) {
          console.warn("Contenido sospechoso en input:", input.value)
          input.value = input.value.replace(/<script|javascript:|on\w+=/gi, "")
        }
      }
    }

    // Monitorear cambios en inputs
    document.addEventListener("input", handleSuspiciousActivity)

    // Monitorear intentos de copiar/pegar scripts
    const handlePaste = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData?.getData("text") || ""
      if (/<script|javascript:|on\w+=/i.test(clipboardData)) {
        event.preventDefault()
        console.warn("Contenido malicioso bloqueado en paste")

        // Mostrar notificación al usuario
        if (typeof window !== "undefined" && "Notification" in window) {
          new Notification("Contenido bloqueado", {
            body: "Se detectó contenido potencialmente malicioso y fue bloqueado.",
            icon: "/favicon.ico",
          })
        }
      }
    }

    document.addEventListener("paste", handlePaste)

    // Limpiar localStorage de datos antiguos de rate limiting
    cleanupOldRateLimitData()

    return () => {
      observer.disconnect()
      document.removeEventListener("input", handleSuspiciousActivity)
      document.removeEventListener("paste", handlePaste)
    }
  }, [pathname])

  // Función para verificar dominios permitidos
  const isAllowedDomain = (url: string): boolean => {
    const allowedDomains = [
      "youtube.com",
      "vimeo.com",
      "maps.google.com",
      // Añade aquí los dominios que consideres seguros
    ]

    try {
      const urlObj = new URL(url)
      return allowedDomains.some((domain) => urlObj.hostname.includes(domain))
    } catch {
      return false
    }
  }

  // Función para limpiar datos antiguos de rate limiting
  const cleanupOldRateLimitData = () => {
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

  if (pathname.startsWith("/admin")) {
    // Layout alternativo para /admin con seguridad adicional
    return (
      <>
        <div data-admin-layout="true">
          {/* Aquí puedes poner otro header o nada */}
          <main role="main">{children}</main>
          {/* Otro footer o nada */}
        </div>
      </>
    )
  }

  // Layout general para resto de la app
  return (
    <>
      <header role="banner">
        <TopBar />
        <Header />
        <Navigation />
      </header>
      <main role="main">{children}</main>
      <footer role="contentinfo">
        <Footer />
      </footer>
    </>
  )
}
