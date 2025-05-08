"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import styles from "../styles/contenedorProducto.module.css"

export default function OfferProductCard({ product }) {
  return (
    <div className={`${styles.productCard} ${product.superOfertas ? styles.productCardGlow : ""}`}>
      {product.badge && (
        <span className={`${styles.productBadge} ${styles[`badge${product.badge.replace(/\s+/g, "")}`]}`}>
          {product.badge}
        </span>
      )}

      <div className={styles.productImageContainer}>
        <Link href={`/productos/${product.slug}`}>
          <Image
            src={product.image[0] || "https://via.placeholder.com/300"}
            alt={product.name}
            width={300}
            height={300}
            className={`${styles.productImage} hoverable`}
          />
        </Link>
        <div className={styles.productActions}>
          <button className={styles.actionButton} aria-label="Añadir a favoritos">
            <Heart size={20} onClick={() => alert(product.name)} />
          </button>
          <button className={styles.actionButtonPrimary}>
            <ShoppingCart size={20} />
            <span>Añadir</span>
          </button>
        </div>
      </div>

      <div className={styles.productInfo}>
        <Link href={`/producto/${product.id}`} className={styles.productName}>
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
            {product.offerPrice ? (
              <>
                <span className={styles.originalPrice}>{product.originalPrice.toFixed(2)}€</span>
                <span className={styles.offerPrice}>{product.offerPrice.toFixed(2)}€</span>
              </>
            ) : (
              <span className={styles.offerPrice}>{product.originalPrice.toFixed(2)}€</span>
            )}
          </div>
          {product.offerPrice && <span className={styles.discountBadge}>-{product.discount}%</span>}
        </div>
      </div>
    </div>
  )
}
