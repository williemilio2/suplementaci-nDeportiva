
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import styles from "../styles/contenedorProducto.module.css"
import columnStyles from "../styles/product-column.module.css"

interface Producto {
  id: number;            // 'number' en lugar de 'string'
  name: string;          // 'string' en lugar de 'strnig'
  description: string;   // 'string' en lugar de 'strnig'
  originalPrice: number; // 'number' en lugar de 'float' (en JavaScript, 'float' es 'number')
  offerPrice?: number;    // 'number' en lugar de 'float'
  discount?: number;      // 'number' en lugar de 'float'
  image: string;       // 'string
  rating: number;        // 'number' en lugar de 'float'
  reviews: number;       // 'number' está bien
  badge?: string;         // 'string' en lugar de 'strnig'
  marca: string;         // 'string' en lugar de 'strnig'
  tipo: string;          // 'string' en lugar de 'strnig'
  colesterol: string;    // 'string' en lugar de 'strnig'
  superOfertas?: boolean; // 'boolean' en lugar de 'bool'
  slug: string;          // 'string' en lugar de 'strnig'
  informacionAlergenos: string;
  infoIngredientes: string;
  modoDeUso: string;
  recomendacionesDeUso: string;
  sabores: string;
}
interface OfferProductCardProps {
  product: Producto
  displayMode?: "grid" | "column"
}

export default function OfferProductCard({ product, displayMode = "grid" }: OfferProductCardProps) {
  // Procesar imágenes múltiples si existen
  const images = product.image ? product.image.split("<<<") : ["/placeholder.svg?height=300&width=300"]

  // Procesar otros campos que pueden ser listas
  const sabores = product.sabores ? product.sabores.split("<<<") : []

  // Función para cambiar la imagen mostrada

  // Si el modo de visualización es columna, usar el estilo de columna
  if (displayMode === "column") {
    return (
      <div className={`${styles.productCard} ${product.superOfertas ? styles.productCardGlow : ""}`}>
        <div className={columnStyles.productContent}>
          <div className={columnStyles.productImageContainer}>
            {product.badge && (
              <span
                className={`${columnStyles.productBadge} ${columnStyles[`badge${product.badge.replace(/\s+/g, "")}`]}`}
              >
                {product.badge}
              </span>
            )}

            <Link href={`/productos/${product.slug || product.id}`}>
              <Image
                src={images[0] || "/placeholder.svg"}
                alt={product.name}
                width={180}
                height={180}
                className={columnStyles.productImage}
              />
            </Link>
          </div>

          <div className={columnStyles.productInfo}>
            <Link href={`/productos/${product.slug || product.id}`} className={columnStyles.productName}>
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
                {product.offerPrice ? (
                  <>
                    <span className={columnStyles.originalPrice}>{product.originalPrice.toFixed(2)}€</span>
                    <span className={columnStyles.offerPrice}>{product.offerPrice.toFixed(2)}€</span>
                  </>
                ) : (
                  <span className={columnStyles.offerPrice}>{product.originalPrice.toFixed(2)}€</span>
                )}
              </div>
              {product.offerPrice && <span className={columnStyles.discountBadge}>-{product.discount}%</span>}
            </div>

            <div className={columnStyles.actionButtons}>
              <button className={columnStyles.actionButton} aria-label="Añadir a favoritos">
                <Heart size={20} />
              </button>
              <button className={columnStyles.actionButtonPrimary}>
                <ShoppingCart size={20} />
                <span>Añadir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Modo de visualización por defecto (grid)
  return (
    <div className={`${styles.productCard} ${product.superOfertas ? styles.productCardGlow : ""}`}>
      {product.badge && (
        <span className={`${styles.productBadge} ${styles[`badge${product.badge.replace(/\s+/g, "")}`]}`}>
          {product.badge}
        </span>
      )}

      <div className={styles.productImageContainer}>
        <Link href={`/productos/${product.slug || product.id}`}>
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className={styles.productImage}
          />
        </Link>

        <div className={styles.productActions}>
          <button className={styles.actionButton} aria-label="Añadir a favoritos">
            <Heart size={20} />
          </button>
          <button className={styles.actionButtonPrimary}>
            <ShoppingCart size={20} />
            <span>Añadir</span>
          </button>
        </div>
      </div>

      <div className={styles.productInfo}>
        <Link href={`/productos/${product.slug || product.id}`} className={styles.productName}>
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
