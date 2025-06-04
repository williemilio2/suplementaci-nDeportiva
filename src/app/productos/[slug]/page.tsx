import { getAllProducts } from "../../../products/listaArchivos"
import { notFound } from "next/navigation"
import ProductDetailClient from "./product-detail-client"
import type { Metadata } from "next"

type Props = {
  params: { slug: string }
}

// Generar metadatos dinámicamente para cada producto
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params

  try {
    const products = await getAllProducts()
    const producto = products.find((p) => p.slug === slug)

    if (!producto) {
      return {
        title: "Producto no encontrado | Suplementación Deportiva",
        description: "Lo sentimos, el producto que buscas no está disponible.",
      }
    }

    // Crear metadatos optimizados para SEO
    const productName = producto.name || "Suplemento deportivo"
    const productBrand = producto.brand || "Marca premium"
    const productCategory = producto.category || "Suplementos deportivos"
    const productPrice = producto.price ? `${producto.price.toFixed(2)}€` : "Precio especial"

    // Crear una descripción rica en palabras clave
    let description = `Compra ${productName} de ${productBrand} al mejor precio: ${productPrice}. `

    if (productCategory.toLowerCase().includes("proteina") || productName.toLowerCase().includes("proteina")) {
      description += "Proteína barata de alta calidad para aumentar masa muscular y mejorar tu recuperación. "
    }

    if (
      productCategory.toLowerCase().includes("aminoacido") ||
      productName.toLowerCase().includes("aminoacido") ||
      productName.toLowerCase().includes("bcaa")
    ) {
      description += "Aminoácidos esenciales para optimizar tu recuperación muscular. "
    }

    if (productCategory.toLowerCase().includes("creatina") || productName.toLowerCase().includes("creatina")) {
      description += "Creatina pura para aumentar tu fuerza y rendimiento. "
    }

    description += "Envío gratis en pedidos superiores a 34.99€."

    // Generar palabras clave relevantes
    const keywords = `${productName}, ${productBrand}, ${productCategory}, comprar ${productName}, ${productName} barato, suplementos deportivos`

    return {
      title: `${productName} | ${productBrand} - Comprar al Mejor Precio`,
      description: description,
      keywords: keywords,
      openGraph: {
        title: `${productName} | ${productBrand} - Suplementación Deportiva`,
        description: description,
        url: `https://suplementaciondeportiva.es/productos/${slug}`,
        type: "website", // usa "website" si es una página de producto normal
        images: [producto.image || "/placeholder-product.jpg"],
      },
      alternates: {
        canonical: `https://suplementaciondeportiva.es/productos/${slug}`,
      },
    }
  } catch (error) {
    console.error("Error generando metadatos:", error)
    return {
      title: "Suplementación Deportiva | Proteínas y Suplementos al Mejor Precio",
      description:
        "Tu tienda online de suplementos deportivos con las mejores ofertas en proteínas, aminoácidos y nutrición deportiva.",
    }
  }
}

// Generar datos estructurados para el producto
async function generateProductStructuredData(slug: string) {
  try {
    const products = await getAllProducts()
    const product = products.find((p) => p.slug === slug)

    if (!product) return null

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description || `${product.name} de alta calidad para deportistas`,
      image: product.image || "/placeholder-product.jpg",
      sku: product.id.toString(),
      mpn: product.id.toString(),
      brand: {
        "@type": "Brand",
        name: product.brand || "Suplementación Deportiva",
      },
      offers: {
        "@type": "Offer",
        url: `https://suplementaciondeportiva.es/productos/${slug}`,
        price: product.price,
        priceCurrency: "EUR",
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "Suplementación Deportiva",
        },
      },
      aggregateRating: product.rating
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating.toString(),
            reviewCount: product.reviews.toString(),
          }
        : undefined,
      category: product.category,
    }
  } catch (error) {
    console.error("Error generando datos estructurados:", error)
    return null
  }
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = params

  const products = await getAllProducts()
  const producto = products.find((p) => p.slug === slug)

  if (!producto) {
    notFound()
  }

  // Generar datos estructurados
  const structuredData = await generateProductStructuredData(slug)

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      <ProductDetailClient producto={producto} />
    </>
  )
}
