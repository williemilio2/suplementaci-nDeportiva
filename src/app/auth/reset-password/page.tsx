"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, ArrowRight, ArrowLeft, Eye, EyeOff  } from "lucide-react"
import Cookies from 'js-cookie'

import styles from "../../../styles/Auth.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mensajeError, setMensajeError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [ponerNuevaContrasena, setPonerNuevaContrasena] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Redirige si ya hay token válido
  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) return

    fetch('/api/verifyToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.resultado && data.nombre) {
          window.location.href = '/'
        }
      })
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMensajeError('')

    try {
      const res = await fetch('/api/enviarCodigoNuevaContrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email }),
      })

      const data = await res.json()

      if (data.resultado) {
        setIsSubmitted(true)
      } else {
        setMensajeError('Error al enviar el código. Verifica el correo.')
      }
    } catch (error) {
      setMensajeError('Error interno del servidor.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMensajeError('')

    try {
      const res = await fetch('/api/validarCodigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, codigo: code }),
      })

      const data = await res.json()

      if (data.resultado) {
        setPonerNuevaContrasena(true)
      } else {
        setMensajeError('Código inválido o expirado.')
      }
    } catch (error) {
      setMensajeError('Error al validar el código.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      setMensajeError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      setMensajeError('Las contraseñas no coinciden.')
      return
    }

    setIsLoading(true)
    setMensajeError('')

    try {
      const res = await fetch('/api/cambiarContrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, nuevaContrasena: newPassword }),
      })

      const data = await res.json()

      if (data.resultado) {
        alert('Contraseña cambiada correctamente. Ahora puedes iniciar sesión.')
        window.location.href = '/auth/login'
      } else {
        setMensajeError('Hubo un error al cambiar la contraseña.')
      }
    } catch (error) {
      setMensajeError('Error en el servidor. Intenta más tarde.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.authContainer}>
      <CustomCursor />
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Link href="/" className={styles.logoContainer}>
            <Image src="/logoAlante.png" width={130} height={80} alt="Logo" priority />
          </Link>
          <h1 className={styles.authTitle}>Recuperar Contraseña</h1>
          <p className={styles.authSubtitle}>
            {!isSubmitted
              ? "Te enviaremos un código a tu correo para restablecer tu contraseña."
              : ponerNuevaContrasena
              ? "Introduce tu nueva contraseña."
              : "Introduce el código que te hemos enviado al correo."}
          </p>
        </div>

        {/* FORM 1 - ENVIAR CÓDIGO */}
        {!isSubmitted && (
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Correo electrónico
              </label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  className={styles.formInput}
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            {mensajeError && <p className={styles.errorText}>{mensajeError}</p>}
            <button
              type="submit"
              className={`${styles.authButton} ${isLoading ? styles.loading : ""}`}
              disabled={isLoading}
            >
              {isLoading ? <span className={styles.spinner}></span> : <>Enviar Código <ArrowRight size={18} /></>}
            </button>
          </form>
        )}

        {/* FORM 2 - VALIDAR CÓDIGO */}
        {isSubmitted && !ponerNuevaContrasena && (
          <form onSubmit={handleVerifyCode} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Código de verificación</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Introduce el código"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
              />
            </div>
            {mensajeError && <p className={styles.errorText}>{mensajeError}</p>}
            <button type="submit" className={styles.authButton} disabled={isLoading}>
              {isLoading ? <span className={styles.spinner}></span> : <>Verificar Código</>}
            </button>
          </form>
        )}

        {/* FORM 3 - NUEVA CONTRASEÑA */}
        {ponerNuevaContrasena && (
          <form onSubmit={handleChangePassword} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nueva contraseña</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className={styles.formInput}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Confirmar nueva contraseña</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={styles.formInput}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mensajeError && <p className={styles.errorText}>{mensajeError}</p>}

            <button
              type="submit"
              className={`${styles.authButton} ${isLoading ? styles.loading : ""}`}
              disabled={isLoading}
            >
              {isLoading ? <span className={styles.spinner}></span> : <>Cambiar Contraseña</>}
            </button>
          </form>
        )}


        <div className={styles.authFooter}>
          <p>
            <Link href="/auth/login" className={styles.authLink}>
              <ArrowLeft size={16} className={styles.backIcon} />
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
