import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { client } from "@/src/lib/db";

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    // Extraemos token de la cookie 'token'
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) throw new Error('No token');

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const resultNombre = await client.execute({
      sql: 'SELECT nombre FROM usuarios WHERE correo = ?',
      args: [decoded.correo],
    });
    const nombreNuevo = resultNombre.rows[0]?.nombre;

    return new Response(JSON.stringify({ resultado: true, nombre: nombreNuevo }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error al verificar token:', error);
    return new Response(JSON.stringify({ resultado: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const { token } = await req.json();

    const decoded = jwt.verify(token, JWT_SECRET);
    const esAdmin = decoded.correo == 'willymarta@gmail.com'
    const resultNombre = await client.execute({
      sql: 'SELECT nombre FROM usuarios WHERE correo = ?',
      args: [decoded.correo],
    });
    const nombreNuevo = resultNombre.rows[0]?.nombre;

    return new Response(JSON.stringify({ resultado: true, nombre: nombreNuevo, esAdmin: esAdmin}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    return new Response(JSON.stringify({ resultado: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
