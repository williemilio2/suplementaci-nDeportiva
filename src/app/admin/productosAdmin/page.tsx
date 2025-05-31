"use client"

import { useState,useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit
} from "lucide-react"
import styles from "../admin.module.css"
import * as XLSX from "xlsx";
import { ensureDataLoaded } from "@/src/products/listaArchivos"
import type { Product } from "@/src/types/product"
import StockAutoSelector from "@/src/components/dineroDefault"
import EditModal from "@/src/components/editProduct";
/*interface Orders {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
  marca: string;
  tipo: string;
  colesterol: string;
  superOfertas: boolean; // Asumiendo que NUMERIC se usa como booleano
  slug: string;
  informacionAlergenos: string;
  infoIngredientes: string;
  modoDeUso: string;
  recomendacionesDeUso: string;
  sabores: string;
  categoriaEspecial: string;

  // Información nutricional
  product_id: number;
  porcion: string;
  calorias: string;
  proteinas: string;
  carbohidratos: string;
  azucares: string;
  grasas: string;
  grasasSaturadas: string;
  fibra: string;
  sal: string;
  sodio: string;
  calcio: string;
  hierro: string;
  vitaminaD: string;
  vitaminaB12: string;
  enzimasDigestivas: string;
  aminoacidos: string;
}*/

export default function ProductsPage() {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setAllProducts] = useState<Product[]>([])
  const [stocks, setStocks] = useState<{ [productId: number]: { dinero: number; oferta: number, cantidad: number } }>({})
  const [modalOpen, setModalOpen] = useState(false);
  
  const sacarPrimeraFoto = (imageArray: string) => imageArray.split('<<<')[0];
  useEffect(() => {
    const loadProducts = async () => {
      try {
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
      }
    }

    loadProducts()
  }, [])
  const exportOrdersToExcel = (orders: Product[]) => {
    const data = orders.map(order => ({
      Producto: order.name,
      Tipo: order.tipo,
      Marca: order.marca
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");

    XLSX.writeFile(workbook, "pedidos.xlsx");
  };
  // Filtrar productos por término de búsqueda
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Paginación
  const productsPerPage = 8
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Manejar selección de productos
  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((productId) => productId !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }
  function handleEditar(){
    if(selectedProducts.length > 1) return
    setModalOpen(true);
  }  
  async function handleEliminar(){
    alert(selectedProducts)
    try {
      const res = await fetch("/api/eliminarDato", {
        method: "POST",
        body: JSON.stringify({ productIds: selectedProducts }),
      })

      const result = await res.json()

      if (result.ok) {
        window.location.reload()
        // Reset form or redirect as needed
      } else {
        alert("Error al guardar el producto")
      }
    } catch (error) {
      console.error("Error al enviar datos:", error)
      alert("Error al enviar los datos")
    }
  }
  function handleStockFound(productId: number, price: number, offer: number, cantidad?: number) {
    setStocks((prev) => {
      const current = prev[productId];
      if (current?.dinero === price && current?.oferta === offer && current?.cantidad === (cantidad ?? 0)) {
        return prev; // No cambios
      }
      return {
        ...prev,
        [productId]: {
          dinero: price,
          oferta: offer,
          cantidad: cantidad ?? 0, // valor por defecto
        },
      };
    });
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

  return (
    <div className={styles.productsContainer}>
      <div>
        <EditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} producto={selectedProducts[0]}/>
      </div>
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

          </div>

        <div className={styles.bulkActionsContainer}>
          {selectedProducts.length > 0 && (
            <>
              <span className={styles.selectedCount}>{selectedProducts.length} seleccionados</span>
              <button className={`${styles.bulkActionButton} ${styles.deleteButton} hoverable`} onClick={handleEliminar}>
                <Trash2 size={16} />
                Eliminar
              </button>              
              <button className={`${styles.bulkActionButton} hoverable`} onClick={handleEditar}>
                <Edit size={16} />
                Editar
              </button>
            </>
          )}
          <button className={styles.exportButton} onClick={() => exportOrdersToExcel(products)}>
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      <div className={styles.productsTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell} style={{ width: "50px", flex: 0 }}>
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
            style={{ flex: 2 }}
          >
            <span>Producto</span>
          </div>
          <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
            Tipo
          </div>
          <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
            Marca
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
            style={{ flex: 1 }}
          >
            <span>Precio</span>
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
            style={{ flex: 1 }}
          >
            <span>Stock</span>
          </div>
        </div>

        <div className={styles.tableBody}>
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.id} className={styles.tableRow}>
                <StockAutoSelector
                  productId={product.id}
                  onFound={({ price, offer, cantidad }) => handleStockFound(product.id, price, offer, cantidad)}
                />
                <div className={styles.tableCell} style={{ width: "50px", flex: 0 }}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className={styles.checkbox}
                  />
                </div>
                <div className={styles.tableCell} style={{ flex: 2 }}>
                  <Link href={`/productos/${product.slug}`} className={styles.productName} target="blank">
                    <div className={styles.productCell}>
                      <Image src={sacarPrimeraFoto(product.image)} width={40} height={40} alt={product.name}/>
                      {product.name}
                    </div>
                  </Link>
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  {product.tipo}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  {product.marca}
                </div>
                <div className={styles.tableCell} style={{ flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                   <p style={{textAlign: 'left', width: '100%'}}>{stocks[product.id]?.dinero ?? '—'}</p>
                   {stocks[product.id]?.oferta != 0 && <p className={styles.customerEmail} style={{textAlign: 'left', width: '100%'}}>{stocks[product.id]?.oferta ?? '—'}%</p>}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  <span className={`${styles.stockBadge} ${product.id === 0 ? styles.stockOut : ""}`}>
                    {stocks[product.id]?.cantidad ?? '—'}
                  </span>
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
          Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} de{" "}
          {filteredProducts.length} productos
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
