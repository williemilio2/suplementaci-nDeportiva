"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import styles from "../styles/productSlider.module.css"

interface ProductSliderProps {
  images: string[]
  productName: string
  className?: string
  onLightboxChange?: (isOpen: boolean) => void
}

export default function ProductSlider({ images, productName, className = "", onLightboxChange }: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Verificar si hay múltiples imágenes
  const hasMultipleImages = images && images.length > 1

  // Asegurarse de que el componente está montado antes de usar createPortal
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Notificar cambios en el estado del lightbox
  useEffect(() => {
    if (onLightboxChange) {
      onLightboxChange(showLightbox)
    }

    // Añadir clase al body cuando el lightbox está abierto
    if (showLightbox) {
      document.body.classList.add("lightbox-open")
    } else {
      document.body.classList.remove("lightbox-open")
    }

    return () => {
      document.body.classList.remove("lightbox-open")
    }
  }, [showLightbox, onLightboxChange])

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const openLightbox = () => setShowLightbox(true)
  const closeLightbox = () => setShowLightbox(false)

  if (!images || images.length === 0) {
    return (
      <div className={`${styles.sliderContainer} ${className}`}>
        <Image src="/placeholder.svg" alt={productName} fill className={styles.image} />
      </div>
    )
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Main Slider */}
      <div className={styles.sliderContainer}>
        <Image
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${productName} - Image ${currentIndex + 1}`}
          fill
          className={`${styles.image} hoverable`}
          onClick={openLightbox}
        />

        {/* Navigation Arrows - Solo mostrar si hay múltiples imágenes */}
        {hasMultipleImages && (
          <>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className={`${styles.navIcon} hoverable`} />
            </button>

            <button className={`${styles.navButton} ${styles.nextButton}`} onClick={goToNext} aria-label="Next image">
              <ChevronRight className={`${styles.navIcon} hoverable`} />
            </button>
          </>
        )}

        {/* Indicator Dots - Solo mostrar si hay múltiples imágenes */}
        {hasMultipleImages && (
          <div className={styles.indicators}>
            {images.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${index === currentIndex ? styles.activeIndicator : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox usando Portal para renderizarlo fuera del contenedor padre */}
      {isMounted &&
        showLightbox &&
        createPortal(
          <div className={styles.lightbox} data-custom-cursor-hide="true">
            <div className={styles.lightboxContent}>
              <Image
                src={images[currentIndex] || "/placeholder.svg"}
                alt={`${productName} - Image ${currentIndex + 1}`}
                fill
                className={styles.lightboxImage}
              />

              {/* Navigation Arrows en Lightbox - Solo mostrar si hay múltiples imágenes */}
              {hasMultipleImages && (
                <>
                  <button
                    className={`${styles.navButton} ${styles.lightboxPrevButton}`}
                    onClick={goToPrevious}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className={`${styles.navIcon} hoverable`} />
                  </button>

                  <button
                    className={`${styles.navButton} ${styles.lightboxNextButton}`}
                    onClick={goToNext}
                    aria-label="Next image"
                  >
                    <ChevronRight className={`${styles.navIcon} hoverable`} />
                  </button>
                </>
              )}

              <button className={styles.closeButton} onClick={closeLightbox} aria-label="Close lightbox">
                <X className={`${styles.navIcon} hoverable`} />
              </button>

              {/* Indicator Dots for Lightbox - Solo mostrar si hay múltiples imágenes */}
              {hasMultipleImages && (
                <div className={styles.lightboxIndicators}>
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.indicator} ${index === currentIndex ? styles.activeIndicator : ""}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
