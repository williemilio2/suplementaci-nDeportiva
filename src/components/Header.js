"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, Heart, TrendingUp, X } from "lucide-react"
import styles from "../styles/Header.module.css"
import { allProducts } from "../products/listaArchivos"

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
  const [carritoItems, setCarritoItems] = useState(0)
  const [favItems, setFavItems] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

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
        product.tipo.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      window.location.href = `/buscar?q=${encodeURIComponent(searchTerm)}`
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      window.location.href = `/buscar?q=${encodeURIComponent(searchTerm)}`
    }
  }

  const applyPopularSearch = (term) => {
    setSearchTerm(term)
    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase()) ||
        product.marca.toLowerCase().includes(term.toLowerCase()) ||
        product.tipo.toLowerCase().includes(term.toLowerCase())
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleSearch()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleSearch])

  const updateCartCount = () => {
    const carritoString = localStorage.getItem("carrito")
    if (carritoString) {
      const carrito = JSON.parse(carritoString)
      setCarritoItems(carrito.length)
    } else {
      setCarritoItems(0)
    }
  }

  const updateFavCount = () => {
    const favoritosString = localStorage.getItem("favoritos")
    if (favoritosString) {
      const favoritos = JSON.parse(favoritosString)
      setFavItems(favoritos.length)
    } else {
      setFavItems(0)
    }
  }

  useEffect(() => {
    if (!isClient) return

    const carritoString = localStorage.getItem("carrito")
    const carrito = carritoString ? JSON.parse(carritoString) : []
    setCarritoItems(carrito.length)

    const favString = localStorage.getItem("favoritos")
    const favoritos = favString ? JSON.parse(favString) : []
    setFavItems(favoritos.length)

    window.addEventListener("favoritesUpdated", updateFavCount)
    window.addEventListener("cartUpdated", updateCartCount)
    window.addEventListener("storage", (event) => {
      if (event.key === "carrito") updateCartCount()
      if (event.key === "favoritos") updateFavCount()
    })

    return () => {
      window.removeEventListener("favoritesUpdated", updateFavCount)
      window.removeEventListener("cartUpdated", updateCartCount)
      window.removeEventListener("storage", () => {})
    }
  }, [isClient])

  return (
    <header className={styles.header}>
      <div className={`${styles.logo} hoverable`}>
        <Link href="/">
          <Image src="/logoAlante.png" alt="HSN Logo" width={120} height={50} />
        </Link>
      </div>

      {isClient && (
        <div className={styles.searchContainer} ref={searchRef}>
          <div className={styles.searchInputWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por: Producto, Objetivo, Ingrediente..."
              className={`${styles.searchInput} hoverable`}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onKeyDown={handleKeyPress}
            />
            {searchTerm && (
              <button className={`${styles.clearButton} hoverable`} onClick={() => setSearchTerm("")}>
                <X size={16} />
              </button>
            )}
            <button className={`${styles.searchButton} hoverable`} onClick={handleSearch}>
              <Search size={20} />
            </button>
          </div>

          {showResults && (
            <div className={styles.searchResults}>
              <div className={styles.popularTermsSection}>
                <div className={styles.popularTermsHeader}>
                  <TrendingUp size={18} />
                  <h3>Terminos populares</h3>
                </div>
                <div className={styles.popularTermsList}>
                  {popularSearchTerms.map((term, index) => (
                    <button key={index} className={`${styles.popularTermButton} hoverable`} onClick={() => applyPopularSearch(term)}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>

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
                              {product.originalPrice ? `${product.originalPrice.toFixed(2)}â‚¬` : ""}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {filteredProducts.length > 5 && (
                      <Link href={`/buscar?q=${encodeURIComponent(searchTerm)}`} className={`${styles.viewAllResults} hoverable`} onClick={handleSearch}>
                        Ver todos los resultados ({filteredProducts.length})
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {isClient && (
        <div className={styles.headerRight}>
          <Link href="/favoritos" className={`${styles.cartButton} hoverable`}>
            <div className={styles.cartIcon} style={{ backgroundColor: "red" }}>
              <Heart size={20} />
            </div>
            <span className={`${styles.cartCount} ${styles.favCount}`}>
              {favItems}
            </span>
          </Link>
          <Link href="/carrito" className={`${styles.cartButton} hoverable`}>
            <div className={styles.cartIcon}>
              <ShoppingBag size={20} />
            </div>
            <span className={styles.cartCount}>{carritoItems}</span>
          </Link>
        </div>
      )}
    </header>
  )
}