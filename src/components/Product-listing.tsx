"use client"

import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import OfferProductCard from "./ContenedorPorducto"
import styles from "../styles/Product-listing.module.css"
import { allProducts } from "../products/listaArchivos"
import ProductFilters from "./filtroProductos"
import ProductSort from "./ordenadorProductso"
import Link from 'next/link';

// Importar la función especiales
import { especiales } from "../products/listaArchivos"

interface ProductListingProps {
  searchTerm?: string
  displayMode?: "grid" | "column"
  title?: string
  coleccionEspecial?: string
}

export default function ProductListing({
  searchTerm,
  displayMode = "grid",
  title = "Suplementos Deportivos",
  coleccionEspecial,
}: ProductListingProps) {
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(0)
  const productosPorPagina = displayMode === "column" ? 6 : 16

  // Estados para los filtros
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [selectedMarcas, setSelectedMarcas] = useState<string[]>([])
  const [selectedTipos, setSelectedTipos] = useState<string[]>([])
  const [selectedFormatos, setSelectedFormatos] = useState<string[]>([])
  const [selectedSabores, setSelectedSabores] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState(0)
  const [showOffers, setShowOffers] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")

  // Obtener valores únicos para los filtros
  const marcas = [...new Set(allProducts.map((product) => product.marca))]
  const tipos = [...new Set(allProducts.map((product) => product.tipo))]

  // Precio mínimo y máximo para el rango
  const minPrice = Math.floor(Math.min(...allProducts.map((p) => p.offerPrice || p.originalPrice)))
  const maxPrice = Math.ceil(Math.max(...allProducts.map((p) => p.offerPrice || p.originalPrice)))

  // Inicializar el rango de precios
  useEffect(() => {
    setPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  // Filtrar por colección especial si existe
  let baseProducts = allProducts
  if (coleccionEspecial) {
    baseProducts = especiales(coleccionEspecial)
  }

  // Filtrar por término de búsqueda si existe
  const searchFilteredProducts = searchTerm
    ? baseProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.marca && product.marca.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.tipo && product.tipo.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : baseProducts

  // Aplicar filtros
  const filteredProducts = searchFilteredProducts.filter((product) => {
    // Filtro de precio
    const productPrice = product.offerPrice || product.originalPrice
    if (productPrice < priceRange[0] || productPrice > priceRange[1]) return false

    // Filtro de marca
    if (selectedMarcas.length > 0 && !selectedMarcas.includes(product.marca)) return false

    // Filtro de tipo
    if (selectedTipos.length > 0 && !selectedTipos.includes(product.tipo)) return false

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

  // Función para generar la paginación
  const renderPagination = () => {
    const visiblePages = 5 // Número de páginas visibles (sin contar puntos suspensivos)
    const pageButtons = []

    // Botón anterior
    pageButtons.push(
      <button
        key="prev"
        className={`${styles.pageButton} ${styles.navButton} ${currentPage === 0 ? styles.disabledButton : ""} hoverable`}
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
          <p className="hoverable">{i + 1}</p>
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
        className={`${styles.pageButton} ${styles.navButton} ${
          currentPage === totalPages - 1 ? styles.disabledButton : ""
        } hoverable`}
        onClick={() => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        aria-label="Página siguiente"
      >
        <ChevronRight size={16} />
      </button>,
    )

    return pageButtons
  }

  // Resetear a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(0)
  }, [priceRange, selectedMarcas, selectedTipos, selectedFormatos, selectedSabores, selectedRating, showOffers, sortBy])

  // Resetear a la primera página cuando cambia la colección especial
  useEffect(() => {
    setCurrentPage(0)
  }, [coleccionEspecial])

  return (
    <div className={styles.productListingContainer}>
      {/* Barra superior con controles */}
      <div className={styles.listingHeader}>
        <div className={styles.resultsInfo}>
          <h1 className={styles.listingTitle}>
            {searchTerm
              ? `Resultados para "${searchTerm}"`
              : coleccionEspecial
                ? `Colección: ${coleccionEspecial.replace(/(?!^)([A-Z])/g, ' $1').toLowerCase().replace(/^./, c => c.toUpperCase())}`
                : title}
          </h1>
          <p className={styles.resultsCount}>
            Mostrando {cantidadProductos > 0 ? inicio + 1 : 0}-{fin} de {cantidadProductos} productos
          </p>
        </div>

        <div className={styles.listingControls}>
          {/* Componente de ordenación */}
          <ProductSort sortBy={sortBy} setSortBy={setSortBy} />

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
        {/* Componente de filtros */}
        <ProductFilters
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          marcas={marcas}
          selectedMarcas={selectedMarcas}
          setSelectedMarcas={setSelectedMarcas}
          tipos={tipos}
          selectedTipos={selectedTipos}
          setSelectedTipos={setSelectedTipos}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          showOffers={showOffers}
          setShowOffers={setShowOffers}
          activeFiltersCount={activeFiltersCount}
          clearAllFilters={clearAllFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Contenedor de productos */}
        <div className={styles.productsContainer}>
          {/* Contenedor de productos con clase condicional basada en el modo de vista */}
          {productosPagina.length > 0 ? (
            <div className={`${styles.offerProducts} ${displayMode === "column" ? styles.columnLayout : ""}`}>
              {productosPagina.map((product, index) => (
                <OfferProductCard key={index} product={product} displayMode={displayMode} />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <p>No se encontraron productos que coincidan con los filtros seleccionados.</p>
              {displayMode === "column" ? (
                <Link href="/" className={styles.clearFiltersButton}>
                  Volver al inicio
                </Link>
              ) : (
                <button className={styles.clearFiltersButton} onClick={clearAllFilters}>
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          {/* Paginación mejorada */}
          {cantidadProductos > 0 && <div className={styles.pagination}>{renderPagination()}</div>}
        </div>
      </div>
    </div>
  )
}
