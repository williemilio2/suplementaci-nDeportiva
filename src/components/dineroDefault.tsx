"use client"

import { useEffect } from "react"
import { sacarStock } from "../products/listaArchivos"

interface sacarStock {
  product_id: number
  sabor: string
  tamano: string
  cantidad: number
  precio: number
  oferta?: number
  name: string
}

interface StockAutoSelectorProps {
  productId: number
  onFound: (info: {
    price: number
    offer: number
  }) => void
}

export default function StockAutoSelector({
  productId,
  onFound,
}: StockAutoSelectorProps) {
  useEffect(() => {
    if (!productId) return

    const stockList = sacarStock(productId)
    if (!stockList) return

    // Buscar primero los que tienen oferta y stock
    const conOferta = stockList.find(item => item.cantidad > 0 && item.oferta)

    if (conOferta) {
      onFound({
        price: conOferta.precio,
        offer: conOferta.oferta ?? 0,
      })
      return
    }

    // Si no hay con oferta, buscar cualquier variante con stock
    const conStock = stockList.find(item => item.cantidad > 0)

    if (conStock) {
      onFound({
        price: conStock.precio,
        offer: conStock.oferta ?? 0,
      })
    }

  }, [productId, onFound])

  return null
}
