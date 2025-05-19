"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, ArrowRight, ArrowLeft } from "lucide-react"
import styles from "../../../styles/Auth.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulación de envío de correo
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      // Aquí iría la lógica real de recuperación
      console.log("Recuperación para:", email)
    }, 1500)
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
              ? "Te enviaremos un enlace para restablecer tu contraseña"
              : "Hemos enviado un correo con instrucciones para recuperar tu contraseña"}
          </p>
        </div>

        {!isSubmitted ? (
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

            <button
              type="submit"
              className={`${styles.authButton} ${isLoading ? styles.loading : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                <>
                  Enviar Instrucciones <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  fill="#4CAF50"
                />
                <path
                  d="M16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z"
                  fill="white"
                />
              </svg>
            </div>
            <p className={styles.successText}>
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
            <p className={styles.successSubtext}>Si no encuentras el correo, revisa tu carpeta de spam.</p>
            <Link href="/auth/login" className={styles.backButton}>
              <ArrowLeft size={18} />
              Volver al inicio de sesión
            </Link>
          </div>
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
