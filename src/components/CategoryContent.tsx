"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import styles from "../styles/CategoryContent.module.css"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function CategoryContent() {
  const images = [
    { name: "apartadoSlider1", link: "/especiales/veganas" },
    { name: "apartadoSlider2", link: "/especiales/veganas" },
    { name: "apartadoSlider3", link: "/especiales/veganas" },
    { name: "apartadoSlider1", link: "/especiales/veganas" },
    { name: "apartadoSlider2", link: "/especiales/veganas" },
    { name: "apartadoSlider3", link: "/especiales/veganas" },
  ]

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      const containerWidth = scrollContainer.clientWidth
      const scrollWidth = scrollContainer.scrollWidth

      // Centrar el scroll horizontalmente
      scrollContainer.scrollLeft = (scrollWidth - containerWidth) / 2

      scrollContainer.addEventListener("scroll", checkScrollPosition)
      checkScrollPosition()
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScrollPosition)
      }
    }
  }, [])


  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    e.preventDefault()
    isDraggingRef.current = true
    startXRef.current = e.clientX
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.clientX
    const walk = (x - startXRef.current) * 1.5
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  const handleMouseLeave = () => {
    isDraggingRef.current = false
  }

  const scrollLeft20Percent = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth
      scrollContainerRef.current.scrollBy({
        left: -containerWidth * 0.8,
        behavior: "smooth",
      })
    }
  }

  const scrollRight20Percent = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth
      scrollContainerRef.current.scrollBy({
        left: containerWidth * 0.8,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className={styles.categoryContent}>
      <div className={styles.categoryHeader}>
        <h1 className={styles.categoryContentTitulo}>Colecciones</h1>
        <div className={styles.navigationControls}>
          <button
            className={`${styles.navButton} ${!showLeftArrow ? styles.navButtonDisabled : ""} hoverable`}
            onClick={scrollLeft20Percent}
            disabled={!showLeftArrow}
            aria-label="Ver colecciones anteriores"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className={`${styles.navButton} ${!showRightArrow ? styles.navButtonDisabled : ""} hoverable`}
            onClick={scrollRight20Percent}
            disabled={!showRightArrow}
            aria-label="Ver más colecciones"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div
        className={styles.scrollContainer}
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {images.map((item, index) => (
          <div key={`${item.name}-${index}`} className={styles.contentItem}>
            <div className={styles.itemPlaceholder}>
              <Link href={item.link}>
                <Image src={`/${item.name}.webp`} alt={`Colección ${index + 1}`} fill className={styles.heroImage} />
              </Link>
              <div className={styles.overlay}>
                <Link href={item.link}>
                  <button className={`${styles.ctaButton} hoverable`}>Ir ahora</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
