// src/app/page.tsx
'use client'
import type { Metadata } from "next";
import HeroBanner from "../components/HeroBanner";
import CategoryContent from "../components/CategoryContent";
import OfertaDia from "../components/OfertaDelDia";
import ProductListing from "../components/Product-listing";
import CustomCursor from "../components/customCursor";
import ClubPopup from "../components/clubPopup";

// SEO Metadata
export const metadata: Metadata = {
  title: "Inicio - Tu Tienda de Suplementos",
  description:
    "Descubre las mejores ofertas en suplementos deportivos, proteínas y nutrición deportiva. Envío gratuito en pedidos superiores a 34.99€.",
  openGraph: {
    title: "Tu Tienda de Suplementos - Ofertas en Proteínas y Suplementos",
    description:
      "Descubre las mejores ofertas en suplementos deportivos, proteínas y nutrición deportiva.",
    images: ["/og-home.jpg"],
    url: "https://suplementaciondeportiva.es",
  },
  alternates: {
    canonical: "https://suplementaciondeportiva.es",
  },
};

// Structured Data JSON-LD
function generateHomeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Tu Tienda de Suplementos - Inicio",
    description: "Tienda online de suplementos deportivos, proteínas y nutrición deportiva",
    url: "https://suplementaciondeportiva.es",
    mainEntity: {
      "@type": "Store",
      name: "Tu Tienda de Suplementos",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Catálogo de Suplementos Deportivos",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "Proteínas",
              category: "Suplementos Deportivos",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "Aminoácidos",
              category: "Suplementos Deportivos",
            },
          },
        ],
      },
    },
  };
}

// Página Principal
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomeStructuredData()),
        }}
      />
      <main>
        <CustomCursor />
        <ClubPopup />
        <HeroBanner />
        <OfertaDia />
        <CategoryContent />
        <ProductListing />
      </main>
    </>
  );
}
