"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronRight, Truck, Check, MapPin, Clock } from "lucide-react"
import styles from "../checkout.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function ShippingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(1)
  const [selectedShipping, setSelectedShipping] = useState(1)

  // Datos de ejemplo del carrito
  const cartItems = [
    {
      id: 1,
      name: "ProteÃ­na Whey Gold Standard",
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
  const shipping = selectedShipping === 1 ? 4.99 : 9.99
  const total = subtotal + shipping

  // Direcciones guardadas de ejemplo
  const savedAddresses = [
    {
      id: 1,
      name: "Casa",
      recipient: "Juan PÃ©rez",
      street: "Calle Principal 123",
      city: "Madrid",
      postalCode: "28001",
      country: "EspaÃ±a",
      phone: "+34 612 345 678",
      isDefault: true,
    },
    {
      id: 2,
      name: "Trabajo",
      recipient: "Juan PÃ©rez",
      street: "Avenida Empresarial 45, Oficina 302",
      city: "Madrid",
      postalCode: "28002",
      country: "EspaÃ±a",
      phone: "+34 698 765 432",
      isDefault: false,
    },
  ]

  // Opciones de envÃ­o
  const shippingOptions = [
    {
      id: 1,
      name: "EnvÃ­o estÃ¡ndar",
      price: 4.99,
      description: "Entrega en 3-5 dÃ­as laborables",
      icon: <Truck size={20} />,
    },
    {
      id: 2,
      name: "EnvÃ­o express",
      price: 9.99,
      description: "Entrega en 24-48 horas",
      icon: <Clock size={20} />,
    },
  ]

  const handleContinue = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/checkout/review")
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
        <div
          className={`${styles.progressStep} ${styles.completed}`}
        >
          <div className={styles.stepIcon}><Check size={18}/></div>
          <span className={styles.stepText}>Pago</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={`${styles.progressStep} ${styles.active}`}>
          <div className={styles.stepIcon}>
            <Truck size={18} />
          </div>
          <span className={styles.stepText}>EnvÃ­o</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={styles.progressStep}>
          <div className={styles.stepIcon}>
            <Check size={18} />
          </div>
          <span className={styles.stepText}>ConfirmaciÃ³n</span>
        </div>
      </div>

      <div className={styles.checkoutContent}>
        <div className={styles.checkoutMain}>
          <div className={styles.sectionTitle}>
            <h1>DirecciÃ³n de envÃ­o</h1>
            <p>Selecciona dÃ³nde quieres recibir tu pedido</p>
          </div>

          <div className={styles.addressSection}>
            <h2 className={styles.sectionSubtitle}>Direcciones guardadas</h2>

            <div className={styles.savedAddresses}>
              {savedAddresses.map((address) => (
                <div
                  key={address.id}
                  className={`${styles.addressCard} ${selectedAddress === address.id ? styles.selectedAddress : ""}`}
                  onClick={() => setSelectedAddress(address.id)}
                >
                  <div className={styles.addressRadio}>
                    <input
                      type="radio"
                      id={`address-${address.id}`}
                      name="selectedAddress"
                      checked={selectedAddress === address.id}
                      onChange={() => setSelectedAddress(address.id)}
                    />
                    <label htmlFor={`address-${address.id}`}></label>
                  </div>
                  <div className={styles.addressContent}>
                    <div className={styles.addressHeader}>
                      <h3 className={styles.addressName}>{address.name}</h3>
                      {address.isDefault && <span className={styles.defaultBadge}>Predeterminada</span>}
                    </div>
                    <div className={styles.addressDetails}>
                      <p className={styles.recipientName}>{address.recipient}</p>
                      <p>{address.street}</p>
                      <p>
                        {address.postalCode}, {address.city}, {address.country}
                      </p>
                      <p>{address.phone}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className={styles.addAddressCard}>
                <div className={styles.addAddressIcon}>
                  <MapPin size={24} />
                </div>
                <span>AÃ±adir nueva direcciÃ³n</span>
              </div>
            </div>

            <h2 className={styles.sectionSubtitle}>MÃ©todo de envÃ­o</h2>

            <div className={styles.shippingOptions}>
              {shippingOptions.map((option) => (
                <div
                  key={option.id}
                  className={`${styles.shippingOption} ${selectedShipping === option.id ? styles.selectedShipping : ""}`}
                  onClick={() => setSelectedShipping(option.id)}
                >
                  <div className={styles.shippingRadio}>
                    <input
                      type="radio"
                      id={`shipping-${option.id}`}
                      name="selectedShipping"
                      checked={selectedShipping === option.id}
                      onChange={() => setSelectedShipping(option.id)}
                    />
                    <label htmlFor={`shipping-${option.id}`}></label>
                  </div>
                  <div className={styles.shippingContent}>
                    <div className={styles.shippingIcon}>{option.icon}</div>
                    <div className={styles.shippingDetails}>
                      <h3 className={styles.shippingName}>{option.name}</h3>
                      <p className={styles.shippingDescription}>{option.description}</p>
                    </div>
                    <div className={styles.shippingPrice}>{option.price.toFixed(2)}â‚¬</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <Link href="/checkout" className={styles.backButton}>
              Volver al pago
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
                      <span className={styles.itemPrice}>{item.price.toFixed(2)}â‚¬</span>
                      <span className={styles.itemQuantity}>x{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}â‚¬</span>
              </div>
              <div className={styles.summaryRow}>
                <span>EnvÃ­o</span>
                <span>{shipping.toFixed(2)}â‚¬</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>{total.toFixed(2)}â‚¬</span>
              </div>
            </div>
          </div>

          <div className={styles.deliveryInfo}>
            <div className={styles.deliveryIcon}>
              <Truck size={24} />
            </div>
            <div className={styles.deliveryContent}>
              <h3>InformaciÃ³n de entrega</h3>
              <p>
                {selectedShipping === 1
                  ? "RecibirÃ¡s tu pedido en 3-5 dÃ­as laborables."
                  : "RecibirÃ¡s tu pedido en 24-48 horas."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}