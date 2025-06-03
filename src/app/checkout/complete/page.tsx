
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Package, Truck, Calendar, ChevronRight, Download, MapPin } from "lucide-react"
import styles from "../checkout.module.css"
import CustomCursor from "@/src/components/customCursor"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import * as XLSX from "xlsx"
interface ProductoProcesado {
  nombre: string
  tipo: string
  sabor: string
  tamano: string
  cantidad: number
  dinero: number
  finalDiscount: number
}
interface CompraData {
  id: string
  productosComprados: string
  saborTamanoCantidadDinero: string
  precioTotal: number
  direccionFinal: string
}
//e
export default function CompletePage() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [compraData, setCompraData] = useState<CompraData | null>(null)
  const [productosTransformados, setProductosTransformados] = useState<ProductoProcesado[]>([])
  const [loading, setLoading] = useState(true);
    const firstRender = useRef(true);
  const exportarFactura = () => {
    if (!compraData || productosTransformados.length === 0) return

    const data = productosTransformados.map((item) => ({
      Producto: item.nombre,
      Tipo: item.tipo || "-",
      Sabor: item.sabor,
      Tamaño: item.tamano,
      Cantidad: item.cantidad,
      "Precio unitario (€)": (item.dinero / item.cantidad).toFixed(2),
      "Total (€)": item.dinero.toFixed(2),
      Descuento: item.finalDiscount > 0 ? `-${item.finalDiscount.toFixed(2)}€` : "0€",
    }))

  data.push(
    {
      Producto: "",
      Tipo: "",
      Sabor: "",
      Tamaño: "",
      Cantidad: 0,
      "Precio unitario (€)": "",
      "Total (€)": "",
      Descuento: ""
    },
    {
      Producto: "Subtotal",
      Tipo: "",
      Sabor: "",
      Tamaño: "",
      Cantidad: 0,
      "Precio unitario (€)": "",
      "Total (€)": subtotal.toFixed(2),
      Descuento: ""
    },
    {
      Producto: "TOTAL FINAL",
      Tipo: "",
      Sabor: "",
      Tamaño: "",
      Cantidad: 0,
      "Precio unitario (€)": "",
      "Total (€)": total.toFixed(2),
      Descuento: ""
    }
  )

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Factura")

    const fileName = `factura_pedido_${compraData.id}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }
  useEffect(() => {
  if (!sessionId) {
    router.push("/"); // No hay session_id en la URL
    return;
  }

  fetch(`/api/verificarPagoStripe?session_id=${sessionId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.pagoExitoso) {
        router.push("/"); // Redirige si Stripe no valida el pago
      } else {
        setLoading(false); // Validado => sigue el flujo normal
      }
    })
    .catch(err => {
      console.error("Error validando sesión:", err);
      router.push("/");
    });
}, [sessionId, router]);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // ignora el primer render
    }
    const pedido = localStorage.getItem('pedido')
    
    const datos = JSON.parse(pedido ? pedido : '')
  setCompraData(datos)
    fetch('/api/meterDatosCompras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          console.log('Compra insertada correctamente')
          localStorage.removeItem('pedido')
        } else {
          console.error('Error en la API:', data)
        }
      })
      .catch(err => {
        console.error('Error al conectar con la API:', err)
      })
  }, [loading])
  useEffect(() => {
    if (!compraData) return

    try {
      // Procesar productos comprados: "Extreme PROTEIN COMPLEX&%&undefined<<<Pro MUSCLE BUILDER&%&undefined<<<"
      const productosArray = compraData.productosComprados
        .split('<<<')
        .filter(Boolean)
        .map(producto => {
          const [nombre, tipo] = producto.split('&%&')
          return { nombre: nombre.trim(), tipo: tipo === 'undefined' ? '' : tipo }
        })

      // Procesar detalles: "Caramelo;1kg;2;72.16;0//Pistacho;1kg;2;64.56;0//"
      const detallesArray = compraData.saborTamanoCantidadDinero
        .split('//')
        .filter(Boolean)
        .map(detalle => {
          const [sabor, tamano, cantidad, dinero, finalDiscount] = detalle.split(';')
          return {
            sabor: sabor.trim(),
            tamano: tamano.trim(),
            cantidad: parseInt(cantidad),
            dinero: parseFloat(dinero),
            finalDiscount: parseFloat(finalDiscount)
          }
        })

      // Combinar productos con sus detalles
      const productosCompletos = productosArray.map((producto, index) => ({
        ...producto,
        ...detallesArray[index]
      }))

      console.log('Productos procesados:', productosCompletos)
      setProductosTransformados(productosCompletos)
    } catch (error) {
      console.error('Error procesando productos:', error)
    }
  }, [compraData])

  const subtotal = compraData?.precioTotal || 0
  const shipping = subtotal >= 35 ? 0 : 3.99
  const total = subtotal + shipping

  const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  if (loading) {
    return <p className={styles.loadingMessage}>Validando pago...</p>;
  }
  return (
    <div className={styles.checkoutContainer}>
        <CustomCursor />
      <div className={styles.checkoutHeader}>
        <Link href="/" className={styles.logoContainer}>
          <Image src="/logoLetras.png" width={130} height={42} alt="Logo" priority />
        </Link>
      </div>

      <div className={styles.completeContainer}>
        <div className={styles.completeHeader}>
          <div className={styles.completeIcon}>
            <CheckCircle size={48} />
          </div>
          <h1 className={styles.completeTitle}>¡Pedido completado con éxito!</h1>
          <p className={styles.completeSubtitle}>
            Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
          </p>
          <div className={styles.orderNumber}>
            <span>Número de pedido:</span>
            <strong>{compraData?.id}</strong>
          </div>
        </div>

        <div className={styles.completeContent}>
          <div className={styles.completeMain}>
            <div className={styles.orderStatus}>
              <h2 className={styles.statusTitle}>Estado del pedido</h2>
              <div className={styles.statusTimeline}>
                <div className={`${styles.statusStep} ${styles.active}`}>
                  <div className={styles.statusIcon}>
                    <CheckCircle size={20} />
                  </div>
                  <div className={styles.statusContent}>
                    <h3>Pedido confirmado</h3>
                    <p>
                      {new Date().toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className={styles.statusLine}></div>
                <div className={styles.statusStep}>
                  <div className={styles.statusIcon}>
                    <Package size={20} />
                  </div>
                  <div className={styles.statusContent}>
                    <h3>Preparando pedido</h3>
                    <p>Procesando tus productos</p>
                  </div>
                </div>
                <div className={styles.statusLine}></div>
                <div className={styles.statusStep}>
                  <div className={styles.statusIcon}>
                    <Truck size={20} />
                  </div>
                  <div className={styles.statusContent}>
                    <h3>En camino</h3>
                    <p>Pendiente de envío</p>
                  </div>
                </div>
                <div className={styles.statusLine}></div>
                <div className={styles.statusStep}>
                  <div className={styles.statusIcon}>
                    <CheckCircle size={20} />
                  </div>
                  <div className={styles.statusContent}>
                    <h3>Entregado</h3>
                    <p>Pendiente</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.deliveryInfo}>
              <div className={styles.deliverySection}>
                <h3>
                  <Calendar size={18} /> Fecha estimada de entrega
                </h3>
                <p className={styles.deliveryDate}>{estimatedDelivery}</p>
              </div>
              <div className={styles.deliverySection}>
                <h3>
                  <MapPin size={18} /> Dirección de envío
                </h3>
                <div className={styles.addressReview}>
                     {compraData && (
                        <>
                          <p>{compraData.direccionFinal}</p>
                        </>
                      )}
                </div>
              </div>
            </div>

            <div className={styles.completeActions}>
              <button className={`${styles.invoiceButton} hoverable`} onClick={exportarFactura}>
                <Download size={18} />
                Descargar factura
              </button>
              <Link href="/pedidos" className={`${styles.viewOrdersButton} hoverable`}>
                Ver mis pedidos <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          <div className={styles.completeSidebar}>
            <div className={styles.orderSummary}>
              <h2 className={styles.summaryTitle}>Resumen del pedido</h2>
                <div>
                <div className={styles.cartItems}>
                {productosTransformados.map((item, index) => (
                  <div key={`${item.nombre}-${item.sabor}-${index}`} className={styles.cartItem}>
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.nombre}</h3>
                      {item.tipo && <p className={styles.itemType}>{item.tipo}</p>}
                      <p className={styles.itemVariant}>{item.sabor}</p>
                      <p className={styles.itemVariant}>{item.tamano}</p>
                      <div className={styles.itemPriceQty}>
                        <span className={styles.itemPrice}>
                          {(item.dinero / item.cantidad).toFixed(2)}€
                        </span>
                        <span className={styles.cantidad}>x{item.cantidad}</span>
                      </div>
                      {item.finalDiscount > 0 && (
                        <div className={styles.discount}>
                          Descuento: -{item.finalDiscount.toFixed(2)}€
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            <div className={styles.helpSection}>
              <h3>¿Necesitas ayuda?</h3>
              <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
              <Link href="/contacto" className={`${styles.contactLink} hoverable`}>
                Contactar con soporte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
