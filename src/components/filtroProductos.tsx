"use client"

import { Check, ChevronDown, X, Filter } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import styles from "../styles/filtroProductos.module.css"

interface ProductFiltersProps {
  minPrice: number
  maxPrice: number
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  marcas: string[]
  selectedMarcas: string[]
  setSelectedMarcas: (marcas: string[]) => void
  tipos: string[]
  selectedTipos: string[]
  setSelectedTipos: (tipos: string[]) => void
  sabores: string[]
  selectedSabores: string[]
  setSelectedSabores: (sabores: string[]) => void
  selectedRating: number
  setSelectedRating: (rating: number) => void
  showOffers: boolean
  setShowOffers: (show: boolean) => void
  activeFiltersCount: number
  clearAllFilters: () => void
  showFilters: boolean
  setShowFilters: (show: boolean) => void
}

export default function ProductFilters({
  minPrice,
  maxPrice,
  priceRange,
  setPriceRange,
  marcas,
  selectedMarcas,
  setSelectedMarcas,
  tipos,
  selectedTipos,
  setSelectedTipos,
  sabores,
  selectedSabores,
  setSelectedSabores,
  selectedRating,
  setSelectedRating,
  showOffers,
  setShowOffers,
  activeFiltersCount,
  clearAllFilters,
  showFilters,
  setShowFilters,
}: ProductFiltersProps) {
  // Estados para los dropdowns
  const [showMarcasDropdown, setShowMarcasDropdown] = useState(false)
  const [showSaboresDropdown, setShowSaboresDropdown] = useState(false)
  const [showTiposDropdown, setShowTiposDropdown] = useState(false)
  const [marcaSearchTerm, setMarcaSearchTerm] = useState("")
  const [saborSearchTerm, setSaborSearchTerm] = useState("")
  const [tipoSearchTerm, setTipoSearchTerm] = useState("")

  // Refs para los dropdowns
  const marcasDropdownRef = useRef<HTMLDivElement>(null)
  const saboresDropdownRef = useRef<HTMLDivElement>(null)
  const tiposDropdownRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  // Filtrar marcas según el término de búsqueda
  const filteredMarcas = marcas.filter((marca) => marca.toLowerCase().includes(marcaSearchTerm.toLowerCase()))

  // Filtrar sabores según el término de búsqueda
  const filteredSabores = sabores.filter((sabor) => sabor.toLowerCase().includes(saborSearchTerm.toLowerCase()))

  // Filtrar tipos según el término de búsqueda
  const filteredTipos = tipos.filter((tipo) => tipo.toLowerCase().includes(tipoSearchTerm.toLowerCase()))

  // Función para alternar una marca en la selección
  const toggleMarca = (marca: string) => {
    if (selectedMarcas.includes(marca)) {
      setSelectedMarcas(selectedMarcas.filter((m) => m !== marca))
    } else {
      setSelectedMarcas([...selectedMarcas, marca])
    }
  }

  // Función para alternar un sabor en la selección
  const toggleSabor = (sabor: string) => {
    if (selectedSabores.includes(sabor)) {
      setSelectedSabores(selectedSabores.filter((s) => s !== sabor))
    } else {
      setSelectedSabores([...selectedSabores, sabor])
    }
  }

  // Función para alternar un tipo en la selección
  const toggleTipo = (tipo: string) => {
    if (selectedTipos.includes(tipo)) {
      setSelectedTipos(selectedTipos.filter((t) => t !== tipo))
    } else {
      setSelectedTipos([...selectedTipos, tipo])
    }
  }

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (marcasDropdownRef.current && !marcasDropdownRef.current.contains(event.target as Node)) {
        setShowMarcasDropdown(false)
      }
      if (saboresDropdownRef.current && !saboresDropdownRef.current.contains(event.target as Node)) {
        setShowSaboresDropdown(false)
      }
      if (tiposDropdownRef.current && !tiposDropdownRef.current.contains(event.target as Node)) {
        setShowTiposDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Limpiar términos de búsqueda al cerrar dropdowns
  useEffect(() => {
    if (!showMarcasDropdown) {
      setMarcaSearchTerm("")
    }
    if (!showSaboresDropdown) {
      setSaborSearchTerm("")
    }
    if (!showTiposDropdown) {
      setTipoSearchTerm("")
    }
  }, [showMarcasDropdown, showSaboresDropdown, showTiposDropdown])

  // Manejar clic en el overlay para cerrar filtros en móvil
  const handleOverlayClick = () => {
    setShowFilters(false)
  }

  return (
    <>
      {/* Overlay para móvil */}
      <div
        className={`${styles.filtersOverlay} ${showFilters ? styles.overlayVisible : ""}`}
        onClick={handleOverlayClick}
      ></div>

      {/* Botón de filtros para móvil */}
      <button
        className={styles.mobileFilterButton}
        onClick={() => setShowFilters(!showFilters)}
        aria-label="Mostrar filtros"
      >
        <Filter size={24} />
        {activeFiltersCount > 0 && <span className={styles.filterBadge}>{activeFiltersCount}</span>}
      </button>

      <div className={`${styles.filtersContainer} ${showFilters ? styles.filtersVisible : ""}`} ref={filtersRef}>
        <button className={styles.closeFiltersButton} onClick={() => setShowFilters(false)} aria-label="Cerrar filtros">
          <X size={24} />
        </button>

        <div className={styles.filtersHeader}>
          <h2 className={styles.filtersTitle}>Filtros</h2>
          {activeFiltersCount > 0 && (
            <button onClick={clearAllFilters} className={`${styles.clearFiltersButton} hoverable`}>
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Filtro de tipos */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Tipo</h3>
          <div className={styles.customSelect}>
            <div
              onClick={() => setShowTiposDropdown(!showTiposDropdown)}
              className={`${styles.selectHeader} hoverable`}
            >
              <span>
                {selectedTipos.length === 0
                  ? "Todos los tipos"
                  : selectedTipos.length === 1
                    ? selectedTipos[0]
                    : `${selectedTipos.length} tipos seleccionados`}
              </span>
              <ChevronDown
                size={16}
                className={`${styles.dropdownIcon} ${showTiposDropdown ? styles.dropdownIconOpen : ""}`}
              />
            </div>
            {showTiposDropdown && (
              <div ref={tiposDropdownRef} className={styles.selectDropdown}>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Buscar tipo..."
                    value={tipoSearchTerm}
                    onChange={(e) => setTipoSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className={`${styles.searchInput} hoverable`}
                  />
                </div>
                <div className={styles.optionsContainer}>
                  {filteredTipos.map((tipo) => (
                    <div
                      key={tipo}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTipo(tipo)
                      }}
                      className={`${styles.optionItem} ${selectedTipos.includes(tipo) ? styles.optionSelected : ""} hoverable`}
                    >
                      <div className={styles.checkboxContainer}>
                        <div
                          className={`${styles.checkbox} ${selectedTipos.includes(tipo) ? styles.checkboxChecked : ""}`}
                        >
                          {selectedTipos.includes(tipo) && <Check size={12} />}
                        </div>
                      </div>
                      <span>{tipo}</span>
                    </div>
                  ))}
                  {filteredTipos.length === 0 && <div className={styles.noResults}>No se encontraron tipos</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filtro de marcas */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Marca</h3>
          <div className={styles.customSelect}>
            <div
              onClick={() => setShowMarcasDropdown(!showMarcasDropdown)}
              className={`${styles.selectHeader} hoverable`}
            >
              <span>
                {selectedMarcas.length === 0
                  ? "Todas las marcas"
                  : selectedMarcas.length === 1
                    ? selectedMarcas[0]
                    : `${selectedMarcas.length} marcas seleccionadas`}
              </span>
              <ChevronDown
                size={16}
                className={`${styles.dropdownIcon} ${showMarcasDropdown ? styles.dropdownIconOpen : ""}`}
              />
            </div>
            {showMarcasDropdown && (
              <div ref={marcasDropdownRef} className={styles.selectDropdown}>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Buscar marca..."
                    value={marcaSearchTerm}
                    onChange={(e) => setMarcaSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className={`${styles.searchInput} hoverable`}
                  />
                </div>
                <div className={styles.optionsContainer}>
                  {filteredMarcas.map((marca) => (
                    <div
                      key={marca}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleMarca(marca)
                      }}
                      className={`${styles.optionItem} ${selectedMarcas.includes(marca) ? styles.optionSelected : ""} hoverable`}
                    >
                      <div className={styles.checkboxContainer}>
                        <div
                          className={`${styles.checkbox} ${selectedMarcas.includes(marca) ? styles.checkboxChecked : ""}`}
                        >
                          {selectedMarcas.includes(marca) && <Check size={12} />}
                        </div>
                      </div>
                      <span>{marca}</span>
                    </div>
                  ))}
                  {filteredMarcas.length === 0 && <div className={styles.noResults}>No se encontraron marcas</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filtro de sabores */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Sabor</h3>
          <div className={styles.customSelect}>
            <div
              onClick={() => setShowSaboresDropdown(!showSaboresDropdown)}
              className={`${styles.selectHeader} hoverable`}
            >
              <span>
                {selectedSabores.length === 0
                  ? "Todos los sabores"
                  : selectedSabores.length === 1
                    ? selectedSabores[0]
                    : `${selectedSabores.length} sabores seleccionados`}
              </span>
              <ChevronDown
                size={16}
                className={`${styles.dropdownIcon} ${showSaboresDropdown ? styles.dropdownIconOpen : ""}`}
              />
            </div>
            {showSaboresDropdown && (
              <div ref={saboresDropdownRef} className={styles.selectDropdown}>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Buscar sabor..."
                    value={saborSearchTerm}
                    onChange={(e) => setSaborSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className={`${styles.searchInput} hoverable`}
                  />
                </div>
                <div className={styles.optionsContainer}>
                  {filteredSabores.map((sabor) => (
                    <div
                      key={sabor}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSabor(sabor)
                      }}
                      className={`${styles.optionItem} ${selectedSabores.includes(sabor) ? styles.optionSelected : ""} hoverable`}
                    >
                      <div className={styles.checkboxContainer}>
                        <div
                          className={`${styles.checkbox} ${selectedSabores.includes(sabor) ? styles.checkboxChecked : ""}`}
                        >
                          {selectedSabores.includes(sabor) && <Check size={12} />}
                        </div>
                      </div>
                      <span>{sabor}</span>
                    </div>
                  ))}
                  {filteredSabores.length === 0 && <div className={styles.noResults}>No se encontraron sabores</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filtro de ofertas */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Ofertas</h3>
          <label className={`${styles.checkboxLabel} hoverable`}>
            <input
              type="checkbox"
              checked={showOffers}
              onChange={() => setShowOffers(!showOffers)}
              style={{ marginRight: "0.5rem" }}
            />
            Mostrar solo ofertas
          </label>
        </div>

        {/* Filtro de valoración */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Valoración</h3>
          <div className={styles.radioGroup}>
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className={`${styles.radioLabel} hoverable`}>
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() => setSelectedRating(rating)}
                  style={{ marginRight: "0.5rem" }}
                />
                {rating} {rating === 1 ? "estrella" : "estrellas"} o más
              </label>
            ))}
            {selectedRating > 0 && (
              <button onClick={() => setSelectedRating(0)} className={`${styles.resetButton} hoverable`}>
                Mostrar todas las valoraciones
              </button>
            )}
          </div>
        </div>

        {/* Filtro de rango de precio */}
        <div className={styles.priceRangeContainer}>
          <h3 className={styles.filterTitle}>Rango de Precio</h3>
            <div className={styles.rangeSliders}>
              <span>{priceRange[0]}€</span>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                className={`${styles.rangeInput} hoverable`}
              />
              <span>{priceRange[1]}€</span>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                className={`${styles.rangeInput} hoverable`}
              />
            </div>
        </div>
      </div>
    </>
  )
}
