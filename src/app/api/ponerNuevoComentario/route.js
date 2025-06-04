import { client } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("📥 Recibiendo solicitud POST...");

    const body = await req.json();
    console.log("📦 Body recibido:", body);

    const {
      usuarioValoracion,
      productoValoracion,
      tituloValoracion,
      textoValoracion,
      nota,
      fecha,
    } = body;

    console.log("📝 Insertando en base de datos...");
    const result = await client.execute(
      `INSERT INTO valoraciones 
       (usuarioValoracion, productoValoracion, tituloValoracion, textoValoracion, nota, fecha)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usuarioValoracion,
        productoValoracion,
        tituloValoracion,
        textoValoracion,
        nota,
        fecha,
      ]
    );

    console.log("✅ Inserción completada:", result);

    return NextResponse.json(
      { ok: true, mensaje: "Valoración añadida correctamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error al insertar valoración:", error);

    return NextResponse.json(
      { error: "Error en el servidor", detalle: error.message },
      { status: 500 }
    );
  }
}
