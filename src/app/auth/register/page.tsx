"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import styles from "../../../styles/Auth.module.css"
import CustomCursor from "@/src/components/customCursor"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    // Simulación de registro
    setTimeout(() => {
      setIsLoading(false)
      // Aquí iría la lógica real de registro
      console.log("Registro con:", { name, email, password, acceptTerms })
    }, 1500)
  }

  return (
    <div className={styles.authContainer}>
        <CustomCursor />
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Link href="/" className={styles.logoContainer}>
            <Image src="/logoAlante.png" width={130} height={80} alt="Logo" priority className={styles.logoContainerImage} />
          </Link>
          <h1 className={styles.authTitle}>Crear Cuenta</h1>
          <p className={styles.authSubtitle}>Únete a nuestra comunidad y disfruta de ofertas exclusivas</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>
              Nombre completo
            </label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} />
              <input
                id="name"
                type="text"
                className={`${styles.formInput} hoverable`}
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Correo electrónico
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                className={`${styles.formInput} hoverable`}
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Contraseña
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`${styles.formInput} hoverable`}
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                required
                minLength={8}
              />
              <button
                type="button"
                className={`${styles.passwordToggle} hoverable`}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>
              Confirmar contraseña
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`${styles.formInput} hoverable`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={`${styles.passwordToggle} hoverable`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className={styles.passwordMismatch}>Las contraseñas no coinciden</p>
            )}
          </div>

          <div className={styles.termsContainer}>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
                className={`${styles.checkbox} hoverable`}
                required
              />
              <span className={styles.checkmark}></span>
              <span>
                Acepto los{" "}
                <Link href="/terminos-condiciones" className={`${styles.termsLink} hoverable`}>
                  Términos y Condiciones
                </Link>{" "}
                y la{" "}
                <Link href="/terminos-condiciones" className={`${styles.termsLink} hoverable`}>
                  Política de Privacidad
                </Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={`${styles.authButton} ${isLoading ? styles.loading : ""} ${isLoading || !acceptTerms || password !== confirmPassword ? '' : 'hoverable'}`}
            disabled={isLoading || !acceptTerms || password !== confirmPassword}
          >
            {isLoading ? (
              <span className={styles.spinner}></span>
            ) : (
              <>
                Crear Cuenta <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.divider}>
          <span>O regístrate con</span>
        </div>

        <div className={styles.socialButtons}>
          <button className={`${styles.socialButton} ${styles.google} hoverable`}>
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>

        <div className={styles.authFooter}>
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login" className={`${styles.authLink} hoverable`}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
