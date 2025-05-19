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
  sabor: string
  tamano: string
  onFound: (info: {
    saborP: string
    tamanoP: string
    price: number
    offer: number
    cantidadPrdActual: number
    hayStockEnOtrasVariantes?: boolean 
  }) => void
}

export default function StockSelectorSaborTamano({
  productId,
  sabor,
  tamano,
  onFound,
}: StockAutoSelectorProps) {
  useEffect(() => {
    if (!productId) return

    const stockList = sacarStock(productId)
    if (!stockList) return
    const match = stockList.find(item => item.tamano === tamano && item.sabor === sabor)
    const hayStockEnOtrasVariantes = stockList.some(item =>
        (item.sabor !== sabor || item.tamano !== tamano) && item.cantidad > 0
    )

    if (match) {
      onFound({
        saborP: match.sabor,
        tamanoP: match.tamano,
        price: match.precio,
        offer: match.oferta ?? 0,
        cantidadPrdActual: match.cantidad ?? 0,
        hayStockEnOtrasVariantes
      })
    }
  }, [productId, onFound, sabor, tamano])

  return null
}
