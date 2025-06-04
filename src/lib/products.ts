import { client } from "./db"
import { cache } from "react"

// Función para obtener todos los productos con caché
export const getAllProducts = cache(async () => {
  try {
    const result = await client.execute({
      sql: "SELECT * FROM productos ORDER BY id DESC",
    })

    return result.rows || []
  } catch (error) {
    console.error("Error obteniendo productos:", error)
    return []
  }
})

// Función para obtener un producto por slug con caché
export const getProductBySlug = cache(async (slug: string) => {
  try {
    const result = await client.execute({
      sql: "SELECT * FROM productos WHERE slug = ? LIMIT 1",
      args: [slug],
    })

    return result.rows[0] || null
  } catch (error) {
    console.error(`Error obteniendo producto con slug ${slug}:`, error)
    return null
  }
})

// Función para obtener todas las categorías con caché
export const getAllCategories = cache(async () => {
  try {
    const result = await client.execute({
      sql: 'SELECT DISTINCT tipo FROM productos WHERE tipo IS NOT NULL AND tipo != ""',
    })

    return result.rows.map((row) => row.tipo) || []
  } catch (error) {
    console.error("Error obteniendo categorías:", error)
    return []
  }
})

// Función para obtener productos por categoría con caché
export const getProductsByCategory = cache(async (category: string) => {
  try {
    const result = await client.execute({
      sql: "SELECT * FROM productos WHERE tipo = ? ORDER BY id DESC",
      args: [category],
    })

    return result.rows || []
  } catch (error) {
    console.error(`Error obteniendo productos de categoría ${category}:`, error)
    return []
  }
})

// Función para obtener productos destacados con caché
export const getFeaturedProducts = cache(async () => {
  try {
    const result = await client.execute({
      sql: "SELECT * FROM productos WHERE destacado = 1 ORDER BY id DESC LIMIT 8",
    })

    return result.rows || []
  } catch (error) {
    console.error("Error obteniendo productos destacados:", error)
    return []
  }
})

// Función para obtener marcas con caché
export const getAllBrands = cache(async () => {
  try {
    const result = await client.execute({
      sql: 'SELECT DISTINCT marca FROM productos WHERE marca IS NOT NULL AND marca != ""',
    })

    return result.rows.map((row) => row.marca) || []
  } catch (error) {
    console.error("Error obteniendo marcas:", error)
    return []
  }
})
