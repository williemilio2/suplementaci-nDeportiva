"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Truck, Check, CreditCard, MapPin } from 'lucide-react'
import styles from "./checkout.module.css"
import CustomCursor from "@/src/components/customCursor"
import Cookies from 'js-cookie'
import { loadStripe } from '@stripe/stripe-js';
import { useCompraStore } from '@/src/components/useCompraStore'
//e

interface ProductoProcesado {
  nombre: string
  tipo: string
  sabor: string
  tamano: string
  cantidad: number
  dinero: number
  finalDiscount: number
}
interface DatosBBDD {
  nombres: string
  precioTotal: number
}
export default function EnvioPage() {
  const [direccion, setDireccionLocal] = useState({
    calle: "",
    ciudad: "",
    codigoPostal: "",
    pais: "España",
    numero: "",
    bloque: "",
    extra: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [codigoProvisional, setCodigoProvisional] = useState("")
  const [descuentoCodigo, setDescuentoCodigo] = useState(0)
  const compraData = useCompraStore((state) => state.datosCompra)
  const [selectedShipping, setSelectedShipping] = useState(1)
  const [yaTieneUnaCompraEnSuCuenta, setYaTieneUnaCompraEnSuCuenta] = useState(false)
  const [productosTransformados, setProductosTransformados] = useState<ProductoProcesado[]>([])

  useEffect(() => {
    const token = Cookies.get("token")
    fetch("/api/comrpobarUsuarioClubAfiliados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.resultado && data.resultadoAmedias) {
          setYaTieneUnaCompraEnSuCuenta(true)
        }
      })
      .catch(console.error)
  }, [])
  const shippingOptions = [
    {
      id: 1,
      name: "Envío estándar",
      price: 3.99,
      description: "Entrega en 3-5 días laborables",
      icon: <Truck size={20} />,
    },
  ]
  const validarCodigo = () => {
    if(yaTieneUnaCompraEnSuCuenta){ alert('solo puedes usar el codigo promocional en tu priemra compra'); return}
    const codigoUpper = codigoProvisional.trim().toUpperCase()
    if (codigoUpper === "BIENVENIDA" || codigoUpper === "EMILIO") {
      setDescuentoCodigo(0.10) // 10%
      alert("Código válido, se aplicó un 10% de descuento")
    } else {
      setDescuentoCodigo(0)
      alert("Código inválido")
    }
  }

  // Procesar productos cuando cambien los datos
  useEffect(() => {
    if (!compraData) return

    try {
      // Procesar productos comprados: "Extreme PROTEINd COMPLEX&%&undefined<<<Pro MUSCLE BUILDER&%&undefined<<<"
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
  const descuentoAmount = subtotal * descuentoCodigo
  const total = subtotal + shipping - descuentoAmount
  const meterDatosStripe = async (datosbbdd: DatosBBDD) => {
    const productos = datosbbdd.nombres.split('<<<')
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: productos.map((item: string) => item.split('&%&')[0].trim()),
        precioTotal: datosbbdd.precioTotal + shipping
      }),
    })

    const session = await response.json()
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)
    stripe?.redirectToCheckout({ sessionId: session.id })
  }
  const handleContinue = () => {
    const token = Cookies.get('token')
    if (!token) return alert("No hay token. Inicia sesión.")

    if (
      !direccion.calle ||
      !direccion.ciudad ||
      !direccion.codigoPostal ||
      !direccion.numero
    ) {
      alert("Por favor, completa todos los campos de la dirección.")
      return
    }

    setIsLoading(true)

    const direccionFinal = `${direccion.ciudad},${direccion.calle},${direccion.numero},${direccion.bloque},${direccion.codigoPostal} | ${direccion.extra}`
    const compraData = useCompraStore.getState().datosCompra
    if (!compraData) return
    // Asegúrate de que estos campos existen en el store
    const { productosComprados, precioTotal } = compraData

    const pedidoCompleto = {
      ...compraData,
      direccionFinal,
      precioTotal: precioTotal + shipping - descuentoAmount
    }

    // Guardar en localStorage
    localStorage.setItem('pedido', JSON.stringify(pedidoCompleto))

    // Crear el objeto para Stripe
    const resultStripe = {
      nombres: productosComprados,
      precioTotal: precioTotal - descuentoAmount,
    }
    alert(resultStripe.precioTotal)

    meterDatosStripe(resultStripe)
  }

  if (!compraData) {
    return (
      <div className={styles.checkoutContainer}>
        <CustomCursor />
        <div className={styles.loadingPayment}>
          <div className={styles.spinner}></div>
          <p>Cargando datos de la compra...</p>
        </div>
      </div>
    )
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
            <Truck size={18} />
          </div>
          <span className={styles.stepText}>Envío</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={styles.progressStep}>
          <div className={styles.stepIcon}>
            <CreditCard size={18} />
          </div>
          <span className={styles.stepText}>Pago</span>
        </div>
        <div className={styles.progressLine}></div>
        <div className={styles.progressStep}>
          <div className={styles.stepIcon}>
            <Check size={18} />
          </div>
          <span className={styles.stepText}>Final</span>
        </div>
      </div>

      <div className={styles.checkoutContent}>
        <div className={styles.checkoutMain}>
          <div className={styles.sectionTitle}>
            <h1>Dirección de envío</h1>
            <p>Completa los datos de entrega para tu pedido</p>
          </div>

          <div className={styles.shippingSection}>
            <h2 className={styles.subsectionTitle}>
              <Truck size={18} />
              Método de envío
            </h2>

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
                    <div className={styles.shippingPrice}>
                      {subtotal >= 35 ? (
                        <span className={styles.freeShipping}>Gratis</span>
                      ) : (
                        `${option.price.toFixed(2)}€`
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.addressSection}>
            <h2 className={styles.subsectionTitle}>
              <MapPin size={18} />
              Dirección de entrega
            </h2>

            <div className={styles.addressForm}>
              <div className={styles.formRow}>
                <div className={`${styles.formGroup} hoverable`}>
                  <label htmlFor="calle">Calle *</label>
                  <input
                    type="text"
                    id="calle"
                    placeholder="Nombre de la calle"
                    value={direccion.calle}
                    onChange={(e) => setDireccionLocal({ ...direccion, calle: e.target.value })}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={`${styles.formGroup} hoverable`}>
                  <label htmlFor="numero">Número *</label>
                  <input
                    type="text"
                    id="numero"
                    placeholder="Nº"
                    value={direccion.numero}
                    onChange={(e) => setDireccionLocal({ ...direccion, numero: e.target.value })}
                    className={styles.formInput}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} hoverable`}>
                  <label htmlFor="bloque">Bloque/Portal</label>
                  <input
                    type="text"
                    id="bloque"
                    placeholder="2A (opcional)"
                    value={direccion.bloque}
                    onChange={(e) => setDireccionLocal({ ...direccion, bloque: e.target.value })}
                    className={styles.formInput}
                  />
                </div>
                <div className={`${styles.formGroup} hoverable`}>
                  <label htmlFor="codigoPostal">Código Postal *</label>
                  <input
                    type="text"
                    id="codigoPostal"
                    placeholder="12345"
                    maxLength={6}
                    value={direccion.codigoPostal}
                    onChange={(e) => setDireccionLocal({ ...direccion, codigoPostal: e.target.value })}
                    className={styles.formInput}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} hoverable`}>
                  <label htmlFor="ciudad">Ciudad *</label>
                  <input
                    type="text"
                    id="ciudad"
                    placeholder="Tu ciudad"
                    value={direccion.ciudad}
                    onChange={(e) => setDireccionLocal({ ...direccion, ciudad: e.target.value })}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="pais">País</label>
                  <input
                    type="text"
                    id="pais"
                    value={direccion.pais}
                    className={styles.formInput}
                    disabled
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={`${styles.formGroup} hoverable`}>
                  <label htmlFor="ciudad">Informacion extra</label>
                  <input
                    type="text"
                    id="extra"
                    placeholder="Info extra"
                    value={direccion.extra}
                    onChange={(e) => setDireccionLocal({ ...direccion, extra: e.target.value })}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div className={`${styles.formGroup} hoverable`} style={{display: 'flex'}}>
                  <label htmlFor="codigoProvisional">Código provisional</label>
                  <input
                    type="text"
                    id="codigoProvisional"
                    placeholder="Introduce un código"
                    value={codigoProvisional}
                    onChange={(e) => setCodigoProvisional(e.target.value)}
                    className={styles.formInput}
                  />
                  <button
                    type="button"
                    onClick={validarCodigo}
                    className={styles.continueButton}
                    style={{ marginTop: '0.5rem' }}
                  >
                    Aplicar código
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <Link href="/carrito" className={`${styles.backButton} hoverable`}>
              Volver al carrito
            </Link>
            <button
              className={`${styles.continueButton} ${isLoading ? styles.loading : ""} hoverable`}
              onClick={handleContinue}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                <>
                  Continuar al pago <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        <div className={styles.checkoutSidebar}>
          <div className={styles.orderSummary}>
            <h2 className={styles.summaryTitle}>Resumen del pedido</h2>

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

            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              {descuentoCodigo > 0 && (
                <div className={styles.summaryRow} style={{ color: 'green' }}>
                  <span>Descuento código</span>
                  <span>-{descuentoAmount.toFixed(2)}€</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Envío</span>
                {shipping === 0 ? (
                  <span className={styles.freeShipping}>Gratis</span>
                ) : (
                  <span>{shipping.toFixed(2)}€</span>
                )}
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>

            {subtotal >= 35 && (
              <div className={styles.freeShippingBanner}>
                🎉 ¡Envío gratis! Has superado los 35€
              </div>
            )}
          </div>
              
          <div className={styles.deliveryInfo}>
            <div className={styles.deliveryIcon}>
              <Truck size={24} />
            </div>
            <div className={styles.deliveryContent}>
              <h3>Información de entrega</h3>
              <p>Recibirás tu pedido en 3-5 días laborables.</p>
              <p className={styles.deliveryNote}>
                Te enviaremos un email con el seguimiento del envío.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}