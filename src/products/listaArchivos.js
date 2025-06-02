import { client } from "../lib/db"

// Datos en memoria
let allProducts = []
let stock = []
let informacionNutricional = []
let compras = []
let clientes
let dataLoaded = false

// Función para cargar todos los datos de la base de datos
async function loadAllData() {
  if (dataLoaded) return { allProducts, stock, informacionNutricional, compras, clientes }

  try {
    console.log("🔄 Cargando datos desde la base de datos...")

    // Cargar productos
    const productosResult = await client.execute("SELECT * FROM productos")
    allProducts = productosResult.rows.map((row) => ({
      ...row,
      superOfertas: row.superOfertas === 1, // Convertir 0/1 a boolean
      // Asegurar que los campos requeridos existan
      description: row.description || "",
      image: row.image || "",
      tipo: row.tipo || "",
    }))
    console.log(`✅ Cargados ${allProducts.length} productos`)

    // Cargar stock
    const stockResult = await client.execute("SELECT * FROM stock")
    stock = stockResult.rows
    console.log(`✅ Cargados ${stock.length} registros de stock`)

    // Cargar información nutricional
    const infoResult = await client.execute("SELECT * FROM informacion_nutricional")
    informacionNutricional = infoResult.rows
    console.log(`✅ Cargados ${informacionNutricional.length} registros de información nutricional`)    
    const copmprasReult = await client.execute("SELECT * FROM compras")
    compras = copmprasReult.rows
    console.log(`✅ Cargados ${compras.length} registros de información nutricional`)
    const clientesReult = await client.execute("SELECT * FROM usuarios")
    const clientesTotal = clientesReult.rows
    clientes = clientesTotal.length

    dataLoaded = true
    return { allProducts, stock, informacionNutricional }
  } catch (error) {
    console.error("❌ Error al cargar datos:", error)

    // Si hay un error, cargar datos de ejemplo
    console.log("⚠️ Usando datos de ejemplo como fallback")
    allProducts = [
      {
        id: 1,
        name: "High-Quality MASS PROTEIN",
        description: "Fórmula de alta pureza con 28g de proteína de máxima pureza con fórmula mejorada",
        image:
          "https://q2qwccah9hqmefmy.public.blob.vercel-storage.com/evoflex-gral-coat-tabs-front-hsn_1-9yP2K8aLQ71nESrj0BClWhMtfZ8ofx.webp",
        rating: 3.3,
        reviews: 348,
        badge: "EXCLUSIVO",
        marca: "Ronnie Coleman",
        tipo: "Hydrolyzed Protein",
        colesterol: "Mínimo",
        superOfertas: true,
        slug: "high-quality-mass-protein",
        categoriaEspecial: "veganas<<<OfertaDelDia<<<proteinas",
        precio: 32.66,
        precioAnterior: 37.98,
      },
      {
        id: 2,
        name: "Whey Protein Isolate",
        description: "Aislado de proteína de suero de alta calidad con 27g de proteína por servicio",
        image: "/placeholder.svg?height=200&width=200",
        rating: 4.5,
        reviews: 124,
        badge: "TOP VENTAS",
        marca: "HSN",
        tipo: "Isolated Protein",
        colesterol: "Bajo",
        superOfertas: true,
        slug: "whey-protein-isolate",
        categoriaEspecial: "proteinas<<<OfertaDelDia",
        precio: 29.99,
        precioAnterior: 34.99,
      },
      {
        id: 3,
        name: "BCAA 2:1:1 Recovery",
        description: "Aminoácidos ramificados para mejorar la recuperación muscular",
        image: "/placeholder.svg?height=200&width=200",
        rating: 4.2,
        reviews: 87,
        marca: "Optimum Nutrition",
        tipo: "Aminoácidos",
        colesterol: "Ninguno",
        superOfertas: false,
        slug: "bcaa-recovery",
        categoriaEspecial: "aminoacidos<<<recuperacion",
        precio: 24.5,
      },
    ]

    stock = []
    informacionNutricional = []

    dataLoaded = true
    return { allProducts, stock, informacionNutricional }
  }
}

// Cargar datos al inicializar
loadAllData().catch(console.error)

// Función para obtener stock de un producto
export function sacarStock(id) {
  const stockProductoElegido = stock.filter((item) => item.product_id === id)
  if (stockProductoElegido.length === 0) {
    return null
  }
  return stockProductoElegido
}

// Función para obtener información nutricional de un producto
export function sacarInformacionNutricional(id) {
  const informacionNutricionalProductoElegido = informacionNutricional.filter((item) => item.product_id === id)
  if (informacionNutricionalProductoElegido.length === 0) {
    return null
  }
  return informacionNutricionalProductoElegido
}

// Función para obtener productos con ofertas especiales
export function getProductosSuperOfertas() {
  return allProducts.filter((producto) => producto.superOfertas)
}

// Exportar productos con ofertas especiales
export const productosSuperOfertas = getProductosSuperOfertas()

// Función para obtener productos por categoría especial
export function especiales(tituloEspecial) {
  const limpiarCaracteres = (str) => str.replace(/[^a-zA-Z0-9\s]/g, '').trim()

  const tieneEspeciales = /[^a-zA-Z0-9\s]/.test(tituloEspecial)

  if (tieneEspeciales) {
    // Limpiamos tituloEspecial
    const tituloLimpio = limpiarCaracteres(tituloEspecial).toLowerCase()

    return allProducts.filter(producto => {
      if (!producto.tipo) return false

      const tipoLower = producto.tipo.trim().toLowerCase()
      return tipoLower === tituloLimpio
    })
  } else {
    return allProducts.filter(producto => {
      if (!producto.categoriaEspecial) return false
      return producto.categoriaEspecial.includes(tituloEspecial)
    })
  }
}



