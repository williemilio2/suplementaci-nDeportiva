import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { client } from '@/src/lib/db';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  console.log('HOLA! ME HAN LLAMADO');
  try {
    const { token } = await req.json();

    const decoded = jwt.verify(token, JWT_SECRET);
    const correo = decoded.correo
    const correoNormalizado = correo.trim().toLowerCase()
    const result = await client.execute({
      sql: "SELECT productosComprados FROM compras WHERE correoUsuarioCompra = ?",
      args: [correoNormalizado],
    })
    if (result.rows.length > 0) {
      return new Response(JSON.stringify({ resultado: true, resultadoAmedias: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }
    else{
        return new Response(JSON.stringify({ resultado: false, error: 'Aún no has comprado ningún articulo', resultadoAmedias: true }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
  } catch (error) {
    console.log('Error al verificar token:', error);
  }

}
