import { client } from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, correo, contrasena } = body;

    const hashed = await hashPassword(contrasena);
    await client.execute({
      sql: 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)',
      args: [nombre, correo, hashed],
    });

    console.log('Usuario nuevo registrado');
    return new Response(
      JSON.stringify({
        Resultado: true,
        Respuesta: 'Registrado correctamente. En espera de aprobación.',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Error al registrar:', err);
    return new Response(
      JSON.stringify({
        Resultado: false,
        Respuesta: 'Error inesperado',
        CodErr: err.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
