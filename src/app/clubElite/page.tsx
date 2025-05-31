"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { ensureDataLoaded } from "../../products/listaArchivos"
import OfferProductCard from "../../components/ContenedorPorducto"
import styles from "../../styles/Product-listing.module.css"
import eliteStyles from "../../styles/clubElite.module.css"
import type { Product } from "../../types/product"
import CustomCursor from "@/src/components/customCursor"
import Link from 'next/link'
import {
  Crown,
  Lock,
  ShoppingBag,
  Star,
  Target,
  Gift,
  Shield,
  Zap,
} from "lucide-react"


export default function ClubElitePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [proceso, setProceso] = useState(0)
  const [isCheckingMembership, setIsCheckingMembership] = useState(true)

  useEffect(() => {
    const token = Cookies.get("token")
    if (!token) {
      setProceso(1)
      setIsCheckingMembership(false)
      return
    }

    fetch("/api/comrpobarUsuarioClubAfiliados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.resultado && data.resultadoAmedias) {
          setProceso(2)
        } else {
          setProceso(1)
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsCheckingMembership(false)
      })
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const { allProducts: products } = await ensureDataLoaded()

        const eliteProducts = products
          .filter((product) => product.rebajasElite)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 16)

        setAllProducts(eliteProducts as Product[])
      } catch (error) {
        console.error("Error al cargar productos:", error)
        setAllProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (isCheckingMembership) {
    return (
      <div className={eliteStyles.loadingContainer}>
        <div className={eliteStyles.loadingContent}>
          <Crown size={48} className={eliteStyles.loadingIcon} />
          <p>Verificando membresía del Club Elite...</p>
          <div className={eliteStyles.spinner}></div>
        </div>
      </div>
    )
  }

  if (proceso === 1) {
    return (
      <div className={eliteStyles.eliteContainer}>
              <CustomCursor />
        <div className={eliteStyles.accessDenied}>
          <div className={eliteStyles.accessContent}>
            <div className={eliteStyles.accessHeader}>
              <div className={eliteStyles.lockContainer}>
                <Lock size={64} className={eliteStyles.lockIcon} />
              </div>
              <h1 className={eliteStyles.accessTitle}>
                <Crown size={28} />
                CLUB ELITE
              </h1>
              <p className={eliteStyles.accessSubtitle}>Acceso Exclusivo Requerido</p>
            </div>

            <div className={eliteStyles.accessInfo}>
              <h3>Para acceder necesitas:</h3>
              <ul className={eliteStyles.requirementsList}>
                <li>
                  <Shield size={16} />
                  <span>Cuenta creada</span>
                </li>
                <li>
                  <ShoppingBag size={16} />
                  <span>Al menos una compra</span>
                </li>
              </ul>
            </div>

            <div className={eliteStyles.accessActions}>
              <Link href="/auth/login" className={`${eliteStyles.primaryBtn} hoverable`}>
                <Zap size={20} />
                Iniciar Sesión
              </Link>
            </div>

            <div className={eliteStyles.benefitsGrid}>
              <h3>Beneficios Exclusivos</h3>
              <div className={eliteStyles.benefits}>
                <div className={eliteStyles.benefit}>
                  <Target size={24} className={eliteStyles.benefitIcon} />
                  <div>
                    <strong>Descuentos VIP</strong>
                    <span>Hasta 20% en productos premium</span>
                  </div>
                </div>
                <div className={eliteStyles.benefit}>
                  <Gift size={24} className={eliteStyles.benefitIcon} />
                  <div>
                    <strong>Productos Exclusivos</strong>
                    <span>Solo para miembros Elite</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={eliteStyles.loadingContainer}>
        <div className={eliteStyles.loadingContent}>
          <Crown size={48} className={eliteStyles.loadingIcon} />
          <p>Cargando ofertas exclusivas...</p>
          <div className={eliteStyles.spinner}></div>
        </div>
      </div>
    )
  }

  return (
    <div className={eliteStyles.eliteContainer}>
            <CustomCursor />
      {/* Header Elite */}
      <div className={eliteStyles.eliteHeader}>
        <div className={eliteStyles.eliteHeaderContent}>
          <div className={eliteStyles.eliteTitle}>
            <Crown size={32} className={eliteStyles.eliteTitleIcon} />
            <h1>CLUB ELITE</h1>
          </div>
          <p className={eliteStyles.eliteDescription}>Bienvenido al nivel más alto de suplementación deportiva</p>
          <div className={eliteStyles.memberBadge}>
            <Crown size={16} />
            <span>Miembro Verificado</span>
          </div>
        </div>
      </div>

      <div className={styles.productListingContainer}>
        <div className={styles.listingHeader}>
          <div className={styles.resultsInfo}>
            <p className={styles.resultsCount}>Productos exclusivos para miembros Elite</p>
          </div>
        </div>

        <div className={styles.productListingContent}>

            <section className={eliteStyles.eliteSection}>
              <div className={eliteStyles.eliteSectionHeader}>
                <div className={eliteStyles.eliteSectionTitle}>
                  <Star size={24} className={eliteStyles.eliteStarIcon} />
                  <h2>PRODUCTOS PREMIUM</h2>
                  <span className={eliteStyles.premiumBadge}>PREMIUM</span>
                </div>
                <div className={eliteStyles.eliteSectionCount}>{allProducts.length} productos</div>
              </div>

              <div
                className={`${eliteStyles.eliteProducts}`}
              >
                {allProducts.map((product, index) => (
                  <div key={`elite-regular-${product.id}-${index}`} className={eliteStyles.eliteProductWrapper}>
                    <OfferProductCard product={product} displayMode={'grid'} />
                  </div>
                ))}
              </div>
            </section>

          {allProducts.length === 0 && (
            <div className={eliteStyles.eliteNoResults}>
              <Crown size={48} />
              <p>No hay productos exclusivos disponibles en este momento.</p>
              <p>¡Vuelve pronto para descubrir nuevas ofertas Elite!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
