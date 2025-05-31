import { NextResponse } from 'next/server';
import { client } from "@/src/lib/db"
export async function POST(req) {
  try {
    const { productIds } = await req.json()  // Recibimos { productIds: [1, 2, 3] }
    console.log(productIds)
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ ok: false, message: 'No se recibieron IDs válidos' }, { status: 400 })
    }

    // Eliminar en orden para respetar relaciones, primero info_nutricional y stock, luego productos

    // 1. Eliminar informacion_nutricional
    for (const id of productIds) {
      await client.execute(`DELETE FROM informacion_nutricional WHERE product_id = ?`, [id])
    }

    // 2. Eliminar stock
    for (const id of productIds) {
      await client.execute(`DELETE FROM stock WHERE product_id = ?`, [id])
    }

    // 3. Eliminar productos
    for (const id of productIds) {
      await client.execute(`DELETE FROM productos WHERE id = ?`, [id])
    }

    return NextResponse.json({ ok: true, message: 'Productos y datos relacionados eliminados' })
  } catch (error) {
    console.error('Error eliminando productos:', error)
    return NextResponse.json({ ok: false, message: 'Error eliminando productos' }, { status: 500 })
  }
}
