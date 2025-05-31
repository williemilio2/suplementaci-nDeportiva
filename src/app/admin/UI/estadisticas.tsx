"use client"

import { useEffect, useRef, useState } from "react"
import Chart from "chart.js/auto"

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string
    tension?: number
  }[]
}

export function LineChart({ data }: { data: ChartData }) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 })

  // Función para actualizar dimensiones
  const updateDimensions = () => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height: Math.min(300, width * 0.6) })
    }
  }

  // Observer para cambios de tamaño
  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Actualizar dimensiones iniciales
    updateDimensions()

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (chartRef.current) {
      // Destruir el gráfico anterior si existe
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: "index",
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: window.innerWidth < 768 ? 10 : 12,
                  },
                },
              },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "white",
                bodyColor: "white",
                borderColor: "#ff5722",
                borderWidth: 1,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                  font: {
                    size: window.innerWidth < 768 ? 10 : 12,
                  },
                },
              },
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  font: {
                    size: window.innerWidth < 768 ? 10 : 12,
                  },
                  maxRotation: window.innerWidth < 768 ? 45 : 0,
                },
              },
            },
            elements: {
              point: {
                radius: window.innerWidth < 768 ? 3 : 4,
                hoverRadius: window.innerWidth < 768 ? 5 : 6,
              },
              line: {
                borderWidth: window.innerWidth < 768 ? 2 : 3,
              },
            },
          },
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, dimensions])

  return (
    <div ref={containerRef} style={{ width: "100%", height: `${dimensions.height}px`, position: "relative" }}>
      <canvas ref={chartRef} />
    </div>
  )
}

export function BarChart({ data }: { data: ChartData }) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 })

  // Función para actualizar dimensiones
  const updateDimensions = () => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height: Math.min(300, width * 0.6) })
    }
  }

  // Observer para cambios de tamaño
  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Actualizar dimensiones iniciales
    updateDimensions()

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (chartRef.current) {
      // Destruir el gráfico anterior si existe
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: "index",
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: window.innerWidth < 768 ? 10 : 12,
                  },
                },
              },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "white",
                bodyColor: "white",
                borderColor: "#ff5722",
                borderWidth: 1,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                  font: {
                    size: window.innerWidth < 768 ? 10 : 12,
                  },
                },
              },
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  font: {
                    size: window.innerWidth < 768 ? 10 : 12,
                  },
                  maxRotation: window.innerWidth < 768 ? 45 : 0,
                },
              },
            },
          },
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, dimensions])

  return (
    <div ref={containerRef} style={{ width: "100%", height: `${dimensions.height}px`, position: "relative" }}>
      <canvas ref={chartRef} />
    </div>
  )
}
