"use client"

import styles from "../styles/Product-listing.module.css"

interface ProductSortProps {
  sortBy: string
  setSortBy: (sortBy: string) => void
}

export default function ProductSort({ sortBy, setSortBy }: ProductSortProps) {
  return (
    <div className={styles.sortControl}>
      <label htmlFor="sortBy" className={styles.sortLabel}>
        Ordenar por:
      </label>
      <select
        id="sortBy"
        className={`${styles.sortSelect} hoverable`}
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="relevance">Relevancia</option>
        <option value="price_asc">Precio: Menor a Mayor</option>
        <option value="price_desc">Precio: Mayor a Menor</option>
        <option value="rating">Mejor Valorados</option>
        <option value="newest">Más Recientes</option>
        <option value="bestselling">Más Vendidos</option>
      </select>
    </div>
  )
}
