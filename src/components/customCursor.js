"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = () => setClicked(true)
    const handleMouseUp = () => setClicked(false)

    // Detectar cuando el cursor entra en elementos "hoverable"
    const handleMouseEnter = (e) => {
      if (e.target && e.target.classList?.contains("hoverable")) {
        setHovered(true)
      }
    }

    // Detectar cuando el cursor sale de elementos "hoverable"
    const handleMouseLeave = (e) => {
      if (e.target && e.target.classList?.contains("hoverable")) {
        setHovered(false)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseenter", handleMouseEnter, true)
    document.addEventListener("mouseleave", handleMouseLeave, true)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseenter", handleMouseEnter, true)
      document.removeEventListener("mouseleave", handleMouseLeave, true)
    }
  }, [])

  const cursorStyle = {
    pointerEvents: "none",
    position: "fixed",
    top: position.y,
    left: position.x,
    width: "40px",
    height: "40px",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
  }

  return (
    <div style={cursorStyle}>
      {clicked ? (
        <Image src="/cursor3.png" alt="clicked" width={49} height={50} />
      ) : hovered ? (
        <Image src="/cursor2.png" alt="hover" width={49} height={45} />
      ) : (
        <Image src="/cursor.png" alt="cursor" width={40} height={50} />
      )}
    </div>
  )
}
