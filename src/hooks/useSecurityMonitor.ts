"use client"

import { useEffect } from "react"
import { clientRateLimit, detectBot, cleanupLocalStorage } from "../lib/enhanced-security"

export function useSecurityMonitor() {
  useEffect(() => {
    // Limpiar localStorage al cargar
    cleanupLocalStorage()

    // Detectar si es un bot
    if (detectBot()) {
      console.warn("Bot detected")
      // Reportar si es necesario
      if (clientRateLimit("bot_detection", 1, 3600000)) {
        // Una vez por hora
        fetch("/api/security/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "bot_detected",
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }),
        }).catch(console.error)
      }
    }

    // Monitorear eventos sospechosos
    const handleSuspiciousActivity = (event: Event) => {
      const target = event.target as Element

      // Detectar intentos de inyección
      if (target && target.innerHTML && /<script|javascript:|on\w+=/i.test(target.innerHTML)) {
        console.warn("Suspicious content detected:", target.innerHTML.substring(0, 100))

        // Reportar incidente
        if (clientRateLimit("security_report", 3, 300000)) {
          fetch("/api/security/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "content_injection",
              content: target.innerHTML.substring(0, 100),
              timestamp: new Date().toISOString(),
            }),
          }).catch(console.error)
        }
      }
    }

    // Monitorear cambios en inputs
    document.addEventListener("input", handleSuspiciousActivity)

    // Monitorear intentos de copiar/pegar scripts
    document.addEventListener("paste", (event) => {
      const clipboardData = event.clipboardData?.getData("text") || ""
      if (/<script|javascript:|on\w+=/i.test(clipboardData)) {
        event.preventDefault()
        console.warn("Suspicious paste content blocked")

        // Mostrar alerta al usuario
        alert("Contenido potencialmente malicioso bloqueado")
      }
    })

    // Monitorear intentos de abrir DevTools (básico)
    const devtools = { open: false, orientation: null }
    const threshold = 160

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true
          console.warn("DevTools opened")
        }
      } else {
        devtools.open = false
      }
    }, 500)

    return () => {
      document.removeEventListener("input", handleSuspiciousActivity)
    }
  }, [])
}
