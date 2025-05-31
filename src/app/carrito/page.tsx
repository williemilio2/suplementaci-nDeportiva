"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from 'next/navigation'
import Image from "next/image"
import Link from "next/link"
import { Trash2, Minus, Plus, ShoppingBag, Crown } from "lucide-react"
import { guardadosSeguro } from "../../products/listaArchivos"
import styles from "@/src/styles/Carrito.module.css"
import StockSelectorSaborTamano from "@/src/components/dineroSegunSaborTamaño"
import CustomCursor from "@/src/components/customCursor"
import { useElite } from "@/src/components/eliteContent"
import Cookies from 'js-cookie'; // npm i js-cookie
import { useCompraStore } from '@/src/components/useCompraStore'
import type { Product } from "../../types/product"


// Tipo para los items en loscalStorage
type CarritoLocalStorage = {
  producto: string
  sabor: string
  tamaño: string
  cantidad: number
  tipo: string
  token: string
}


// Tipo para los items en el carrito con toda la información
type CarritoItem = CarritoLocalStorage & {
  productoCompleto: Product
  precioUnitario: number
  precioTotal: number
  stockPrice?: number
  stockOffer?: number
  finalDiscount?: number
}

export default function Carrito() {
  const router = useRouter()
  const [carrito, setCarrito] = useState<CarritoItem[]>([])
  const [total, setTotal] = useState(0)
  const [envioGratis, setEnvioGratis] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  // Usar el contexto Elite
  const { isElite } = useElite()

  const [preciosStock, setPreciosStock] = useState<
    Record<
      string,
      {
        price: number
        offer: number
        cantidadPrdActual: number
        hayStockEnOtrasVariantes?: boolean
      }
    >
  >({})
  const envioGratisMinimo = 35 // Envío gratis a partir de 35€
  const loadingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3

  // Función para calcular descuento final con Elite
  const calculateFinalDiscount = (producto: Product, regularOffer: number) => {
    let totalDiscount = regularOffer

    // Si es Elite y el producto tiene rebajasElite, combinar descuentos
    if (isElite && producto.rebajasElite !== undefined && producto.rebajasElite > 0) {
      totalDiscount = Math.min(regularOffer + producto.rebajasElite, 90)
    }


    return totalDiscount
  }

  // Función para cargar el carrito con retry y timeout
  const cargarCarrito = async () => {
    // Evitar múltiples cargas simultáneas
    if (loadingRef.current) return

    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    loadingRef.current = true
    setLoading(true)

    // Establecer un timeout para evitar carga infinita
    timeoutRef.current = setTimeout(() => {
      if (loading && loadingRef.current) {
        console.log("Timeout al cargar carrito")
        loadingRef.current = false
        setLoading(false)
      }
    }, 8000) // 8 segundos de timeout

    try {
      // Obtener productos del localStorage
      let carritoLocalStorage: CarritoLocalStorage[] = []

      if (typeof window !== "undefined") {
        const carritoString = localStorage.getItem("carrito")
        carritoLocalStorage = carritoString ? JSON.parse(carritoString) : []
      }

      if (carritoLocalStorage.length === 0) {
        setCarrito([])
        setDataLoaded(true)
        return
      }

      // Obtener productos completos
      const productosCompletos = await guardadosSeguro(carritoLocalStorage)

      // Combinar la información
      const carritoCompleto = carritoLocalStorage.map((item) => {
        // Buscar el producto completo que coincide con el nombre
        const productoCompleto = productosCompletos.find((p) => p.name === item.producto)

        if (!productoCompleto) {
          // Si no se encuentra el producto, devolver un objeto con valores por defecto
          return {
            ...item,
            productoCompleto: {
              id: 0,
              name: item.producto,
              description: "",
              image: "/placeholder.svg",
              rating: 0,
              reviews: 0,
              marca: "",
              tipo: "",
              colesterol: "",
              slug: "",
              informacionAlergenos: "",
              infoIngredientes: "",
              modoDeUso: "",
              recomendacionesDeUso: "",
              sabores: "",
              rebajasElite: 0,
            },
            precioUnitario: 0,
            precioTotal: 0,
            finalDiscount: 0,
          }
        }

        return {
          ...item,
          productoCompleto,
          precioUnitario: 0,
          precioTotal: 0,
          finalDiscount: 0,
        }
      })

      setCarrito(carritoCompleto)
      setDataLoaded(true)
      retryCountRef.current = 0 // Resetear contador de reintentos
    } catch (error) {
      console.error("Error al cargar carrito:", error)

      // Intentar nuevamente si no excedimos el máximo de reintentos
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++
        console.log(`Reintentando (${retryCountRef.current}/${maxRetries})...`)

        // Esperar un poco antes de reintentar
        setTimeout(() => {
          loadingRef.current = false
          cargarCarrito()
        }, 1000 * retryCountRef.current) // Backoff exponencial

        return
      }

      setCarrito([])
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

  // Cargar carrito al montar el componente
  useEffect(() => {
    // Resetear estado
    setCarrito([])
    setDataLoaded(false)
    loadingRef.current = false
    retryCountRef.current = 0

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Cargar carrito con un pequeño delay para evitar problemas de timing
    const timer = setTimeout(() => {
      cargarCarrito()
    }, 100)

    return () => {
      clearTimeout(timer)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      loadingRef.current = false
    }
  }, [])

  // Actualizar precios cuando se reciben del StockAutoSelector
  useEffect(() => {
    if (!dataLoaded || Object.keys(preciosStock).length === 0 || carrito.length === 0) return

    const carritoActualizado = carrito.map((item) => {
      const key = `${item.productoCompleto.id}-${item.sabor}-${item.tamaño}`
      const stockInfo = preciosStock[key]

      if (stockInfo) {
        const regularOffer = stockInfo.offer
        const finalDiscount = calculateFinalDiscount(item.productoCompleto, regularOffer)
        const precioUnitario =
          finalDiscount > 0 ? stockInfo.price - (stockInfo.price * finalDiscount) / 100 : stockInfo.price

        return {
          ...item,
          stockPrice: stockInfo.price,
          stockOffer: stockInfo.offer,
          finalDiscount: finalDiscount,
          precioUnitario: precioUnitario,
          precioTotal: precioUnitario * item.cantidad,
        }
      }
      return item
    })

    setCarrito(carritoActualizado)
  }, [preciosStock, dataLoaded, isElite])

  // Calcular total
  useEffect(() => {
    if (!dataLoaded) return

    let totalCalculado = 0

    carrito.forEach((item) => {
      const key = `${item.productoCompleto.id}-${item.sabor}-${item.tamaño}`
      const stock = preciosStock[key]

      if (!stock || stock.cantidadPrdActual === 0) {
        return // saltamos este producto
      }

      totalCalculado += item.precioTotal
    })

    setTotal(totalCalculado)
    setEnvioGratis(totalCalculado >= envioGratisMinimo)
  }, [carrito, preciosStock, dataLoaded])

  const actualizarCantidad = (index: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1 || !dataLoaded) return

    const nuevoCarrito = [...carrito]
    nuevoCarrito[index].cantidad = nuevaCantidad
    nuevoCarrito[index].precioTotal = nuevoCarrito[index].precioUnitario * nuevaCantidad
    setCarrito(nuevoCarrito)

    // Actualizar localStorage manteniendo la estructura original
    const carritoLocalStorage = nuevoCarrito.map((item) => ({
      producto: item.producto,
      sabor: item.sabor,
      tamaño: item.tamaño,
      cantidad: item.cantidad,
    }))

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("carrito", JSON.stringify(carritoLocalStorage))
        window.dispatchEvent(new Event("cartUpdated"))
      }
    } catch (error) {
      console.error("Error al actualizar localStorage:", error)
    }
  }

  const eliminarProducto = (index: number) => {
    if (!dataLoaded) return

    const nuevoCarrito = carrito.filter((_, i) => i !== index)
    setCarrito(nuevoCarrito)

    // Actualizar localStorage manteniendo la estructura original
    const carritoLocalStorage = nuevoCarrito.map((item) => ({
      producto: item.producto,
      sabor: item.sabor,
      tamaño: item.tamaño,
      cantidad: item.cantidad,
    }))

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("carrito", JSON.stringify(carritoLocalStorage))
        window.dispatchEvent(new Event("cartUpdated"))
      }
    } catch (error) {
      console.error("Error al actualizar localStorage:", error)
    }
  }

  // Función para actualizar los precios desde StockAutoSelector
  const handleStockPriceFound = (
    productId: number,
    saborP: string,
    tamanoP: string,
    price: number,
    offer: number,
    cantidadPrdActual: number,
    hayStockEnOtrasVariantes?: boolean,
  ) => {
    if (!dataLoaded) return

    const key = `${productId}-${saborP}-${tamanoP}`

    setPreciosStock((prev) => {
      const prevEntry = prev[key]
      if (
        prevEntry &&
        prevEntry.price === price &&
        prevEntry.offer === offer &&
        prevEntry.cantidadPrdActual === cantidadPrdActual &&
        prevEntry.hayStockEnOtrasVariantes === hayStockEnOtrasVariantes
      ) {
        // No actualizar si no ha cambiado nada
        return prev
      }

      return {
        ...prev,
        [key]: { price, offer, cantidadPrdActual, hayStockEnOtrasVariantes },
      }
    })
  }

  // Obtener la primera imagen si hay varkias
  const obtenerPrimeraImagen = (imagenString: string) => {
    return imagenString.split("<<<")[0]
  }
  const handleBuy = () => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/auth/register')
      return
    }

    const carritoLimpio = carrito.map(({ producto, cantidad, sabor, tamaño, precioTotal, finalDiscount, tipo }) => ({
      producto,
      cantidad,
      sabor,
      tamaño,
      precioTotal,
      finalDiscount: finalDiscount ?? 0,
      tipo,
    }))

    useCompraStore.getState().generarDatosCompra(carritoLimpio)
    router.push('/checkout')
  }

  // Mostrar pantalla de carga mientras se cargan los productos
  if (loading) {
    return (
      <div className={styles.carritoContainer}>
        <CustomCursor />
        <div className={styles.carritoHeader}>
          <h1 className={styles.carritoTitle}>Tu Carrito</h1>
          <div className={styles.carritoInfo}>
            <ShoppingBag size={20} />
            <span>Cargando...</span>
          </div>
        </div>
        <div className={styles.carritoVacio}>
          <div className={styles.spinner}></div>
          <h2>Cargando carrito...</h2>
          <p>Por favor espera un momento</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.carritoContainer}>
      <CustomCursor />

      {/* Componentes StockAutoSelector para cada producto */}
      {carrito.map((item) => (
        <StockSelectorSaborTamano
          key={`stock-${item.productoCompleto.id}-${item.sabor}-${item.tamaño}`}
          productId={item.productoCompleto.id}
          sabor={item.sabor}
          tamano={item.tamaño}
          onFound={({ saborP, tamanoP, price, offer, cantidadPrdActual, hayStockEnOtrasVariantes }) =>
            handleStockPriceFound(
              item.productoCompleto.id,
              saborP,
              tamanoP,
              price,
              offer,
              cantidadPrdActual,
              hayStockEnOtrasVariantes,
            )
          }
        />
      ))}

      <div className={styles.carritoHeader}>
        <h1 className={styles.carritoTitle}>Tu Carrito</h1>
        <div className={styles.carritoInfo}>
          <ShoppingBag size={20} />
          <span>
            {carrito.length} {carrito.length === 1 ? "producto" : "productos"}
          </span>
          {isElite && (
            <div className={styles.eliteStatus}>
              <Crown size={16} />
              <span>Elite</span>
            </div>
          )}
        </div>
      </div>

      {carrito.length === 0 ? (
        <div className={styles.carritoVacio}>
          <ShoppingBag size={48} />
          <h2>Tu carrito está vacío</h2>
          <p>Añade productos para comenzar tu pedido</p>
          <Link href="/" className={`${styles.browseButton} hoverable`}>
            Explorar productos
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.carritoProductos}>
            {carrito.map((item, index) => {
              const key = `${item.productoCompleto.id}-${item.sabor}-${item.tamaño}`
              const stock = preciosStock[key]
              const cantidadAUsar = stock?.cantidadPrdActual < item.cantidad ? stock?.cantidadPrdActual : item.cantidad
              const hasEliteOffer = isElite && (item.productoCompleto.rebajasElite ?? 0) > 0


              return (
                <div key={index} className={`${styles.carritoItem} ${hasEliteOffer ? styles.eliteItem : ""}`}>
                  <div className={styles.productoImagen}>
                    <Link
                      href={
                        stock?.hayStockEnOtrasVariantes === true || stock?.cantidadPrdActual > 0
                          ? `/productos/${item.productoCompleto.slug}`
                          : ""
                      }
                    >
                      <Image
                        src={obtenerPrimeraImagen(item.productoCompleto.image) || "/placeholder.svg"}
                        width={120}
                        height={120}
                        alt={item.productoCompleto.name}
                        className={`${styles.productoImg} hoverable`}
                      />
                    </Link>
                  </div>

                  <div className={styles.productoInfo}>
                    <div className={styles.productoHeader}>
                      <Link
                        href={
                          stock?.hayStockEnOtrasVariantes === true || stock?.cantidadPrdActual > 0
                            ? `/productos/${item.productoCompleto.slug}`
                            : ""
                        }
                      >
                        <h3 className={`${styles.productoNombre} hoverable`}>{item.productoCompleto.name}</h3>
                      </Link>
                      <button
                        className={`${styles.eliminarBtn} hoverable`}
                        onClick={() => eliminarProducto(index)}
                        aria-label="Eliminar producto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className={styles.productoDetalles}>
                      <span className={styles.productoSabor}>Sabor: {item.sabor}</span>
                      <span className={styles.productoTamaño}>Tamaño: {item.tamaño}</span>
                      {hasEliteOffer && (
                        <span className={styles.eliteDiscount}>
                          <Crown size={12} />+{item.productoCompleto.rebajasElite}% descuento Elite
                        </span>
                      )}
                    </div>

                    <div className={styles.productoControles}>
                      <div className={styles.cantidadControl}>
                        <button
                          className={`${styles.cantidadBtn} hoverable`}
                          onClick={() => actualizarCantidad(index, cantidadAUsar - 1)}
                          disabled={cantidadAUsar <= 1}
                          aria-label="Disminuir cantidad"
                        >
                          <Minus size={16} />
                        </button>

                        <span className={styles.cantidadValor}>{cantidadAUsar}</span>

                        <button
                          className={`${styles.cantidadBtn} hoverable`}
                          onClick={() => actualizarCantidad(index, cantidadAUsar + 1)}
                          disabled={stock?.cantidadPrdActual <= cantidadAUsar}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className={styles.productoPrecio}>
                        {item.finalDiscount && item.finalDiscount > 0 && stock?.cantidadPrdActual !== 0 ? (
                          <>
                            <span className={styles.precioOriginal}>
                              {item.stockPrice ? (item.stockPrice * cantidadAUsar).toFixed(2) : "0.00"}€
                            </span>
                            <span className={`${styles.precioActual} ${hasEliteOffer ? styles.elitePrice : ""}`}>
                              {item.precioTotal.toFixed(2)}€
                            </span>
                            {hasEliteOffer && (
                              <span className={styles.eliteDiscountBadge}>-{item.finalDiscount}% ELITE</span>
                            )}
                          </>
                        ) : (
                          <span className={`${styles.precioActual} ${hasEliteOffer ? styles.elitePrice : ""}`}>
                            {stock?.cantidadPrdActual === 0
                              ? "Fuera de stock"
                              : `${item.stockPrice ? (item.stockPrice * cantidadAUsar).toFixed(2) : item.precioTotal.toFixed(2)} €`}
                          </span>
                        )}

                        {stock?.cantidadPrdActual === 0 && stock?.hayStockEnOtrasVariantes === true && (
                          <Link href={`/productos/${item.productoCompleto.slug}`}>
                            <button className={`${styles.checkoutBtn} hoverable`}>Cambiar de tamaño o sabor</button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className={styles.carritoResumen}>
            <div className={styles.resumenHeader}>
              <h2>Resumen del pedido</h2>
              {isElite && (
                <div className={styles.eliteStatusResumen}>
                  <Crown size={16} />
                  <span>Miembro Elite</span>
                </div>
              )}
            </div>

            <div className={styles.resumenDetalles}>
              <div className={styles.resumenLinea}>
                <span>Subtotal</span>
                <span>{total.toFixed(2)}€</span>
              </div>

              <div className={styles.resumenLinea}>
                <span>Envío</span>
                <span>{envioGratis ? "Gratis" : "3.99€"}</span>
              </div>

              {!envioGratis && (
                <div className={styles.envioGratisInfo}>
                  <p>¡Añade {(envioGratisMinimo - total).toFixed(2)}€ más para conseguir envío gratis!</p>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${Math.min(100, (total / envioGratisMinimo) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {isElite && (
                <div className={styles.eliteAhorro}>
                  <div className={styles.resumenLinea}>
                    <span>
                      <Crown size={14} />
                      Ahorro Elite
                    </span>
                    <span className={styles.eliteSavings}>
                      {carrito
                        .reduce((total, item) => {
                          if (item.productoCompleto.rebajasElite !== undefined && item.productoCompleto.rebajasElite > 0 && item.stockPrice) {
                            const regularPrice = item.stockOffer
                              ? item.stockPrice - (item.stockPrice * item.stockOffer) / 100
                              : item.stockPrice
                            const eliteDiscount = (regularPrice * item.productoCompleto.rebajasElite) / 100
                            return total + eliteDiscount * item.cantidad
                          }
                          return total
                        }, 0)
                        .toFixed(2)}
                      €
                    </span>
                  </div>
                </div>
              )}

              <div className={`${styles.resumenLinea} ${styles.totalLinea}`}>
                <span>Total</span>
                <span>{(total + (envioGratis ? 0 : 3.99)).toFixed(2)}€</span>
              </div>
            </div>

            <button
              className={`${styles.checkoutBtn} ${isElite ? styles.eliteCheckoutBtn : ""} hoverable`}
              disabled={carrito.some((item) => {
                const key = `${item.productoCompleto.id}-${item.sabor}-${item.tamaño}`
                const stock = preciosStock[key]
                return !stock || stock.cantidadPrdActual === 0
              })}
              style={{
                opacity: carrito.some((item) => {
                  const key = `${item.productoCompleto.id}-${item.sabor}-${item.tamaño}`
                  const stock = preciosStock[key]
                  return !stock || stock.cantidadPrdActual === 0
                })
                  ? 0.5
                  : 1,
              }}
              onClick={handleBuy}
            >
              Finalizar compra
            </button>

            <div className={`${styles.seguirComprando} hoverable`}>
              <Link href="/">← Seguir comprando</Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
