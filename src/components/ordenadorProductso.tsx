"use client"

import type React from "react"
import styles from "../styles/Product-listing.module.css"

interface ProductSortProps {
  sortBy: string
  setSortBy: (sortBy: string) => void
}

export default function ProductSort({ sortBy, setSortBy }: ProductSortProps) {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }

  return (
    <div className={styles.sortContainer}>
      <label htmlFor="sort-select" className={styles.sortLabel}>
        Ordenar por:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={handleSortChange}
        className={`${styles.sortSelect} hoverable`}
        aria-label="Ordenar productos"
      >
        <option value="relevance">Relevancia</option>
        <option value="price_asc">Precio: de menor a mayor</option>
        <option value="price_desc">Precio: de mayor a menor</option>
        <option value="rating">Mejor valorados</option>
        <option value="newest">Más recientes</option>
        <option value="bestselling">Más vendidos</option>
      </select>
    </div>
  )
}
