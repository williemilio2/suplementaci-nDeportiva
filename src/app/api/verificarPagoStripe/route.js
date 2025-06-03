import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const session_id = searchParams.get('session_id')

  if (!session_id) {
    return new Response(JSON.stringify({ error: 'Falta session_id' }), {
      status: 400,
    })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status === 'paid') {
      return new Response(JSON.stringify({ pagoExitoso: true }), {
        status: 200,
      })
    } else {
      return new Response(JSON.stringify({ pagoExitoso: false }), {
        status: 200,
      })
    }
  } catch (error) {
    console.error('Error verificando sesión de Stripe:', error)
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
    })
  }
}