// Función para obtener productos guardados
export function guardados(guardadosArray) {
  const coleccionGuardados = []
  // Iteramos sobre la lista de guardados
  for (const e of guardadosArray) {
    // Buscamos en allProducts el producto que coincida con el name
    const productoGuardado = allProducts.find((producto) => producto.name === e.producto)
    if (productoGuardado) {
      // Si encontramos el producto, lo agregamos a la lista
      coleccionGuardados.push(productoGuardado)
    }
  }
  return coleccionGuardados
}

// Función para obtener productos favoritos
export function favoritosF(favoritos) {
  const coleccionGuardados = []
  // Iteramos sobre la lista de favoritos
  for (const e of favoritos) {
    // Buscamos en allProducts el producto que coincida con el name
    const productoGuardado = allProducts.find((producto) => producto.name === e)
    if (productoGuardado) {
      // Si encontramos el producto, lo agregamos a la lista
      coleccionGuardados.push(productoGuardado)
    }
  }
  return coleccionGuardados
}

// Función para filtrar productos similares
export function filtrarProductosSimilares(productoActual, maxProductos = 9) {
  if (!productoActual) return []

  // Extraer características para comparar
  const { id, categoriaEspecial, marca, tipo } = productoActual

  // Convertir categoriaEspecial a array si existe
  const categoriasActual = categoriaEspecial ? categoriaEspecial.split("<<<") : []

  // Función para calcular puntuación de similitud
  const calcularPuntuacionSimilitud = (producto) => {
    if (producto.id === id) return -1 // Excluir el producto actual

    let puntuacion = 0

    // Misma marca: +3 puntos
    if (producto.marca === marca) {
      puntuacion += 3
    }

    // Mismo tipo: +2 puntos
    if (producto.tipo === tipo) {
      puntuacion += 2
    }

    // Categorías compartidas
    if (producto.categoriaEspecial && categoriasActual.length > 0) {
      const categoriasProducto = producto.categoriaEspecial.split("<<<")

      // Por cada categoría compartida: +1 punto
      categoriasProducto.forEach((cat) => {
        if (categoriasActual.includes(cat)) {
          puntuacion += 1
        }
      })
    }

    // Si es una oferta especial y el producto actual también: +1 punto
    if (producto.superOfertas && productoActual.superOfertas) {
      puntuacion += 1
    }

    return puntuacion
  }

  // Filtrar y ordenar productos por puntuación de similitud
  const productosSimilares = allProducts
    .map((producto) => ({
      ...producto,
      puntuacionSimilitud: calcularPuntuacionSimilitud(producto),
    }))
    .filter((producto) => producto.puntuacionSimilitud > 0) // Solo productos con alguna similitud
    .sort((a, b) => b.puntuacionSimilitud - a.puntuacionSimilitud) // Ordenar por mayor similitud
    .slice(0, maxProductos) // Limitar al número máximo

  return productosSimilares
}

// Función para asegurar que los datos estén cargados
export async function ensureDataLoaded() {
  if (!dataLoaded) {
    await loadAllData()
  }
  return { allProducts, stock, informacionNutricional, compras, clientes }
}

// Función para obtener productos similares (versión asíncrona)
export async function productosSimilaresFiltrados(productoActual, maxProductos = 9) {
  await ensureDataLoaded()
  return filtrarProductosSimilares(productoActual, maxProductos)
}

// Exportar funciones asíncronas
export async function getAllProducts() {
  await ensureDataLoaded()
  return allProducts
}

export async function getStock() {
  await ensureDataLoaded()
  return stock
}

export async function getInformacionNutricional() {
  await ensureDataLoaded()
  return informacionNutricional
}
export const filtrarProductosSimilaresSeguro = async (producto) => {
  try {
    // Asegurar que los datos están cargados
    await ensureDataLoaded()

    // Usar la función original que ya tienes
    return filtrarProductosSimilares(producto)
  } catch (error) {
    console.error("Error al filtrar productos similares:", error)
    return []
  }
}

// Función para cargar favoritos de forma segura
export const favoritosFSeguro = async (favoritosIds) => {
  try {
    // Asegurar que los datos están cargados
    await ensureDataLoaded()

    // Usar la función original que ya tienes
    return favoritosF(favoritosIds)
  } catch (error) {
    console.error("Error al cargar favoritos:", error)
    return []
  }
}

// Función para cargar productos del carrito de forma segura
export const guardadosSeguro = async (carritoItems) => {
  try {
    // Asegurar que los datos están cargados
    await ensureDataLoaded()

    // Usar la función original que ya tienes
    return guardados(carritoItems)
  } catch (error) {
    console.error("Error al cargar productos del carrito:", error)
    return []
  }
}

// Mantener todas las funciones originales que ya tienes...
// (no las reescribo para no duplicar código)

// Añadir estas funciones seguras para información nutricional y stock

// Función para cargar información nutricional de forma segura
export const sacarInformacionNutricionalSeguro = async (productId) => {
  try {
    // Asegurar que los datos están cargados
    await ensureDataLoaded()

    // Usar la función original
    const infoNutricional = sacarInformacionNutricional(productId)
    return infoNutricional || []
  } catch (error) {
    console.error("Error al cargar información nutricional:", error)
    return []
  }
}

// Función para cargar stock de forma segura
export const sacarStockSeguro = async (productId) => {
  try {
    // Asegurar que los datos están cargados
    await ensureDataLoaded()

    // Usar la función original
    const stock = sacarStock(productId)
    return stock || []
  } catch (error) {
    console.error("Error al cargar stock:", error)
    return []
  }
}
// Exportar los arrays con tipos explícitos
export { allProducts, stock, informacionNutricional }
