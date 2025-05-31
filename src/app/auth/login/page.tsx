"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, ArrowRight, } from "lucide-react"
import styles from "../../../styles/Auth.module.css"
import CustomCursor from "@/src/components/customCursor"
import Cookies from 'js-cookie'; // npm i js-cookie

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mensajeError, setMensajeError] = useState('')
  useEffect(() => {
      const token = Cookies.get('token');
      if (!token) return;

      fetch('/api/verifyToken', {  // Crea esta API que valide el token y devuelva el nombre
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
        .catch(console.error);
    }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contrasena: password, recuerda: rememberMe }),  // usa "correo"
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(`Error: ${errorData.message || 'No se pudo iniciar sesión'}`);
        setMensajeError('Datos no validos')
        setIsLoading(false);
        return;
      }
      setMensajeError('')
      const data = await response.json(); 
      console.log("Inicio de sesión exitoso:", data);
      window.location.href = '/'
      // Aquí redirigir o mostrar mensaje de éxito

    } catch (error) {
      console.error("Error en la petición:", error);
      alert('Error al registrar');
    } finally {
      setIsLoading(false);
    }
    // Simulación de login
    setTimeout(() => {
      setIsLoading(false)
      // Aquí iría la lógica real de login
      console.log("Login con:", { email, password, rememberMe })
    }, 1500)
  }

  return (
    <div className={styles.authContainer}>
      <CustomCursor />
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Link href="/" className={styles.logoContainer}>
            <Image src="/logoAlante.png" width={130} height={80} alt="Logo" priority/>
          </Link>
          <h1 className={styles.authTitle}>Iniciar Sesión</h1>
          <p className={styles.authSubtitle}>Accede a tu cuenta para ver tus pedidos, favoritos y más</p>
        </div>

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
                className={`${styles.formInput} hoverable`}
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.passwordHeader}>
              <label htmlFor="password" className={styles.formLabel}>
                Contraseña
              </label>
              <Link href="/auth/reset-password" className={`${styles.forgotPassword} hoverable`}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`${styles.formInput} hoverable`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          <div className={styles.rememberContainer}>
            <p style={{color: 'red'}}>{mensajeError}</p>
            <label className={`${styles.checkboxContainer} hoverable`}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className={styles.checkbox}
              />
              <span className={styles.checkmark}></span>
              <span>Recordar mi sesión</span>
            </label>
          </div>

          <button
            type="submit"
            className={`${styles.authButton} ${isLoading ? styles.loading : ""} hoverable`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner}></span>
            ) : (
              <>
                Iniciar Sesión <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
    {/*
        <div className={styles.divider}>
          <span>O continúa con</span>
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
*/}
        <div className={styles.authFooter}>
          <p>
            ¿No tienes una cuenta?{" "}
            <Link href="/auth/register" className={`${styles.authLink} hoverable`}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
