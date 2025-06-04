import { sanitizeHtml } from "./security"
import type { Product } from "../types/product"

export function generateProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: sanitizeHtml(product.name),
    description: sanitizeHtml(product.description || ""),
    brand: {
      "@type": "Brand",
      name: sanitizeHtml(product.marca),
    },
    offers: {
      "@type": "Offer",
      price: product.precio || 0,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: sanitizeHtml(item.name),
      item: item.url,
    })),
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tu Tienda de Suplementos",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+34-XXX-XXX-XXX",
      contactType: "customer service",
    },
  }
}
