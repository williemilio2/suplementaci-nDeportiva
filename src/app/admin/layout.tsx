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
} from "lucide-react"
import styles from "./admin.module.css"
import { Suspense } from "react"
import CustomCursor from "@/src/components/customCursor"
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [waiting, setWaiting] = useState(true)
  const pathname = usePathname()

  // Cerrar sidebar en pantallas pequeñas cuando cambia la ruta
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/')
      return;
      }

    fetch('/api/verifyToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.esAdmin) {
          setWaiting(false);
        }
        else{
          router.push('/')
        }
      })
      .catch(console.error);
  }, [])

    useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Productos", href: "/admin/productosAdmin", icon: Package },
    { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart },
  ]
  if(waiting){return <h1>Verificando datos</h1>}
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
              <Image src="/logoAlante.png" width={130} height={42} alt="Logo" priority />
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
