"use client"

import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react"
import { useEffect, useState } from "react"
import OfferProductCard from "./ContenedorPorducto"
import styles from "../styles/Product-listing.module.css"
import { allProducts }  from '../others/listaArchivos'

export default function ProductListing() {

  //A esta mierda le faltan de datos: Vendidos, ingredientes
const [currentPage, setCurrentPage] = useState(0)
const productosPorPagina = 16

// Estados para los filtros
const [showFilters, setShowFilters] = useState(false)
const [priceRange, setPriceRange] = useState([0, 100])
const [selectedMarcas, setSelectedMarcas] = useState([])
const [selectedTipos, setSelectedTipos] = useState([])
const [selectedFormatos, setSelectedFormatos] = useState([])
const [selectedSabores, setSelectedSabores] = useState([])
const [selectedRating, setSelectedRating] = useState(0)
const [showOffers, setShowOffers] = useState(false)
const [sortBy, setSortBy] = useState("relevance")

// Obtener valores únicos para los filtros
const marcas = [...new Set(allProducts.map((product) => product.marca))]
const tipos = [...new Set(allProducts.map((product) => product.tipo))]
const formatos = [...new Set(allProducts.map((product) => product.formato))]
const sabores = [...new Set(allProducts.map((product) => product.sabor))]

// Precio mínimo y máximo para el rango
const minPrice = Math.floor(Math.min(...allProducts.map((p) => p.offerPrice || p.originalPrice)))
const maxPrice = Math.ceil(Math.max(...allProducts.map((p) => p.offerPrice || p.originalPrice)))

// Inicializar el rango de precios
useEffect(() => {
  setPriceRange([minPrice, maxPrice])
}, [minPrice, maxPrice])

// Aplicar filtros
const filteredProducts = allProducts.filter((product) => {
  // Filtro de precio
  const productPrice = product.offerPrice || product.originalPrice
  if (productPrice < priceRange[0] || productPrice > priceRange[1]) return false

  // Filtro de marca
  if (selectedMarcas.length > 0 && !selectedMarcas.includes(product.marca)) return false

  // Filtro de tipo
  if (selectedTipos.length > 0 && !selectedTipos.includes(product.tipo)) return false

  // Filtro de formato
  if (selectedFormatos.length > 0 && !selectedFormatos.includes(product.formato)) return false

  // Filtro de sabor
  if (selectedSabores.length > 0 && !selectedSabores.includes(product.sabor)) return false

  // Filtro de valoración
  if (selectedRating > 0 && product.rating < selectedRating) return false

  // Filtro de ofertas
  if (showOffers && !product.offerPrice) return false

  return true
})

// Ordenar productos
const sortedProducts = [...filteredProducts].sort((a, b) => {
  switch (sortBy) {
    case "price_asc":
      return (a.offerPrice || a.originalPrice) - (b.offerPrice || b.originalPrice)
    case "price_desc":
      return (b.offerPrice || b.originalPrice) - (a.offerPrice || a.originalPrice)
    case "rating":
      return b.rating - a.rating
    case "newest":
      return b.id - a.id // Asumiendo que ID más alto = más nuevo
    case "bestselling":
      return b.reviews - a.reviews // Asumiendo que más reviews = más vendido
    default:
      return 0
  }
})

// Recalcular paginación con productos filtrados
const cantidadProductos = sortedProducts.length
const totalPages = Math.ceil(cantidadProductos / productosPorPagina)

// Asegurarse de que la página actual es válida después de filtrar
useEffect(() => {
  if (currentPage >= totalPages && totalPages > 0) {
    setCurrentPage(totalPages - 1)
  }
}, [sortedProducts.length, currentPage, totalPages])

const inicio = currentPage * productosPorPagina
const fin = Math.min(inicio + productosPorPagina, cantidadProductos)
const productosPagina = sortedProducts.slice(inicio, fin)

// Número de filtros activos
const activeFiltersCount =
  (selectedMarcas.length > 0 ? 1 : 0) +
  (selectedTipos.length > 0 ? 1 : 0) +
  (selectedFormatos.length > 0 ? 1 : 0) +
  (selectedSabores.length > 0 ? 1 : 0) +
  (selectedRating > 0 ? 1 : 0) +
  (showOffers ? 1 : 0) +
  (priceRange[0] > minPrice || priceRange[1] < maxPrice ? 1 : 0)

// Función para limpiar todos los filtros
const clearAllFilters = () => {
  setPriceRange([minPrice, maxPrice])
  setSelectedMarcas([])
  setSelectedTipos([])
  setSelectedFormatos([])
  setSelectedSabores([])
  setSelectedRating(0)
  setShowOffers(false)
  setSortBy("relevance")
}

// Función para manejar cambios en los checkboxes
const handleCheckboxChange = (value, state, setState) => {
  setState((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
}

// Función para generar la paginación
const renderPagination = () => {
  const visiblePages = 5 // Número de páginas visibles (sin contar puntos suspensivos)
  const pageButtons = []

  // Botón anterior
  pageButtons.push(
    <button
      key="prev"
      className={`${styles.pageButton} ${styles.navButton} ${currentPage === 0 ? styles.disabledButton : ""}`}
      onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
      disabled={currentPage === 0}
      aria-label="Página anterior"
    >
      <ChevronLeft size={16} />
    </button>,
  )

  // Determinar qué páginas mostrar
  let startPage, endPage

  if (totalPages <= visiblePages + 2) {
    // +2 para primera y última
    // Si hay pocas páginas, mostrar todas
    startPage = 0
    endPage = totalPages - 1
  } else {
    // Calcular páginas a mostrar
    const halfVisible = Math.floor(visiblePages / 2)

    if (currentPage <= halfVisible) {
      // Estamos cerca del inicio
      startPage = 0
      endPage = visiblePages - 1
    } else if (currentPage >= totalPages - halfVisible - 1) {
      // Estamos cerca del final
      startPage = totalPages - visiblePages
      endPage = totalPages - 1
    } else {
      // Estamos en el medio
      startPage = currentPage - halfVisible
      endPage = currentPage + halfVisible
    }
  }

  // Siempre mostrar la primera página
  pageButtons.push(
    <div
      key={0}
      className={`${styles.pageButton} ${currentPage === 0 ? styles.activePageButton : ""}`}
      onClick={() => setCurrentPage(0)}
    >
      1
    </div>,
  )

  // Mostrar puntos suspensivos después de la primera página si es necesario
  if (startPage > 1) {
    pageButtons.push(
      <div key="dots1" className={`${styles.pageButton} ${styles.dotsButton}`}>
        ...
      </div>,
    )
  }

  // Mostrar páginas del medio
  for (let i = Math.max(1, startPage); i <= Math.min(totalPages - 2, endPage); i++) {
    pageButtons.push(
      <div
        key={i}
        className={`${styles.pageButton} ${currentPage === i ? styles.activePageButton : ""}`}
        onClick={() => setCurrentPage(i)}
      >
        {i + 1}
      </div>,
    )
  }

  // Mostrar puntos suspensivos antes de la última página si es necesario
  if (endPage < totalPages - 2) {
    pageButtons.push(
      <div key="dots2" className={`${styles.pageButton} ${styles.dotsButton}`}>
        ...
      </div>,
    )
  }

  // Siempre mostrar la última página si hay más de una página
  if (totalPages > 1) {
    pageButtons.push(
      <div
        key={totalPages - 1}
        className={`${styles.pageButton} ${currentPage === totalPages - 1 ? styles.activePageButton : ""}`}
        onClick={() => setCurrentPage(totalPages - 1)}
      >
        {totalPages}
      </div>,
    )
  }

  // Botón siguiente
  pageButtons.push(
    <button
      key="next"
      className={`${styles.pageButton} ${styles.navButton} ${currentPage === totalPages - 1 ? styles.disabledButton : ""}`}
      onClick={() => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}
      disabled={currentPage === totalPages - 1}
      aria-label="Página siguiente"
    >
      <ChevronRight size={16} />
    </button>,
  )

  return pageButtons
}
useEffect(() => {
  setCurrentPage(0) // Resetear a la primera página (índice 0)
}, [
  // Dependencias: todos los estados de filtros
  priceRange,
  selectedMarcas,
  selectedTipos,
  selectedFormatos,
  selectedSabores,
  selectedRating,
  showOffers,
  sortBy // Incluir también el ordenamiento
]);
return (
  <div className={styles.productListingContainer}>
    {/* Barra superior con controles */}
    <div className={styles.listingHeader}>
      <div className={styles.resultsInfo}>
        <h1 className={styles.listingTitle}>Suplementos Deportivos</h1>
        <p className={styles.resultsCount}>
          Mostrando {cantidadProductos > 0 ? inicio + 1 : 0}-{fin} de {cantidadProductos} productos
        </p>
      </div>

      <div className={styles.listingControls}>
        <div className={styles.sortControl}>
          <label htmlFor="sortBy" className={styles.sortLabel}>
            Ordenar por:
          </label>
          <select
            id="sortBy"
            className={styles.sortSelect}
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

        <button
          className={styles.mobileFilterButton}
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Mostrar filtros"
        >
          <SlidersHorizontal size={20} />
          <span>Filtros</span>
          {activeFiltersCount > 0 && <span className={styles.filterBadge}>{activeFiltersCount}</span>}
        </button>
      </div>
    </div>

    <div className={styles.productListingContent}>
      {/* Panel de filtros */}
      <aside className={`${styles.filtersPanel} ${showFilters ? styles.showMobileFilters : ""}`}>
        <div className={styles.filterHeader}>
          <h2 className={styles.filterTitle}>Filtros</h2>
          {activeFiltersCount > 0 && (
            <button className={styles.clearFiltersButton} onClick={clearAllFilters}>
              Limpiar todos
            </button>
          )}
          <button className={styles.closeFiltersButton} onClick={() => setShowFilters(false)}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.filtersList}>
          {/* Filtro de precio */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Precio</h3>
            <div className={styles.priceRangeContainer}>
              <div className={styles.priceSlider}>
                {/* Aquí iría un slider, pero como no usamos componentes UI, usamos inputs */}
                <div className={styles.priceInputs}>
                  <div className={styles.priceInput}>
                    <span className={styles.currencySymbol}>€</span>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      min={minPrice}
                      max={priceRange[1]}
                    />
                  </div>
                  <span className={styles.priceSeparator}>-</span>
                  <div className={styles.priceInput}>
                    <span className={styles.currencySymbol}>€</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      min={priceRange[0]}
                      max={maxPrice}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtro de marcas */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Marcas</h3>
            <div className={styles.filterOptions}>
              {marcas.map((marca) => (
                <div key={marca} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    id={`marca-${marca}`}
                    checked={selectedMarcas.includes(marca)}
                    onChange={() => handleCheckboxChange(marca, selectedMarcas, setSelectedMarcas)}
                  />
                  <label htmlFor={`marca-${marca}`} className={styles.filterLabel}>
                    {marca}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filtro de tipos */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Tipo de producto</h3>
            <div className={styles.filterOptions}>
              {tipos.map((tipo) => (
                <div key={tipo} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    id={`tipo-${tipo}`}
                    checked={selectedTipos.includes(tipo)}
                    onChange={() => handleCheckboxChange(tipo, selectedTipos, setSelectedTipos)}
                  />
                  <label htmlFor={`tipo-${tipo}`} className={styles.filterLabel}>
                    {tipo}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filtro de formatos */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Formato</h3>
            <div className={styles.filterOptions}>
              {formatos.map((formato) => (
                <div key={formato} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    id={`formato-${formato}`}
                    checked={selectedFormatos.includes(formato)}
                    onChange={() => handleCheckboxChange(formato, selectedFormatos, setSelectedFormatos)}
                  />
                  <label htmlFor={`formato-${formato}`} className={styles.filterLabel}>
                    {formato}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filtro de sabores */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Sabor</h3>
            <div className={styles.filterOptions}>
              {sabores.map((sabor) => (
                <div key={sabor} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    id={`sabor-${sabor}`}
                    checked={selectedSabores.includes(sabor)}
                    onChange={() => handleCheckboxChange(sabor, selectedSabores, setSelectedSabores)}
                  />
                  <label htmlFor={`sabor-${sabor}`} className={styles.filterLabel}>
                    {sabor}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filtro de valoraciones */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterSectionTitle}>Valoración</h3>
            <div className={styles.filterOptions}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className={styles.filterOption}>
                  <input
                    type="radio"
                    id={`rating-${rating}`}
                    name="rating"
                    checked={selectedRating === rating}
                    onChange={() => setSelectedRating(rating)}
                  />
                  <label htmlFor={`rating-${rating}`} className={styles.filterLabel}>
                    <div className={styles.ratingStars}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < rating ? styles.starFilled : styles.star}>
                          ★
                        </span>
                      ))}
                      {rating < 5 && <span className={styles.ratingText}>o más</span>}
                    </div>
                  </label>
                </div>
              ))}
              {selectedRating > 0 && (
                <button className={styles.clearRatingButton} onClick={() => setSelectedRating(0)}>
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Filtro de ofertas */}
          <div className={styles.filterSection}>
            <div className={styles.filterOption}>
              <input
                type="checkbox"
                id="offers-only"
                checked={showOffers}
                onChange={() => setShowOffers(!showOffers)}
              />
              <label htmlFor="offers-only" className={styles.filterLabel}>
                Solo ofertas
              </label>
            </div>
          </div>

          {/* Botón de aplicar filtros (solo móvil) */}
          <div className={styles.mobileFilterActions}>
            <button className={styles.applyFiltersButton} onClick={() => setShowFilters(false)}>
              Aplicar filtros
              {activeFiltersCount > 0 && <span className={styles.filterBadge}>{activeFiltersCount}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Contenedor de productos */}
      <div className={styles.productsContainer}>
        {/* Contenedor de productos con clase condicional basada en el modo de vista */}
        {productosPagina.length > 0 ? (
          <div className={styles.offerProducts}>
            {productosPagina.map((product, index) => (
              <OfferProductCard key={index} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>No se encontraron productos que coincidan con los filtros seleccionados.</p>
            <button className={styles.clearFiltersButton} onClick={clearAllFilters}>
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Paginación mejorada */}
        {cantidadProductos > 0 && <div className={styles.pagination}>{renderPagination()}</div>}
      </div>
    </div>
  </div>
)
}
