"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react"
import styles from "./admin.module.css"
import { Suspense } from "react"
import CustomCursor from "@/src/components/customCursor"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Cerrar sidebar en pantallas pequeñas cuando cambia la ruta
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Productos", href: "/admin/productosAdmin", icon: Package },
    { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart },
    { name: "Clientes", href: "/admin/clientes", icon: Users },
  ]

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomCursor />
      <div className={styles.adminContainer}>
        {/* Sidebar para móvil */}
        <div
          className={`${styles.sidebarBackdrop} ${sidebarOpen ? styles.sidebarBackdropVisible : ""}`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <Link href="/admin" className={styles.sidebarLogo}>
              <Image src="/logoLetras.png" width={130} height={42} alt="Logo" priority />
            </Link>
          </div>

          <nav className={styles.sidebarNav}>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                >
                  <item.icon size={20} className={styles.navIcon} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className={styles.mainContent}>
          {/* Header */}

          {/* Contenido de la página */}
          <div className={styles.pageContent}>{children}</div>
        </main>
      </div>
    </Suspense>
  )
}
