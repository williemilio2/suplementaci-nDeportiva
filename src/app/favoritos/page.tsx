"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2, Star, Tag, Info, X } from "lucide-react"
import CustomCursor from "@/src/components/customCursor"
import { favoritosF } from "../../products/listaArchivos"
import styles from "@/src/styles/Favoritos.module.css"
import PopUpSelectorPrecioSabor from "@/src/components/PopUpSelectorPrecioSabor"
import StockAutoSelector from "@/src/components/dineroDefault"

// Tipo para los productos completos
type ProductoCompleto = {
  id: number
  name: string
  description: string
  image: string
  rating: number
  reviews: number
  badge?: string
  marca: string
  tipo: string
  colesterol: string
  superOfertas?: boolean
  slug: string
  informacionAlergenos: string
  infoIngredientes: string
  modoDeUso: string
  recomendacionesDeUso: string
  sabores: string
  categoriaEspecial?: string
}

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState<ProductoCompleto[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductoCompleto | null>(null)
  const [showProductInfo, setShowProductInfo] = useState<number | null>(null)
  const [stocks, setStocks] = useState<{ [productId: number]: { dinero: number; oferta: number } }>({})

  function handleStockFound(productId: number, price: number, offer: number) {
    setStocks(prev => {
      const current = prev[productId]
      if (current?.dinero === price && current?.oferta === offer) {
        return prev // No cambios, evita render infinito
      }
      return { ...prev, [productId]: { dinero: price, oferta: offer } }
    })
  }


  // Cargar favoritos desde localStorage
  const cargarFavoritos = () => {
    // Obtener favoritos del localStorage
    const favoritosString = localStorage.getItem("favoritos")
    const favoritosIds: string[] = favoritosString ? JSON.parse(favoritosString) : []

    // Obtener productos completos
    const productosCompletos = favoritosF(favoritosIds)
    console.log(productosCompletos)
    setFavoritos(productosCompletos)
  }

  useEffect(() => {
    cargarFavoritos()

    // Escuchar cambios en favoritos desde otros componentes
    window.addEventListener("favoritesUpdated", cargarFavoritos)

    return () => {
      window.removeEventListener("favoritesUpdated", cargarFavoritos)
    }
  }, [])

  const eliminarDeFavoritos = (nombre: string) => {
    // Obtener favoritos actuales
    const favoritosString = localStorage.getItem("favoritos")
    const favoritosNames: string[] = favoritosString ? JSON.parse(favoritosString) : []

    // Filtrar el ID a eliminar
    const nuevosFavoritosIds = favoritosNames.filter((favN) => favN !== nombre)

    // Guardar en localStorage
    localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritosIds))

    // Actualizar estado
    const nuevosFavoritos = favoritos.filter((producto) => producto.name !== nombre)
    setFavoritos(nuevosFavoritos)

    // Disparar evento para que otros componentes se actualicen
    window.dispatchEvent(new Event("favoritesUpdated"))
  }

  const abrirPopupCarrito = (producto: ProductoCompleto) => {
    setSelectedProduct(producto)
    setShowPopup(true)
    document.body.style.overflow = "hidden"
  }

  const cerrarPopup = () => {
    setShowPopup(false)
    setSelectedProduct(null)
    document.body.style.overflow = "auto"
  }

  const toggleProductInfo = (id: number) => {
    if (showProductInfo === id) {
      setShowProductInfo(null)
    } else {
      setShowProductInfo(id)
    }
  }

  // Obtener la primera imagen si hay varias
  const obtenerPrimeraImagen = (imagenString: string) => {
    return imagenString.split("<<<")[0]
  }

  return (
    <div className={styles.favoritosContainer}>
      <CustomCursor />

      <div className={styles.favoritosHeader}>
        <h1 className={styles.favoritosTitle}>Tus Favoritos</h1>
        <div className={styles.favoritosInfo}>
          <Heart size={20} />
          <span>
            {favoritos.length} {favoritos.length === 1 ? "producto" : "productos"}
          </span>
        </div>
      </div>

      {favoritos.length === 0 ? (
        <div className={styles.favoritosVacio}>
          <div className={styles.emptyStateIllustration}>
            <Heart size={48} strokeWidth={1.5} />
            <div className={styles.emptyStateCircle}></div>
          </div>
          <h2>No tienes productos favoritos</h2>
          <p>Añade productos a tus favoritos para encontrarlos fácilmente más tarde</p>
          <Link href="/" className={`${styles.browseButton} hoverable`}>
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className={styles.favoritosGrid}>
          {favoritos.map((producto) => (
            <div key={producto.id} className={styles.favoritoCard}>
              <StockAutoSelector
                productId={producto.id}
                onFound={({ price, offer }) => handleStockFound(producto.id, price, offer)}
              />
              <div className={styles.favoritoHeader}>
                <div className={styles.favoritoBadges}>
                  {producto.badge && <span className={styles.badge}>{producto.badge}</span>}
                  {stocks[producto.id]?.oferta  && <span className={styles.discountBadge}>-{stocks[producto.id].oferta}%</span>}
                </div>
                <button
                  className={`${styles.removeButton} hoverable`}
                  onClick={() => eliminarDeFavoritos(producto.name)}
                  aria-label="Eliminar de favoritos"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <Link href={stocks[producto.id]?.dinero === 0 || stocks[producto.id]?.dinero == null ? '' : `/productos/${producto.slug || producto.id}`}>
                <div className={`${styles.favoritoImageContainer} hoverable`}>
                    <Image
                      src={obtenerPrimeraImagen(producto.image) || "/placeholder.svg"}
                      width={180}
                      height={180}
                      alt={producto.name}
                      className={styles.favoritoImage}
                    />
                </div>
              </Link>

              <div className={styles.favoritoContent}>
                <div className={styles.favoritoMeta}>
                  {producto.marca && <span className={styles.favoritoMarca}>{producto.marca}</span>}
                  <div className={styles.favoritoRating}>
                    <Star size={14} fill="#FFA500" stroke="#FFA500" />
                    <span>{producto.rating.toFixed(1)}</span>
                  </div>
                </div>

                <h3 className={`${styles.favoritoName} hoverable`}>
                  <Link href={stocks[producto.id]?.dinero === 0 || stocks[producto.id]?.dinero == null ? '' : `/productos/${producto.slug || producto.id}`}>{producto.name}</Link>
                </h3>

                <p className={styles.favoritoDescription}>
                  {producto.description.length > 80
                    ? `${producto.description.substring(0, 80)}...`
                    : producto.description}
                </p>

                <div className={styles.favoritoTags}>
                  {producto.tipo && (
                    <span className={styles.favoritoTag}>
                      <Tag size={12} />
                      {producto.tipo}
                    </span>
                  )}
                  <button
                    className={`${styles.infoButton} hoverable`}
                    onClick={() => toggleProductInfo(producto.id)}
                    aria-label="Ver más información"
                  >
                    <Info size={14} />
                    Detalles
                  </button>
                </div>

                {showProductInfo === producto.id && (
                  <div className={`${styles.productInfoPopup} hoverable`}>
                    <button className={styles.closeInfoButton} onClick={() => setShowProductInfo(null)}>
                      <X size={16} />
                    </button>
                    <h4>Información del producto</h4>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Marca:</span>
                        <span>{producto.marca}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Tipo:</span>
                        <span>{producto.tipo}</span>
                      </div>
                      {producto.colesterol && (
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Colesterol:</span>
                          <span>{producto.colesterol}</span>
                        </div>
                      )}
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Valoración:</span>
                        <span>
                          {producto.rating.toFixed(1)} ({producto.reviews} opiniones)
                        </span>
                      </div>
                    </div>
                    <div className={styles.saboresDisponibles}>
                      <span className={styles.infoLabel}>Sabores disponibles:</span>
                      <div className={styles.saboresList}>
                        {producto.sabores.split("<<<").map((sabor, index) => (
                          <span key={index} className={styles.saborChip}>
                            {sabor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.favoritoFooter}>
                  <div className={styles.favoritoPricing}>
                    {stocks[producto.id]?.oferta ? (
                      <>
                        <span className={styles.originalPrice}>{stocks[producto.id]?.dinero == 0 ? '' : stocks[producto.id].dinero}€</span>
                        <span className={styles.offerPrice}>{stocks[producto.id]?.dinero == 0 ? 'Fuera stock' : `${(stocks[producto.id].dinero - (stocks[producto.id].dinero * stocks[producto.id].oferta / 100)).toFixed(2)}€`}</span>
                      </>
                    ) : (
                      <span className={styles.offerPrice}>
                        {stocks[producto.id]?.dinero === 0 || stocks[producto.id]?.dinero == null
                          ? 'Fuera stock'
                          : stocks[producto.id]?.dinero !== undefined}
                      </span>
                    )}
                  </div>

                  <button
                    className={`${styles.addToCartButton} hoverable`}
                    onClick={() => abrirPopupCarrito(producto)}
                    aria-label="Añadir al carrito"
                  >
                    <ShoppingCart size={18} />
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {favoritos.length > 0 && (
        <div className={styles.favoritosActions}>
          <Link href="/" className={`${styles.continueShopping} hoverable`}>
            ← Seguir comprando
          </Link>
        </div>
      )}

      {/* Popup para añadir al carrito */}
      {showPopup && selectedProduct && (
        <div className={styles.popupOverlay} onClick={cerrarPopup}>
          <div className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={cerrarPopup}>
              <X size={24} />
            </button>
            <PopUpSelectorPrecioSabor producto={selectedProduct} onClose={cerrarPopup} />
          </div>
        </div>
      )}
    </div>
  )
}
