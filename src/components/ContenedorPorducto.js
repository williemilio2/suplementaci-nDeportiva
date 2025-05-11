"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, StarHalf } from "lucide-react"
import styles from "../styles/contenedorProducto.module.css"

export default function OfferProductCard({ product }) {
  const imagenSplit = product.image.split('<<<')
  const imagen = imagenSplit[0]
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
            src={imagen || "https://via.placeholder.com/300"}
            alt={product.name}
            width={300}
            height={300}
            className={`${styles.productImage} hoverable`}
          />
        </Link>
        <div className={styles.productActions}>
          <button className={`${styles.actionButton} hoverable`} aria-label="Añadir a favoritos">
            <Heart size={20} onClick={() => alert(product.rating)} />
          </button>
          <button className={`${styles.actionButtonPrimary} hoverable`}>
            <ShoppingCart size={20} />
            <span>Añadir</span>
          </button>
        </div>
      </div>

      <div className={styles.productInfo}>
        <Link href={`/producto/${product.id}`} className={`${styles.productName} hoverable`}>
          {product.name}
        </Link>
        <p className={styles.productDescription}>{product.description}</p>

        <div className={styles.productRating}>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => {
              const rating = Number(product.rating);
              const diff = rating - (star - 1);

              let fillLevel = 0;
              if (diff >= 0.75) {
                fillLevel = 1;
              } else if (diff >= 0.25) {
                fillLevel = 0.5;
              }

              if (fillLevel === 0.5) {
                return (
                  <div key={star} style={{position: 'relative'}}>
                    <StarHalf
                      size={16}
                      className={`${styles.star} ${styles.starFilled}`}
                      fill="#FFA500"
                      stroke="#ccc"
                    />
                    
                    <StarHalf
                      size={16}
                      className={`${styles.starMirror}`}
                      fill="none"
                      stroke="#ccc"
                      style={{ position: 'absolute', left: 0 }}
                    />
                  </div>
                );
              }

              return (
                <Star
                  key={star}
                  size={16}
                  className={`${styles.star} ${
                    fillLevel === 1 ? styles.starFilled : styles.starEmpty
                  }`}
                  fill={fillLevel > 0 ? "#FFA500" : "none"}
                  stroke={fillLevel > 0 ? "#FFA500" : "#ccc"}
                />
              );
            })}
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
