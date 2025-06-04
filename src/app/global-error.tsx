"use client"
import "./globalError.css"
import type { Metadata } from "next"
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Error del servidor - 500",
  description: "Ha ocurrido un error interno del servidor.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="global-error-container">
          <div className="global-error-box">
            <div>
              <h1 className="global-error-heading">500</h1>
              <h2 className="global-error-subheading">Error del servidor</h2>
              <p className="global-error-description">
                Ha ocurrido un error interno. Nuestro equipo ha sido notificado.
              </p>
            </div>

            <div>
              <button onClick={reset} className="global-error-button">
                Intentar de nuevo
              </button>
              <Link href="/" className="global-error-link">
                Volver al inicio
              </Link>
            </div>

            {process.env.NODE_ENV === "development" && (
              <details className="global-error-details">
                <summary>Detalles del error (solo en desarrollo)</summary>
                <pre className="global-error-pre">
                  {error.message}
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
