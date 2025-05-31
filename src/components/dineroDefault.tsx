"use client"

import { useEffect, useRef } from "react"
import { sacarStock } from "../products/listaArchivos"

interface StockAutoSelectorProps {
  productId: number
  onFound: (info: {
    price: number
    offer: number
    cantidad?: number;
  }) => void
}

export default function StockAutoSelector({ productId, onFound }: StockAutoSelectorProps) {
  // Usar una referencia para el timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Si no hay ID de producto, no hacer nada pero llamar a onFound para evitar carga infinita
    if (!productId) {
      onFound({ price: 0, offer: 0 })
      return
    }

    // Establecer un timeout para asegurar que siempre se llame a onFound
    timeoutRef.current = setTimeout(() => {
      onFound({ price: 0, offer: 0 })
    }, 3000) // 3 segundos de timeout

    try {
      const stockList = sacarStock(productId)
      // Si no hay stock, llamar a onFound con valores por defecto
      if (!stockList || stockList.length === 0) {
        onFound({ price: 0, offer: 0 })
        clearTimeout(timeoutRef.current)
        return
      }

      // Buscar primero los que tienen oferta y stock
      const conOferta = stockList.find((item) => item.cantidad > 0 && item.oferta)

      if (conOferta) {
        onFound({
          price: conOferta.precio,
          offer: conOferta.oferta ?? 0,
          cantidad: conOferta.cantidad,
        })
        clearTimeout(timeoutRef.current)
        return
      }

      // Si no hay con oferta, buscar cualquier variante con stock
      const conStock = stockList.find((item) => item.cantidad > 0)

      if (conStock) {
        onFound({
          price: conStock.precio,
          offer: conStock.oferta ?? 0,
          cantidad: conStock.cantidad,
        })
        clearTimeout(timeoutRef.current)
        return
      }

      // Si llegamos aquí, no se encontró ningún producto con stock
      // Usar el primer elemento de la lista como fallback
      if (stockList.length > 0) {
        onFound({
          price: stockList[0].precio,
          offer: stockList[0].oferta ?? 0,
          cantidad: stockList[0].cantidad ?? 0,
        })
        clearTimeout(timeoutRef.current)
        return
      }

      // Si no hay ningún elemento, llamar a onFound con valores por defecto
      onFound({ price: 0, offer: 0 })
      clearTimeout(timeoutRef.current)
    } catch (error) {
      console.error(`Error al cargar stock para producto ${productId}:`, error)
      onFound({ price: 0, offer: 0 })
      clearTimeout(timeoutRef.current)
    }
  }, [productId, onFound])

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return null
}
