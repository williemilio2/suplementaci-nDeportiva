"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronRight, Truck, Check, MapPin, Calendar, CreditCardIcon as CardIcon } from "lucide-react"
import styles from "../checkout.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function ReviewPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

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
  const paymentInfo = {
    cardType: "Visa",
    cardNumber: "**** **** **** 1234",
    cardHolder: "Juan Pérez",
    expiryDate: "12/25",
  }

  const shippingAddress = {
    name: "Casa",
    recipient: "Juan Pérez",
    street: "Calle Principal 123",
    city: "Madrid",
    postalCode: "28001",
    country: "España",
    phone: "+34 612 345 678",
  }

  const shippingMethod = {
    name: "Envío estándar",
    price: 4.99,
    description: "Entrega en 3-5 días laborables",
  }

  const handleCompleteOrder = () => {
    if (!acceptTerms) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/checkout/complete")
    }, 1500)
  }

  return (
    <div className={styles.checkoutContainer}>
        <CustomCursor />
      <div className={styles.checkoutHeader}>
        <Link href="/" className={styles.logoContainer}>
          <Image src="/logoLetras.png" width={130} height={42} alt="Logo" priority />
        </Link>
      </div>

      <div className={styles.checkoutProgress}>
        <div className={`${styles.progressStep} ${styles.active} ${styles.completed}`}>
          <div className={styles.stepIcon}>
            <Check size={18} />
          </div>
          <span className={styles.stepText}>Pago</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={`${styles.progressStep} ${styles.active} ${styles.completed}`}>
          <div className={styles.stepIcon}>
            <Check size={18} />
          </div>
          <span className={styles.stepText}>Envío</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={`${styles.progressStep} ${styles.active}`}>
          <div className={styles.stepIcon}>
            <Check size={18} />
          </div>
          <span className={styles.stepText}>Confirmación</span>
        </div>
      </div>

      <div className={styles.checkoutContent}>
        <div className={styles.checkoutMain}>
          <div className={styles.sectionTitle}>
            <h1>Revisar y confirmar</h1>
            <p>Verifica los detalles de tu pedido antes de completar la compra</p>
          </div>

          <div className={styles.reviewSections}>
            <div className={styles.reviewSection}>
              <div className={styles.reviewHeader}>
                <h2>
                  <CardIcon size={18} /> Método de pago
                </h2>
                <Link href="/checkout" className={styles.editLink}>
                  Editar
                </Link>
              </div>
              <div className={styles.reviewContent}>
                <div className={styles.paymentReview}>
                  <div className={styles.cardBrandIcon}>
                    <Image
                      src="/placeholder.svg?height=24&width=38"
                      width={38}
                      height={24}
                      alt={paymentInfo.cardType}
                    />
                  </div>
                  <div className={styles.paymentDetails}>
                    <p className={styles.cardNumber}>{paymentInfo.cardNumber}</p>
                    <p className={styles.cardHolder}>{paymentInfo.cardHolder}</p>
                    <p className={styles.cardExpiry}>Expira: {paymentInfo.expiryDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <div className={styles.reviewHeader}>
                <h2>
                  <MapPin size={18} /> Dirección de envío
                </h2>
                <Link href="/checkout/envio" className={styles.editLink}>
                  Editar
                </Link>
              </div>
              <div className={styles.reviewContent}>
                <div className={styles.addressReview}>
                  <p className={styles.addressName}>{shippingAddress.name}</p>
                  <p className={styles.recipientName}>{shippingAddress.recipient}</p>
                  <p>{shippingAddress.street}</p>
                  <p>
                    {shippingAddress.postalCode}, {shippingAddress.city}, {shippingAddress.country}
                  </p>
                  <p>{shippingAddress.phone}</p>
                </div>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <div className={styles.reviewHeader}>
                <h2>
                  <Truck size={18} /> Método de envío
                </h2>
                <Link href="/checkout/envio" className={styles.editLink}>
                  Editar
                </Link>
              </div>
              <div className={styles.reviewContent}>
                <div className={styles.shippingReview}>
                  <p className={styles.shippingName}>{shippingMethod.name}</p>
                  <p className={styles.shippingDescription}>{shippingMethod.description}</p>
                  <p className={styles.shippingPrice}>{shippingMethod.price.toFixed(2)}€</p>
                </div>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <div className={styles.reviewHeader}>
                <h2>
                  <Calendar size={18} /> Fecha estimada de entrega
                </h2>
              </div>
              <div className={styles.reviewContent}>
                <div className={styles.deliveryReview}>
                  <p className={styles.deliveryDate}>
                    {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className={styles.deliveryNote}>
                    La fecha puede variar dependiendo de la disponibilidad y ubicación.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.termsContainer}>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
                className={styles.checkbox}
                required
              />
              <span className={styles.checkmark}></span>
              <span>
                Acepto los{" "}
                <Link href="/terms" className={styles.termsLink}>
                  Términos y Condiciones
                </Link>{" "}
                y la{" "}
                <Link href="/privacy" className={styles.termsLink}>
                  Política de Privacidad
                </Link>
              </span>
            </label>
          </div>

          <div className={styles.formActions}>
            <Link href="/checkout/envio" className={styles.backButton}>
              Volver al envío
            </Link>
            <button
              className={`${styles.completeButton} ${isLoading ? styles.loading : ""}`}
              onClick={handleCompleteOrder}
              disabled={isLoading || !acceptTerms}
            >
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                <>
                  Completar pedido <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        <div className={styles.checkoutSidebar}>
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

          <div className={styles.orderNote}>
            <p>
              Al completar tu pedido, aceptas que procesemos tus datos personales de acuerdo con nuestra{" "}
              <Link href="/privacy" className={styles.noteLink}>
                Política de Privacidad
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
