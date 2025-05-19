
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronRight, Search, Package, Truck, CheckCircle, AlertCircle, Download } from "lucide-react"
import styles from "../../styles/pedidos.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Datos de ejemplo de pedidos
  const orders = [
    {
      id: "ORD78945612",
      date: "15 de mayo, 2023",
      total: 89.97,
      status: "delivered",
      statusText: "Entregado",
      items: [
        {
          id: 1,
          name: "Proteína Whey Gold Standard",
          variant: "Chocolate - 2kg",
          price: 59.99,
          quantity: 1,
          image: "/cursor.png",
        },
        {
          id: 2,
          name: "Creatina Monohidrato",
          variant: "Sin sabor - 500g",
          price: 24.99,
          quantity: 1,
          image: "/images/supplement-deals.jpg",
        },
      ],
      shipping: 4.99,
      trackingNumber: "TRK123456789",
      deliveryDate: "20 de mayo, 2023",
    },
    {
      id: "ORD45678923",
      date: "2 de mayo, 2023",
      total: 134.97,
      status: "delivered",
      statusText: "Entregado",
      items: [
        {
          id: 3,
          name: "Pre-Workout Extreme",
          variant: "Frutas del bosque - 300g",
          price: 39.99,
          quantity: 1,
          image: "/images/fat-loss.jpg",
        },
        {
          id: 4,
          name: "BCAA 2:1:1",
          variant: "Limón - 400g",
          price: 29.99,
          quantity: 1,
          image: "/images/recovery.jpg",
        },
        {
          id: 5,
          name: "Multivitamínico Sport",
          variant: "60 cápsulas",
          price: 19.99,
          quantity: 3,
          image: "/images/health.jpg",
        },
      ],
      shipping: 4.99,
      trackingNumber: "TRK987654321",
      deliveryDate: "7 de mayo, 2023",
    },
    {
      id: "ORD12345678",
      date: "28 de abril, 2023",
      total: 74.98,
      status: "in_transit",
      statusText: "En camino",
      items: [
        {
          id: 6,
          name: "Proteína Vegana",
          variant: "Vainilla - 1kg",
          price: 49.99,
          quantity: 1,
          image: "/images/vegan-diet.jpg",
        },
        {
          id: 7,
          name: "Omega 3",
          variant: "90 cápsulas",
          price: 24.99,
          quantity: 1,
          image: "/images/health.jpg",
        },
      ],
      shipping: 0,
      trackingNumber: "TRK456789123",
      deliveryDate: "Estimado: 3 de mayo, 2023",
    },
    {
      id: "ORD98765432",
      date: "15 de abril, 2023",
      total: 129.97,
      status: "processing",
      statusText: "Procesando",
      items: [
        {
          id: 8,
          name: "Pack Definición",
          variant: "Completo",
          price: 99.99,
          quantity: 1,
          image: "/images/weight-loss.jpg",
        },
        {
          id: 9,
          name: "Shaker Premium",
          variant: "Negro - 600ml",
          price: 14.99,
          quantity: 2,
          image: "/images/supplement-deals.jpg",
        },
      ],
      shipping: 4.99,
      trackingNumber: "Pendiente",
      deliveryDate: "Estimado: 5 de mayo, 2023",
    },
    {
      id: "ORD56789012",
      date: "2 de abril, 2023",
      total: 49.99,
      status: "cancelled",
      statusText: "Cancelado",
      items: [
        {
          id: 10,
          name: "Glutamina",
          variant: "Neutro - 300g",
          price: 29.99,
          quantity: 1,
          image: "/images/recovery.jpg",
        },
        {
          id: 11,
          name: "ZMA",
          variant: "90 cápsulas",
          price: 19.99,
          quantity: 1,
          image: "/images/health.jpg",
        },
      ],
      shipping: 0,
      trackingNumber: "N/A",
      deliveryDate: "N/A",
      cancellationReason: "Cancelado por el cliente",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Package size={18} className={`${styles.statusIcon} ${styles.processingIcon}`} />
      case "in_transit":
        return <Truck size={18} className={`${styles.statusIcon} ${styles.transitIcon}`} />
      case "delivered":
        return <CheckCircle size={18} className={`${styles.statusIcon} ${styles.deliveredIcon}`} />
      case "cancelled":
        return <AlertCircle size={18} className={`${styles.statusIcon} ${styles.cancelledIcon}`} />
      default:
        return <Package size={18} className={styles.statusIcon} />
    }
  }

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  const filteredOrders = orders.filter((order) => {
    // Filtrar por estado
    if (filterStatus !== "all" && order.status !== filterStatus) {
      return false
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchLower))
      )
    }

    return true
  })

  return (
    <div className={styles.ordersContainer}>
        <CustomCursor />
      <div className={styles.ordersHeader}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logoContainer}>
            <Image src="/logoLetras.png" width={180} height={62} alt="Logo" priority />
          </Link>
          <h1 className={styles.pageTitle}>Mis Pedidos</h1>
        </div>
      </div>

      <div className={styles.ordersContent}>
        <div className={styles.ordersFilters}>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por número de pedido o producto"
              className={`${styles.searchInput} hoverable`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filterContainer}>
            <select
              className={`${styles.filterSelect} hoverable`}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos los pedidos</option>
              <option value="processing">Procesando</option>
              <option value="in_transit">En camino</option>
              <option value="delivered">Entregados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>

        <div className={styles.ordersList}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className={`${styles.orderCard} hoverable`}>
                <div className={styles.orderHeader} onClick={() => toggleOrderExpand(order.id)}>
                  <div className={styles.orderBasicInfo}>
                    <div className={styles.orderNumberDate}>
                      <h3 className={styles.orderNumber}>{order.id}</h3>
                      <span className={styles.orderDate}>{order.date}</span>
                    </div>
                    <div className={styles.orderStatus}>
                      {getStatusIcon(order.status)}
                      <span className={styles.statusText}>{order.statusText}</span>
                    </div>
                  </div>
                  <div className={styles.orderActions}>
                    <span className={styles.orderTotal}>{order.total.toFixed(2)}€</span>
                    <ChevronDown
                      size={20}
                      className={`${styles.expandIcon} ${expandedOrder === order.id ? styles.expanded : ""}`}
                    />
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className={styles.orderDetails}>
                    <div className={styles.orderItems}>
                      {order.items.map((item) => (
                        <div key={item.id} className={styles.orderItem}>
                          <div className={styles.itemImage}>
                            <Image src={item.image || "/placeholder.svg"} width={60} height={60} alt={item.name} />
                          </div>
                          <div className={styles.itemInfo}>
                            <h4 className={styles.itemName}>{item.name}</h4>
                            <p className={styles.itemVariant}>{item.variant}</p>
                            <div className={styles.itemPriceQty}>
                              <span className={styles.itemPrice}>{item.price.toFixed(2)}€</span>
                              <span className={styles.itemQuantity}>x{item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.orderSummary}>
                      <div className={styles.summarySection}>
                        <h4 className={styles.summaryTitle}>Resumen</h4>
                        <div className={styles.summaryDetails}>
                          <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>{(order.total - order.shipping).toFixed(2)}€</span>
                          </div>
                          <div className={styles.summaryRow}>
                            <span>Envío</span>
                            <span>{order.shipping.toFixed(2)}€</span>
                          </div>
                          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                            <span>Total</span>
                            <span>{order.total.toFixed(2)}€</span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.trackingSection}>
                        <h4 className={styles.trackingTitle}>Información de envío</h4>
                        <div className={styles.trackingDetails}>
                          <div className={styles.trackingRow}>
                            <span>Número de seguimiento:</span>
                            <span>{order.trackingNumber}</span>
                          </div>
                          <div className={styles.trackingRow}>
                            <span>Fecha de entrega:</span>
                            <span>{order.deliveryDate}</span>
                          </div>
                          {order.status === "cancelled" && (
                            <div className={styles.trackingRow}>
                              <span>Motivo de cancelación:</span>
                              <span>{order.cancellationReason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.orderActions}>
                      <button className={`${styles.invoiceButton} hoverable`}>
                        <Download size={16} />
                        Descargar factura
                      </button>
                      {order.status !== "cancelled" && order.status !== "delivered" && (
                        <button className={`${styles.cancelButton} hoverable`}>Cancelar pedido</button>
                      )} 
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noOrders}>
              <div className={styles.noOrdersIcon}>
                <Package size={48} />
              </div>
              <h2>No se encontraron pedidos</h2>
              <p>No hay pedidos que coincidan con los criterios de búsqueda.</p>
              <button
                className={styles.resetButton}
                onClick={() => {
                  setFilterStatus("all")
                  setSearchTerm("")
                }}
              >
                Mostrar todos los pedidos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
