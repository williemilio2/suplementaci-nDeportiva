import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const res = NextResponse.next()

  // Añadir cabeceras para ver el flujo
  res.headers.set('X-Debug-Token', token ?? 'no-token')

  if (!token) {
    const redirect = NextResponse.redirect(new URL('/login', request.url))
    redirect.headers.set('X-Debug-Reason', 'No token')
    return redirect
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { correo: string }

    res.headers.set('X-Debug-Correo', decoded.correo)

    if (decoded.correo !== 'hola@gmail.com') {
      const redirect = NextResponse.redirect(new URL('/login', request.url))
      redirect.headers.set('X-Debug-Reason', 'Correo no autorizado')
      return redirect
    }

    return res
  } catch (err) {
    console.log(err)
    const redirect = NextResponse.redirect(new URL('/login', request.url))
    redirect.headers.set('X-Debug-Reason', 'Token inválido')
    return redirect
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
