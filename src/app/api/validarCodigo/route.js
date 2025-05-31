import { client } from '@/src/lib/db';

export async function POST(request) {
  try {
    const { correo, codigo } = await request.json();
    const correoNormalizado = correo.trim().toLowerCase();

    const result = await client.execute({
      sql: 'SELECT code FROM temporalCode WHERE correo = ?',
      args: [correoNormalizado],
    });

    const codigoGuardado = result.rows[0]?.code;
    console.log(result)
    console.log(codigoGuardado)
    console.log(correoNormalizado)
    console.log(codigo)

    if (codigoGuardado && codigoGuardado == codigo) {
      // Eliminar código para evitar reutilización
      await client.execute({
        sql: 'DELETE FROM temporalCode WHERE correo = ?',
        args: [correoNormalizado],
      });

      return new Response(JSON.stringify({ resultado: true, mensaje: 'Código válido' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ resultado: false, mensaje: 'Código inválido' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ resultado: false, mensaje: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
