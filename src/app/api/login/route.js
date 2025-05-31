import { client } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { cookies } from 'next/headers';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'inseguro';

export async function POST(request) {
  try {
    const body = await request.json();
    const { correo, contrasena, recuerda } = body;

    const results = await client.execute({
      sql: 'SELECT * FROM usuarios WHERE correo = ?',
      args: [correo],
    });

    if (results.rows.length === 0) {
      return Response.json({ Resultado: false, Respuesta: 'Esta cuenta no existe' }, { status: 401 });
    }
    console.log(results)
    const usuario = results.rows[0];
    console.log(usuario)
    console.log(contrasena)
    const passwordOk = await verifyPassword(contrasena, usuario.contraseña);

    if (!passwordOk) {
      return Response.json({ Resultado: false, Respuesta: 'Contraseña incorrecta' }, { status: 401 });
    }

    const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, JWT_SECRET);

    // Establecer cookie
    const cookieOptions = {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
    };

    if (recuerda) {
      cookieOptions.maxAge = 60 * 60 * 24 * 365; // 1 año
    }

    cookies().set('token', token, cookieOptions);

    // Devolver respuesta JSON sin incluir el token explícitamente (ya va en cookie)
    return Response.json({
      Resultado: true,
      Respuesta: 'Login correcto',
    });
  } catch (err) {
    console.error('Error login:', err);
    return Response.json({ Resultado: false, Respuesta: 'Error inesperado', CodErr: err.message }, { status: 500 });
  }
}
