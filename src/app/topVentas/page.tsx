"use client"

import { useState, useEffect } from "react"
import { ensureDataLoaded } from "../../products/listaArchivos"
import OfferProductCard from "../../components/ContenedorPorducto"
import styles from "../../styles/Product-listing.module.css"
import type { Product } from "../../types/product"
import { Trophy, Star, TrendingUp } from "lucide-react"
import CustomCursor from "@/src/components/customCursor"

//ew

export default function TopVentasPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const { allProducts: products } = await ensureDataLoaded()

        const topProducts = products
          .filter((product) => product.reviews > 0)
          .sort((a, b) => {
            const reviewDiff = b.reviews - a.reviews
            if (reviewDiff !== 0) return reviewDiff
            return b.rating - a.rating
          })
          .slice(0, 24)

        setAllProducts(topProducts as Product[])
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
        <p>Cargando productos más vendidos...</p>
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
            <Trophy size={32} className={styles.pageTitleIcon} />
            <h1>TOP VENTAS</h1>
          </div>
          <p className={styles.pageDescription}>Los productos más vendidos y mejor valorados por nuestros clientes</p>
          <div className={styles.pageStats}>
            <div className={styles.statItem}>
              <TrendingUp size={20} />
              <span>Más vendidos</span>
            </div>
            <div className={styles.statItem}>
              <Star size={20} />
              <span>Mejor valorados</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.listingHeader}>
        <div className={styles.resultsInfo}>
          <p className={styles.resultsCount}>Mostrando {allProducts.length} productos más vendidos</p>
        </div>
      </div>

     <div className={styles.productListingContent}>
        {/* Productos sin oferta */}
          <section className={styles.productSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleContainer}>
                <Star size={24} className={styles.regularIcon} />
                <h2 className={styles.sectionTitle}>PRODUCTOS MÁS VENDIDOS</h2>
                <span className={styles.newBadge}>TRENDING</span>
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
            <Trophy size={48} />
            <p>No se encontraron productos en el top de ventas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
