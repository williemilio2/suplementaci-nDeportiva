"use client"

import { useState, useEffect } from "react"
import { ensureDataLoaded } from "../../products/listaArchivos"
import OfferProductCard from "../../components/ContenedorPorducto"
import styles from "../../styles/Product-listing.module.css"
import type { Product } from "../../types/product"
import { Sparkles, Star, Clock } from "lucide-react"
import CustomCursor from "@/src/components/customCursor"

// Metadatos para la página de novedades
const novedadesMetadata = {
  title: "Novedades en Suplementos Deportivos | Últimos Lanzamientos - Suplementación Deportiva",
  description:
    "Descubre las últimas novedades en suplementos deportivos. Nuevos productos, fórmulas mejoradas y las últimas tendencias en nutrición deportiva. ¡Sé el primero en probarlos!",
  keywords:
    "novedades suplementos, nuevos productos, últimos lanzamientos, tendencias nutrición deportiva, proteína nueva, pre-entreno innovador",
  url: "https://suplementaciondeportiva.es/novedades",
}

// Generar datos estructurados para la página de novedades
function generateNovedadesStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Novedades en Suplementos Deportivos",
    description: "Los últimos lanzamientos y novedades en suplementación deportiva",
    url: "https://suplementaciondeportiva.es/novedades",
    dateModified: new Date().toISOString(),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://suplementaciondeportiva.es",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Novedades",
          item: "https://suplementaciondeportiva.es/novedades",
        },
      ],
    },
  }
}

export default function NovedadesClientPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Actualizar metadatos para SEO
    document.title = novedadesMetadata.title

    // Actualizar meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute("content", novedadesMetadata.description)
    } else {
      const meta = document.createElement("meta")
      meta.name = "description"
      meta.content = novedadesMetadata.description
      document.head.appendChild(meta)
    }

    // Actualizar meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute("content", novedadesMetadata.keywords)
    } else {
      const meta = document.createElement("meta")
      meta.name = "keywords"
      meta.content = novedadesMetadata.keywords
      document.head.appendChild(meta)
    }

    // Actualizar canonical
    const canonicalLink = document.querySelector('link[rel="canonical"]')
    if (canonicalLink) {
      canonicalLink.setAttribute("href", novedadesMetadata.url)
    } else {
      const link = document.createElement("link")
      link.rel = "canonical"
      link.href = novedadesMetadata.url
      document.head.appendChild(link)
    }

    // Añadir datos estructurados
    const structuredData = generateNovedadesStructuredData()
    let scriptTag = document.querySelector('script[type="application/ld+json"]')
    if (scriptTag) {
      scriptTag.textContent = JSON.stringify(structuredData)
    } else {
      scriptTag = document.createElement("script")
      scriptTag.textContent = JSON.stringify(structuredData)
      document.head.appendChild(scriptTag)
    }

    // Cargar productos
    const loadProducts = async () => {
      try {
        setLoading(true)
        const { allProducts: products } = await ensureDataLoaded()

        const newestProducts = products.sort((a, b) => b.id - a.id).slice(0, 20)

        setAllProducts(newestProducts as Product[])
      } catch (error) {
        console.error("Error al cargar productos:", error)
        setAllProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando novedades...</p>
        <div className={styles.spinner}></div>
      </div>
    )
  }

  return (
    <div className={styles.productListingContainer}>
      <CustomCursor />
      {/* Header mejorado */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <div className={styles.pageTitle}>
            <Sparkles size={32} className={styles.pageTitleIcon} />
            <h1>NOVEDADES</h1>
          </div>
          <p className={styles.pageDescription}>
            Los productos más recientes y las últimas innovaciones en suplementación
          </p>
          <div className={styles.pageStats}>
            <div className={styles.statItem}>
              <Clock size={20} />
              <span>Recién llegados</span>
            </div>
            <div className={styles.statItem}>
              <Sparkles size={20} />
              <span>Innovación</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.listingHeader}>
        <div className={styles.resultsInfo}>
          <p className={styles.resultsCount}>Mostrando {allProducts.length} productos más recientes</p>
        </div>
      </div>

      <div className={styles.productListingContent}>
        {/* Productos sin oferta */}
        <section className={styles.productSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleContainer}>
              <Star size={24} className={styles.regularIcon} />
              <h2 className={styles.sectionTitle}>NUEVOS PRODUCTOS</h2>
              <span className={styles.newBadge}>NUEVO</span>
            </div>
            <div className={styles.sectionCount}>{allProducts.length} productos</div>
          </div>

          <div className={`${styles.offerProducts}`}>
            {allProducts.map((product, index) => (
              <OfferProductCard key={`regular-${product.id}-${index}`} product={product} displayMode={"grid"} />
            ))}
          </div>
        </section>

        {allProducts.length === 0 && (
          <div className={styles.noResults}>
            <Sparkles size={48} />
            <p>No se encontraron novedades disponibles.</p>
          </div>
        )}
      </div>
    </div>
  )
}
