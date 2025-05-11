"use client"
import { X } from "lucide-react"
import styles from "../styles/Product-listing.module.css"

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
  selectedRating,
  setSelectedRating,
  showOffers,
  setShowOffers,
  activeFiltersCount,
  clearAllFilters,
  showFilters,
  setShowFilters,
}: ProductFiltersProps) {
  // Función para manejar cambios en los checkboxes
  const handleCheckboxChange = (value: string, state: string[], setState: (state: string[]) => void) => {
    setState(state.includes(value) ? state.filter((item) => item !== value) : [...state, value])
  }

  return (
    <aside className={`${styles.filtersPanel} ${showFilters ? styles.showMobileFilters : ""}`}>
      <div className={styles.filterHeader}>
        <h2 className={styles.filterTitle}>Filtros</h2>
        {activeFiltersCount > 0 && (
          <button className={`${styles.clearFiltersButton} hoverable`} onClick={clearAllFilters}>
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
                  className="hoverable"
                />
                <label htmlFor={`marca-${marca}`} className={`${styles.filterLabel} hoverable`}>
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
                  className="hoverable"
                />
                <label htmlFor={`tipo-${tipo}`} className={`${styles.filterLabel} hoverable`}>
                  {tipo}
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
                  className="hoverable"
                />
                <label htmlFor={`rating-${rating}`} className={`${styles.filterLabel} hoverable`}>
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
              <button className={`${styles.clearRatingButton} hoverable`} onClick={() => setSelectedRating(0)}>
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
              className="hoverable"
            />
            <label htmlFor="offers-only" className={`${styles.filterLabel} hoverable`}>
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
  )
}
