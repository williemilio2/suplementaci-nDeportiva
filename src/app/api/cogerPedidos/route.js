import { NextResponse } from 'next/server';
import { client } from "@/src/lib/db"
export async function GET() {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM compras'
    });
    console.log(result.rows)
    return NextResponse.json({
      ok: true,
      dataProductos: result.rows
    }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener compras:', error);
    return NextResponse.json({ ok: false, error: 'Error al acceder a la base de datos' }, { status: 500 });
  }
}

