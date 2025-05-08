"use client"

import Link from "next/link"
import CustomCursor from "../../../components/customCursor"
import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Heart, Share2, Truck, Shield, Star, Minus, Plus } from "lucide-react"

// Estilos
import styles from "../../../styles/ProductDetail.module.css"
{/*PARA AÑADIR A UN FUTURO, QUE LAS COSAS ESTAS Q NO LE IMPORTAN A NADIE VAYAN MAS ABAJO, Y ABAJO DE ESTO LOS RELACIONADOS*/}
{/*TAMBIEN AÑADIR UNA Q PONGA PACKS, Y SI TIENE UN PACK EN PLAN PILLA ESTA Y ESTA JUNTAS Y AHORRASM PUES LO METO arribo  DE LOS RELACIONADOS*/}
{/*Hacer que si le das click a la imagen se haga grande position abosulte*/}
{/*Ordenar un poco tood */}
{/*Lo de las reseñas ya es para mucho mucho alante*/}
interface Producto {
  id: number;            // 'number' en lugar de 'string'
  name: string;          // 'string' en lugar de 'strnig'
  description: string;   // 'string' en lugar de 'strnig'
  originalPrice: number; // 'number' en lugar de 'float' (en JavaScript, 'float' es 'number')
  offerPrice: number;    // 'number' en lugar de 'float'
  discount: number;      // 'number' en lugar de 'float'
  image: string[];       // 'string[]' para un array de cadenas de texto
  rating: number;        // 'number' en lugar de 'float'
  reviews: number;       // 'number' está bien
  badge: string;         // 'string' en lugar de 'strnig'
  marca: string;         // 'string' en lugar de 'strnig'
  tipo: string;          // 'string' en lugar de 'strnig'
  colesterol: string;    // 'string' en lugar de 'strnig'
  superOfertas?: boolean; // 'boolean' en lugar de 'bool'
  slug: string;          // 'string' en lugar de 'strnig'
  cantidad: number;      // 'number' está bien
  informacionAlergenos: string;
  infoIngredientes: string;
  modoDeUso: string;
}

