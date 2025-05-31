import { NextResponse } from 'next/server'
import { client } from "@/src/lib/db"

export async function POST(req) {
  try {
    const { productoId } = await req.json()
    console.log('ProductoId recibido:', productoId)

    // Consulta para obtener las valoraciones
    const result = await client.execute({
      sql: 'SELECT * FROM valoraciones WHERE productoValoracion = ?',
      args: [productoId],
    })

    // Consulta para calcular la media del campo nota
    const mediaResult = await client.execute({
      sql: 'SELECT AVG(nota) as media FROM valoraciones WHERE productoValoracion = ?',
      args: [productoId],
    })

    // mediaResult.rows[0].media debería contener la media (puede ser null si no hay valoraciones)
    const media = mediaResult.rows[0].media ?? 0
    
    const currentData = await client.execute({
      sql: `SELECT rating, reviews FROM productos WHERE id = ?`,
      args: [productoId],
    });

    const current = currentData.rows[0] || { rating: null, reviews: null };

    // 2. Comparar
    if (current.rating !== media || current.reviews !== result.rows.length) {
      // 3. Ejecutar UPDATE sólo si es distinto
      await client.execute({
        sql: `
          UPDATE productos
          SET rating = ?, reviews = ?
          WHERE id = ?
        `,
        args: [media, result.rows.length, productoId],
      });
    }
    return NextResponse.json({
      ok: true,
      data: result.rows,
      media: parseFloat(media.toFixed(2)) // redondeamos a 2 decimales
    }, { status: 200 })
  } catch (error) {
    console.error('Error al obtener valoraciones:', error)
    return NextResponse.json({ ok: false, error: 'Error al acceder a la base de datos' }, { status: 500 })
  }
}
