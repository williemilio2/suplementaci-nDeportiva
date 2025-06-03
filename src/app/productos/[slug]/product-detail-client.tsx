"use client"

import type React from "react"

import Link from "next/link"
import Image from 'next/image'
import CustomCursor from "../../../components/customCursor"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Heart, Share2, Truck, Shield, Star, StarHalf, Minus, Plus } from "lucide-react"
import { sacarStockSeguro } from "../../../products/listaArchivos"
import ProductSlider from "../../../components/product-slider"
import ProductOptions from "../../../components/product-options"
import ProductosSimilares from "@/src/components/productosSimilares"
import OpinionesClientes from "@/src/components/opinionesClientes"
import { useElite } from "@/src/components/eliteContent"
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'; // npm i js-cookie
import { useCompraStore } from '@/src/components/useCompraStore'
import type { Product } from "../../../types/product"

// Estilos
import styles from "../../../styles/ProductDetail.module.css"

interface StockItem {
  product_id: number
  sabor: string
  tamano: string
  cantidad: number
  precio: number
  oferta?: number
}
export default function ProductDetailClient({ producto }: { producto: Product }) {
  // Estados para datos
  const [stockProductoActual, setStockProductoActual] = useState<StockItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [finalDiscount, setFinalDiscount] = useState(0)
  const router = useRouter()
  // Usar el contexto Elite
  const { isElite } = useElite()

  // Referencias para controlar la carga
  const loadingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCount = useRef(0)
  const maxRetries = 3

  // Detectar cuando el componente está montado en el cliente
  useEffect(() => {
    console.log(producto)
    setMounted(true)
    return () => {
      setMounted(false)
      // Limpiar timeouts al desmontar
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Cargar datos de stock e información nutricional
  useEffect(() => {
    // No hacer nada si no estamos montados den el cliente
    if (!mounted) return

    // Evitar cargas múltiples simultáneas
    if (loadingRef.current) return

    const loadProductData = async () => {
      // Marcar como cargando
      loadingRef.current = true
      setIsLoading(true)
      setError(null)

      try {
        // Cargar información nutricional usando la versión segura

        // Cargar stock usando la versión segura
        const stock = await sacarStockSeguro(producto.id)
        if (stock) {
          setStockProductoActual(stock.filter((item) => item.product_id === producto.id))
        }

        // Resetear contador de reintentos si todo va bien
        retryCount.current = 0
      } catch (error) {
        console.error("Error al cargar datos del producto:", error)
        setError("Error al cargar datos del producto. Por favor, inténtalo de nuevo.")

        // Reintentar si no hemos excedido el máximo de reintentos
        if (retryCount.current < maxRetries) {
          retryCount.current++
          // Reintentar con backoff exponencial
          const retryDelay = Math.min(1000 * Math.pow(2, retryCount.current), 10000)
          timeoutRef.current = setTimeout(loadProductData, retryDelay)
        }
      } finally {
        setIsLoading(false)

        // Establecer un timeout para liberar el flag de carga
        // Esto evita múltiples cargas rápidas consecutivas
        timeoutRef.current = setTimeout(() => {
          loadingRef.current = false
        }, 500)
      }
    }

    // Iniciar carga de datos
    loadProductData()

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [producto.id, mounted])

  // Función para copiar URL al portapapeles
  const copiarAlPortapapeles = async () => {
    if (typeof navigator === "undefined") return

    try {
      await navigator.clipboard.writeText(window.location.href)
      alert("¡URL copiada al portapapeles!")
    } catch (err) {
      alert("Error al copiar la URL")
      console.error(err)
    }
  }

  // Dividir imágenes y recomendaciones
  const imagenes = producto.image.split("<<<")

  // Estados para la UI
  const [activeTab, setActiveTab] = useState("descripcion")
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [precioUnitario, setPrecioUnitario] = useState<number | 0>(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [cantidadProductoActual, setCantidadProductoActual] = useState<number | null>(null)
  const [ofertaProductoActual, setOfertaProductoActual] = useState<number | null>(null)

  const handleBuy = () => {
  const token = Cookies.get('token');
  if (!token) {
    router.push('/auth/register');
    return;
  }

  const ofertaProducto = ofertaProductoActual ?? 0;
  const rebajaElite = producto.rebajasElite ?? 0;
  const oferta = isElite ? ofertaProducto + rebajaElite : ofertaProducto;

  const precioTotalPrt1 = precioUnitario * quantity;
  const precioConDescuento = precioTotalPrt1 * (1 - oferta / 100);

  alert(precioConDescuento);

  const carritoLimpio = [{ 
    producto: producto.name,
    cantidad: quantity,
    sabor: selectedFlavor ?? "",
    tamaño: selectedSize ?? "",
    precioTotal: precioConDescuento,
    finalDiscount: oferta,  // Ahora siempre número
    tipo: producto.tipo,
  }];

  useCompraStore.getState().generarDatosCompra(carritoLimpio);
  router.push('/checkout');
}
  // Calcular descuento final cuando cambian las ofertas
  useEffect(() => {
    let totalDiscount = ofertaProductoActual || 0

    // Si es Elite y el producto tiene rebajasElite, combinar descuentos
    if (isElite && producto.rebajasElite && producto.rebajasElite > 0) {
      totalDiscount = Math.min((ofertaProductoActual || 0) + producto.rebajasElite, 90)
    }

    setFinalDiscount(totalDiscount)
  }, [ofertaProductoActual, isElite, producto.rebajasElite])

  // Determinar si aplicar estilos Elite
  const hasEliteOffer = isElite && (producto.rebajasElite ?? 0) > 0


  // Manejar cambios de sabor y tamaño
  const handleFlavorSizeChange = (
    flavor: string | null,
    size: string | null,
    price: number,
    quantity: number | null,
    offer: number,
  ) => {
    setSelectedFlavor(flavor)
    setSelectedSize(size)
    setPrecioUnitario(price)
    if (flavor !== selectedFlavor || size !== selectedSize) {
      setQuantity(1)
    }
    setCantidadProductoActual(quantity)
    setOfertaProductoActual(offer)
  }

  // Añadir al carrito
  const handleAddToCart = (e: React.MouseEvent) => {
    if (!mounted) return
    e.stopPropagation()

    if (!selectedFlavor || !selectedSize) {
      alert("Por favor, selecciona sabor y tamaño antes de añadir al carrito")
      return
    }

    try {
      const carritoItem = {
        producto: producto.name,
        sabor: selectedFlavor,
        tamaño: selectedSize,
        cantidad: quantity,
      }

      type CarritoItem = {
        producto: string
        sabor: string
        tamaño: string
        cantidad: number
      }

      const carritoString = localStorage.getItem("carrito")
      const carritoActual: CarritoItem[] = carritoString ? JSON.parse(carritoString) : []

      const existente = carritoActual.find(
        (item) =>
          item.producto === carritoItem.producto &&
          item.sabor === carritoItem.sabor &&
          item.tamaño === carritoItem.tamaño,
      )

      if (existente) {
        alert("Este producto ya está en el carrito")
        return
      } else {
        alert("Producto añadido!")
        carritoActual.push(carritoItem)
      }

      localStorage.setItem("carrito", JSON.stringify(carritoActual))

      // Usar un try-catch para el evento por si acaso
      try {
        window.dispatchEvent(new Event("cartUpdated"))
      } catch (error) {
        console.error("Error al disparar evento cartUpdated:", error)
      }
    } catch (error) {
      console.error("Error al añadir al carrito:", error)
      alert("Error al añadir al carrito. Por favor, inténtalo de nuevo.")
    }
  }

  // Alternar favoritos
  const toggleFavorite = (e: React.MouseEvent) => {
    if (!mounted) return
    e.preventDefault()
    e.stopPropagation()

    try {
      const favoritosString = localStorage.getItem("favoritos")
      const favoritos: string[] = favoritosString ? JSON.parse(favoritosString) : []

      let nuevosFavoritos: string[]

      if (isFavorite) {
        // Quitar de favoritos
        nuevosFavoritos = favoritos.filter((nombre) => nombre !== producto.name)
      } else {
        // Añadir a favoritos
        nuevosFavoritos = [...favoritos, producto.name]
      }

      // Guardar en localStorage
      localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos))

      // Actualizar estado
      setIsFavorite(!isFavorite)

      // Disparar evento para que otros componentes puedan reaccionar
      try {
        window.dispatchEvent(new Event("favoritesUpdated"))
      } catch (error) {
        console.error("Error al disparar evento favoritesUpdated:", error)
      }
    } catch (error) {
      console.error("Error al actualizar favoritos:", error)
    }
  }

  // Verificar estado de favoritos
  useEffect(() => {
    if (!mounted) return

    const checkFavoriteStatus = () => {
      try {
        const favoritosString = localStorage.getItem("favoritos")
        const favoritos: string[] = favoritosString ? JSON.parse(favoritosString) : []
        setIsFavorite(favoritos.includes(producto.name))
      } catch (error) {
        console.error("Error al verificar favoritos:", error)
      }
    }

    checkFavoriteStatus()

    // Añadir un event listener para actualizar el estado si cambian los favoritos
    try {
      window.addEventListener("favoritesUpdated", checkFavoriteStatus)
    } catch (error) {
      console.error("Error al añadir event listener:", error)
    }

    return () => {
      try {
        window.removeEventListener("favoritesUpdated", checkFavoriteStatus)
      } catch (error) {
        console.error("Error al eliminar event listener:", error)
      }
    }
  }, [producto.name, mounted])

  // Mostrar pantalla de carga mientras se cargan los datos
  if (!mounted || isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando información del producto...</p>
        <div className={styles.spinner}></div>
      </div>
    )
  }

  // Mostrar error si lo hay
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button
          className={styles.retryButton}
          onClick={() => {
            loadingRef.current = false
            retryCount.current = 0
            setIsLoading(true)
            // Forzar recarga
            window.location.reload()
          }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <>
      <CustomCursor />
      <div className={styles.productDetailContainer}>
        {/* Breadcrumb y botón volver */}
        <div className={styles.breadcrumb}>
          <Link href="/" className={`${styles.backLink} hoverable`}>
            <span className={styles.backIcon}>←</span> Volver a productos
          </Link>
        </div>

        <div className={styles.productLayout}>
          {/* Columna izquierda - Galería de imágenes */}
          <motion.div
            className={styles.galleryColumn}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`${styles.productoPasarela} ${hasEliteOffer ? styles.eliteProductDetail : ""}`}>
              <div className={styles.badgeContainer}>
                {producto.badge && <span className={styles.badgeOverlay}>{producto.badge}</span>}
                {finalDiscount > 0 && (
                  <span className={hasEliteOffer ? styles.eliteDiscountOverlay : styles.discountOverlay}>
                    -{finalDiscount}%{hasEliteOffer && <span className={styles.eliteText}>ELITE</span>}
                  </span>
                )}
              </div>
              <ProductSlider images={imagenes} productName={producto.name} className="mb-8" />
            </div>
            <div className={styles.shareWishlist}>
              <button
                className={`${styles.iconButton} ${isFavorite ? styles.actionButtonFavorite : ""} hoverable`}
                onClick={toggleFavorite}
                aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                <Heart size={18} fill={isFavorite ? "red" : "none"} />
                <span style={{ color: isFavorite ? "red" : "" }}>Favorito</span>
              </button>
              <button className={`${styles.iconButton} hoverable`} onClick={copiarAlPortapapeles}>
                <Share2 size={18} />
                <span>Compartir</span>
              </button>
            </div>
          </motion.div>

          {/* Columna central - Información del producto */}
          <motion.div
            className={styles.infoColumn}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.productInfo}>
              {/* Nombre y badges */}
              <div>
                <div className={styles.brandBadge}>{producto.marca}</div>
                <h1 className={styles.productTitle}>{producto.name}</h1>
                <div className={styles.ratingContainer}>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const rating = Number(producto.rating)
                      const diff = rating - (star - 1)

                      let fillLevel = 0
                      if (diff >= 0.75) {
                        fillLevel = 1
                      } else if (diff >= 0.25) {
                        fillLevel = 0.5
                      }

                      if (fillLevel === 0.5) {
                        return (
                          <div key={star} style={{ position: "relative", transform: "translateY(2px)" }}>
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
                              style={{ position: "absolute", left: 0 }}
                            />
                          </div>
                        )
                      }

                      return (
                        <Star
                          key={star}
                          size={16}
                          className={`${styles.star} ${fillLevel === 1 ? styles.starFilled : styles.starEmpty}`}
                          fill={fillLevel > 0 ? "#FFA500" : "none"}
                          stroke={fillLevel > 0 ? "#FFA500" : "#ccc"}
                        />
                      )
                    })}
                    <span className={styles.reviewCount}>({producto.reviews} reseñas)</span>
                  </div>
                </div>
              </div>

              {/* Descripción corta */}
              <p className={styles.productDescription}>{producto.description}</p>

              {/* Opciones de producto */}
              <ProductOptions stockItems={stockProductoActual} onFlavorSizeChange={handleFlavorSizeChange} />
            </div>
          </motion.div>

          {/* Columna derecha - Compra */}
          <motion.div
            className={styles.buyColumn}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={`${styles.buyCard} ${hasEliteOffer ? styles.eliteBuyCard : ""}`}>
              {/* Precio */}
              <div className={styles.priceContainer}>
                {finalDiscount > 0 ? (
                  <>
                    <span className={`${styles.currentPrice} ${hasEliteOffer ? styles.elitePrice : ""}`}>
                      {precioUnitario == 0
                        ? "Sold out"
                        : `${(Number(precioUnitario) * (1 - finalDiscount / 100) * quantity).toFixed(2)}€`}
                    </span>
                    <span className={styles.originalPrice}>
                      {precioUnitario == 0 ? "" : `${Number(precioUnitario * quantity).toFixed(2)}€`}
                    </span>
                  </>
                ) : (
                  <span className={`${styles.currentPrice} ${hasEliteOffer ? styles.elitePrice : ""}`}>
                    {precioUnitario == 0 ? "Sold out" : `${Number(precioUnitario * quantity).toFixed(2)}€`}
                  </span>
                )}
              </div>
              <p className={styles.taxInfo}>IVA incluido</p>
              <div className={styles.quantitySection}>
                <h3 className={styles.sectionTitle}>Cantidad:</h3>
                <div className={styles.quantityControl}>
                  <button
                    className={`${styles.quantityButton} hoverable`}
                    onClick={() => {
                      if (quantity > 1) {
                        setQuantity((prev) => prev - 1)
                      }
                    }}
                    disabled={quantity <= 1 || selectedFlavor == null || selectedSize == null}
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.quantityValue}>{quantity}</span>
                  <button
                    className={`${styles.quantityButton} hoverable`}
                    onClick={() => setQuantity((prev) => prev + 1)}
                    disabled={selectedFlavor == null || selectedSize == null || cantidadProductoActual === quantity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              {/* Disponibilidad */}
              <div className={styles.availability}>
                <div className={styles.availabilityDot}></div>
                {cantidadProductoActual && cantidadProductoActual > 0
                  ? "En stock - Disponible para envío inmediato"
                  : "Fuera de stock - No disponible actualmente"}
              </div>

              {/* Botones de acción */}
              <div className={styles.actionButtons}>
                <button
                  className={`${styles.button} ${styles.primaryButton} ${hasEliteOffer ? styles.elitePrimaryButton : ""} hoverable`}
                  disabled={
                    selectedFlavor == null ||
                    selectedSize == null ||
                    (cantidadProductoActual !== null && cantidadProductoActual <= 0)
                  }
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={18} />
                  {selectedFlavor == null || selectedSize == null
                    ? "Selecciona un sabor y un tamaño"
                    : cantidadProductoActual !== null && cantidadProductoActual <= 0
                      ? "Fuera de stock"
                      : "Añadir al carrito"}
                </button>
                <button
                  onClick={
                    selectedFlavor == null ||
                    selectedSize == null ||
                    (cantidadProductoActual !== null && cantidadProductoActual <= 0)
                      ? undefined
                      : handleBuy
                  }
                  className={`${styles.button} ${styles.secondaryButton} ${hasEliteOffer ? styles.eliteSecondaryButton : ""} hoverable`}
                >
                  {selectedFlavor == null || selectedSize == null
                    ? "Selecciona un sabor y un tamaño"
                    : cantidadProductoActual !== null && cantidadProductoActual <= 0
                      ? "Fuera de stock"
                      : "Comprar"}
                </button>
              </div>

              {/* Envío y garantías */}
              <div className={styles.shippingInfo}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className={styles.infoTitle}>Envío gratuito</h4>
                    <p className={styles.infoText}>En pedidos superiores a 50€</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className={styles.infoTitle}>Garantía de calidad</h4>
                    <p className={styles.infoText}>Devolución garantizada durante 30 días</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Tabs de información detallada */}
        <ProductosSimilares
          producto={{
            id: producto.id,
            name: producto.name,
            categoriaEspecial: producto.categoriaEspecial,
            marca: producto.marca,
          }}
        />
        <motion.div
          className={styles.tabsSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.tabsContainer}>
            <div className={styles.tabsHeader}>
              <button
                className={`${styles.tabButton} ${activeTab === "descripcion" ? styles.tabButtonActive : "hoverable"}`}
                onClick={() => setActiveTab("descripcion")}
              >
                Descripción
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "ingredientes" ? styles.tabButtonActive : "hoverable"}`}
                onClick={() => setActiveTab("ingredientes")}
              >
                Ingredientes
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "modo-uso" ? styles.tabButtonActive : "hoverable"}`}
                onClick={() => setActiveTab("modo-uso")}
              >
                Modo de uso
              </button>
            </div>
            <div className={styles.tabContent}>
              {activeTab === "descripcion" && (
                <div>
                  <h3>Descripción detallada</h3>
                  <p>
                    Esta proteína de suero de alta calidad está diseñada para ayudarte a alcanzar tus objetivos de
                    fitness. Con una fórmula avanzada que proporciona 24g de proteína por servicio, es perfecta para
                    apoyar el crecimiento y la recuperación muscular.
                  </p>
                  <p>
                    Nuestra proteína se somete a un proceso de microfiltración que garantiza la máxima pureza y
                    biodisponibilidad, lo que significa que tu cuerpo puede absorber y utilizar más eficientemente los
                    aminoácidos esenciales.
                  </p>
                  <div className={styles.descripCionLabelsGrid}>
                    <div>
                      <p className={styles.metaLabel}>Marca</p>
                      <p className={styles.metaValue}>{producto.marca}</p>
                    </div>
                    <div>
                      <p className={styles.metaLabel}>Tipo</p>
                      <p className={styles.metaValue}>{producto.tipo}</p>
                    </div>
                  </div>
                    {producto.imagenInfoNutricional && (
                      <div className={styles.nutritionInfo}>
                        <h4>Información nutricional</h4>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                          <Image src={producto.imagenInfoNutricional} width={200} height={200} alt="Información nutricional" />
                        </div>
                      </div>
                    )}
                  </div>
              )}
              {activeTab === "ingredientes" && (
                <div>
                  <h3>Ingredientes</h3>
                  <p>{producto.infoIngredientes}</p>
                  <div className={styles.allergenInfo}>
                    <h4>Información sobre alérgenos</h4>
                    <p>{producto.informacionAlergenos}</p>
                  </div>
                </div>
              )}
              {activeTab === "modo-uso" && (
                <div>
                  <h3>Modo de uso</h3>
                  <p>{producto.modoDeUso}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        <OpinionesClientes productoId={producto.id} rating={producto.rating} totalReviews={producto.reviews} />
      </div>
    </>
  )
}
