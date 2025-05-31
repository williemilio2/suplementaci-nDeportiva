import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { client } from "@/src/lib/db"

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const body = await req.json();
    const token = body.token;
    const decoded = jwt.verify(token, JWT_SECRET);

    const response = await client.execute(
      `SELECT * FROM compras WHERE correoUsuarioCompra = ? ORDER BY fechaCompleta DESC`,
      [decoded.correo]
    );

    const columnas = response.columns;

    // Mapear cada fila a objeto usando columnas
    const compras = response.rows.map(fila =>
      Object.fromEntries(
        columnas.map((col, i) => [col, fila[i]])
      )
    );
    console.log(compras)
    return NextResponse.json({ ok: true, data: compras });
  } catch (error) {
    console.error('Error al obtener compras:', error);
    return NextResponse.json({ ok: false, message: 'Error al obtener compras' }, { status: 500 });
  }
}