"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import styles from "../admin.module.css"
import * as XLSX from "xlsx";
interface Order {
  id: number;
  correoUsuarioCompra: string;
  fechaCompleta: string;  // Puedes usar Date si lo manejas como objeto Date, pero aquí parece string
  precioTotal: number | string; // Si puede ser número o string, o solo uno de los dos
  productosComprados: string | null; // Puede ser undefined o null si no hay productos
}
interface Orders {
  id: number;
  correoUsuarioCompra: string;
  productosComprados: string;
  fechaCompleta: string;
  precioTotal: number;
}

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [orders, setOrders] = useState<Orders[]>([]);
  const [popupContent, setPopupContent] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupProducts, setPopupProducts] = useState<string[] | null>(null)

  const exportOrdersToExcel = (orders: Order[]) => {
    const data = orders.map(order => ({
      ID: order.id,
      Email: order.correoUsuarioCompra,
      Fecha: order.fechaCompleta,
      Total: `${order.precioTotal}€`,
      Productos: order.productosComprados
        ? order.productosComprados.split("<<<").map(p => p.trim()).filter(Boolean).join(", ")
        : "Sin productos",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");

    XLSX.writeFile(workbook, "pedidos.xlsx");
  };
  useEffect(() => {
    fetch('/api/cogerPedidos')
      .then(async res => {
        console.log('status:', res.status);
        const text = await res.text();
        console.log('response text:', text);
        try {
          return JSON.parse(text);
        } catch (err) {
          console.error('Error al hacer JSON.parse:', err);
          return { ok: false };
        }
      })
      .then(data => {
        if (data.ok) {
          console.log('response data:', data.dataProductos);
          setOrders(data.dataProductos);
        }
      })
      .catch(console.error);
  }, []);

  const ordersPerPage = 8
  const totalPages = Math.ceil(orders.length / ordersPerPage)
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }
  const closePopup = () => {
    setShowPopup(false)
    setPopupContent([])
  }
  return (
    <div className={styles.ordersContainer}>
      {popupProducts && (
        <div className={styles.popupOverlay} onClick={() => setPopupProducts(null)}>
          <div className={styles.popupContent} onClick={e => e.stopPropagation()}>
            <h3>Productos comprados</h3>
            <ul className={styles.popupList}>
              {popupProducts.map((prod, i) => (
                <li key={i} className={styles.popupListItem}>{prod.split('&%&')[0]}</li>
              ))}
            </ul>
            <button
              className={styles.popupCloseButton}
              onClick={() => setPopupProducts(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className={styles.ordersContainer}>
        {showPopup && (
          <div className={styles.popupOverlay} onClick={closePopup}>
            <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
              <h3>Productos comprados</h3>
              <ul>
                {popupContent.map((prod, i) => (
                  <li key={i}>{prod}</li>
                ))}
              </ul>
              <button onClick={closePopup}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Pedidos</h1>
        <button onClick={() => exportOrdersToExcel(currentOrders)} className={styles.exportButton}>
          <Download size={16} />
          Exportar pedidos
        </button>
      </div>
      <div className={styles.ordersTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell} style={{ flex: 1 }}>ID</div>
          <div className={`${styles.tableHeaderCell} ${styles.sortableHeader}`} style={{ flex: 2 }} onClick={() => handleSort("customer")}>
            <span>Cliente</span>
          </div>
          <div className={`${styles.tableHeaderCell} ${styles.sortableHeader}`} style={{ flex: 2 }} onClick={() => handleSort("date")}>
            <span>Fecha</span>
          </div>
          <div className={`${styles.tableHeaderCell} ${styles.sortableHeader}`} style={{ flex: 1 }} onClick={() => handleSort("total")}>
            <span>Total</span>
          </div>
          <div className={styles.tableHeaderCell} style={{ flex: 1 }}>Productos comprados</div>
        </div>

        <div className={styles.tableBody}>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => {
              const productosList = order.productosComprados
                ? order.productosComprados.split("<<<").map(p => p.trim()).filter(Boolean)
                : [];

              return (
                <div key={order.id} className={styles.tableRow}>
                  <div className={styles.tableCell} style={{ flex: 1 }}>
                    <Link href={`/admin/pedidos/${order.id}`} className={styles.orderIdLink}>
                      {order.id}
                    </Link>
                  </div>
                  <div className={styles.tableCell} style={{ flex: 2 }}>
                    <div className={styles.customerInfo}>
                      <span className={styles.customerName}>{order.correoUsuarioCompra}</span>
                    </div>
                  </div>
                  <div className={styles.tableCell} style={{ flex: 2 }}>{order.fechaCompleta}</div>
                  <div className={styles.tableCell} style={{ flex: 1 }}>
                    <div className={styles.orderTotal}>
                      <span className={styles.totalAmount}>{order.precioTotal}€</span>
                    </div>
                  </div>
                  <div className={styles.tableCell} style={{ flex: 1 }}>
                    {productosList.length === 1 ? (
                      <span>{productosList[0].split('&%&')[0]}</span>
                    ) : productosList.length > 1 ? (
                      <button
                        onClick={() => setPopupProducts(productosList)}
                        className={`${styles.totalAmount} ${styles.botonMasProductos}`}
                      >
                        {productosList[0].split('&%&')[0]}...
                      </button>
                    ) : (
                      <span>No hay productos</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noResults}>
              <p>No se encontraron pedidos</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.paginationContainer}>
        <div className={styles.paginationInfo}>
          Mostrando {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, orders.length)} de {orders.length} pedidos
        </div>
        <div className={styles.paginationControls}>
          <button className={styles.paginationButton} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
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
          <button className={styles.paginationButton} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
