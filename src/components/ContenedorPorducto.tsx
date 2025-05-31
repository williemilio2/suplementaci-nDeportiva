"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, X, Crown } from "lucide-react"
import styles from "../styles/contenedorProducto.module.css"
import columnStyles from "../styles/product-column.module.css"
import PopUpSelectorPrecioSabor from "./PopUpSelectorPrecioSabor"
import StockAutoSelector from "./dineroDefault"
import { useElite } from "@/src/components/eliteContent"
import type { Product } from "../types/product"


interface OfferProductCardProps {
  product: Product
  displayMode?: "grid" | "column"
}

export default function OfferProductCard({ product, displayMode = "grid" }: OfferProductCardProps) {
  const images = product.image ? product.image.split("<<<") : ["/placeholder.svg?height=300&width=300"]
  const [showPopup, setShowPopup] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [dinero, setDinero] = useState(0)
  const [oferta, setOferta] = useState(0)
  const [finalDiscount, setFinalDiscount] = useState(0)

  // Usar el contexto Elite
  const { isElite} = useElite()

  const sabores = product.sabores ? product.sabores.split("<<<") : []

  // Calcular descuento final cuando cambian las ofertas
  useEffect(() => {
    let totalDiscount = oferta

    // Si es Elite y el producto tiene rebajasElite, combinar descuentos
    if (isElite && product.rebajasElite !== undefined && product.rebajasElite > 0) {
      totalDiscount = Math.min(oferta + product.rebajasElite, 90)
    }

    setFinalDiscount(totalDiscount)
  }, [oferta, isElite, product.rebajasElite])

  const togglePopup = () => {
    setShowPopup(!showPopup)
  }

  useEffect(() => {
    const checkFavoriteStatus = () => {
      const favoritosString = localStorage.getItem("favoritos")
      const favoritos: string[] = favoritosString ? JSON.parse(favoritosString) : []
      setIsFavorite(favoritos.includes(product.name))
    }

    checkFavoriteStatus()
    window.addEventListener("favoritesUpdated", checkFavoriteStatus)

    return () => {
      window.removeEventListener("favoritesUpdated", checkFavoriteStatus)
    }
  }, [product.id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const favoritosString = localStorage.getItem("favoritos")
    const favoritos: string[] = favoritosString ? JSON.parse(favoritosString) : []

    let nuevosFavoritos: string[]

    if (isFavorite) {
      nuevosFavoritos = favoritos.filter((nombre) => nombre !== product.name)
    } else {
      nuevosFavoritos = [...favoritos, product.name]
    }

    localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos))
    setIsFavorite(!isFavorite)
    window.dispatchEvent(new Event("favoritesUpdated"))
  }

  // Determinar si aplicar estilos Elite
  const hasEliteOffer = isElite && product.rebajasElite !== undefined && product.rebajasElite > 0
  const cardClassName = hasEliteOffer
    ? `${styles.productCard} ${styles.eliteProductCard}`
    : `${styles.productCard} ${product.superOfertas ? styles.productCardGlow : ""}`

  if (displayMode === "column") {
    return (
      <>
        <div className={cardClassName}>
          <StockAutoSelector
            productId={product.id}
            onFound={({ price, offer }) => {
              setDinero(price)
              setOferta(offer)
            }}
          />

          {/* Badge Elite */}
          {hasEliteOffer && (
            <div className={styles.eliteBadge}>
              <Crown size={12} className={styles.eliteIcon} />
              ELITE
            </div>
          )}

          <div className={columnStyles.productContent}>
            <div className={columnStyles.productImageContainer}>
              {product.badge && (
                <span
                  className={`${columnStyles.productBadge} ${columnStyles[`badge${product.badge.replace(/\s+/g, "")}`]}`}
                >
                  {product.badge}
                </span>
              )}

              <Link href={dinero == 0 ? "" : `/productos/${product.slug || product.id}`}>
                <Image
                  src={images[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={180}
                  height={180}
                  className={`${columnStyles.productImage} hoverable`}
                />
              </Link>
            </div>

            <div className={columnStyles.productInfo}>
              <Link
                href={dinero == 0 ? "" : `/productos/${product.slug || product.id}`}
                className={`${columnStyles.productName} hoverable`}
              >
                {product.name}
              </Link>

              <div className={columnStyles.productMeta}>
                {product.marca && <span className={columnStyles.productMarca}>{product.marca}</span>}
                {product.tipo && <span className={columnStyles.productTipo}>{product.tipo}</span>}
              </div>

              <p className={columnStyles.productDescription}>{product.description}</p>

              <div className={columnStyles.productRating}>
                <div className={columnStyles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < Math.floor(product.rating) ? columnStyles.starFilled : columnStyles.star}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className={columnStyles.reviewCount}>{product.reviews} opiniones</span>
              </div>

              {sabores.length > 0 && (
                <div className={columnStyles.productSabores}>
                  <span className={columnStyles.saboresLabel}>Sabores:</span>
                  <div className={columnStyles.saboresList}>
                    {sabores.map((sabor: string, index: number) => (
                      <span key={index} className={columnStyles.saborTag}>
                        {sabor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={columnStyles.productActions}>
              <div className={columnStyles.productPricing}>
                <div className={columnStyles.priceContainer}>
                  {finalDiscount > 0 ? (
                    <>
                      <span className={columnStyles.originalPrice}>{dinero == 0 ? "" : dinero}€</span>
                      <span className={columnStyles.offerPrice}>
                        {dinero == 0 ? "Fuera stock" : `${(dinero - (dinero * finalDiscount) / 100).toFixed(2)}€`}
                      </span>
                    </>
                  ) : (
                    <span className={columnStyles.offerPrice}>{dinero == 0 ? "Fuera stock" : `${dinero}€`}</span>
                  )}
                </div>
                {finalDiscount > 0 && (
                  <span className={hasEliteOffer ? styles.eliteDiscountBadge : styles.discountBadge}>
                    -{finalDiscount}%{hasEliteOffer && <span className={styles.eliteDiscountText}>ELITE</span>}
                  </span>
                )}
              </div>

              <div className={columnStyles.actionButtons}>
                <button
                  className={`${styles.actionButton} ${isFavorite ? styles.actionButtonFavorite : ""} hoverable`}
                  aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                  onClick={toggleFavorite}
                >
                  <Heart size={20} fill={isFavorite ? "red" : "none"} />
                </button>
                <button className={`${columnStyles.actionButtonPrimary} hoverable`} onClick={togglePopup}>
                  <ShoppingCart size={20} />
                  <span>Añadir</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {showPopup && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContainer}>
              <button className={`${styles.closeButton} hoverable`} onClick={togglePopup}>
                <X size={30} />
              </button>
              <PopUpSelectorPrecioSabor producto={product} onClose={togglePopup} />
            </div>
          </div>
        )}
      </>
    )
  }

  // Modo de visualización por defecto (grid)
  return (
    <>
      <StockAutoSelector
        productId={product.id}
        onFound={({ price, offer }) => {
          setDinero(price)
          setOferta(offer)
        }}
      />
      <div className={cardClassName}>
        {product.badge && (
          <span className={`${styles.productBadge} ${styles[`badge${product.badge.replace(/\s+/g, "")}`]}`}>
            {product.badge}
          </span>
        )}

        {/* Badge Elite */}
        {hasEliteOffer && (
          <div className={styles.eliteBadge}>
            <Crown size={12} className={styles.eliteIcon} />
            ELITE
          </div>
        )}

        <div className={styles.productImageContainer}>
          <Link href={dinero == 0 ? "" : `/productos/${product.slug || product.id}`}>
            <Image
              src={images[0] || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className={`${styles.productImage} hoverable`}
            />
          </Link>

          <div className={styles.productActions}>
            <button
              className={`${styles.actionButton} ${isFavorite ? styles.actionButtonFavorite : ""} hoverable`}
              aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              onClick={toggleFavorite}
            >
              <Heart size={20} fill={isFavorite ? "red" : "none"} />
            </button>
            <button className={`${styles.actionButtonPrimary} hoverable`} onClick={togglePopup}>
              <ShoppingCart size={20} />
              <span>Añadir</span>
            </button>
          </div>
        </div>

        <div className={styles.productInfo}>
          <Link
            href={dinero == 0 ? "" : `/productos/${product.slug || product.id}`}
            className={`${styles.productName} hoverable`}
          >
            {product.name}
          </Link>
          <p className={styles.productDescription}>{product.description}</p>

          <div className={styles.productRating}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? styles.starFilled : styles.star}>
                  ★
                </span>
              ))}
            </div>
            <span className={styles.reviewCount}>{product.reviews} opiniones</span>
          </div>

          <div className={styles.productPricing}>
            <div className={styles.priceContainer}>
              {finalDiscount > 0 ? (
                <>
                  <span className={styles.originalPrice}>{dinero == 0 ? "" : dinero}€</span>
                  <span className={styles.offerPrice}>
                    {dinero == 0 ? "Fuera stock" : `${(dinero - (dinero * finalDiscount) / 100).toFixed(2)}€`}
                  </span>
                </>
              ) : (
                <span className={styles.offerPrice}>{dinero == 0 ? "Fuera stock" : `${dinero}€`}</span>
              )}
            </div>
            {finalDiscount > 0 && (
              <span className={hasEliteOffer ? styles.eliteDiscountBadge : styles.discountBadge}>
                -{finalDiscount}%{hasEliteOffer && <span className={styles.eliteDiscountText}>ELITE</span>}
              </span>
            )}
          </div>
        </div>
      </div>
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContainer}>
            <button className={`${styles.closeButton} hoverable`} onClick={togglePopup}>
              <X size={30} />
            </button>
            <PopUpSelectorPrecioSabor producto={product} onClose={togglePopup} />
          </div>
        </div>
      )}
    </>
  )
}
