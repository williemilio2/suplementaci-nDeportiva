"use client"

import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import OfferProductCard from "./ContenedorPorducto"
import styles from "../styles/Product-listing.module.css"
import ProductFilters from "./filtroProductos"
import ProductSort from "./ordenadorProductso"
import Link from "next/link"
import StockAutoSelector from "./dineroDefault"
import { ensureDataLoaded } from "../products/listaArchivos"
import type { Product } from "../types/product"

// Importar la función especiales
import { especiales } from "../products/listaArchivos"

interface ProductListingProps {
  searchTerm?: string
  displayMode?: "grid" | "column"
  title?: string
  coleccionEspecial?: string
}

// Interfaz para almacenar los precios y ofertas de los productos
interface ProductPricing {
  [productId: number]: {
    price: number
    offer: number
  }
}

export default function ProductListing({
  searchTerm,
  displayMode = "grid",
  title = "Suplementos Deportivos",
  coleccionEspecial,
}: ProductListingProps) {
  // Estado para los productos
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(0)
  const productosPorPagina = displayMode === "column" ? 6 : 12

  // Estados para los filtros
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedMarcas, setSelectedMarcas] = useState<string[]>([])
  const [selectedTipos, setSelectedTipos] = useState<string[]>([])
  const [selectedFormatos, setSelectedFormatos] = useState<string[]>([])
  const [selectedSabores, setSelectedSabores] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState(0)
  const [showOffers, setShowOffers] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")

  // Estado para almacenar los precios y ofertas de los productos
  const [productPricing, setProductPricing] = useState<ProductPricing>({})
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  // Usar useRef para evitar actualizaciones infinitas
  const pricesInitialized = useRef(false)
  const productsToLoad = useRef<number[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cargar productos desde la base de datos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const { allProducts: products } = await ensureDataLoaded()

        // Asegurarse de que todos los productos tengan los campos requeridos
        const validatedProducts = products.map((p) => ({
          ...p,
          description: p.description || "",
          image: p.image || "",
          tipo: p.tipo || "",
        })) as Product[]

        setAllProducts(validatedProducts)
      } catch (error) {
        console.error("Error al cargar productos:", error)
        setAllProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filtrar por colección especial si existe
  let baseProducts = allProducts
  if (coleccionEspecial && allProducts.length > 0) {
    const filteredProducts = especiales(coleccionEspecial)
    // Asegurarse de que todos los productos tengan los campos requeridos
    baseProducts = filteredProducts.map((p) => ({
      ...p,
      description: p.description || "",
      image: p.image || "",
      tipo: p.tipo || "",
    })) as Product[]
  }

  // Filtrar por término de búsqueda si existe
  const searchFilteredProducts = searchTerm
    ? baseProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : baseProducts

  // Función para calcular el precio final con descuento
  const calculateFinalPrice = useCallback(
    (productId: number) => {
      const pricing = productPricing[productId]
      if (!pricing) return 0

      return pricing.offer > 0 ? pricing.price - (pricing.price * pricing.offer) / 100 : pricing.price
    },
    [productPricing],
  )

  // Obtener valores únicos para los filtros
  const marcas = [...new Set(searchFilteredProducts.map((product) => product.marca))].filter(Boolean).sort()

  // Asegurarse de que tipos no contenga undefined
  const tipos = [...new Set(searchFilteredProducts.map((product) => product.tipo))]
    .filter((tipo): tipo is string => Boolean(tipo))
    .sort()

  // Extraer todos los sabores únicos de los productos
  const extractSabores = (saboresString?: string): string[] => {
    if (!saboresString) return []
    return saboresString.split("<<<").filter(Boolean)
  }

  const sabores = [...new Set(searchFilteredProducts.flatMap((product) => extractSabores(product.sabores)))]
    .filter(Boolean)
    .sort()

  // Inicializar la lista de productos a cargar
  useEffect(() => {
    productsToLoad.current = searchFilteredProducts.map((product) => product.id)
  }, [searchFilteredProducts])

  // Calcular precio mínimo y máximo después de cargar los precios
  useEffect(() => {
    // Solo actualizar el rango de precios una vez que tengamos suficientes precios
    // y solo si no se ha inicializado antes
    if (Object.keys(productPricing).length > 0 && isLoadingPrices && !pricesInitialized.current) {
      const prices = searchFilteredProducts
        .map((product) => calculateFinalPrice(product.id))
        .filter((price) => price > 0)

      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices))
        const maxPrice = Math.ceil(Math.max(...prices))

        // Solo actualizar si los valores son diferentes
        if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice) {
          setPriceRange([minPrice, maxPrice])
          pricesInitialized.current = true
        }

        // Marcar como cargado si tenemos precios para la mayoría de los productos
        if (Object.keys(productPricing).length >= searchFilteredProducts.length * 0.8) {
          setIsLoadingPrices(false)
        }
      }
    }
  }, [productPricing, searchFilteredProducts, calculateFinalPrice, priceRange, isLoadingPrices])

  // Función para manejar los precios encontrados
  const handlePriceFound = useCallback((productId: number, price: number, offer: number) => {
    setProductPricing((prev) => {
      // Si ya tenemos este precio, no actualizar
      if (prev[productId] && prev[productId].price === price && prev[productId].offer === offer) {
        return prev
      }
      return {
        ...prev,
        [productId]: { price, offer },
      }
    })

    // Eliminar el producto de la lista de productos a cargar
    productsToLoad.current = productsToLoad.current.filter((id) => id !== productId)
  }, [])

  // Aplicar filtros
  const filteredProducts = searchFilteredProducts.filter((product) => {
    // Filtro de precio
    const productPrice = calculateFinalPrice(product.id)

    // Si no hay precio (fuera de stock) y no estamos filtrando por precio, mostrar el producto
    if (productPrice === 0 && priceRange[0] === 0) return true

    // Si estamos filtrando por precio y el producto no tiene precio o está fuera del rango, no mostrarlo
    if (productPrice < priceRange[0] || productPrice > priceRange[1]) return false

    // Filtro de marca
    if (selectedMarcas.length > 0 && !selectedMarcas.includes(product.marca)) return false

    // Filtro de tipo
    if (selectedTipos.length > 0 && !selectedTipos.includes(product.tipo)) return false

    // Filtro de sabor
    if (selectedSabores.length > 0) {
      const productSabores = extractSabores(product.sabores)
      if (!selectedSabores.some((sabor) => productSabores.includes(sabor))) return false
    }

    // Filtro de valoración
    if (selectedRating > 0 && product.rating < selectedRating) return false

    // Filtro de ofertas
    if (showOffers && (!productPricing[product.id] || productPricing[product.id].offer <= 0)) return false

    return true
  })

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = calculateFinalPrice(a.id)
    const priceB = calculateFinalPrice(b.id)

    switch (sortBy) {
      case "price_asc":
        // Productos sin precio (fuera de stock) van al final
        if (priceA === 0 && priceB === 0) return 0
        if (priceA === 0) return 1
        if (priceB === 0) return -1
        return priceA - priceB
      case "price_desc":
        // Productos sin precio (fuera de stock) van al final
        if (priceA === 0 && priceB === 0) return 0
        if (priceA === 0) return 1
        if (priceB === 0) return -1
        return priceB - priceA
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
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)

  // Función para limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    // Calcular min y max precio de los productos disponibles
    const prices = searchFilteredProducts.map((product) => calculateFinalPrice(product.id)).filter((price) => price > 0)

    const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0
    const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000

    setPriceRange([minPrice, maxPrice])
    setSelectedMarcas([])
    setSelectedTipos([])
    setSelectedFormatos([])
    setSelectedSabores([])
    setSelectedRating(0)
    setShowOffers(false)
    setSortBy("relevance")
  }, [searchFilteredProducts, calculateFinalPrice])

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
    // Reiniciar el estado de precios cuando cambia la colección
    setProductPricing({})
    setIsLoadingPrices(true)
    pricesInitialized.current = false
  }, [coleccionEspecial, searchTerm])

  // Efecto para forzar la actualización del estado de carga de precios después de un tiempo
  useEffect(() => {
    // Limpiar el timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Si estamos cargando precios, establecer un timeout para forzar la finalización después de 5 segundos
    if (isLoadingPrices) {
      timeoutRef.current = setTimeout(() => {
        // Verificar si tenemos al menos algunos precios o si ha pasado demasiado tiempo
        if (Object.keys(productPricing).length > 0 || searchFilteredProducts.length === 0) {
          console.log("Forzando finalización de carga de precios por timeout")
          setIsLoadingPrices(false)
        }
      }, 5000) // 5 segundos
    }

    // Limpiar el timeout al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isLoadingPrices, productPricing, searchFilteredProducts.length])

  // Efecto adicional para verificar si todos los productos tienen precio
  useEffect(() => {
    // Si ya no estamos cargando, no hacer nada
    if (!isLoadingPrices) return

    // Verificar si todos los productos visibles tienen precio
    const allProductsHavePrice = searchFilteredProducts.every((product) => {
      return Object.keys(productPricing).includes(product.id.toString())
    })

    // Si todos los productos tienen precio o no hay productos, finalizar la carga
    if (allProductsHavePrice || searchFilteredProducts.length === 0) {
      console.log("Todos los productos tienen precio o no hay productos, finalizando carga")
      setIsLoadingPrices(false)
    }
  }, [productPricing, searchFilteredProducts, isLoadingPrices])

  // Mostrar pantalla de carga mientras se cargan los productos
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando productos...</p>
        <div className={styles.spinner}></div>
      </div>
    )
  }

  // Determinar si mostrar el indicador de carga de precios
  const showPriceLoading =
    isLoadingPrices &&
    Object.keys(productPricing).length < searchFilteredProducts.length / 2 &&
    searchFilteredProducts.length > 0

  return (
    <div className={styles.productListingContainer}>

      {/* Componentes StockAutoSelector solo para productos que aún no tienen precio */}
      {productsToLoad.current.map((productId) => (
        <StockAutoSelector
          key={`stock-${productId}`}
          productId={productId}
          onFound={({ price, offer }) => handlePriceFound(productId, price, offer)}
        />
      ))}

      {/* Barra superior con controles */}
      <div className={styles.listingHeader}>
        <div className={styles.resultsInfo}>
          <h1 className={styles.listingTitle}>
            {searchTerm
              ? `Resultados para "${searchTerm}"`
              : coleccionEspecial
                ? `Colección: ${coleccionEspecial
                    .replace(/(?!^)([A-Z])/g, " $1")
                    .toLowerCase()
                    .replace(/^./, (c) => c.toUpperCase())}`
                : title}
          </h1>
          <p className={styles.resultsCount}>
            Mostrando {cantidadProductos > 0 ? inicio + 1 : 0}-{fin} de {cantidadProductos} productos
          </p>
        </div>

        {/* Reemplazar la parte donde se usa el componente ProductSort */}
        <div className={styles.listingControls}>
          {/* Componente de ordenación */}
          <ProductSort sortBy={sortBy} setSortBy={setSortBy} />

          <button
            className={`${styles.mobileFilterButton} mobileFilterButton`}
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
          minPrice={(() => {
            const prices = Object.values(productPricing)
              .map((p) => p.price)
              .filter((p) => p > 0)
            return prices.length > 0 ? Math.floor(Math.min(...prices)) : 0
          })()}
          maxPrice={(() => {
            const prices = Object.values(productPricing)
              .map((p) => p.price)
              .filter((p) => p > 0)
            return prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000
          })()}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          marcas={marcas}
          selectedMarcas={selectedMarcas}
          setSelectedMarcas={setSelectedMarcas}
          tipos={tipos}
          selectedTipos={selectedTipos}
          setSelectedTipos={setSelectedTipos}
          sabores={sabores}
          selectedSabores={selectedSabores}
          setSelectedSabores={setSelectedSabores}
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
          {showPriceLoading ? (
            <div className={styles.loadingContainer}>
              <p>Cargando precios...</p>
              <div className={styles.spinner}></div>
            </div>
          ) : productosPagina.length > 0 ? (
            <div className={`${styles.offerProducts} ${displayMode === "column" ? styles.columnLayout : ""}`}>
              {productosPagina.map((product, index) => (
                <OfferProductCard key={`product-${product.id}-${index}`} product={product} displayMode={displayMode} />
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
