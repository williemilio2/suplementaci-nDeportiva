"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import styles from "../styles/PopUpSelectorPrecioSabor.module.css"
import ProductOptions from "./product-options"
import { sacarStock } from "../products/listaArchivos"

interface Producto {
  id: number // 'number' en lugar de 'string'
  name: string // 'string' en lugar de 'strnig'
  description: string // 'string' en lugar de 'strnig'
  image: string // 'string
  rating: number // 'number' en lugar de 'float'
  reviews: number // 'number' está bien
  badge?: string // 'string' en lugar de 'strnig'
  marca: string // 'string' en lugar de 'strnig'
  tipo: string // 'string' en lugar de 'strnig'
  colesterol: string // 'string' en lugar de 'strnig'
  superOfertas?: boolean // 'boolean' en lugar de 'bool'
  slug: string // 'string' en lugar de 'strnig'
  informacionAlergenos: string
  infoIngredientes: string
  modoDeUso: string
  recomendacionesDeUso: string
}
interface PopUpSelectorPrecioSaborProps {
  producto: Producto
  onClose?: () => void // Añadimos esta prop para cerrars el popup
}
export default function PopUpSelectorPrecioSabor({ producto, onClose }: PopUpSelectorPrecioSaborProps) {
  // Estados para manejar las selecciones y el precio
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [precioUnitario, setPrecioUnitario] = useState<number | null>(null)
  const [cantidadProductoActual, setCantidadProductoActual] = useState<number | null>(null)
  const [ofertaProductoActual, setOfertaProductoActual] = useState<number | null>(null)

  // Obtener los items de stock para este producto
  const stockProductoActual = sacarStock(producto.id)
  const itemsDelProducto = stockProductoActual?.filter((item) => item.product_id === producto.id)

  // Manejar cambios de sabor y tamaño
  const handleFlavorSizeChange = (flavor: string | null, size: string | null, price: number, quantity: number | null, offer: number) => {
    setSelectedFlavor(flavor)
    setSelectedSize(size)
    setPrecioUnitario(price)
    if (flavor !== selectedFlavor || size !== selectedSize) {
      setQuantity(1)
    }
    setCantidadProductoActual(quantity)
    setOfertaProductoActual(offer)
  }

  // Función para añadir al carrito
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que el clic se propague al overlay

    if (!selectedFlavor || !selectedSize) {
      alert("Por favor, selecciona sabor y tamaño antes de añadir al carrito")
      return
    }

    // Aquí iría la lógica para añadir al carrito
    const carritoItem = {
      producto: producto.name,
      sabor: selectedFlavor,
      tamaño: selectedSize,
      cantidad: quantity,
    }
    type CarritoItem = {
      producto: string;
      sabor: string;
      tamaño: string;
      cantidad: number;
    };
    const carritoString = localStorage.getItem('carrito');
    const carritoActual: CarritoItem[] = carritoString ? JSON.parse(carritoString) : [];

    const existente = carritoActual.find(item => item.producto === carritoItem.producto);

    if (existente) {
      alert('Este producto ya esta en el carrito')
      return
    } else {
      // Si no existe, lo añadimos
      alert('Producto añadido!')
      carritoActual.push(carritoItem);
    }

    localStorage.setItem('carrito', JSON.stringify(carritoActual));
    if (onClose) {
      onClose()
    }
    window.dispatchEvent(new Event("cartUpdated"))
  }

  // Extraer la primera imagen si hay varias
  const imagenPrincipal = producto.image.split("<<<")[0]

  // Detener la propagación de clics dentro del popup
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className={styles.popUpDiv} onClick={handlePopupClick}>
      <div className={styles.divImage}>
        <Image src={imagenPrincipal || "/placeholder.svg"} width={100} height={100} alt={producto.name} />
      </div>
      <div className={styles.selectorsButtons}>
        {/* Componente de opciones de producto */}
        <ProductOptions
          stockItems={itemsDelProducto}
          onFlavorSizeChange={handleFlavorSizeChange}
        />

        {/* Selector de cantidad */}
        <div className={styles.quantitySection}>
          <h3 className={styles.sectionTitle}>Cantidad:</h3>
          <div className={styles.quantityControl}>
            <button
              className={`${styles.quantityButton} hoverable`}
              onClick={() => {
                if (quantity > 1) {
                  setQuantity((prev) => prev - 1)
                }
              }}
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button className={`${styles.quantityButton} hoverable`} onClick={() => setQuantity((prev) => prev + 1)} disabled={selectedFlavor == null || selectedSize == null || cantidadProductoActual === quantity}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Precio */}
        <div className={styles.priceContainer}>
           {ofertaProductoActual!= 0 ? (
              <>
                <span className={styles.currentPrice}>{(Number(precioUnitario) * (1 - (ofertaProductoActual ?? 0) / 100) * quantity).toFixed(2)}€</span>
                <span className={styles.originalPrice}>{Number(precioUnitario).toFixed(2)}€</span>
              </>
            ) : (
              <span className={styles.currentPrice}>{Number(Number(precioUnitario) * quantity).toFixed(2)}€</span>
            )}
        </div>
      </div>
      <div className={styles.botonAnadirDiv}>
        <button
          className={`${styles.addToCartButton} hoverable`}
          onClick={handleAddToCart}
          disabled={!selectedFlavor || !selectedSize}
        >
          <ShoppingCart size={18} />
          Añadir al carrito
        </button>
      </div>
    </div>
  )
}