export default function ProductDetailClient({ producto }: { producto: Producto }) {
  const [activeTab, setActiveTab] = useState("descripcion")
  const [quantity, setQuantity] = useState(1)
  const [selectedFlavor, setSelectedFlavor] = useState("Chocolate")
  const [selectedSize, setSelectedSize] = useState("1kg")

  // Sabores disponibles (ejemplo)
  const sabores = [
    { id: 1, name: "Chocolate", isAvailable: true },
    { id: 2, name: "Vainilla", isAvailable: true },
    { id: 3, name: "Fresa", isAvailable: true },
    { id: 4, name: "Cookies & Cream", isAvailable: false },
    { id: 5, name: "Plátano", isAvailable: true },
  ]

  // Tamaños disponibles (ejemplo)
  const tamaños = [
    { id: 1, name: "500g", isAvailable: true },
    { id: 2, name: "1kg", isAvailable: true },
    { id: 3, name: "2kg", isAvailable: true },
    { id: 4, name: "5kg", isAvailable: false },
  ]

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <>
      <CustomCursor />
      <div className={styles.productDetailContainer}>
        {/* Breadcrumb y botón volver */}
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.backLink}>
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
                {Number(producto.discount) > 0 && (
                  <span className={styles.discountOverlay}>-{Number(producto.discount)}%</span>
                )}
              </div>
              <Image
                src={producto.image[0] || "/placeholder.svg"}
                width={500}
                height={500}
                alt={producto.name}
                className={styles.productImage}
              />
              <div className={styles.imageControls}>
                <button className={styles.imageControlActive}></button>
                <button className={styles.imageControl}></button>
                <button className={styles.imageControl}></button>
              </div>
            </div>
            <div className={styles.shareWishlist}>
              <button className={styles.iconButton}>
                <Heart size={18} />
                <span>Favorito</span>
              </button>
              <button className={styles.iconButton}>
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
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${styles.star} ${star <= Math.round(Number(producto.rating)) ? styles.starFilled : styles.starEmpty}`}
                        fill={star <= Math.round(Number(producto.rating)) ? "#FFA500" : "none"}
                        stroke={star <= Math.round(Number(producto.rating)) ? "#FFA500" : "#ccc"}
                      />
                    ))}
                    <span className={styles.reviewCount}>({producto.reviews} reseñas)</span>
                  </div>
                </div>
              </div>

              {/* Descripción corta */}
              <p className={styles.productDescription}>{producto.description}</p>

              {/* Variantes/Sabores */}
              <div className={styles.variantsSection}>
                <h3 className={styles.sectionTitle}>Sabor:</h3>
                <div className={styles.flavorOptions}>
                  {sabores.map((sabor) => (
                    <button
                      key={sabor.id}
                      className={`${styles.flavorButton} ${selectedFlavor === sabor.name ? styles.flavorButtonActive : ""} ${!sabor.isAvailable ? styles.flavorButtonDisabled : ""}`}
                      onClick={() => sabor.isAvailable && setSelectedFlavor(sabor.name)}
                      disabled={!sabor.isAvailable}
                    >
                      {sabor.name}
                      {!sabor.isAvailable && <span className={styles.unavailableText}>Agotado</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tamaños */}
              <div className={styles.variantsSection}>
                <h3 className={styles.sectionTitle}>Tamaño:</h3>
                <div className={styles.sizeOptions}>
                  {tamaños.map((tamaño) => (
                    <button
                      key={tamaño.id}
                      className={`${styles.sizeButton} ${selectedSize === tamaño.name ? styles.sizeButtonActive : ""} ${!tamaño.isAvailable ? styles.sizeButtonDisabled : ""}`}
                      onClick={() => tamaño.isAvailable && setSelectedSize(tamaño.name)}
                      disabled={!tamaño.isAvailable}
                    >
                      {tamaño.name}
                      {!tamaño.isAvailable && <span className={styles.unavailableText}>Agotado</span>}
                    </button>
                  ))}
                </div>
              </div>
              





              {/* Marca y tipo ^)P^*/}
              <div className={styles.productMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Marca:</span>
                  <span className={styles.metaValue}>{producto.marca}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Tipo:</span>
                  <span className={styles.metaValue}>{producto.tipo}</span>
                </div>
                {producto.colesterol && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Colesterol:</span>
                    <span className={styles.metaValue}>{producto.colesterol}</span>
                  </div>
                )}
              </div>
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
                <span className={styles.currentPrice}>{Number(producto.offerPrice).toFixed(2)}€</span>
                <span className={styles.originalPrice}>{Number(producto.originalPrice).toFixed(2)}€</span>
              </div>
              <p className={styles.taxInfo}>IVA incluido</p>

              {/* Disponibilidad */}
              <div className={styles.availability}>
                <div className={styles.availabilityDot}></div>
                En stock - Disponible para envío inmediato
              </div>

              {/* Cantidad */}
              <div className={styles.quantitySection}>
                <h3 className={styles.sectionTitle}>Cantidad:</h3>
                <div className={styles.quantityControl}>
                  <button className={styles.quantityButton} onClick={decrementQuantity} disabled={quantity <= 1}>
                    <Minus size={16} />
                  </button>
                  <span className={styles.quantityValue}>{quantity}</span>
                  <button className={styles.quantityButton} onClick={incrementQuantity}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Botones de acción */}
              <div className={styles.actionButtons}>
                <button className={`${styles.button} ${styles.primaryButton}`}>
                  <ShoppingCart size={18} />
                  Añadir al carrito
                </button>
                <button className={`${styles.button} ${styles.secondaryButton}`}>Comprar ahora</button>
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
                className={`${styles.tabButton} ${activeTab === "descripcion" ? styles.tabButtonActive : ""}`}
                onClick={() => setActiveTab("descripcion")}
              >
                Descripción
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "ingredientes" ? styles.tabButtonActive : ""}`}
                onClick={() => setActiveTab("ingredientes")}
              >
                Ingredientes
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "modo-uso" ? styles.tabButtonActive : ""}`}
                onClick={() => setActiveTab("modo-uso")}
              >
                Modo de uso
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "opiniones" ? styles.tabButtonActive : ""}`}
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
                  <div className={styles.nutritionInfo}>
                    <h4>Información nutricional (por servicio de 30g)</h4>
                    <div className={styles.nutritionTable}>
                      <div className={styles.nutritionRow}>
                        <span>Proteínas</span>
                        <span>24g</span>
                      </div>
                      <div className={styles.nutritionRow}>
                        <span>Carbohidratos</span>
                        <span>3g</span>
                      </div>
                      <div className={styles.nutritionRow}>
                        <span>- de los cuales azúcares</span>
                        <span>1.5g</span>
                      </div>
                      <div className={styles.nutritionRow}>
                        <span>Grasas</span>
                        <span>1.8g</span>
                      </div>
                      <div className={styles.nutritionRow}>
                        <span>- de las cuales saturadas</span>
                        <span>1.1g</span>
                      </div>
                      <div className={styles.nutritionRow}>
                        <span>Sal</span>
                        <span>0.25g</span>
                      </div>
                      <div className={styles.nutritionRow}>
                        <span>Calorías</span>
                        <span>120 kcal</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "ingredientes" && (
                <div>
                  <h3>Ingredientes</h3>
                  <p>
                    Concentrado de proteína de suero de leche (contiene emulsionante: lecitina de soja), aislado de
                    proteína de suero de leche (90%), cacao en polvo (10%), aromas, espesantes (goma xantana, goma
                    guar), edulcorantes (sucralosa, acesulfamo K), sal, enzimas digestivas (bromelina, papaína).
                  </p>
                  <div className={styles.allergenInfo}>
                    <h4>Información sobre alérgenos</h4>
                    <p>
                      Contiene leche y soja. Fabricado en instalaciones que también procesan huevo, gluten, frutos secos
                      y cacahuetes.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "modo-uso" && (
                <div>
                  <h3>Modo de uso</h3>
                  <p>
                    Mezclar 1 cacito (30g) con 250-300ml de agua o leche. Agitar enérgicamente durante 10 segundos o
                    hasta que se disuelva por completo.
                  </p>
                  <div className={styles.usageTips}>
                    <h4>Recomendaciones</h4>
                    <ul>
                      <li>Tomar 1-3 veces al día, según necesidades proteicas</li>
                      <li>Ideal después del entrenamiento para maximizar la recuperación</li>
                      <li>Puede tomarse entre comidas como snack proteico</li>
                      <li>Conservar en lugar fresco y seco</li>
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
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            className={`${styles.star} ${star <= Math.round(Number(producto.rating)) ? styles.starFilled : styles.starEmpty}`}
                            fill={star <= Math.round(Number(producto.rating)) ? "#FFA500" : "none"}
                            stroke={star <= Math.round(Number(producto.rating)) ? "#FFA500" : "#ccc"}
                          />
                        ))}
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

        {/* Productos relacionados */}
        <motion.div
          className={styles.relatedSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className={styles.sectionHeading}>Productos relacionados</h2>
          <div className={styles.relatedProducts}>
            {/* Aquí irían los productos relacionados */}
            <div className={styles.relatedProductPlaceholder}>
              <div className={styles.placeholderImage}></div>
              <div className={styles.placeholderText}>
                <div className={styles.placeholderTitle}></div>
                <div className={styles.placeholderPrice}></div>
              </div>
            </div>
            <div className={styles.relatedProductPlaceholder}>
              <div className={styles.placeholderImage}></div>
              <div className={styles.placeholderText}>
                <div className={styles.placeholderTitle}></div>
                <div className={styles.placeholderPrice}></div>
              </div>
            </div>
            <div className={styles.relatedProductPlaceholder}>
              <div className={styles.placeholderImage}></div>
              <div className={styles.placeholderText}>
                <div className={styles.placeholderTitle}></div>
                <div className={styles.placeholderPrice}></div>
              </div>
            </div>
            <div className={styles.relatedProductPlaceholder}>
              <div className={styles.placeholderImage}></div>
              <div className={styles.placeholderText}>
                <div className={styles.placeholderTitle}></div>
                <div className={styles.placeholderPrice}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
