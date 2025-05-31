import { createClient } from "@libsql/client"

// Función para crear el cliente de base de datos
export function createDbClient() {
  try {
    // Intentar obtener las variables de entorno
    const dbUrl = process.env.TURSO_DATABASE_URL || process.env.TURSO_DB_LINK
    const dbToken = process.env.TURSO_AUTH_TOKEN || process.env.TURSO_DB_TOKEN

    // Si no hay variables de entorno, usar valores de prueba (solo para desarrollo)
    if (!dbUrl || !dbToken) {
      console.warn("⚠️ Variables de entorno no encontradas, usando valores de prueba")

      // Valores de ejemplo (estos no funcionarán en producción)
      const testUrl = "libsql://suplementaciondeportiva-emiliosuplementacion.aws-eu-west-1.turso.io"
      const testToken =
        "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDc4NDI2NDksImlkIjoiNGQ0MmVkYmUtMjFlZi00NDI5LWI1YjEtN2QwYjZmMGI5YjRmIiwicmlkIjoiOTYwN2UwODItMWYyMC00ZGMwLTg5ZDctZWJkNzgyYTIxY2Y0In0.i8OvKTY1eTMIczNpUYXIV9wY5JakuxBYgd5zr0Vpr6IYUn-rmTb0U9h7Md0-F09ph4GlH01aq8KQDyoty6cuCg"

      return createClient({
        url: testUrl,
        authToken: testToken,
      })
    }

    // Crear y devolver el cliente con las variables de entorno
    return createClient({
      url: dbUrl,
      authToken: dbToken,
    })
  } catch (error) {
    console.error("❌ Error al crear cliente de base de datos:", error)
    throw new Error("No se pudo crear el cliente de base de datos")
  }
}

// Crear una instancia del cliente
export const client = createDbClient()
