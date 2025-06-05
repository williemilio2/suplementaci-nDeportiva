import type { MetadataRoute } from "next"
import { getAllProducts, getAllCategories } from "@/src/lib/products"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.suplementaciondeportiva.es"
  const currentDate = new Date()

  // Obtener productos y categorías de la base de datos
  const products = await getAllProducts()
  const categories = await getAllCategories()

  // Páginas estáticas principales - alta prioridad
  const mainPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/especiales/`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/topVentas`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/novedades`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/clubElite`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ]

  // Páginas informativas - prioridad media
  const infoPages = [
    {
      url: `${baseUrl}/nosotros`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/envios`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/devoluciones`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/preguntas-frecuentes`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/afiliados`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]

  // Páginas legales - prioridad baja
  const legalPages = [
    {
      url: `${baseUrl}/politica-privacidad`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terminos-condiciones`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
  ]

  // Páginas de productos - prioridad alta para SEO de productos
  const productPages = products.map((product) => ({
    url: `${baseUrl}/productos/${product.slug}`,
    lastModified: new Date(
      typeof product.updated_at === 'string' || typeof product.updated_at === 'number' || product.updated_at instanceof Date
        ? product.updated_at
        : currentDate
    ),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }))

  // Páginas de categorías - URLs amigables para SEO
  const tipos = categories
  .filter((tipo): tipo is string => typeof tipo === 'string')
  .map((tipo) => ({
    url: `${baseUrl}/tipo/${tipo.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }))
const categoryQueryPages = categories
  .filter((category): category is string => typeof category === 'string')
  .map((category) => ({
    url: `${baseUrl}/especiales/${category}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // Combinar todas las páginas
  return [...mainPages, ...infoPages, ...legalPages, ...productPages, ...tipos, ...categoryQueryPages]
}
