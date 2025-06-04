import { sanitizeHtml } from "@/src/lib/security"

interface CategorySchemaProps {
  category: string
  products: Array<{
    id: string | number
    name: string
    slug: string
  }>
}

export default function CategorySchema({ category, products }: CategorySchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.suplementaciondeportiva.es"

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${sanitizeHtml(category)} - Suplementación Deportiva`,
    description: `Lista de productos de ${sanitizeHtml(category)} disponibles en Suplementación Deportiva`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: sanitizeHtml(product.name),
        url: `${baseUrl}/producto/${product.slug}`,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
