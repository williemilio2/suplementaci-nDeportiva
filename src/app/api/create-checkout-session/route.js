import dotenv from 'dotenv';
import path from 'path';
import Stripe from 'stripe';


dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(req) {
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2025-04-30.basil', // Usa esta si '' da error
  });

  try {
    const body = await req.json();
    const precios = body.precioTotal;
    const nombres = body.items;
    const preciosCent = Math.round(precios * 100);

    console.log(body);
    console.log(nombres);

    if (!precios || !nombres) {
      return new Response(JSON.stringify({ error: 'Datos incompletos' }), { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: nombres.join(', '),
            },
            unit_amount: preciosCent,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    return Response.json({ id: session.id });
  } catch (error) {
    console.error('Error creando la sesión:', error);
    return new Response(JSON.stringify({ error: 'Error al crear la sesión' }), { status: 500 });
  }
}
