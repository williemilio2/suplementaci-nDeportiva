"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react"
import { guardados } from "../../products/listaArchivos"
import styles from "@/src/styles/Carrito.module.css"
import StockSelectorSaborTamano from "@/src/components/dineroSegunSaborTamaño"
import CustomCursor from "@/src/components/customCursor"

// Tipo para los items en localStorage
type CarritoLocalStorage = {
  producto: string
  sabor: string
  tamaño: string
  cantidad: number
}

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

// Tipo para los items en el carrito con toda la información
type CarritoItem = CarritoLocalStorage & {
  productoCompleto: ProductoCompleto
  precioUnitario: number
  precioTotal: number
  stockPrice?: number
  stockOffer?: number
}

export default function Carrito() {
  const [carrito, setCarrito] = useState<CarritoItem[]>([])
  const [total, setTotal] = useState(0)
  const [envioGratis, setEnvioGratis] = useState(false)
  const envioGratisMinimo = 50 // Envío gratis a partir de 50€
  const [preciosStock, setPreciosStock] = useState<Record<string, {
    price: number;
    offer: number;
    cantidadPrdActual: number;
    hayStockEnOtrasVariantes?: boolean;
  }>>({});
  

  useEffect(() => {
    // Obtener productos del localStorage
    const carritoString = localStorage.getItem("carrito")
    const carritoLocalStorage: CarritoLocalStorage[] = carritoString ? JSON.parse(carritoString) : []

    // Obtener productos completos
    const productosCompletos = guardados(carritoLocalStorage)

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
          },
          precioUnitario: 0,
          precioTotal: 0,
        }
      }

      // Determinar el precio unitario (oferta o normal)
      const precioUnitario =
        0

      return {
        ...item,
        productoCompleto,
        precioUnitario,
        precioTotal: precioUnitario * item.cantidad,
      }
    })

    setCarrito(carritoCompleto)
  }, [])

  // Actualizar precios cuando se reciben del StockAutoSelector
  useEffect(() => {
    if (Object.keys(preciosStock).length === 0) return

    const carritoActualizado = carrito.map((item) => {
      const key = `${item.productoCompleto.id}-${item.sabor}-${item.tamaño}`;
      const stockInfo = preciosStock[key]
      if (stockInfo) {
        const precioUnitario =
          stockInfo.offer > 0 ? stockInfo.price - (stockInfo.price * stockInfo.offer) / 100 : stockInfo.price

        return {
          ...item,
          stockPrice: stockInfo.price,
          stockOffer: stockInfo.offer,
          precioUnitario: precioUnitario,
          precioTotal: precioUnitario * item.cantidad,
        }
      }
      return item
    })

    setCarrito(carritoActualizado)
  }, [preciosStock])

  useEffect(() => {
    let totalCalculado = 0

    carrito.forEach(item => {
      const key = `${item.productoCompleto.id}-${item.sabor}-${item.tamaño}`;
      const stock = preciosStock[key];

      if (!stock || stock.cantidadPrdActual === 0) {
        return // saltamos este producto
      }

      totalCalculado += item.precioTotal
    })

    setTotal(totalCalculado)
    setEnvioGratis(totalCalculado >= envioGratisMinimo)
  }, [carrito, preciosStock])


  const actualizarCantidad = (index: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return

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

    localStorage.setItem("carrito", JSON.stringify(carritoLocalStorage))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const eliminarProducto = (index: number) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index)
    setCarrito(nuevoCarrito)

    // Actualizar localStorage manteniendo la estructura original
    const carritoLocalStorage = nuevoCarrito.map((item) => ({
      producto: item.producto,
      sabor: item.sabor,
      tamaño: item.tamaño,
      cantidad: item.cantidad,
    }))

    localStorage.setItem("carrito", JSON.stringify(carritoLocalStorage))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  // Función para actualizar los precios desde StockAutoSelector
