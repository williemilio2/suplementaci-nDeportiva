"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Printer,
  Mail,
  Trash2,
} from "lucide-react"
import styles from "../admin.module.css"

export default function OrdersPage() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [statusFilter, setStatusFilter] = useState("all")

  // Datos de ejemplo para los pedidos
  const orders = [
    {
      id: "ORD-12345",
      customer: "Juan Pérez",
      email: "juan.perez@example.com",
      date: "15 mayo, 2023 - 14:32",
      total: "€129.99",
      items: 3,
      status: "completed",
      statusText: "Completado",
      paymentMethod: "Tarjeta de crédito",
      shippingMethod: "Envío estándar",
    },
    {
      id: "ORD-12344",
      customer: "María López",
      email: "maria.lopez@example.com",
      date: "15 mayo, 2023 - 13:15",
      total: "€89.95",
      items: 2,
      status: "processing",
      statusText: "Procesando",
      paymentMethod: "PayPal",
      shippingMethod: "Envío express",
    },
    {
      id: "ORD-12343",
      customer: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      date: "15 mayo, 2023 - 11:42",
      total: "€74.50",
      items: 1,
      status: "shipped",
      statusText: "Enviado",
      paymentMethod: "Tarjeta de crédito",
      shippingMethod: "Envío estándar",
    },
    {
      id: "ORD-12342",
      customer: "Ana Martínez",
      email: "ana.martinez@example.com",
      date: "15 mayo, 2023 - 10:08",
      total: "€54.99",
      items: 1,
      status: "completed",
      statusText: "Completado",
      paymentMethod: "Transferencia bancaria",
      shippingMethod: "Recogida en tienda",
    },
    {
      id: "ORD-12341",
      customer: "Pedro Sánchez",
      email: "pedro.sanchez@example.com",
      date: "14 mayo, 2023 - 18:23",
      total: "€149.95",
      items: 4,
      status: "cancelled",
      statusText: "Cancelado",
      paymentMethod: "PayPal",
      shippingMethod: "Envío estándar",
    },
    {
      id: "ORD-12340",
      customer: "Laura García",
      email: "laura.garcia@example.com",
      date: "14 mayo, 2023 - 15:47",
      total: "€112.50",
      items: 2,
      status: "processing",
      statusText: "Procesando",
      paymentMethod: "Tarjeta de crédito",
      shippingMethod: "Envío express",
    },
    {
      id: "ORD-12339",
      customer: "Miguel Fernández",
      email: "miguel.fernandez@example.com",
      date: "14 mayo, 2023 - 12:30",
      total: "€67.99",
      items: 1,
      status: "completed",
      statusText: "Completado",
      paymentMethod: "Tarjeta de crédito",
      shippingMethod: "Envío estándar",
    },
    {
      id: "ORD-12338",
      customer: "Carmen Ruiz",
      email: "carmen.ruiz@example.com",
      date: "14 mayo, 2023 - 09:15",
      total: "€94.95",
      items: 2,
      status: "refunded",
      statusText: "Reembolsado",
      paymentMethod: "PayPal",
      shippingMethod: "Envío estándar",
    },
  ]

  // Filtrar pedidos por término de búsqueda y estado
  const filteredOrders = orders.filter((order) => {
    // Filtrar por término de búsqueda
    const searchMatch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtrar por estado
    const statusMatch = statusFilter === "all" || order.status === statusFilter

    return searchMatch && statusMatch
  })

  // Ordenar pedidos
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "date") {
      // Ordenar por fecha (asumiendo que las fechas están en formato consistente)
      return sortOrder === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
    } else if (sortBy === "total") {
      // Ordenar por total (convertir a número)
      const totalA = Number.parseFloat(a.total.replace("€", ""))
      const totalB = Number.parseFloat(b.total.replace("€", ""))
      return sortOrder === "asc" ? totalA - totalB : totalB - totalA
    } else if (sortBy === "customer") {
      // Ordenar por nombre de cliente
      return sortOrder === "asc" ? a.customer.localeCompare(b.customer) : b.customer.localeCompare(a.customer)
    }
    return 0
  })

  // Paginación
  const ordersPerPage = 5
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage)
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  // Manejar selección de pedidos
  const handleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id))
    } else {
      setSelectedOrders([...selectedOrders, id])
    }
  }

  // Manejar selección de todos los pedidos
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(currentOrders.map((order) => order.id))
    }
    setSelectAll(!selectAll)
  }

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedOrders([])
    setSelectAll(false)
  }

  // Manejar cambio de ordenación
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Pedidos</h1>
        <button className={styles.exportButton}>
          <Download size={16} />
          Exportar pedidos
        </button>
      </div>

      <div className={styles.toolbarContainer}>
        <div className={styles.searchFilterContainer}>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por ID, cliente o email..."
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
                <label className={styles.filterLabel}>Estado</label>
                <select
                  className={styles.filterSelect}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="processing">Procesando</option>
                  <option value="shipped">Enviado</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                  <option value="refunded">Reembolsado</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Método de pago</label>
                <select className={styles.filterSelect}>
                  <option value="">Todos los métodos</option>
                  <option value="credit_card">Tarjeta de crédito</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Transferencia bancaria</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Fecha</label>
                <div className={styles.dateRangeInputs}>
                  <input type="date" className={styles.dateInput} placeholder="Desde" />
                  <span>-</span>
                  <input type="date" className={styles.dateInput} placeholder="Hasta" />
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
          {selectedOrders.length > 0 && (
            <>
              <span className={styles.selectedCount}>{selectedOrders.length} seleccionados</span>
              <button className={styles.bulkActionButton}>
                <Printer size={16} />
                Imprimir
              </button>
              <button className={styles.bulkActionButton}>
                <Mail size={16} />
                Enviar email
              </button>
              <button className={`${styles.bulkActionButton} ${styles.deleteButton}`}>
                <Trash2 size={16} />
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.ordersTable}>
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
          <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
            ID
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
            style={{ flex: 2 }}
            onClick={() => handleSort("customer")}
          >
            <span>Cliente</span>
            <ArrowUpDown size={14} className={styles.sortIcon} />
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
            style={{ flex: 2 }}
            onClick={() => handleSort("date")}
          >
            <span>Fecha</span>
            <ArrowUpDown size={14} className={styles.sortIcon} />
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
            style={{ flex: 1 }}
            onClick={() => handleSort("total")}
          >
            <span>Total</span>
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
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <div key={order.id} className={styles.tableRow}>
                <div className={styles.tableCell} style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                    className={styles.checkbox}
                  />
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  <Link href={`/admin/pedidos/${order.id}`} className={styles.orderIdLink}>
                    {order.id}
                  </Link>
                </div>
                <div className={styles.tableCell} style={{ flex: 2 }}>
                  <div className={styles.customerInfo}>
                    <span className={styles.customerName}>{order.customer}</span>
                    <span className={styles.customerEmail}>{order.email}</span>
                  </div>
                </div>
                <div className={styles.tableCell} style={{ flex: 2 }}>
                  {order.date}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  <div className={styles.orderTotal}>
                    <span className={styles.totalAmount}>{order.total}</span>
                    <span className={styles.itemCount}>{order.items} productos</span>
                  </div>
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  <span className={`${styles.statusBadge} ${styles[`status${order.status}`]}`}>{order.statusText}</span>
                </div>
                <div className={styles.tableCell} style={{ width: "60px" }}>
                  <div className={styles.actionDropdown}>
                    <button className={styles.actionButton}>
                      <MoreHorizontal size={16} />
                    </button>
                    <div className={styles.actionMenu}>
                      <Link href={`/admin/pedidos/${order.id}`} className={styles.actionMenuItem}>
                        <Eye size={14} />
                        Ver detalles
                      </Link>
                      <button className={styles.actionMenuItem}>
                        <Printer size={14} />
                        Imprimir
                      </button>
                      <button className={styles.actionMenuItem}>
                        <Mail size={14} />
                        Enviar email
                      </button>
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
              <p>No se encontraron pedidos</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.paginationContainer}>
        <div className={styles.paginationInfo}>
          Mostrando {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, sortedOrders.length)} de {sortedOrders.length}{" "}
          pedidos
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
