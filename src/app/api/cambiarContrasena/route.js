import { client } from '@/src/lib/db';
import dotenv from 'dotenv';
import path from 'path';
import { hashPassword } from '../../../lib/auth';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export async function POST(request) {
  try {
    const { correo, nuevaContrasena } = await request.json();

    const correoNormalizado = correo.trim().toLowerCase();
    const hashed = await hashPassword(nuevaContrasena);
    const resultado = await client.execute({
      sql: 'UPDATE usuarios SET contraseña = ? WHERE correo = ?',
      args: [hashed, correoNormalizado],
    });

    if (resultado.rowsAffected > 0) {
      return new Response(
        JSON.stringify({ resultado: true, mensaje: 'Contraseña actualizada correctamente' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ resultado: false, mensaje: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    return new Response(
      JSON.stringify({ resultado: false, mensaje: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
