"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Mail,
  Trash2,
  UserPlus,
} from "lucide-react"
import styles from "../admin.module.css"

export default function CustomersPage() {
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  // Datos de ejemplo para los clientes
  const customers = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      phone: "+34 612 345 678",
      orders: 8,
      totalSpent: "€529.92",
      lastOrder: "15 mayo, 2023",
      status: "active",
      statusText: "Activo",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "María López",
      email: "maria.lopez@example.com",
      phone: "+34 623 456 789",
      orders: 5,
      totalSpent: "€349.75",
      lastOrder: "12 mayo, 2023",
      status: "active",
      statusText: "Activo",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      phone: "+34 634 567 890",
      orders: 3,
      totalSpent: "€189.50",
      lastOrder: "8 mayo, 2023",
      status: "active",
      statusText: "Activo",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana.martinez@example.com",
      phone: "+34 645 678 901",
      orders: 2,
      totalSpent: "€109.98",
      lastOrder: "5 mayo, 2023",
      status: "inactive",
      statusText: "Inactivo",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Pedro Sánchez",
      email: "pedro.sanchez@example.com",
      phone: "+34 656 789 012",
      orders: 6,
      totalSpent: "€419.90",
      lastOrder: "2 mayo, 2023",
      status: "active",
      statusText: "Activo",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Laura García",
      email: "laura.garcia@example.com",
      phone: "+34 667 890 123",
      orders: 4,
      totalSpent: "€279.96",
      lastOrder: "28 abril, 2023",
      status: "active",
      statusText: "Activo",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      name: "Miguel Fernández",
      email: "miguel.fernandez@example.com",
      phone: "+34 678 901 234",
      orders: 1,
      totalSpent: "€67.99",
      lastOrder: "25 abril, 2023",
      status: "inactive",
      statusText: "Inactivo",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      name: "Carmen Ruiz",
      email: "carmen.ruiz@example.com",
      phone: "+34 689 012 345",
      orders: 7,
      totalSpent: "€489.65",
      lastOrder: "20 abril, 2023",
      status: "active",
      statusText: "Activo",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Filtrar clientes por término de búsqueda
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  )

  // Ordenar clientes
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "orders") {
      return sortOrder === "asc" ? a.orders - b.orders : b.orders - a.orders
    } else if (sortBy === "totalSpent") {
      const totalA = Number.parseFloat(a.totalSpent.replace("€", ""))
      const totalB = Number.parseFloat(b.totalSpent.replace("€", ""))
      return sortOrder === "asc" ? totalA - totalB : totalB - totalA
    } else if (sortBy === "lastOrder") {
      return sortOrder === "asc" ? a.lastOrder.localeCompare(b.lastOrder) : b.lastOrder.localeCompare(a.lastOrder)
    }
    return 0
  })

  // Paginación
  const customersPerPage = 5
  const totalPages = Math.ceil(sortedCustomers.length / customersPerPage)
  const indexOfLastCustomer = currentPage * customersPerPage
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
  const currentCustomers = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer)

  // Manejar selección de clientes
  const handleSelectCustomer = (id: number) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter((customerId) => customerId !== id))
    } else {
      setSelectedCustomers([...selectedCustomers, id])
    }
  }

  // Manejar selección de todos los clientes
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(currentCustomers.map((customer) => customer.id))
    }
    setSelectAll(!selectAll)
  }

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedCustomers([])
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
    <div className={styles.customersContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Clientes</h1>
        <div className={styles.headerActions}>
          <button className={styles.exportButton}>
            <Download size={16} />
            Exportar
          </button>
          <Link href="/admin/customers/new" className={styles.addButton}>
            <UserPlus size={16} />
            Añadir cliente
          </Link>
        </div>
      </div>

      <div className={styles.toolbarContainer}>
        <div className={styles.searchFilterContainer}>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
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
                <select className={styles.filterSelect}>
                  <option value="">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Pedidos</label>
                <div className={styles.rangeInputs}>
                  <input type="number" placeholder="Min" className={styles.rangeInput} />
                  <span>-</span>
                  <input type="number" placeholder="Max" className={styles.rangeInput} />
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Gasto total</label>
                <div className={styles.rangeInputs}>
                  <input type="number" placeholder="Min" className={styles.rangeInput} />
                  <span>-</span>
                  <input type="number" placeholder="Max" className={styles.rangeInput} />
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
          {selectedCustomers.length > 0 && (
            <>
              <span className={styles.selectedCount}>{selectedCustomers.length} seleccionados</span>
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

      <div className={styles.customersTable}>
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
            style={{ flex: 2 }}
            onClick={() => handleSort("name")}
          >
            <span>Cliente</span>
            <ArrowUpDown size={14} className={styles.sortIcon} />
          </div>
          <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
            Teléfono
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
            style={{ flex: 1 }}
            onClick={() => handleSort("orders")}
          >
            <span>Pedidos</span>
            <ArrowUpDown size={14} className={styles.sortIcon} />
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
            style={{ flex: 1 }}
            onClick={() => handleSort("totalSpent")}
          >
            <span>Gasto total</span>
            <ArrowUpDown size={14} className={styles.sortIcon} />
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
            style={{ flex: 1 }}
            onClick={() => handleSort("lastOrder")}
          >
            <span>Último pedido</span>
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
          {currentCustomers.length > 0 ? (
            currentCustomers.map((customer) => (
              <div key={customer.id} className={styles.tableRow}>
                <div className={styles.tableCell} style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={() => handleSelectCustomer(customer.id)}
                    className={styles.checkbox}
                  />
                </div>
                <div className={styles.tableCell} style={{ flex: 2 }}>
                  <div className={styles.customerCell}>
                    <div className={styles.customerAvatar}>
                      <Image src={customer.avatar || "/placeholder.svg"} width={40} height={40} alt={customer.name} />
                    </div>
                    <div className={styles.customerInfo}>
                      <Link href={`/admin/customers/${customer.id}`} className={styles.customerName}>
                        {customer.name}
                      </Link>
                      <span className={styles.customerEmail}>{customer.email}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  {customer.phone}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  {customer.orders}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  {customer.totalSpent}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  {customer.lastOrder}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  <span
                    className={`${styles.statusBadge} ${customer.status === "active" ? styles.statusactive : styles.statusinactive}`}
                  >
                    {customer.statusText}
                  </span>
                </div>
                <div className={styles.tableCell} style={{ width: "60px" }}>
                  <div className={styles.actionDropdown}>
                    <button className={styles.actionButton}>
                      <MoreHorizontal size={16} />
                    </button>
                    <div className={styles.actionMenu}>
                      <Link href={`/admin/customers/${customer.id}`} className={styles.actionMenuItem}>
                        <Eye size={14} />
                        Ver detalles
                      </Link>
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
              <p>No se encontraron clientes</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.paginationContainer}>
        <div className={styles.paginationInfo}>
          Mostrando {indexOfFirstCustomer + 1}-{Math.min(indexOfLastCustomer, sortedCustomers.length)} de{" "}
          {sortedCustomers.length} clientes
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
