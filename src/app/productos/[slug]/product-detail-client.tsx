"use client"

import Link from "next/link"
import CustomCursor from "../../../components/customCursor"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Heart, Share2, Truck, Shield, Star, StarHalf, Minus, Plus } from "lucide-react"
import { sacarStock, sacarInformacionNutricional } from "../../../products/listaArchivos"
import ProductSlider from "../../../components/product-slider"
import ProductOptions from "../../../components/product-options"

// Estilos
import styles from "../../../styles/ProductDetail.module.css"
{
  /*PARA AÑADIR A UN FUTURO, QUE LAS COSAS ESTAS Q NO LE IMPORTAN A NADIE VAYAN MAS ABAJO, Y ABAJO DE ESTO LOS RELACIONADOS*/
}
{
  /*TAMBIEN AÑADIR UNA Q PONGA PACKS, Y SI TIENE UN PACK EN PLAN PILLA ESTA Y ESTA JUNTAS Y AHORRASM PUES LO METO arribo  DE LOS RELACIONADOS*/
}
{
  /*Hacer que si le das click a la imagen se haga grande position abosulte*/
}
{
  /*Ordenar un poco tood */
}
{
  /*Lo de las reseñas ya es para mucho mucho alante*/
}

interface Producto {
  id: number // 'number' en lugar de 'string'
  name: string // 'string' en lugar de 'strnig'
  description: string // 'string' en lugar de 'strnig'
  image: string // 'string
  rating: number // 'number' en lugar de 'float'
  reviews: number // 'number' está bien
  badge?: string // 'string' en lugar de 'strnig'
  marca: string // 'string' en lugar de 'strnig'
  tipo: string // 'string' en lugar de 'strnig'
  colesterol: string // 'string' en lugar de 'strnig'
  superOfertas?: boolean // 'boolean' en lugar de 'bool'
  slug: string // 'string' en lugar de 'strnig'
  informacionAlergenos: string
  infoIngredientes: string
  modoDeUso: string
  recomendacionesDeUso: string
}

