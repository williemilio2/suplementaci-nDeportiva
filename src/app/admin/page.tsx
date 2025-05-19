"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react"
import styles from "./admin.module.css"
import { LineChart, BarChart } from "./UI/estadisticas/page"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  // Datos de ejemplo para las tarjetas
  const cards = [
    {
      title: "Ventas totales",
      value: "€24,532.95",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Pedidos",
      value: "356",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBag,
      color: "green",
    },
    {
      title: "Clientes",
      value: "2,845",
      change: "+5.1%",
      trend: "up",
      icon: Users,
      color: "purple",
    },
    {
      title: "Productos vendidos",
      value: "1,294",
      change: "-2.3%",
      trend: "down",
      icon: Package,
      color: "orange",
    },
  ]

  // Datos de ejemplo para el gráfico de ventas
  const salesData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Ventas",
        data: [1200, 1900, 1500, 2200, 1800, 2500, 2100],
        borderColor: "#ff5722",
        backgroundColor: "rgba(255, 87, 34, 0.1)",
        tension: 0.4,
      },
    ],
  }

  // Datos de ejemplo para el gráfico de categorías
  const categoryData = {
    labels: ["Proteínas", "Creatina", "Pre-entreno", "Vitaminas", "Aminoácidos"],
    datasets: [
      {
        label: "Ventas por categoría",
        data: [4500, 3200, 2800, 2100, 1800],
        backgroundColor: ["#ff5722", "#2196f3", "#4caf50", "#ffc107", "#9c27b0"],
      },
    ],
  }

  // Datos de ejemplo para los productos más vendidos
  const topProducts = [
    {
      id: 1,
      name: "Proteína Whey Gold Standard",
      image: "/images/muscle-gain.jpg",
      sales: 245,
      revenue: "€12,250.00",
      stock: 58,
    },
    {
      id: 2,
      name: "Creatina Monohidrato",
      image: "/images/supplement-deals.jpg",
      sales: 189,
      revenue: "€4,725.00",
      stock: 32,
    },
    {
      id: 3,
      name: "Pre-Workout Extreme",
      image: "/images/fat-loss.jpg",
      sales: 156,
      revenue: "€6,240.00",
      stock: 45,
    },
    {
      id: 4,
      name: "BCAA 2:1:1",
      image: "/images/recovery.jpg",
      sales: 132,
      revenue: "€3,960.00",
      stock: 27,
    },
    {
      id: 5,
      name: "Multivitamínico Sport",
      image: "/images/health.jpg",
      sales: 118,
      revenue: "€2,360.00",
      stock: 64,
    },
  ]

  // Datos de ejemplo para los últimos pedidos
  const recentOrders = [
    {
      id: "ORD-12345",
      customer: "Juan Pérez",
      date: "15 mayo, 2023 - 14:32",
      amount: "€129.99",
      status: "completed",
      statusText: "Completado",
    },
    {
      id: "ORD-12344",
      customer: "María López",
      date: "15 mayo, 2023 - 13:15",
      amount: "€89.95",
      status: "processing",
      statusText: "Procesando",
    },
    {
      id: "ORD-12343",
      customer: "Carlos Rodríguez",
      date: "15 mayo, 2023 - 11:42",
      amount: "€74.50",
      status: "shipped",
      statusText: "Enviado",
    },
    {
      id: "ORD-12342",
      customer: "Ana Martínez",
      date: "15 mayo, 2023 - 10:08",
      amount: "€54.99",
      status: "completed",
      statusText: "Completado",
    },
    {
      id: "ORD-12341",
      customer: "Pedro Sánchez",
      date: "14 mayo, 2023 - 18:23",
      amount: "€149.95",
      status: "cancelled",
      statusText: "Cancelado",
    },
  ]

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <div className={styles.timeRangeSelector}>
          <button
            className={`${styles.timeRangeButton} ${timeRange === "today" ? styles.timeRangeActive : ""}`}
            onClick={() => setTimeRange("today")}
          >
            Hoy
          </button>
          <button
            className={`${styles.timeRangeButton} ${timeRange === "7d" ? styles.timeRangeActive : ""}`}
            onClick={() => setTimeRange("7d")}
          >
            7 días
          </button>
          <button
            className={`${styles.timeRangeButton} ${timeRange === "30d" ? styles.timeRangeActive : ""}`}
            onClick={() => setTimeRange("30d")}
          >
            30 días
          </button>
          <button
            className={`${styles.timeRangeButton} ${timeRange === "90d" ? styles.timeRangeActive : ""}`}
            onClick={() => setTimeRange("90d")}
          >
            90 días
          </button>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className={styles.statsCards}>
        {cards.map((card, index) => (
          <div key={index} className={`${styles.statsCard} ${styles[`statsCard${card.color}`]}`}>
            <div className={styles.statsCardIcon}>
              <card.icon size={24} />
            </div>
            <div className={styles.statsCardContent}>
              <h3 className={styles.statsCardTitle}>{card.title}</h3>
              <p className={styles.statsCardValue}>{card.value}</p>
              <div className={styles.statsCardFooter}>
                <span
                  className={`${styles.statsCardChange} ${card.trend === "up" ? styles.trendUp : styles.trendDown}`}
                >
                  {card.trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {card.change}
                </span>
                <span className={styles.statsCardPeriod}>vs. período anterior</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Ventas</h3>
            <button className={styles.chartOptionsButton}>
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className={styles.chartContent}>
            <LineChart data={salesData} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Ventas por categoría</h3>
            <button className={styles.chartOptionsButton}>
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className={styles.chartContent}>
            <BarChart data={categoryData} />
          </div>
        </div>
      </div>

      {/* Productos más vendidos */}
      <div className={styles.topProductsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Productos más vendidos</h2>
          <Link href="/admin/products" className={styles.viewAllLink}>
            Ver todos <ChevronRight size={16} />
          </Link>
        </div>

        <div className={styles.topProductsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell} style={{ flex: 3 }}>
              Producto
            </div>
            <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
              Ventas
            </div>
            <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
              Ingresos
            </div>
            <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
              Stock
            </div>
          </div>

          <div className={styles.tableBody}>
            {topProducts.map((product) => (
              <div key={product.id} className={styles.tableRow}>
                <div className={styles.tableCell} style={{ flex: 3 }}>
                  <div className={styles.productCell}>
                    <div className={styles.productImage}>
                      <Image src={product.image || "/placeholder.svg"} width={40} height={40} alt={product.name} />
                    </div>
                    <span className={styles.productName}>{product.name}</span>
                  </div>
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  {product.sales}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  {product.revenue}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  <span className={`${styles.stockBadge} ${product.stock < 30 ? styles.stockLow : ""}`}>
                    {product.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pedidos recientes */}
      <div className={styles.recentOrdersSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Pedidos recientes</h2>
          <Link href="/admin/pedidos" className={styles.viewAllLink}>
            Ver todos <ChevronRight size={16} />
          </Link>
        </div>

        <div className={styles.recentOrdersTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
              ID
            </div>
            <div className={styles.tableHeaderCell} style={{ flex: 2 }}>
              Cliente
            </div>
            <div className={styles.tableHeaderCell} style={{ flex: 2 }}>
              Fecha
            </div>
            <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
              Importe
            </div>
            <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
              Estado
            </div>
          </div>

          <div className={styles.tableBody}>
            {recentOrders.map((order) => (
              <div key={order.id} className={styles.tableRow}>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  <Link href={`/admin/pedidos/${order.id}`} className={styles.orderIdLink}>
                    {order.id}
                  </Link>
                </div>
                <div className={styles.tableCell} style={{ flex: 2 }}>
                  {order.customer}
                </div>
                <div className={styles.tableCell} style={{ flex: 2 }}>
                  {order.date}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  {order.amount}
                </div>
                <div className={styles.tableCell} style={{ flex: 1 }}>
                  <span className={`${styles.statusBadge} ${styles[`status${order.status}`]}`}>{order.statusText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
