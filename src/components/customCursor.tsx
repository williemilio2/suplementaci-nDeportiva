"use client";

import { useEffect, useState, useRef } from "react";
import { isMobile, isTablet } from "react-device-detect";
import Image from "next/image";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const positionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };

      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(() => {
          setPosition({ ...positionRef.current });
          animationFrameRef.current = null;
        });
      }
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseEnter = (e: Event) => {
      if ((e.target as HTMLElement)?.classList?.contains("hoverable")) {
        setHovered(true);
      }
    };

    const handleMouseLeave = (e: Event) => {
      if ((e.target as HTMLElement)?.classList?.contains("hoverable")) {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isClient || isMobile || isTablet) return null;

  const cursorStyle: React.CSSProperties = {
    pointerEvents: "none",
    position: "fixed",
    top: position.y,
    left: position.x,
    width: "40px",
    height: "40px",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
  };

  return (
    <div style={cursorStyle}>
      {clicked ? (
        <Image
          src="/cursor3.png"
          alt="clicked"
          width={49}
          height={50}
          style={{ pointerEvents: "none" }}
        />
      ) : hovered ? (
        <Image
          src="/cursor2.png"
          alt="hover"
          width={49}
          height={45}
          style={{ pointerEvents: "none" }}
        />
      ) : (
        <Image
          src="/cursor.png"
          alt="cursor"
          width={40}
          height={50}
          style={{ pointerEvents: "none" }}
        />
      )}
    </div>
  );
}