const handleStockPriceFound = (
  productId: number,
  saborP: string,
  tamanoP: string,
  price: number,
  offer: number,
  cantidadPrdActual: number,
  hayStockEnOtrasVariantes?: boolean
) => {
  const key = `${productId}-${saborP}-${tamanoP}`;

  setPreciosStock((prev) => {
    const prevEntry = prev[key];
    if (
      prevEntry &&
      prevEntry.price === price &&
      prevEntry.offer === offer &&
      prevEntry.cantidadPrdActual === cantidadPrdActual &&
      prevEntry.hayStockEnOtrasVariantes === hayStockEnOtrasVariantes
    ) {
      // No actualizar si no ha cambiado nada
      return prev;
    }

    return {
      ...prev,
      [key]: { price, offer, cantidadPrdActual, hayStockEnOtrasVariantes },
    };
  });
  console.log(preciosStock)
  // Ten en cuenta que console.log(preciosStock) aquí puede estar desfasado
};



  // Obtener la primera imagen si hay varias
  const obtenerPrimeraImagen = (imagenString: string) => {
    return imagenString.split("<<<")[0]
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
          onFound={({ saborP, tamanoP, price, offer, cantidadPrdActual, hayStockEnOtrasVariantes }) => handleStockPriceFound(item.productoCompleto.id, saborP, tamanoP, price, offer, cantidadPrdActual, hayStockEnOtrasVariantes)}
        />
      ))}

      <div className={styles.carritoHeader}>
        <h1 className={styles.carritoTitle}>Tu Carrito</h1>
        <div className={styles.carritoInfo}>
          <ShoppingBag size={20} />
          <span>
            {carrito.length} {carrito.length === 1 ? "producto" : "productos"}
          </span>
        </div>
      </div>

      {carrito.length === 0 ? (
        <div className={styles.carritoVacio}>
          <ShoppingBag size={48} />
          <h2>Tu carrito está vacío</h2>
          <p>Añade productos para comenzar tu pedido</p>
        </div>
      ) : (
<>
        <div className={styles.carritoProductos}>
          {carrito.map((item, index) => {
            const key = `${item.productoCompleto.id}-${item.sabor}-${item.tamaño}`;
            const stock = preciosStock[key];
            console.log(key)
            console.log(stock)
            const cantidadAUsar =
              stock?.cantidadPrdActual < item.cantidad
                ? stock?.cantidadPrdActual
                : item.cantidad;

            return (
              <div key={index} className={styles.carritoItem}>
                <div className={styles.productoImagen}>
                  <Link href={stock?.hayStockEnOtrasVariantes === true || stock?.cantidadPrdActual > 0 ? `/productos/${item.productoCompleto.slug}` : ''}>
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
                    <Link href={stock?.hayStockEnOtrasVariantes ===  true || stock?.cantidadPrdActual > 0 ? `/productos/${item.productoCompleto.slug}` : ''}>
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
                      {item.stockOffer && stock?.cantidadPrdActual !== 0 ? (
                        <>
                          <span className={styles.precioOriginal}>
                            {item.stockPrice ? (item.stockPrice * cantidadAUsar).toFixed(2) : "0.00"}€
                          </span>
                          <span className={styles.precioActual}>{(item.precioTotal).toFixed(2)}€</span>
                        </>
                      ) : (
                        <span className={styles.precioActual}>
                          {stock?.cantidadPrdActual === 0
                            ? 'Fuera de stock'
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
            );
          })}
        </div>

        <div className={styles.carritoResumen}>
          <div className={styles.resumenHeader}>
            <h2>Resumen del pedido</h2>
          </div>

          <div className={styles.resumenDetalles}>
            <div className={styles.resumenLinea}>
              <span>Subtotal</span>
              <span>{total.toFixed(2)}€</span>
            </div>

            <div className={styles.resumenLinea}>
              <span>Envío</span>
              <span>{envioGratis ? "Gratis" : "4.95€"}</span>
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

            <div className={`${styles.resumenLinea} ${styles.totalLinea}`}>
              <span>Total</span>
              <span>{(total + (envioGratis ? 0 : 4.95)).toFixed(2)}€</span>
            </div>
          </div>

          <button
            className={`${styles.checkoutBtn} hoverable`}
            disabled={carrito.some(item => {
              const key = `${item.productoCompleto.id}-${item.sabor}-${item.tamaño}`;
              const stock = preciosStock[key]
              return !stock || stock.cantidadPrdActual === 0
            })}
            style={{ opacity: carrito.some(item => {
              const key = `${item.productoCompleto.id}-${item.sabor}-${item.tamaño}`;
              const stock = preciosStock[key]
              return !stock || stock.cantidadPrdActual === 0
            }) ? 0.5 : 1 }}
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
