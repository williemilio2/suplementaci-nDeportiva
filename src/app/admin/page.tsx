"use client"

import { useState, useEffect, useMemo } from "react"
import { Users, ShoppingBag, DollarSign, Package } from 'lucide-react'
import styles from "./admin.module.css"
import { LineChart, BarChart } from "./UI/estadisticas"
import { ensureDataLoaded } from "@/src/products/listaArchivos"
import { parse, format, isAfter, isSameDay, subDays, startOfDay } from "date-fns"

interface Ventas {
  id: number
  correoUsuarioCompra: string
  productosComprados: string
  fechaCompleta: string
  precioTotal: number
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [allVentas, setAllVentas] = useState<Ventas[]>([])
  const [ventasTotales, setVentasTotales] = useState(0)
  const [clientes, setClientes] = useState(0)
  const [productosVendidos, setProductosVendidos] = useState(0)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { compras: comprasAdmin, clientes: clientesAdmin } = await ensureDataLoaded()
        console.log("Clientes:", clientesAdmin)
        console.log("Compras:", comprasAdmin)

        // Validación ligera por si algún campo falta o viene mal
        const validatedOrders: Ventas[] = (comprasAdmin as Partial<Ventas>[]).map((p) => ({
          id: p.id ?? 0,
          correoUsuarioCompra: p.correoUsuarioCompra ?? "",
          productosComprados: p.productosComprados ?? "",
          fechaCompleta: p.fechaCompleta ?? "",
          precioTotal: Number(p.precioTotal) || 0,
        }))

        setAllVentas(validatedOrders)
        setClientes(clientesAdmin)
      } catch (error) {
        console.error("Error al cargar pedidos:", error)
        setAllVentas([])
      }
    }

    loadOrders()
  }, [])

  // Filtra las ventas según el rango de tiempo seleccionado
  const filteredVentas = useMemo(() => {
    const now = new Date()
    let startDate = new Date(0)

    if (timeRange === "today") {
      startDate = startOfDay(now)
    } else if (timeRange === "7d") {
      startDate = subDays(now, 6) // Últimos 7 días incluyendo hoy
    } else if (timeRange === "30d") {
      startDate = subDays(now, 29) // Últimos 30 días incluyendo hoy
    } else if (timeRange === "90d") {
      startDate = subDays(now, 89) // Últimos 90 días incluyendo hoy
    } else if (timeRange === "total") {
      // Para "total", devolver todas las ventas sin filtrar
      return allVentas
    }

    return allVentas.filter((venta) => {
      try {
        const ventaDate = parse(venta.fechaCompleta, "dd/MM/yyyy", new Date())

        if (timeRange === "today") {
          return isSameDay(ventaDate, now)
        } else {
          return isAfter(ventaDate, startDate) || isSameDay(ventaDate, startDate)
        }
      } catch (error) {
        console.error("Error parsing date:", venta.fechaCompleta, error)
        return false
      }
    })
  }, [allVentas, timeRange])

  // Actualiza totales y productos vendidos con base en las ventas filtradas
  useEffect(() => {
    let suma = 0
    let totalProductosVendidos = 0

    for (const venta of filteredVentas) {
      suma += venta.precioTotal

      // Contar productos: cada producto está separado por <<<
      if (venta.productosComprados && venta.productosComprados.trim()) {
        const productos = venta.productosComprados.split("<<<").filter((p) => p.trim())
        totalProductosVendidos += productos.length
      }
    }

    setProductosVendidos(totalProductosVendidos)
    setVentasTotales(suma)
  }, [filteredVentas])

  // Tarjetas de resumen
  const cards = [
    {
      title: "Ventas totales",
      value: `€${ventasTotales.toFixed(2)}`,
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Pedidos",
      value: filteredVentas.length,
      icon: ShoppingBag,
      color: "green",
    },
    {
      title: "Clientes",
      value: clientes,
      icon: Users,
      color: "purple",
    },
    {
      title: "Productos vendidos",
      value: productosVendidos,
      icon: Package,
      color: "orange",
    },
  ]

  // Datos para el gráfico de ventas por día
