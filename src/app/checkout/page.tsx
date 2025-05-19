"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronRight, CreditCard, ShoppingBag, Truck, Check, Lock } from "lucide-react"
import styles from "./checkout.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function CheckoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Datos de ejemplo del carrito
  const cartItems = [
    {
      id: 1,
      name: "Proteína Whey Gold Standard",
      variant: "Chocolate - 2kg",
      price: 59.99,
      quantity: 1,
      image: "/cursor2.png",
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

  const handleContinue = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/checkout/envio")
    }, 800)
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
        <div className={`${styles.progressStep} ${styles.active}`}>
          <div className={styles.stepIcon}>
            <CreditCard size={18} />
          </div>
          <span className={styles.stepText}>Pago</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={styles.progressStep}>
          <div className={styles.stepIcon}>
            <Truck size={18} />
          </div>
          <span className={styles.stepText}>Envío</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={styles.progressStep}>
          <div className={styles.stepIcon}>
            <Check size={18} />
          </div>
          <span className={styles.stepText}>Confirmación</span>
        </div>
      </div>

      <div className={styles.checkoutContent}>
        <div className={styles.checkoutMain}>
          <div className={styles.sectionTitle}>
            <h1>Información de pago</h1>
            <p>Completa los datos de tu tarjeta para procesar el pago</p>
          </div>

          <div className={styles.paymentMethods}>
            <div className={`${styles.paymentMethod} ${styles.active}`}>
              <div className={styles.methodRadio}>
                <input type="radio" id="card" name="paymentMethod" checked readOnly />
                <label htmlFor="card"></label>
              </div>
              <div className={styles.methodContent}>
                <div className={styles.methodTitle}>Tarjeta de crédito/débito</div>
                <div className={styles.cardIcons}>
                  <Image src="/placeholder.svg?height=24&width=38" width={38} height={24} alt="Visa" />
                  <Image src="/placeholder.svg?height=24&width=38" width={38} height={24} alt="Mastercard" />
                  <Image src="/placeholder.svg?height=24&width=38" width={38} height={24} alt="Amex" />
                </div>
              </div>
            </div>

            <div className={styles.paymentMethod}>
              <div className={styles.methodRadio}>
                <input type="radio" id="paypal" name="paymentMethod" />
                <label htmlFor="paypal"></label>
              </div>
              <div className={styles.methodContent}>
                <div className={styles.methodTitle}>PayPal</div>
                <div className={styles.methodDescription}>Paga rápido y seguro con PayPal</div>
              </div>
            </div>
          </div>

          <div className={styles.cardForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="cardName">Nombre en la tarjeta</label>
                <input
                  type="text"
                  id="cardName"
                  placeholder="Nombre como aparece en la tarjeta"
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Número de tarjeta</label>
                <div className={styles.cardNumberInput}>
                  <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" className={styles.formInput} />
                  <div className={styles.cardBrand}>
                    <Image src="/placeholder.svg?height=24&width=38" width={38} height={24} alt="Card brand" />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="cardExpiry">Fecha de expiración</label>
                <input type="text" id="cardExpiry" placeholder="MM/AA" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="cardCvc">Código de seguridad</label>
                <input type="text" id="cardCvc" placeholder="CVC" className={styles.formInput} />
              </div>
            </div>

            <div className={styles.securePayment}>
              <Lock size={14} />
              <span>Pago 100% seguro. Tus datos están protegidos.</span>
            </div>
          </div>

          <div className={styles.formActions}>
            <Link href="/cart" className={styles.backButton}>
              Volver al carrito
            </Link>
            <button
              className={`${styles.continueButton} ${isLoading ? styles.loading : ""}`}
              onClick={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                <>
                  Continuar <ChevronRight size={18} />
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

          <div className={styles.guaranteeBox}>
            <div className={styles.guaranteeIcon}>
              <ShoppingBag size={24} />
            </div>
            <div className={styles.guaranteeContent}>
              <h3>Garantía de satisfacción</h3>
              <p>Si no estás satisfecho con tu compra, tienes 30 días para devolverla.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
