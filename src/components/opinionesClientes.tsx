"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, StarHalf } from "lucide-react"
import styles from "../styles/opinionesClientes.module.css"
import Cookies from 'js-cookie'; // npm i js-cookie

// Tipos para las opiniones
interface Opinion {
  id: number
  usuarioValoracion: string
  fecha: string
  nota: number
  tituloValoracion: string
  textoValoracion: string
  productoValoracion: number; 
}

interface OpinionesClientesProps {
  productoId: number
  rating: number
  totalReviews: number
}

export default function OpinionesClientes({ productoId, rating, totalReviews }: OpinionesClientesProps) {
  const [opiniones, setOpiniones] = useState<Opinion[]>([])
  const [estadisticas, setEstadisticas] = useState({
    promedio: rating,
    total: totalReviews,
    distribucion: [0, 0, 0, 0, 0], // 1 a 5 estrellas
  })
  const [loading, setLoading] = useState(true)
  const [filtroEstrellas, setFiltroEstrellas] = useState<number | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nuevaOpinion, setNuevaOpinion] = useState({
    puntuacion: 0,
    titulo: "",
    comentario: "",
  })
  const [nombreUsuario, setNombreUsuario] = useState(null)
  const [notaMedia, setNotaMedia] = useState(null)
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
            setNombreUsuario(data.nombre);
          }
        })
        .catch(console.error);
    }, []);
  useEffect(() => {
    const fetchOpiniones = async () => {
    try {
      const res = await fetch('/api/cogerValoracion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productoId }),
      })
      const data = await res.json()

      setOpiniones(data.data)

      // Calcular distribución real basada en las opiniones
      const distribucion = calcularDistribucion(data.data)

      setEstadisticas({
        promedio: rating,
        total: totalReviews,
        distribucion: distribucion,
      })

      // Aquí actualizamos la media con lo que devuelve la API
      setNotaMedia(data.media)
    } catch (error) {
      console.error('Error al cargar opiniones:', error)
    } finally {
      setLoading(false)
    }
  }



    // Simulamos un retardo como en la demo
    setTimeout(() => {
      fetchOpiniones()
    }, 800)
  }, [productoId, rating, totalReviews])


  // Calcular la distribución de estrellas a partir de las opiniones
  const calcularDistribucion = (opiniones: Opinion[]) => {
    // Inicializar contadores para cada estrella (1-5)
    const contadores = [0, 0, 0, 0, 0]

    // Contar opiniones por estrellas
    opiniones.forEach((opinion) => {
      // Redondear al entero más cercano para la distribución
      const estrellaIndex = Math.min(Math.max(Math.round(opinion.nota) - 1, 0), 4)
      contadores[estrellaIndex]++
    })

    // Calcular porcentajes
    const total = opiniones.length
    if (total === 0) return [0, 0, 0, 0, 0]

    return contadores.map((count) => Math.round((count / total) * 100))
  }

  // Filtrar opiniones por estrellas
  const opinionesFiltradas = filtroEstrellas
    ? opiniones.filter((op) => {
        // Para filtrar, consideramos que una puntuación de 4.5 debe aparecer cuando se filtran 4 o 5 estrellas
        const min = Math.floor(op.nota)
        const max = Math.ceil(op.nota)
        return min === filtroEstrellas || max === filtroEstrellas
      })
    : opiniones

  // Renderizar estrellas usando la lógica proporcionada
  const renderEstrellas = (rating: number) => {
    return (
      <div className={styles.estrellas}>
        {[1, 2, 3, 4, 5].map((star) => {
          const diff = rating - (star - 1)

          let fillLevel = 0
          if (diff >= 0.75) {
            fillLevel = 1
          } else if (diff >= 0.25) {
            fillLevel = 0.5
          }

          if (fillLevel === 0.5) {
            return (
              <div key={star} style={{ position: "relative", transform: 'translateY(2px)'  }}>
                <StarHalf size={16} className={`${styles.star} ${styles.starFilled}`} fill="#FF5500" stroke="#ccc" />
                <StarHalf
                  size={16}
                  className={styles.starMirror}
                  fill="none"
                  stroke="#ccc"
                  style={{ position: "absolute", left: 0 }}
                />
              </div>
            )
          }

          return (
            <Star
              key={star}
              size={16}
              className={`${styles.star} ${fillLevel === 1 ? styles.starFilled : styles.starEmpty}`}
              fill={fillLevel > 0 ? "#FF5500" : "none"}
              stroke={fillLevel > 0 ? "#FF5500" : "#ccc"}
            />
          )
        })}
      </div>
    )
  }

  // Renderizar estrellas grandes para el promedio
  const renderEstrellasGrandes = (rating: number) => {
    return (
      <div className={styles.promedioEstrellas}>
        {[1, 2, 3, 4, 5].map((star) => {
          const diff = rating - (star - 1)

          let fillLevel = 0
          if (diff >= 0.75) {
            fillLevel = 1
          } else if (diff >= 0.25) {
            fillLevel = 0.5
          }

          if (fillLevel === 0.5) {
            return (
              <div key={star} style={{ position: "relative", transform: 'translateY(3px)' }}>
                <StarHalf size={24} className={`${styles.star} ${styles.starFilled}`} fill="#FF5500" stroke="#ccc" />
                <StarHalf
                  size={24}
                  className={styles.starMirror}
                  fill="none"
                  stroke="#ccc"
                  style={{ position: "absolute", left: 0 }}
                />
              </div>
            )
          }

          return (
            <Star
              key={star}
              size={24}
              className={`${styles.star} ${fillLevel === 1 ? styles.starFilled : styles.starEmpty}`}
              fill={fillLevel > 0 ? "#FF5500" : "none"}
              stroke={fillLevel > 0 ? "#FF5500" : "#ccc"}
            />
          )
        })}
      </div>
    )
  }

  // Renderizar estrellas interactivas para el formulario
  const renderEstrellasInteractivas = () => {
    return (
      <div className={styles.formularioEstrellas}>
        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((valor) => {
          const esEntero = valor % 1 === 0
          //const estrella = Math.ceil(valor)

          return (
            <button
              key={valor}
              type="button"
              className={`${styles.formularioEstrellaBtn} ${
                nuevaOpinion.puntuacion === valor ? styles.formularioEstrellaSeleccionada : ""
              }`}
              onClick={() => setNuevaOpinion({ ...nuevaOpinion, puntuacion: valor })}
              title={`${valor} ${valor === 1 ? "estrella" : "estrellas"}`}
            >
              {esEntero ? (
                <Star
                  size={24}
                  fill={nuevaOpinion.puntuacion >= valor ? "#FF5500" : "none"}
                  stroke={nuevaOpinion.puntuacion >= valor ? "#FF5500" : "#ccc"}
                />
              ) : (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <StarHalf
                    size={24}
                    fill={nuevaOpinion.puntuacion >= valor ? "#FF5500" : "none"}
                    stroke={nuevaOpinion.puntuacion >= valor ? "#FF5500" : "#ccc"}
                  />
                  <StarHalf
                    size={24}
                    className={styles.starMirror}
                    fill="none"
                    stroke="#ccc"
                    style={{ position: "absolute", left: 0 }}
                  />
                </div>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Manejar envío del formulario
  const handleSubmitOpinion = async (e: React.FormEvent) => {
    e.preventDefault()

    if (nuevaOpinion.puntuacion === 0) {
      alert("Por favor, selecciona una puntuación")
      return
    }

    if (!nuevaOpinion.titulo.trim()) {
      alert("Por favor, añade un título a tu opinión")
      return
    }

    if (!nuevaOpinion.comentario.trim()) {
      alert("Por favor, escribe un comentario")
      return
    }

    // En una aplicación real, aquí enviarías la opinión a tu API
    // Ejemplo: await fetch('/api/opiniones', { method: 'POST', body: JSON.stringify(nuevaOpinion) })

    // Simulamos añadir la opinión localmente
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Enero es 0
    const año = fecha.getFullYear();

    const fechaFormateada = `${dia}/${mes}/${año}`;
    const nuevaOpinionCompleta: Opinion = {
      id: Date.now(),
      usuarioValoracion: nombreUsuario || "Usuario",
      productoValoracion: productoId,
      tituloValoracion: nuevaOpinion.titulo,
      textoValoracion: nuevaOpinion.comentario,
      nota: nuevaOpinion.puntuacion,
      fecha: fechaFormateada,
    }
    await fetch("/api/ponerNuevoComentario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioValoracion: nombreUsuario || "Usuario",
        productoValoracion: productoId,
        tituloValoracion: nuevaOpinion.titulo,
        textoValoracion: nuevaOpinion.comentario,
        nota: nuevaOpinion.puntuacion,
        fecha: fechaFormateada
      }),
    });

    setOpiniones([nuevaOpinionCompleta, ...opiniones])

    // Recalcular distribución
    const nuevaDistribucion = calcularDistribucion([nuevaOpinionCompleta, ...opiniones])
    setEstadisticas({
      ...estadisticas,
      distribucion: nuevaDistribucion,
      total: estadisticas.total + 1,
    })

    // Resetear formulario
    setNuevaOpinion({
      puntuacion: 0,
      titulo: "",
      comentario: "",
    })
    setMostrarFormulario(false)

    alert("¡Gracias por tu opinión!")
  }

  return (
    <div className={styles.container} id="opiniones">
      <h2 className={styles.titulo}>Opiniones de clientes</h2>

      {loading ? (
        <div className={styles.loading}>Cargando opiniones...</div>
      ) : (
        <>
          <div className={styles.resumen}>
            <div className={styles.promedio}>
              <div className={styles.promedioNumero}>{notaMedia || 0}</div>
              {renderEstrellasGrandes(notaMedia || 0)}
              <div className={styles.promedioTotal}>Basado en {opiniones.length} opiniones</div>
            </div>

            <div className={styles.distribucion}>
              {[5, 4, 3, 2, 1].map((estrellas) => (
                <div
                  key={estrellas}
                  className={`${styles.distribucionFila} ${
                    filtroEstrellas === estrellas ? styles.distribucionFilaActiva : ""
                  }`}
                  onClick={() => setFiltroEstrellas(filtroEstrellas === estrellas ? null : estrellas)}
                >
                  <div className={styles.distribucionEstrellas}>{estrellas} estrellas</div>
                  <div className={styles.distribucionBarraContainer}>
                    <div
                      className={styles.distribucionBarra}
                      style={{ width: `${estadisticas.distribucion[estrellas - 1]}%` }}
                    ></div>
                  </div>
                  <div className={styles.distribucionPorcentaje}>{estadisticas.distribucion[estrellas - 1]}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.acciones}>
            <button className={styles.botonEscribir} onClick={() => setMostrarFormulario(!mostrarFormulario)}>
              {mostrarFormulario ? "Cancelar" : "Escribir una opinión"}
            </button>

            {filtroEstrellas && (
              <button className={styles.botonFiltro} onClick={() => setFiltroEstrellas(null)}>
                Quitar filtro ({filtroEstrellas} estrellas)
              </button>
            )}
          </div>

          {mostrarFormulario && (
            <form className={styles.formulario} onSubmit={handleSubmitOpinion}>
              <h3>Escribe tu opinión</h3>
              <div className={styles.formularioGrupo}>
                <label>Puntuación</label>
                <div className={styles.formularioEstrellasContainer}>
                  {renderEstrellasInteractivas()}
                  {nuevaOpinion.puntuacion > 0 && (
                    <span className={styles.puntuacionSeleccionada}>
                      {nuevaOpinion.puntuacion} {nuevaOpinion.puntuacion === 1 ? "estrella" : "estrellas"}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.formularioGrupo}>
                <label>Título</label>
                <input
                  type="text"
                  placeholder="Resume tu opinión"
                  value={nuevaOpinion.titulo}
                  onChange={(e) => setNuevaOpinion({ ...nuevaOpinion, titulo: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formularioGrupo}>
                <label>Comentario</label>
                <textarea
                  placeholder="Comparte tu experiencia con este producto"
                  value={nuevaOpinion.comentario}
                  onChange={(e) => setNuevaOpinion({ ...nuevaOpinion, comentario: e.target.value })}
                  required
                ></textarea>
              </div>
              <button type="submit" className={styles.formularioBotonEnviar}>
                Enviar opinión
              </button>
            </form>
          )}

          <div className={styles.lista}>
            {opinionesFiltradas.length > 0 ? (
              opinionesFiltradas.map((opinion) => (
                <div key={opinion.id} className={styles.opinionItem}>
                  <div className={styles.opinionCabecera}>
                    <div className={styles.opinionUsuarioInfo}>
                      <div className={styles.opinionUsuario}>{opinion.usuarioValoracion}</div>
                    </div>
                    <div className={styles.opinionFecha}>{opinion.fecha}</div>
                  </div>

                  <div className={styles.opinionEstrellas}>{renderEstrellas(opinion.nota)}</div>

                  <h3 className={styles.opinionTitulo}>{opinion.tituloValoracion}</h3>
                  <p className={styles.opinionComentario}>{opinion.textoValoracion}</p>
                </div>
              ))
            ) : (
              <div className={styles.vacio}>
                {filtroEstrellas
                  ? `No hay opiniones con ${filtroEstrellas} estrellas.`
                  : "No hay opiniones para este producto."}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
