// stores/useCompraStore.ts
import { create } from 'zustand'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface Producto {
  producto: string
  cantidad: number
  sabor: string
  tamaño: string
  precioTotal: number
  finalDiscount: number
  tipo: string
}

interface CompraFinal {
  correo: string
  productosComprados: string
  fechaCompleta: string
  precioTotal: number
  saborTamanoCantidadDinero: string
}

interface CompraState {
  datosCompra: CompraFinal | null
  generarDatosCompra: (carrito: Producto[]) => void
}

export const useCompraStore = create<CompraState>((set) => ({
  datosCompra: null,

  generarDatosCompra: (carrito) => {
    const token = Cookies.get('token')
    if (!token) return

    const decoded = jwt.decode(token) as { correo: string }

    // Fecha formateada tipo DD/MM/YYYY
    const fecha = new Date()
    const dia = String(fecha.getDate()).padStart(2, '0')
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const anio = fecha.getFullYear()
    const fechaFormateada = `${dia}/${mes}/${anio}`

    // Formato de strings requeridos
    let productoComprado = ''
    let precioTotal = 0
    let saborTamanoCantidadDinero = ''

    for (const e of carrito) {
      productoComprado += `${e.producto}&%&${e.tipo}<<<`
      precioTotal += e.precioTotal
      saborTamanoCantidadDinero += `${e.sabor};${e.tamaño};${e.cantidad};${e.precioTotal};${e.finalDiscount}//`
    }

    set({
      datosCompra: {
        correo: decoded.correo,
        productosComprados: productoComprado,
        fechaCompleta: fechaFormateada,
        precioTotal,
        saborTamanoCantidadDinero,
      },
    })
  },
}))
