"use client"

import { useState, useEffect } from "react"
import { ensureDataLoaded } from "../../products/listaArchivos"
import OfferProductCard from "../../components/ContenedorPorducto"
import styles from "../../styles/Product-listing.module.css"
import type { Product } from "../../types/product"
import { Sparkles, Star, Clock } from "lucide-react"
import CustomCursor from "@/src/components/customCursor"
//e
export default function NovedadesPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
                <OfferProductCard key={`regular-${product.id}-${index}`} product={product} displayMode={'grid'} />
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
