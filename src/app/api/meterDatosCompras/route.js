import { NextResponse } from 'next/server'
import { client } from "@/src/lib/db"


export async function POST(req) {
  try {
    const body = await req.json(); // <- cambio necesario

      await client.execute(
      `INSERT INTO compras (correoUsuarioCompra, productosComprados, fechaCompleta, precioTotal, saborTamanoCantidadDinero, direccion)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        body.correo,
        body.productosComprados,
        body.fechaCompleta,
        body.precioTotal,
        body.saborTamanoCantidadDinero,
        body.direccionFinal,
      ]
    )
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error al insertar producto:', error);
    return NextResponse.json({ ok: false, message: 'Error al insertar producto' }, { status: 500 });
  }
}
