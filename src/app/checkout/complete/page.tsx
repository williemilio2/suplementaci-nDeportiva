
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Package, Truck, Calendar, ChevronRight, Download, MapPin } from "lucide-react"
import styles from "../checkout.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function CompletePage() {
  const [orderNumber, setOrderNumber] = useState("")

  useEffect(() => {
    // Generar un número de pedido aleatorio
    const randomOrderNumber = Math.floor(10000000 + Math.random() * 90000000).toString()
    setOrderNumber(randomOrderNumber)
  }, [])

  // Datos de ejemplo del carrito
  const cartItems = [
    {
      id: 1,
      name: "Proteína Whey Gold Standard",
      variant: "Chocolate - 2kg",
      price: 59.99,
      quantity: 1,
      image: "/images/muscle-gain.jpg",
    },
    {
      id: 2,
      name: "Creatina Monohidrato",
      variant: "Sin sabor - 500g",
      price: 24.99,
      quantity: 2,
      image: "/images/supplement-deals.jpg",
    },
  ]

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = 4.99
  const total = subtotal + shipping

  // Datos de ejemplo
  const shippingAddress = {
    name: "Casa",
    recipient: "Juan Pérez",
    street: "Calle Principal 123",
    city: "Madrid",
    postalCode: "28001",
    country: "España",
    phone: "+34 612 345 678",
  }

  const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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
            <strong>{orderNumber}</strong>
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
                  <p className={styles.recipientName}>{shippingAddress.recipient}</p>
                  <p>{shippingAddress.street}</p>
                  <p>
                    {shippingAddress.postalCode}, {shippingAddress.city}, {shippingAddress.country}
                  </p>
                  <p>{shippingAddress.phone}</p>
                </div>
              </div>
            </div>

            <div className={styles.completeActions}>
              <button className={styles.invoiceButton}>
                <Download size={18} />
                Descargar factura
              </button>
              <Link href="/pedidos" className={styles.viewOrdersButton}>
                Ver mis pedidos <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          <div className={styles.completeSidebar}>
            <div className={styles.orderSummary}>
              <h2 className={styles.summaryTitle}>Resumen del pedido</h2>

              <div className={styles.cartItems}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <Image src={item.image || "/placeholder.svg"} width={60} height={60} alt={item.name} />
                    </div>
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemVariant}>{item.variant}</p>
                      <div className={styles.itemPriceQty}>
                        <span className={styles.itemPrice}>{item.price.toFixed(2)}€</span>
                        <span className={styles.itemQuantity}>x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Envío</span>
                  <span>{shipping.toFixed(2)}€</span>
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
              <Link href="/contact" className={styles.contactLink}>
                Contactar con soporte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
