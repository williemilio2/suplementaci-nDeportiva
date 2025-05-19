"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
} from "lucide-react"
import styles from "../admin.module.css"

export default function ProductsPage() {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  // Datos de ejemplo para los productos
  const products = [
    {
      id: 1,
      name: "High-Quality MASS PROTEIN",
      image: "/images/muscle-gain.jpg",
      category: "Proteínas",
      brand: "Ronnie Coleman",
      price: "€37.98",
      stock: 1,
      status: "active",
      statusText: "Activo",
    },
    {
      id: 2,
      name: "Creatina Monohidrato",
      image: "/images/supplement-deals.jpg",
      category: "Creatina",
      brand: "HSN",
      price: "€24.99",
      stock: 47,
      status: "active",
      statusText: "Activo",
    },
    {
      id: 3,
      name: "Pre-Workout Extreme",
      image: "/images/fat-loss.jpg",
      category: "Pre-entreno",
      brand: "Prozis",
      price: "€39.99",
      stock: 32,
      status: "active",
      statusText: "Activo",
    },
    {
      id: 4,
      name: "BCAA 2:1:1",
      image: "/images/recovery.jpg",
      category: "Aminoácidos",
      brand: "Optimum Nutrition",
      price: "€29.99",
      stock: 18,
      status: "active",
      statusText: "Activo",
    },
    {
      id: 5,
      name: "Multivitamínico Sport",
      image: "/images/health.jpg",
      category: "Vitaminas",
      brand: "Now Foods",
      price: "€19.99",
      stock: 64,
      status: "active",
      statusText: "Activo",
    },
    {
      id: 6,
      name: "Omega-3 Fish Oil",
      image: "/images/health.jpg",
      category: "Ácidos grasos",
      brand: "Nordic Naturals",
      price: "€27.99",
      stock: 0,
      status: "outofstock",
      statusText: "Sin stock",
    },
    {
      id: 7,
      name: "Proteína Vegana",
      image: "/images/vegan-diet.jpg",
      category: "Proteínas",
      brand: "Vegan Power",
      price: "€49.99",
      stock: 23,
      status: "active",
      statusText: "Activo",
    },
    {
      id: 8,
      name: "ZMA",
      image: "/images/health.jpg",
      category: "Minerales",
      brand: "Scitec Nutrition",
      price: "€19.99",
      stock: 0,
      status: "draft",
      statusText: "Borrador",
    },
  ]

  // Filtrar productos por término de búsqueda
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "price") {
      const priceA = Number.parseFloat(a.price.replace("€", ""))
      const priceB = Number.parseFloat(b.price.replace("€", ""))
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA
    } else if (sortBy === "stock") {
      return sortOrder === "asc" ? a.stock - b.stock : b.stock - a.stock
    }
    return 0
  })

  // Paginación
  const productsPerPage = 5
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Manejar selección de productos
  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((productId) => productId !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  // Manejar selección de todos los productos
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(currentProducts.map((product) => product.id))
    }
    setSelectAll(!selectAll)
  }

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedProducts([])
    setSelectAll(false)
  }

  // Manejar cambio de ordenación
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  return (
    <div className={styles.productsContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Productos</h1>
        <Link href="/admin/productosAdmin/nuevoProducto" className={styles.addButton}>
          <Plus size={16} />
          Añadir producto
        </Link>
      </div>

      <div className={styles.toolbarContainer}>
        <div className={styles.searchFilterContainer}>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className={styles.filterButton} onClick={() => setFilterOpen(!filterOpen)}>
            <Filter size={18} />
            Filtros
          </button>

          {filterOpen && (
            <div className={styles.filterDropdown}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Categoría</label>
                <select className={styles.filterSelect}>
                  <option value="">Todas las categorías</option>
                  <option value="proteinas">Proteínas</option>
                  <option value="creatina">Creatina</option>
                  <option value="pre-entreno">Pre-entreno</option>
                  <option value="aminoacidos">Aminoácidos</option>
                  <option value="vitaminas">Vitaminas</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Marca</label>
                <select className={styles.filterSelect}>
                  <option value="">Todas las marcas</option>
                  <option value="hsn">HSN</option>
                  <option value="optimum-nutrition">Optimum Nutrition</option>
                  <option value="prozis">Prozis</option>
                  <option value="ronnie-coleman">Ronnie Coleman</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Estado</label>
                <select className={styles.filterSelect}>
                  <option value="">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="draft">Borrador</option>
                  <option value="outofstock">Sin stock</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Precio</label>
                <div className={styles.priceRangeInputs}>
                  <input type="number" placeholder="Min" className={styles.priceInput} />
                  <span>-</span>
                  <input type="number" placeholder="Max" className={styles.priceInput} />
                </div>
              </div>

              <div className={styles.filterActions}>
                <button className={styles.applyFiltersButton}>Aplicar filtros</button>
                <button className={styles.resetFiltersButton}>Restablecer</button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.bulkActionsContainer}>
          {selectedProducts.length > 0 && (
            <>
              <span className={styles.selectedCount}>{selectedProducts.length} seleccionados</span>
              <button className={styles.bulkActionButton}>
                <Edit size={16} />
                Editar
              </button>
              <button className={`${styles.bulkActionButton} ${styles.deleteButton}`}>
                <Trash2 size={16} />
                Eliminar
              </button>
            </>
          )}
          <button className={styles.exportButton}>
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      <div className={styles.productsTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell} style={{ width: "40px" }}>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className={styles.checkbox}
              title="Seleccionar todos"
            />
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
            style={{ flex: 3 }}
            onClick={() => handleSort("name")}
          >
            <span>Producto</span>
            <ArrowUpDown size={14} className={styles.sortIcon} />
          </div>
          <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
            Categoría
          </div>
          <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
            Marca
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
            style={{ flex: 1 }}
            onClick={() => handleSort("price")}
          >
            <span>Precio</span>
            <ArrowUpDown size={14} className={styles.sortIcon} />
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
            style={{ flex: 1 }}
            onClick={() => handleSort("stock")}
          >
            <span>Stock</span>
            <ArrowUpDown size={14} className={styles.sortIcon} />
          </div>
          <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
            Estado
          </div>
          <div className={styles.tableHeaderCell} style={{ width: "60px" }}>
            Acciones
          </div>
        </div>

        <div className={styles.tableBody}>
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.id} className={styles.tableRow}>
                <div className={styles.tableCell} style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className={styles.checkbox}
                  />
                </div>
                <div className={styles.tableCell} style={{ flex: 3 }}>
                  <div className={styles.productCell}>
                    <div className={styles.productImage}>
                      <Image src={product.image || "/placeholder.svg"} width={40} height={40} alt={product.name} />
                    </div>
                    <Link href={`/admin/products/${product.id}`} className={styles.productName}>
                      {product.name}
                    </Link>
                  </div>
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  {product.category}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  {product.brand}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  {product.price}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  <span className={`${styles.stockBadge} ${product.stock === 0 ? styles.stockOut : ""}`}>
                    {product.stock}
                  </span>
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  <span className={`${styles.statusBadge} ${styles[`status${product.status}`]}`}>
                    {product.statusText}
                  </span>
                </div>
                <div className={styles.tableCell} style={{ width: "60px" }}>
                  <div className={styles.actionDropdown}>
                    <button className={styles.actionButton}>
                      <MoreHorizontal size={16} />
                    </button>
                    <div className={styles.actionMenu}>
                      <Link href={`/admin/products/${product.id}`} className={styles.actionMenuItem}>
                        <Edit size={14} />
                        Editar
                      </Link>
                      <button className={`${styles.actionMenuItem} ${styles.deleteMenuItem}`}>
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.paginationContainer}>
        <div className={styles.paginationInfo}>
          Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)} de{" "}
          {sortedProducts.length} productos
        </div>
        <div className={styles.paginationControls}>
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.paginationButton} ${currentPage === page ? styles.activePage : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
