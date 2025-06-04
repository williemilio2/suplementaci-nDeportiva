import { NextResponse } from "next/server"
import { rateLimit } from "../../../lib/security"

export async function GET(request: Request) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || "unknown"
  if (!rateLimit(ip, 10, 60000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    // Verificar estado de la base de datos
    // const dbStatus = await checkDatabaseConnection()

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      // database: dbStatus
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ status: "unhealthy", error: "Service unavailable" }, { status: 503 })
  }
}