export default function ProductDetailClient({ producto }: { producto: Producto }) {
  //Sacamos la inforamcion nutricional y le quitamos el primer valor q es id: numero
  const stockInformacionNutricionalActualEntero = sacarInformacionNutricional(producto.id)?.[0]
  const stockInformacionNutricionalActual = stockInformacionNutricionalActualEntero
    ? Object.fromEntries(Object.entries(stockInformacionNutricionalActualEntero).slice(1))
    : undefined

  interface stockInformacionNutricionalActual {
    product_id: number
    porcion: string
    calorias: string
    proteinas: string
    carbohidratos: string
    azucares: string
    grasas: string
    grasasSaturadas: string
    fibra: string
    sal: string
    sodio: string
    calcio: string
    hierro: string
    vitaminaD: string
    vitaminaB12: string
    enzimasDigestivas: string
    aminoacidos: string
  }
  //Dividir imagenes
  const imagenes = producto.image.split("<<<")
  //Dividir recomendaciones de uso
  const recomendacionesDeUsoLista = producto.recomendacionesDeUso.split("<<<")
  //Ordenar sabores y tamanos desde el objeto stock
  const stockProductoActual = sacarStock(producto.id)
  const itemsDelProducto = stockProductoActual?.filter((item) => item.product_id === producto.id)

  //UseStates
  const [activeTab, setActiveTab] = useState("descripcion")
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [precioUnitario, setPrecioUnitario] = useState<number | 0>(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [cantidadProductoActual, setCantidadProductoActual] = useState<number | null>(null)
  const [ofertaProductoActual, setOfertaProductoActual] = useState<number | null>(null)

  // Manejar cambios de sabor y tamaño
  const handleFlavorSizeChange = (flavor: string | null, size: string | null, price: number, quantity: number | null, offer: number) => {
    setSelectedFlavor(flavor)
    setSelectedSize(size)
    setPrecioUnitario(price)
    if (flavor !== selectedFlavor || size !== selectedSize) {
      setQuantity(1)
    }
    setCantidadProductoActual(quantity)
    setOfertaProductoActual(offer)
  }
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!selectedFlavor || !selectedSize) {
      alert("Por favor, selecciona sabor y tamaño antes de añadir al carrito")
      return
    }

    const carritoItem = {
      producto: producto.name,
      sabor: selectedFlavor,
      tamaño: selectedSize,
      cantidad: quantity,
    }

    type CarritoItem = {
      producto: string;
      sabor: string;
      tamaño: string;
      cantidad: number;
    };

    const carritoString = localStorage.getItem('carrito');
    const carritoActual: CarritoItem[] = carritoString ? JSON.parse(carritoString) : [];

    const existente = carritoActual.find(item =>
      item.producto === carritoItem.producto &&
      item.sabor === carritoItem.sabor &&
      item.tamaño === carritoItem.tamaño
    );

    if (existente) {
      alert('Este producto ya está en el carrito')
      return
    } else {
      alert('Producto añadido!')
      carritoActual.push(carritoItem);
    }

    localStorage.setItem('carrito', JSON.stringify(carritoActual));
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const toggleFavorite = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const favoritosString = localStorage.getItem("favoritos")
      const favoritos: string[] = favoritosString ? JSON.parse(favoritosString) : []
      
      let nuevosFavoritos: string[]
      
      if (isFavorite) {
        // Quitar de favoritos
        nuevosFavoritos = favoritos.filter(nombre => nombre !== producto.name)
      } else {
        // Añadir a favoritos
        nuevosFavoritos = [...favoritos, producto.name]
      }
      
      // Guardar en localStorage
      localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos))
      
      // Actualizar estado
      setIsFavorite(!isFavorite)
      
      // Disparar evento para que otros componentes puedan reaccionar
      window.dispatchEvent(new Event("favoritesUpdated"))
  }
  useEffect(() => {
    const checkFavoriteStatus = () => {
      const favoritosString = localStorage.getItem("favoritos")
      const favoritos: string[] = favoritosString ? JSON.parse(favoritosString) : []
      setIsFavorite(favoritos.includes(producto.name))
    }

    checkFavoriteStatus()
    
    // Añadir un event listener para actualizar el estado si cambian los favoritos
    window.addEventListener("favoritesUpdated", checkFavoriteStatus)
    
    return () => {
      window.removeEventListener("favoritesUpdated", checkFavoriteStatus)
    }
  }, [producto.id])
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
            <div className={styles.productoPasarela}>
              <div className={styles.badgeContainer}>
                {producto.badge && <span className={styles.badgeOverlay}>{producto.badge}</span>}
                {Number(ofertaProductoActual) > 0 && (
                  <span className={styles.discountOverlay}>-{Number(ofertaProductoActual)}%</span>
                )}
              </div>
              <ProductSlider images={imagenes} productName={producto.name} className="mb-8" />
            </div>
            <div className={styles.shareWishlist}>
              <button className={`${styles.iconButton} ${isFavorite ? styles.actionButtonFavorite : ''} hoverable`} onClick={toggleFavorite} aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}>
                <Heart size={18} fill={isFavorite ? "red" : "none"} />
                <span style={{color: isFavorite ? "red": ""}}>Favorito</span>
              </button>
              <button className={`${styles.iconButton} hoverable`}>
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
              <ProductOptions
                stockItems={itemsDelProducto}
                onFlavorSizeChange={handleFlavorSizeChange}
              />
            </div>
          </motion.div>

          {/* Columna derecha - Compra */}
          <motion.div
            className={styles.buyColumn}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={styles.buyCard}>
              {/* Precio */}
              <div className={styles.priceContainer}>
                {ofertaProductoActual!= 0 ? (
                  <>
                    <span className={styles.currentPrice}>{precioUnitario == 0 ? 'Sold out' : `${(Number(precioUnitario) * (1 - (ofertaProductoActual ?? 0) / 100) * quantity).toFixed(2)}€`}</span>
                    <span className={styles.originalPrice}>{precioUnitario == 0 ? '' : `${Number(precioUnitario).toFixed(2)}€`}</span>
                  </>
                ) : (
                  <span className={styles.currentPrice}>{precioUnitario == 0 ? 'Sold out' : `${Number(Number(precioUnitario) * quantity).toFixed(2)}€`}</span>
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
                En stock - Disponible para envío inmediato
              </div>

              {/* Botones de acción */}
              <div className={styles.actionButtons}>
                <button className={`${styles.button} ${styles.primaryButton} hoverable`} disabled={selectedFlavor == null || selectedSize == null} onClick={handleAddToCart}>
                  <ShoppingCart size={18} />
                 {(selectedFlavor == null || selectedSize == null) ? "Selecciona un sabor y un tamaño" : "Añadir al carrito" }
                </button>
                <Link href={(selectedFlavor == null || selectedSize == null) ? '' : '/checkout'} className={`${styles.button} ${styles.secondaryButton} hoverable`}>
                    {(selectedFlavor == null || selectedSize == null) ? "Selecciona un sabor y un tamaño" : "Comprar" }
                </Link>
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
              <button
                className={`${styles.tabButton} ${activeTab === "opiniones" ? styles.tabButtonActive : "hoverable"}`}
                onClick={() => setActiveTab("opiniones")}
              >
                Opiniones ({producto.reviews})
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
                    {producto.colesterol && (
                      <div>
                        <p className={styles.metaLabel}>Colesterol</p>
                        <p className={styles.metaValue}>{producto.colesterol}</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.nutritionInfo}>
                    <h4>Información nutricional (por servicio de {stockInformacionNutricionalActual?.porcion})</h4>
                    {stockInformacionNutricionalActual && (
                      <div className={styles.nutritionTable}>
                        {Object.entries(stockInformacionNutricionalActual).map(([key, value]) =>
                          key === "aminoacidos" ? (
                            <div className={styles.nutritionRowAminoacidos} key={key}>
                              <span className={styles.aminoacidos}>Aminoácidos:</span>
                              {(value as string).split(";").map((item: string, index: number) => {
                                const [nombre, cantidad] = item.split(":")
                                return (
                                  <div key={index} className={styles.nutritionRow}>
                                    <span style={{ paddingLeft: "20px" }}>{nombre.trim()}</span>
                                    <span>{cantidad.trim()}</span>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <div className={styles.nutritionRow} key={key}>
                              <span>{key}</span>
                              <span>{value}</span>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
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
                  <div className={styles.usageTips}>
                    <h4>Recomendaciones</h4>
                    <ul>
                      {recomendacionesDeUsoLista.map((recomendacion, index) => {
                        return <li key={index}>{recomendacion}</li>
                      })}
                      ;
                    </ul>
                  </div>
                </div>
              )}
              {activeTab === "opiniones" && (
                <div>
                  <h3>Opiniones de clientes</h3>
                  <div className={styles.reviewsSummary}>
                    <div className={styles.reviewsAverage}>
                      <span className={styles.bigRating}>{Number(producto.rating).toFixed(1)}</span>
                      <div className={styles.starsLarge}>
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
                              <div key={star} style={{ position: "relative" }}>
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
                      </div>
                      <span>Basado en {producto.reviews} opiniones</span>
                    </div>
                    <div className={styles.reviewsDistribution}>
                      <div className={styles.reviewBar}>
                        <span>5 estrellas</span>
                        <div className={styles.barContainer}>
                          <div className={styles.barFill} style={{ width: "70%" }}></div>
                        </div>
                        <span>70%</span>
                      </div>
                      <div className={styles.reviewBar}>
                        <span>4 estrellas</span>
                        <div className={styles.barContainer}>
                          <div className={styles.barFill} style={{ width: "20%" }}></div>
                        </div>
                        <span>20%</span>
                      </div>
                      <div className={styles.reviewBar}>
                        <span>3 estrellas</span>
                        <div className={styles.barContainer}>
                          <div className={styles.barFill} style={{ width: "7%" }}></div>
                        </div>
                        <span>7%</span>
                      </div>
                      <div className={styles.reviewBar}>
                        <span>2 estrellas</span>
                        <div className={styles.barContainer}>
                          <div className={styles.barFill} style={{ width: "2%" }}></div>
                        </div>
                        <span>2%</span>
                      </div>
                      <div className={styles.reviewBar}>
                        <span>1 estrella</span>
                        <div className={styles.barContainer}>
                          <div className={styles.barFill} style={{ width: "1%" }}></div>
                        </div>
                        <span>1%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
