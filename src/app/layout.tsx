import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Script from "next/script" // ✅ AÑADIDO
import "./globals.css"
import LayoutWrapper from "../components/layoutWrapper"
import { EliteProvider } from "@/src/components/eliteContent"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://tu-dominio.com"),
  title: {
    default: "Tu Tienda de Suplementos - Proteínas y Nutrición Deportiva",
    template: "%s | Tu Tienda de Suplementos",
  },
  description:
    "Descubre la mejor selección de suplementos deportivos, proteínas, aminoácidos y nutrición deportiva. Envío gratuito en pedidos superiores a 50€.",
  keywords: ["suplementos deportivos", "proteínas", "aminoácidos", "nutrición deportiva", "fitness", "musculación"],
  authors: [{ name: "Tu Tienda de Suplementos" }],
  creator: "Tu Tienda de Suplementos",
  publisher: "Tu Tienda de Suplementos",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Tu Tienda de Suplementos",
    title: "Tu Tienda de Suplementos - Proteínas y Nutrición Deportiva",
    description: "Descubre la mejor selección de suplementos deportivos, proteínas, aminoácidos y nutrición deportiva.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tu Tienda de Suplementos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tu Tienda de Suplementos - Proteínas y Nutrición Deportiva",
    description: "Descubre la mejor selección de suplementos deportivos, proteínas, aminoácidos y nutrición deportiva.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "tu-codigo-de-verificacion-google",
  },
  alternates: {
    canonical: "/",
  },
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />

        {/* ✅ Google Analytics Script */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0NV8QCMQBF"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0NV8QCMQBF');
          `}
        </Script>

        {/* ✅ JSON-LD Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Tu Tienda de Suplementos",
              description: "Tienda especializada en suplementos deportivos y nutrición",
              url: process.env.NEXT_PUBLIC_SITE_URL,
              logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
              address: {
                "@type": "PostalAddress",
                addressCountry: "ES",
              },
              sameAs: ["https://facebook.com/tu-tienda", "https://instagram.com/tu-tienda"],
            }),
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <LayoutWrapper>
          <EliteProvider>{children}</EliteProvider>
        </LayoutWrapper>
      </body>
    </html>
  )
}
