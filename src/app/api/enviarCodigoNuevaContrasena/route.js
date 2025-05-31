import nodemailer from "nodemailer"
import { client } from "@/src/lib/db"
import dotenv from "dotenv"
import path from "path"
import { generateEmailTemplate } from "@/src/lib/emailTemplate"

dotenv.config({ path: path.resolve(process.cwd(), ".env") })

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString() // 6 dígitos
}

export async function POST(request) {
  console.log("HOLA")
  try {
    const { correo } = await request.json()
    const correoNormalizado = correo.trim().toLowerCase()
    const codigo = generateCode()

    // Guardar o actualizar código
    await client.execute({
      sql: "INSERT OR REPLACE INTO temporalCode (correo, code) VALUES (?, ?)",
      args: [correoNormalizado, codigo],
    })

    // Enviar email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "willymarta@gmail.com",
        pass: process.env.NODEMAILER_CODE,
      },
    })

    // Generar HTML con la plantilla para cambio de contraseña
    const htmlContent = generateEmailTemplate(codigo, "password")

    await transporter.sendMail({
      from: '"Suplementación Deportiva" <willymarta@gmail.com>',
      to: correo,
      subject: "Código de verificación cambio contraseña",
      text: `Tu código de verificación es: ${codigo}`,
      html: htmlContent,
    })

    return new Response(JSON.stringify({ resultado: true, mensaje: "Código enviado" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error:", error)
    return new Response(JSON.stringify({ resultado: false, mensaje: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