const salesData = useMemo(() => {
  const dailySales: Record<string, number> = {}
  const dailyCounts: Record<string, number> = {}

  for (const venta of filteredVentas) {
    try {
      const fecha = parse(venta.fechaCompleta, "dd/MM/yyyy", new Date())
      const fechaKey = format(fecha, "dd/MM/yyyy")  // clave con año

      dailySales[fechaKey] = (dailySales[fechaKey] || 0) + venta.precioTotal
      dailyCounts[fechaKey] = (dailyCounts[fechaKey] || 0) + 1
    } catch (error) {
      console.error("Error processing date:", venta.fechaCompleta, error)
    }
  }

  const sortedDates = Object.keys(dailySales).sort((a, b) => {
    const dateA = parse(a, "dd/MM/yyyy", new Date())
    const dateB = parse(b, "dd/MM/yyyy", new Date())
    return dateA.getTime() - dateB.getTime()
  })

  return {
    labels: sortedDates.map((fecha) => {
      const count = dailyCounts[fecha] || 0
      return `${fecha} (${count})`
    }),
    datasets: [
      {
        label: "Ventas (€)",
        data: sortedDates.map((fecha) => dailySales[fecha] || 0),
        borderColor: "#ff5722",
        backgroundColor: "rgba(255, 87, 34, 0.1)",
        tension: 0.4,
      },
    ],
  }
}, [filteredVentas])



  // Función para mapear tipos a categorías principales
  const mapToCategory = (tipo: string): string => {
    const tipoLower = tipo.toLowerCase()

    if (tipoLower.includes("proteina") || tipoLower.includes("protein")) {
      return "Proteínas"
    } else if (tipoLower.includes("creatina")) {
      return "Creatina"
    } else if (tipoLower.includes("bcaa") || tipoLower.includes("aminoacido")) {
      return "Aminoácidos"
    } else if (tipoLower.includes("vitamina")) {
      return "Vitaminas"
    } else if (tipoLower.includes("mineral")) {
      return "Minerales"
    } else if (tipoLower.includes("glutamina")) {
      return "Glutamina"
    } else {
      // Para tipos genéricos como tipoA, tipoB, etc., mantener el nombre original
      return tipo
    }
  }

  // Datos dinámicos para el gráfico de categorías - LIMITADO A TOP 4
  const categoryData = useMemo(() => {
    const categoryCounts: Record<string, number> = {}

    // Procesar todas las ventas filtradas para obtener categorías
    for (const venta of filteredVentas) {
      if (venta.productosComprados && venta.productosComprados.trim()) {
        // Dividir por <<< para obtener cada producto individual
        const productos = venta.productosComprados.split("<<<")

        for (const producto of productos) {
          if (producto.trim()) {
            // Dividir por &%& para obtener producto y tipo
            const partes = producto.split("&%&")
            if (partes.length >= 2) {
              const tipo = partes[1].trim()
              const categoria = mapToCategory(tipo)

              // Contar cada producto individual
              categoryCounts[categoria] = (categoryCounts[categoria] || 0) + 1
            }
          }
        }
      }
    }

    // Convertir a array de objetos para poder ordenar
    const categoriasArray = Object.entries(categoryCounts)
      .map(([categoria, count]) => ({ categoria, count }))
      .sort((a, b) => b.count - a.count) // Ordenar de mayor a menor
      .slice(0, 4) // LIMITAR A SOLO LOS 4 PRIMEROS

    // Colores específicos para las categorías
    const colores = ["#ff5722", "#2196f3", "#4caf50", "#ffc107"]

    if (categoriasArray.length === 0) {
      return {
        labels: ["Sin datos"],
        datasets: [
          {
            label: "Productos vendidos por categoría",
            data: [0],
            backgroundColor: ["#cccccc"],
          },
        ],
      }
    }

    return {
      labels: categoriasArray.map((item) => `${item.categoria} (${item.count})`),
      datasets: [
        {
          label: "Productos vendidos por categoría",
          data: categoriasArray.map((item) => item.count),
          backgroundColor: categoriasArray.map((_, index) => colores[index % colores.length]),
        },
      ],
    }
  }, [filteredVentas])
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <div className={styles.timeRangeSelector}>
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
          <button
            className={`${styles.timeRangeButton} ${timeRange === "total" ? styles.timeRangeActive : ""}`}
            onClick={() => setTimeRange("total")}
          >
            Total
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
              <div className={styles.statsCardFooter}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Ventas por día</h3>
          </div>
          <div className={styles.chartContent}>
            <LineChart data={salesData} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Top 4 - Productos vendidos por categoría</h3>
          </div>
          <div className={styles.chartContent}>
            <BarChart data={categoryData} />
          </div>
        </div>
      </div>
    </div>
  )
}
