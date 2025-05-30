"use client"

import { useEffect, useState, useRef } from "react"
import styles from "../styles/ProductDetail.module.css"

interface StockItem {
  product_id: number
  sabor: string
  tamano: string
  cantidad: number
  precio: number
  oferta?: number
}

interface ProductOptionsProps {
  stockItems: StockItem[] | undefined
  onFlavorSizeChange?: (
    flavor: string | null,
    size: string | null,
    price: number,
    quantity: number | null,
    offer: number,
  ) => void
}

export default function ProductOptions({ stockItems, onFlavorSizeChange }: ProductOptionsProps) {
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const initialSelectionMade = useRef(false)

  // Detectar cuando el componente está montado en el cliente
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Extraer sabores y tamaños disponibles solo cuando el componente está montado
  const saboresDisponibles = mounted ? Array.from(new Set(stockItems?.map((item) => item.sabor) || [])) : []

  const tamanosDisponibles = mounted ? Array.from(new Set(stockItems?.map((item) => item.tamano) || [])) : []

  // Notificar cambios de selección
  useEffect(() => {
    if (!mounted) return

    if (selectedFlavor !== null && selectedSize !== null) {
      const producto = stockItems?.find((item) => item.sabor === selectedFlavor && item.tamano === selectedSize)
      const nuevoPrecioUnitario = producto?.precio ?? 0
      const cantidadProduct = producto?.cantidad ?? 0
      const ofertaProduct = producto?.oferta ?? 0

      if (onFlavorSizeChange) {
        onFlavorSizeChange(selectedFlavor, selectedSize, nuevoPrecioUnitario, cantidadProduct, ofertaProduct)
      }
    }
  }, [selectedFlavor, selectedSize, stockItems, onFlavorSizeChange, mounted])

  // Selección inicial automática
  useEffect(() => {
    if (!mounted || !stockItems || stockItems.length === 0 || initialSelectionMade.current) return

    // Usar un timeout para evitar problemas de hidratación
    const timer = setTimeout(() => {
      // 1. Buscar primero con oferta y stock
      const conOferta = stockItems.find((item) => item.cantidad > 0 && item.oferta)

      if (conOferta && selectedFlavor === null && selectedSize === null) {
        setSelectedFlavor(conOferta.sabor)
        setSelectedSize(conOferta.tamano)
        initialSelectionMade.current = true
        return
      }

      // 2. Si no hay con oferta, buscar cualquier variante con stock
      const conStock = stockItems.find((item) => item.cantidad > 0)

      if (conStock && selectedFlavor === null && selectedSize === null) {
        setSelectedFlavor(conStock.sabor)
        setSelectedSize(conStock.tamano)
        initialSelectionMade.current = true
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [stockItems, selectedFlavor, selectedSize, mounted])

  // No renderizar nada hasta que el componente esté montado
  if (!mounted) return null

  return (
    <>
      <div className={styles.variantsSection}>
        <h3 className={styles.sectionTitle}>Sabor:</h3>
        <div className={styles.flavorOptions}>
          {saboresDisponibles.map((sabor) => {
            const tieneStock =
              selectedSize === null ||
              stockItems?.some((item) => item.sabor === sabor && item.tamano === selectedSize && item.cantidad > 0)

            return (
              <button
                key={sabor}
                className={`
                  ${styles.flavorButton} 
                  ${selectedFlavor === sabor ? styles.flavorButtonActive : ""} 
                  ${!tieneStock ? styles.flavorButtonDisabled : ""} 
                  hoverable
                `}
                onClick={() => {
                  setSelectedFlavor(sabor)
                }}
                disabled={!tieneStock}
              >
                {sabor}
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.variantsSection}>
        <h3 className={styles.sectionTitle}>Tamaño:</h3>
        <div className={styles.sizeOptions}>
          {tamanosDisponibles.map((tamaño) => {
            const tieneStock =
              selectedFlavor === null ||
              stockItems?.some((item) => item.tamano === tamaño && item.sabor === selectedFlavor && item.cantidad > 0)

            return (
              <button
                key={tamaño}
                className={`
                  ${styles.sizeButton} 
                  ${selectedSize === tamaño ? styles.sizeButtonActive : ""} 
                  ${!tieneStock ? styles.sizeButtonDisabled : ""} 
                  hoverable
                `}
                onClick={() => {
                  setSelectedSize(tamaño)
                }}
                disabled={!tieneStock}
              >
                {tamaño}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
