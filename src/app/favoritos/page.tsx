"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2, Star, Tag, Info, X, Crown } from "lucide-react"
import CustomCursor from "@/src/components/customCursor"
import { favoritosFSeguro } from "../../products/listaArchivos"
import styles from "@/src/styles/Favoritos.module.css"
import PopUpSelectorPrecioSabor from "@/src/components/PopUpSelectorPrecioSabor"
import StockAutoSelector from "@/src/components/dineroDefault"
import { useElite } from "@/src/components/eliteContent"
import type { Product } from "../../types/product"


export default function Favoritos() {
  const [favoritos, setFavoritos] = useState<Product[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductInfo, setShowProductInfo] = useState<number | null>(null)
  const [stocks, setStocks] = useState<{ [productId: number]: { dinero: number; oferta: number } }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Usar el contexto Elite
  const { isElite } = useElite()

  const loadingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3

  function handleStockFound(productId: number, price: number, offer: number) {
    if (!dataLoaded) return

    setStocks((prev) => {
      const current = prev[productId]
      if (current?.dinero === price && current?.oferta === offer) {
        return prev // No cambios, evita render infinito
      }
      return { ...prev, [productId]: { dinero: price, oferta: offer } }
    })
  }

  // Función para calcular descuento final con Elite
  const calculateFinalDiscount = (producto: Product, regularOffer: number) => {
    let totalDiscount = regularOffer

    if (isElite && (producto.rebajasElite ?? 0) > 0) {
      totalDiscount = Math.min(regularOffer + (producto.rebajasElite ?? 0), 90) // Máximo 90% de descuento
    }

    return totalDiscount
  }

  // Función para cargar favoritos con retry y timeout
  const cargarFavoritos = async () => {
    // Evitar múltiples cargas simultáneas
    if (loadingRef.current) return

    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    loadingRef.current = true
    setLoading(true)
    setError(null)

    // Establecer un timeout para evitar carga infinita
    timeoutRef.current = setTimeout(() => {
      if (loading && loadingRef.current) {
        console.log("Timeout al cargar favoritos")
        loadingRef.current = false
        setLoading(false)
        setError("Tiempo de espera agotado. Intente nuevamente.")
      }
    }, 8000) // 8 segundos de timeout

    try {
      // Obtener favoritos del localStorage
      let favoritosIds: string[] = []

      if (typeof window !== "undefined") {
        const favoritosString = localStorage.getItem("favoritos")
        favoritosIds = favoritosString ? JSON.parse(favoritosString) : []
      }

      // Obtener productos completos
      const productosCompletos = await favoritosFSeguro(favoritosIds)

      setFavoritos(productosCompletos)
      setDataLoaded(true)
      retryCountRef.current = 0 // Resetear contador de reintentos
    } catch (error) {
      console.error("Error al cargar favoritos:", error)

      // Intentar nuevamente si no excedimos el máximo de reintentos
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++
        console.log(`Reintentando (${retryCountRef.current}/${maxRetries})...`)

        // Esperar un poco antes de reintentar
        setTimeout(() => {
          loadingRef.current = false
          cargarFavoritos()
        }, 1000 * retryCountRef.current) // Backoff exponencial

        return
      }

      setFavoritos([])
      setError("Error al cargar favoritos")
    } finally {
      // Limpiar timeout si aún existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      setLoading(false)
      loadingRef.current = false
    }
  }

  // Cargar favoritos al montar el componente
  useEffect(() => {
    // Resetear estado
    setFavoritos([])
    setError(null)
    setDataLoaded(false)
    loadingRef.current = false
    retryCountRef.current = 0

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Cargar favoritos con un pequeño delay para evitar problemas de timing
    const timer = setTimeout(() => {
      cargarFavoritos()
    }, 100)

    // Escuchar cambios en favoritos desde otros componentes
    const handleFavoritesUpdate = () => {
      if (!loadingRef.current) {
        cargarFavoritos()
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("favoritesUpdated", handleFavoritesUpdate)
    }

    return () => {
      clearTimeout(timer)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      loadingRef.current = false

      if (typeof window !== "undefined") {
        window.removeEventListener("favoritesUpdated", handleFavoritesUpdate)
      }
    }
  }, [])

  const eliminarDeFavoritos = (nombre: string) => {
    if (!dataLoaded) return

    try {
      // Obtener favoritos actuales
      if (typeof window === "undefined") return

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
    } catch (error) {
      console.error("Error al eliminar favorito:", error)
    }
  }

  const abrirPopupCarrito = (producto: Product) => {
    setSelectedProduct(producto)
    setShowPopup(true)
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden"
    }
  }

  const cerrarPopup = () => {
    setShowPopup(false)
    setSelectedProduct(null)
    if (typeof document !== "undefined") {
      document.body.style.overflow = "auto"
    }
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

  // Si hay un error, mostrar un mensaje pero seguir mostrando el componente
  if (error) {
    return (
      <div className={styles.favoritosContainer}>
        <CustomCursor />
        <div className={styles.favoritosHeader}>
          <h1 className={styles.favoritosTitle}>Tus Favoritos</h1>
          <div className={styles.favoritosInfo}>
            <Heart size={20} />
            <span>Error</span>
          </div>
        </div>
        <div className={styles.favoritosVacio}>
          <div className={styles.emptyStateIllustration}>
            <Heart size={48} strokeWidth={1.5} />
            <div className={styles.emptyStateCircle}></div>
          </div>
          <h2>Error al cargar favoritos</h2>
          <p>{error}</p>
          <button
            onClick={() => {
              loadingRef.current = false
              retryCountRef.current = 0
              cargarFavoritos()
            }}
            className={styles.retryButton}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Mostrar pantalla de carga mientras se cargan los productos
  if (loading) {
    return (
      <div className={styles.favoritosContainer}>
        <CustomCursor />
        <div className={styles.favoritosHeader}>
          <h1 className={styles.favoritosTitle}>Tus Favoritos</h1>
          <div className={styles.favoritosInfo}>
            <Heart size={20} />
            <span>Cargando...</span>
          </div>
        </div>
        <div className={styles.favoritosVacio}>
          <div className={styles.emptyStateIllustration}>
            <Heart size={48} strokeWidth={1.5} />
            <div className={styles.emptyStateCircle}></div>
          </div>
          <div className={styles.spinner}></div>
          <h2>Cargando favoritos...</h2>
          <p>Por favor espera un momento</p>
        </div>
      </div>
    )
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
          {isElite && (
            <div className={styles.eliteStatus}>
              <Crown size={16} />
              <span>Elite</span>
            </div>
          )}
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
          {favoritos.map((producto) => {
            const stockInfo = stocks[producto.id]
            const regularOffer = stockInfo?.oferta || 0
            const finalDiscount = calculateFinalDiscount(producto, regularOffer)
            const hasEliteOffer = isElite && (producto.rebajasElite ?? 0) > 0;

            return (
              <div key={producto.id} className={`${styles.favoritoCard} ${hasEliteOffer ? styles.eliteCard : ""}`}>
                <StockAutoSelector
                  productId={producto.id}
                  onFound={({ price, offer }) => handleStockFound(producto.id, price, offer)}
                />
                <div className={styles.favoritoHeader}>
                  <div className={styles.favoritoBadges}>
                    {producto.badge && <span className={styles.badge}>{producto.badge}</span>}
                    {finalDiscount > 0 && (
                      <span className={hasEliteOffer ? styles.eliteDiscountBadge : styles.discountBadge}>
                        -{finalDiscount}%{hasEliteOffer && <span className={styles.eliteText}>ELITE</span>}
                      </span>
                    )}
                  </div>
                  <button
                    className={`${styles.removeButton} hoverable`}
                    onClick={() => eliminarDeFavoritos(producto.name)}
                    aria-label="Eliminar de favoritos"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <Link
                  href={
                    stocks[producto.id]?.dinero === 0 || stocks[producto.id]?.dinero == null
                      ? ""
                      : `/productos/${producto.slug || producto.id}`
                  }
                >
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
                    <Link
                      href={
                        stocks[producto.id]?.dinero === 0 || stocks[producto.id]?.dinero == null
                          ? ""
                          : `/productos/${producto.slug || producto.id}`
                      }
                    >
                      {producto.name}
                    </Link>
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
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Valoración:</span>
                          <span>
                            {producto.rating.toFixed(1)} ({producto.reviews} opiniones)
                          </span>
                        </div>
                        {hasEliteOffer && (
                          <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Descuento Elite:</span>
                            <span className={styles.eliteDiscount}>+{producto.rebajasElite}% adicional</span>
                          </div>
                        )}
                      </div>
                      <div className={styles.saboresDisponibles}>
                        <span className={styles.infoLabel}>Sabores disponibles:</span>
                        <div className={styles.saboresList}>
                          {producto.sabores?.split("<<<").map((sabor, index) => (
                            <span key={index} className={styles.saborChip}>
                              {sabor}
                            </span>
                          )) ?? null}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.favoritoFooter}>
                    <div className={styles.favoritoPricing}>
                      {finalDiscount > 0 ? (
                        <>
                          <span className={styles.originalPrice}>
                            {stocks[producto.id]?.dinero === 0 ? "" : `${stocks[producto.id]?.dinero}€`}
                          </span>
                          <span className={`${styles.offerPrice} ${hasEliteOffer ? styles.elitePrice : ""}`}>
                            {stocks[producto.id]?.dinero === 0
                              ? "Fuera stock"
                              : `${(stocks[producto.id]?.dinero - (stocks[producto.id]?.dinero * finalDiscount) / 100).toFixed(2)}€`}
                          </span>
                        </>
                      ) : (
                        <span className={`${styles.offerPrice} ${hasEliteOffer ? styles.elitePrice : ""}`}>
                          {stocks[producto.id]?.dinero === 0 || stocks[producto.id]?.dinero == null
                            ? "Fuera stock"
                            : `${stocks[producto.id]?.dinero}€`}
                        </span>
                      )}
                    </div>

                    <button
                      className={`${styles.addToCartButton} ${hasEliteOffer ? styles.eliteButton : ""} hoverable`}
                      onClick={() => abrirPopupCarrito(producto)}
                      aria-label="Añadir al carrito"
                      disabled={stocks[producto.id]?.dinero === 0 || stocks[producto.id]?.dinero == null}
                    >
                      <ShoppingCart size={18} />
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
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
