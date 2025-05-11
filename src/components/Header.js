"use client"

import { useState, useEffect, useRef  } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, Heart, TrendingUp, X } from "lucide-react"
import styles from "../styles/Header.module.css"
import { allProducts } from "../products/listaArchivos"

// Términos de búsqueda populares (normalmente vendrían de una API o base de datos)
const popularSearchTerms = [
  "Protein",
  "Creatina",
  "Pre-entreno",
  "BCAA",
]

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  // Filtrar productos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([])
      return
    }

    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setFilteredProducts(filtered)
  }, [searchTerm])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setShowResults(true)
  }

  const handleSearchFocus = () => {
    setShowResults(true)
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    // Aquí podrías redirigir a la página de resultados
    if (searchTerm.trim() !== "") {
      window.location.href = `/buscar?q=${encodeURIComponent(searchTerm)}`;
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      window.location.href = `/buscar?q=${encodeURIComponent(searchTerm)}`;
    }
  }

  const applyPopularSearch = (term) => {
    setSearchTerm(term)

    // Filtrar productos inmediatamente al seleccionar un término popular
    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase()) ||
        product.marca.toLowerCase().includes(term.toLowerCase()) ||
        product.tipo.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  return (
    <header className={styles.header}>
      <div className={`${styles.logo} hoverable`}>
        <Link href="/">
          <Image src="/logoAlante.png" alt="HSN Logo" width={120} height={50} />
        </Link>
      </div>

      <div className={styles.searchContainer} ref={searchRef}>
        <div className={styles.searchInputWrapper}>
          <Search size={20} className={styles.searchIcon}/>
          <input
            type="text"
            placeholder="Buscar por: Producto, Objetivo, Ingrediente..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onKeyDown={handleKeyPress}
          />
          {searchTerm && (
            <button className={styles.clearButton} onClick={() => setSearchTerm("")}>
              <X size={16} />
            </button>
          )}
          <button className={styles.searchButton} onClick={handleSearch}>
            <Search size={20} />
          </button>
        </div>

        {showResults && (
          <div className={styles.searchResults}>
            {/* Términos populares - siempre visibles en el dropdown */}
            <div className={styles.popularTermsSection}>
              <div className={styles.popularTermsHeader}>
                <TrendingUp size={18} />
                <h3>Términos populares</h3>
              </div>
              <div className={styles.popularTermsList}>
                {popularSearchTerms.map((term, index) => (
                  <button key={index} className={`${styles.popularTermButton} hoverable`} onClick={() => applyPopularSearch(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Resultados de productos - solo si hay búsqueda */}
            {filteredProducts.length > 0 && (
              <div className={styles.productResultsSection}>
                <div className={styles.resultsHeader}>
                  <h4 className={styles.resultsTitle}>Productos encontrados</h4>
                </div>
                <div className={styles.productResults}>
                  {filteredProducts.slice(0, 5).map((product) => (
                    <Link href={`/productos/${product.slug}`} key={product.id} className={`${styles.searchResultItem} hoverable`}>
                      <div className={styles.searchResultContent} onClick={() => setShowResults(false)}>
                        <div className={styles.searchResultImage}>
                          {product.image && (
                            <Image
                              src={product.image.split("<<<")[0] || "/placeholder.svg"}
                              alt={product.name}
                              width={100}
                              height={100}
                              objectFit="cover"
                            />
                          )}
                        </div>
                        <div className={styles.searchResultInfo}>
                          <h4 className={styles.searchResultName}>{product.name}</h4>
                          <p className={styles.searchResultBrand}>
                            {product.marca} - {product.tipo}
                          </p>
                          <p className={styles.searchResultPrice}>
                            {product.originalPrice ? `${product.originalPrice.toFixed(2)}€` : ""}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {filteredProducts.length > 5 && (
                    <Link href={`/buscar?q=${encodeURIComponent(searchTerm)}`} className={`${styles.viewAllResults} hoverable`}>
                      Ver todos los resultados ({filteredProducts.length})
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.headerRight}>
        <Link href="/deseados" className={`${styles.cartButton} hoverable`}>
          <div className={styles.cartIcon} style={{ backgroundColor: "red" }}>
            <Heart size={20} />
          </div>
          <span className={styles.cartCount} style={{ backgroundColor: "#DC143C !IMPORTANT" }}>
            0
          </span>
        </Link>
        <Link href="/cart" className={`${styles.cartButton} hoverable`}>
          <div className={styles.cartIcon}>
            <ShoppingBag size={20} />
          </div>
          <span className={styles.cartCount}>0</span>
        </Link>
      </div>
    </header>
    
  )
}
