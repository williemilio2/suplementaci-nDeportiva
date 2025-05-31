"use client"

import { useState, useEffect } from "react"
import { X, User, Gift, Tag, Trophy } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'
import "../styles/clubPopUp.css"
import Cookies from 'js-cookie'; // npm i js-cookie

export default function ClubPopup() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [proceso, setProceso] = useState(0)

  // Cerrar el popup
  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(true)
    sessionStorage.setItem("popupClosed", "true")
  }

  // Abrir el popup cuando está minimizado
  const handleOpen = () => {
    setIsOpen(true)
    setIsMinimized(false)
  }
  useEffect(() => {
      const token = Cookies.get('token');
      if (token) {
        setIsOpen(false)
        setIsMinimized(true)
      };
      const closed = sessionStorage.getItem("popupClosed")
      if (closed === "true") {
        setIsOpen(false)
        setIsMinimized(true)
      }
    }, [])
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return;

    fetch('/api/comrpobarUsuarioClubAfiliados', {  // Crea esta API que valide el token y devuelva el nombre
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.resultado && data.resultadoAmedias) {
          setProceso(2);
        }
        else {
          setProceso(1);
        }
      })
      .catch(console.error);
      console.log(proceso)
  }, []);
  return (
    <>
      {/* Popup principal */}
      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button onClick={handleClose} className="popup-close-button">
              <X className="popup-close-icon" />
            </button>

            <div className="popup-content">
              <div className="popup-header">
                <div className="popup-logo">
                  <Image
                    src={'/logoAlante.png'}
                    width={53}
                    height={40}
                    alt='logo'
                  />
                </div>
              </div>

              {proceso === 2 ? (
                <>
                  <h2 className="popup-title">¡Ya eres parte del Club Elite!</h2>
                  <div className="popup-subtitle">Disfruta de tus ventajas exclusivas</div>

                  <div className="popup-benefits">
                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <Trophy />
                      </div>
                      <div className="benefit-text">
                        <h3>Acceso VIP</h3>
                        <p>Prioridad en promociones y lanzamientos</p>
                      </div>
                    </div>

                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <Gift />
                      </div>
                      <div className="benefit-text">
                        <h3>Regalos para miembros</h3>
                        <p>Contenido y productos exclusivos</p>
                      </div>
                    </div>
                  </div>

                  <div className="popup-buttons">
                    <Link className="popup-button-primary" href='/clubElite'>
                      <Trophy className="button-icon" />
                      Ir al Club Elite
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="popup-title">¡Únete a El Club!</h2>
                  <div className="popup-subtitle">Programa de afiliados premium</div>

                  <div className="popup-benefits">
                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <Trophy />
                      </div>
                      <div className="benefit-text">
                        <h3>Descuentos en envíos</h3>
                        <p>Envios a casa ¡por menos precio!</p>
                      </div>
                    </div>

                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <Tag />
                      </div>
                      <div className="benefit-text">
                        <h3>Descuentos Exclusivos</h3>
                        <p>Hasta 15% adicional en todos los productos</p>
                      </div>
                    </div>
                  </div>

                  {proceso === 0 ? (
                    <>
                      <div className="popup-buttons">
                        <Link className="popup-button-secondary" href='/auth/login'>
                          <User className="button-icon" />
                          Iniciar Sesión
                        </Link>
                        <Link className="popup-button-secondary" href='/auth/register'>Crear Cuenta</Link>
                      </div>

                      <div className="popup-footer">
                        Al unirte aceptas nuestros <a href="#">Términos y Condiciones</a>
                      </div>
                    </>
                  ) : (
                    <h2 className="popup-title">¡Compra al menos un producto para entrar en el club!</h2>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Icono minimizado */}
      {isMinimized && (
        <button onClick={handleOpen} className="popup-minimized-button">
          {proceso !== 2 && <div className="minimized-badge">1</div>}
          <Trophy className="popup-minimized-icon" />
        </button>
      )}
    </>
  )

}
