"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from "../styles/productosSimilares.module.css"
import { filtrarProductosSimilaresSeguro } from "../products/listaArchivos"
import OfferProductCard from "./ContenedorPorducto"
import type { Product } from "../types/product"

//ew
interface ProductosSimilaresProps {
  producto: {
    id: number
    name: string
    categoriaEspecial?: string
    marca: string
    tipo?: string
    superOfertas?: boolean
  }
}
export default function ProductosSimilares({ producto }: ProductosSimilaresProps) {
  const [productos, setProductos] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [productsToShow, setProductsToShow] = useState(4)
  const [dataLoaded, setDataLoaded] = useState(false)
  console.log(dataLoaded)
  const sliderRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3

  // Función para cargar productos similares con retry y timeout
  const cargarProductosSimilares = async () => {
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
        console.log("Timeout al cargar productos similares")
        loadingRef.current = false
        setLoading(false)
        setError("Tiempo de espera agotado. Intente nuevamente.")
      }
    }, 8000) // 8 segundos de timeout

    try {
      const productosSimilares = await filtrarProductosSimilaresSeguro(producto)

      // Limpiar timeout ya que la carga fue exitosa
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      setProductos(productosSimilares || [])
      setDataLoaded(true)
      retryCountRef.current = 0 // Resetear contador de reintentos
    } catch (error) {
      console.error("Error al cargar productos similares:", error)

      // Intentar nuevamente si no excedimos el máximo de reintentos
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++
        console.log(`Reintentando (${retryCountRef.current}/${maxRetries})...`)

        // Esperar un poco antes de reintentar
        setTimeout(() => {
          loadingRef.current = false
          cargarProductosSimilares()
        }, 1000 * retryCountRef.current) // Backoff exponencial

        return
      }

      setProductos([])
      setError("Error al cargar productos similares")
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

  // Cargar productos similares cuando cambia el producto
  useEffect(() => {
    // Resetear estado
    setProductos([])
    setCurrentIndex(0)
    setError(null)
    setDataLoaded(false)
    loadingRef.current = false
    retryCountRef.current = 0

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Cargar productos con un pequeño delay para evitar problemas de timing
    const timer = setTimeout(() => {
      cargarProductosSimilares()
    }, 100)

    return () => {
      clearTimeout(timer)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      loadingRef.current = false
    }
  }, [producto.id])

  // Detectar ancho ventana y actualizar productos a mostrar
  useEffect(() => {
    function updateProductsToShow() {
      const width = window.innerWidth
      if (width < 640) setProductsToShow(1)
      else if (width < 768) setProductsToShow(2)
      else if (width < 1024) setProductsToShow(3)
      else setProductsToShow(4)
    }

    updateProductsToShow()
    window.addEventListener("resize", updateProductsToShow)
    return () => window.removeEventListener("resize", updateProductsToShow)
  }, [])

  const maxIndex = Math.max(0, productos.length - productsToShow)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  useEffect(() => {
    if (sliderRef.current && productos.length > 0) {
      const itemWidth = sliderRef.current.offsetWidth / productsToShow
      sliderRef.current.style.transform = `translateX(-${currentIndex * itemWidth}px)`
    }
  }, [currentIndex, productos, productsToShow])

  // Si hay un error, mostrar un mensaje pero seguir mostrando el componente
  if (error) {
    return (
      <div className={styles.container}>
        <h2 className={styles.titulo}>Productos Similares</h2>
        <div className={styles.error}>
          {error}
          <button
            onClick={() => {
              loadingRef.current = false
              retryCountRef.current = 0
              cargarProductosSimilares()
            }}
            className={styles.retryButton}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Productos Similares</h2>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando productos similares...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className={styles.empty}>No se encontraron productos similares</div>
      ) : (
        <div className={styles.sliderContainer}>
          <button
            className={`${styles.navButton} ${styles.navButtonLeft} ${currentIndex === 0 ? styles.navButtonDisabled : ""}`}
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>

          <div className={styles.sliderWrapper}>
            <div ref={sliderRef} className={styles.slider} style={{ transition: "transform 0.3s ease-in-out" }}>
              {productos.map((productoActual) => (
                <OfferProductCard key={`product-${productoActual.id}`} product={productoActual} />
              ))}
            </div>
          </div>

          <button
            className={`${styles.navButton} ${styles.navButtonRight} ${currentIndex >= maxIndex ? styles.navButtonDisabled : ""}`}
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Siguiente"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {productos.length > productsToShow && (
        <div className={styles.indicators}>
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${currentIndex === index ? styles.indicatorActive : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Página ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
