"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Package } from "lucide-react"
import styles from "../../styles/pedidos.module.css"
import CustomCursor from "@/src/components/customCursor"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"
//ew
interface ProductoProcesado {
  nombre: string
  sabor: string
  tamano: string
  cantidad: number
  dinero: number
  finalDiscount: number
}

interface PedidoProcesado {
  id: number
  fechaCompleta: string
  precioTotal: number
  direccion: string
  productos: ProductoProcesado[]
}
interface CompraCruda {
  id: number
  correoUsuarioCompra: string
  productosComprados: string
  fechaCompleta: string
  precioTotal: number
  direccion: string
  saborTamanoCantidadDinero: string
}

export default function OrdersPage() {
  const router = useRouter()
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [compraData, setCompraData] = useState<CompraCruda[]>([])
  const [pedidosProcesados, setPedidosProcesados] = useState<PedidoProcesado[]>([])

  useEffect(() => {
    const token = Cookies.get('token')

    fetch('/api/verDatoCompraActual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        setCompraData(data.data)
      }
    })
    .catch(error => {
      console.error('Error:', error)
      alert('Error de conexión')
    })
  }, [router])

  useEffect(() => {
    if (!compraData || compraData.length === 0) return;

    try {
      // Procesar cada pedido y convertirlo a formato agrupado con sus productos
      const pedidos: PedidoProcesado[] = compraData.map(compra => {
        // Dividir productosComprados por '<<<' para tener productos separados
        const productosArray = compra.productosComprados
          .split('<<<')
          .filter(Boolean)
          .map((producto: string) => {
            // Tomar solo la parte antes de '&%&' y eliminar tipo (la parte después)
            const [nombre] = producto.split('&%&');
            return { nombre: nombre.trim() };
          });

        // Dividir saborTamanoCantidadDinero por '//' para detalles de cada producto
        const detallesArray = compra.saborTamanoCantidadDinero
          .split('//')
          .filter(Boolean)
          .map((detalle: string) => {
            const [sabor, tamano, cantidad, dinero, finalDiscount] = detalle.split(';');
            return {
              sabor: sabor.trim(),
              tamano: tamano.trim(),
              cantidad: parseInt(cantidad),
              dinero: parseFloat(dinero),
              finalDiscount: parseFloat(finalDiscount)
            };
          });

        // Combinar nombre con detalles, índice a índice
        const productosCompletos: ProductoProcesado[] = productosArray.map((producto, i: number) => ({
          nombre: producto.nombre,
          sabor: detallesArray[i]?.sabor || '',
          tamano: detallesArray[i]?.tamano || '',
          cantidad: detallesArray[i]?.cantidad || 0,
          dinero: detallesArray[i]?.dinero || 0,
          finalDiscount: detallesArray[i]?.finalDiscount || 0,
        }));

        return {
          id: compra.id,
          fechaCompleta: compra.fechaCompleta,
          precioTotal: compra.precioTotal,
          direccion: compra.direccion,
          productos: productosCompletos
        }
      })

      setPedidosProcesados(pedidos)

    } catch (error) {
      console.error('Error procesando pedidos:', error);
    }
  }, [compraData])

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  return (
    <div className={styles.ordersContainer}>
      <CustomCursor />
      <div className={styles.ordersHeader}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logoContainer}>
            <Image src="/logoLetras.png" width={180} height={62} alt="Logo" priority />
          </Link>
          <h1 className={styles.pageTitle}>Mis Pedidos</h1>
        </div>
      </div>

      <div className={styles.ordersContent}>
        <div className={styles.ordersList}>
          {pedidosProcesados.length > 0 ? (
            pedidosProcesados.map(pedido => (
              <div key={pedido.id} className={`${styles.orderCard} hoverable`}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderBasicInfo}>
                    <div className={styles.orderNumberDate}>
                      {/* Mostrar ID del pedido en header */}
                      <h3 className={styles.orderNumber}>Pedido #{pedido.id}</h3>
                      <span className={styles.orderDate}>{pedido.fechaCompleta}</span>
                    </div>
                  </div>
                  <div className={styles.orderActions}>
                    <span className={styles.orderTotal}>{pedido.precioTotal.toFixed(2)}€</span>
                    <ChevronDown size={40} onClick={() => toggleOrderExpand(pedido.id)} />
                  </div>
                </div>

                {/* Mostrar productos solo si el pedido está expandido */}
                {expandedOrder === pedido.id && (
                  <div className={styles.orderDetails}>
                    <div className={styles.orderItems}>
                      {pedido.productos.map((producto, i) => (
                        <div key={i} className={styles.orderItem}>
                          <div className={styles.itemInfo}>
                            <h4 className={styles.itemName}>Producto: {producto.nombre}</h4>
                            <p className={styles.itemVariant}>Sabor: {producto.sabor}</p>
                            <p className={styles.itemVariant}>Tamaño: {producto.tamano}</p>
                            <p className={styles.itemVariant}>Cantidad: {producto.cantidad}</p>
                            <p className={styles.itemVariant}>{producto.finalDiscount != 0 ? `Descuento aplicado: ${producto.finalDiscount}%` : ''}</p>
                            <div className={styles.itemPriceQty}>
                              <span className={styles.itemPrice}>Total: {producto.dinero.toFixed(2)}€</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noOrders}>
              <div className={styles.noOrdersIcon}>
                <Package size={48} />
              </div>
              <h2>No se encontraron productos</h2>
              <p>No hay productos disponibles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
