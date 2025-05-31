import { NextResponse } from 'next/server'
import { client } from '@/src/lib/db'

export async function POST(req) {
  try {
    const {
      insignia,
      categorias,
      superOferta,
      selectedSabor,
      selectedTamano,
      preciosOfertas,
      precios,
      producto,
      cantidad,
      rebajasElite,
      quitarRebajasElite
    } = await req.json()

    if (!producto) {
      return NextResponse.json({ ok: false, message: 'ID del producto no especificado' }, { status: 400 })
    }

    const updates = []
    const values = []

    // Actualización de PRODUCTOS
    if (insignia !== null && insignia !== '') {
      updates.push('badge = ?')
      values.push(insignia)
    }

    if (categorias !== null && categorias !== '') {
      const result = await client.execute({
        sql: 'SELECT categoriaEspecial FROM productos WHERE id = ?',
        args: [producto]
      })

      const oldCategoria = result.rows?.[0]?.categoriaEspecial || ''
      const nuevaCategoria = '<<<' + categorias

      const categoriaFinal = oldCategoria
        ? `${nuevaCategoria}${oldCategoria}`
        : nuevaCategoria

      updates.push('categoriaEspecial = ?')
      values.push(categoriaFinal)
    }
    updates.push('superOfertas = ?')
    values.push(superOferta ? 1 : 0)

    if (rebajasElite === true) {
      updates.push('rebajasElite = ?')
      values.push(preciosOfertas)
    }

    if (updates.length > 0) {
      values.push(producto)

      const sql = `
        UPDATE productos
        SET ${updates.join(', ')}
        WHERE id = ?
      `

      await client.execute({ sql, args: values })
    }

    // Si NO hay rebajasElite, entonces actualizar o insertar stock
    if (rebajasElite !== true) {
      const result = await client.execute({
        sql: `
          SELECT id FROM stock
          WHERE product_id = ? AND sabor = ? AND tamano = ?
        `,
        args: [producto, selectedSabor, selectedTamano],
      })

      const stockCheck = result.rows || []

      if (stockCheck.length > 0) {
        if (precios == 0) {
          await client.execute({
            sql: `
              UPDATE stock
              SET oferta = ?
              WHERE product_id = ? AND sabor = ? AND tamano = ?
            `,
            args: [preciosOfertas, producto, selectedSabor, selectedTamano],
          })
        } else {
          await client.execute({
            sql: `
              UPDATE stock
              SET precio = ?, oferta = ?
              WHERE product_id = ? AND sabor = ? AND tamano = ?
            `,
            args: [precios, preciosOfertas, producto, selectedSabor, selectedTamano],
          })
        }
      } else {
        await client.execute({
          sql: `
            INSERT INTO stock (product_id, sabor, tamano, precio, oferta, cantidad)
            VALUES (?, ?, ?, ?, ?, ?)
          `,
          args: [producto, selectedSabor, selectedTamano, precios, preciosOfertas, cantidad],
        })
      }
    }
    if(quitarRebajasElite){
      await client.execute({
          sql: `
            UPDATE productos
            SET rebajasElite = ?
            WHERE id = ?
          `,
          args: [null, producto],
        })
    }
    return NextResponse.json({ ok: true, message: 'Producto actualizado correctamente' })
  } catch (error) {
    console.error('Error actualizando producto:', error)
    return NextResponse.json({ ok: false, message: 'Error actualizando producto' }, { status: 500 })
  }
}
