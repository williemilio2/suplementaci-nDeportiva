// File: app/api/meterDatosNuevoProducto/route.js

import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { client } from '@/src/lib/db'

export async function POST(req) {
  try {
    const formData = await req.formData()
    console.log(formData)
    const general = JSON.parse(formData.get('general'))
    const slug = general.name.trim().toLowerCase().replace(/\s+/g, '-')
    const nutricional = JSON.parse(formData.get('nutricional'))
    const stock = JSON.parse(formData.get('stock'))
    const base64Image = formData.get('image') // String: 'data:image/webp;base64,...'

    // Extraer el formato desde el base64 (ej: webp)
    const matches = base64Image.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      throw new Error('Formato de imagen base64 inválido')
    }

    const extension = matches[1]
    const data = matches[2]
    const filename = `${uuidv4()}.${extension}`
    const imagePath = path.join(process.cwd(), 'public', filename)

    // Guardar imagen en /public
    const buffer = Buffer.from(data, 'base64')
    await writeFile(imagePath, buffer)

    // Guardar en productos
    const insertedProduct = await client.execute(
      `INSERT INTO productos (name, description, marca, tipo, modoDeUso, recomendacionesDeUso, badge, categoriaEspecial, informacionAlergenos, image, colesterol, sabores, superOfertas, slug, infoIngredientes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?) RETURNING id`,
      [
        general.name,
        general.description,
        general.brand,
        general.type,
        general.usage,
        general.usageRecommendations,
        general.badge,
        general.specialCategories,
        general.allergenInfo,
        `/${filename}`,
        general.cholesterol,
        general.flavors,
        general.superOffers,
        slug,
        general.ingredients,
      ]
    )

    const productId = insertedProduct.rows[0].id

    // Guardar información nutricional
    await client.execute(
      `INSERT INTO informacion_nutricional (product_id, calorias, proteinas, grasas, carbohidratos, fibra, azucares, sal, grasasSaturadas, sodio, hierro, calcio, vitaminaD, vitaminaB12, aminoacidos, enzimasDigestivas, porcion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId,
        nutricional.calories,
        nutricional.proteins,
        nutricional.fats,
        nutricional.carbs,
        nutricional.fiber,
        nutricional.sugars,
        nutricional.salt,
        nutricional.saturatedFats,
        nutricional.sodium,
        nutricional.iron,
        nutricional.calcium,
        nutricional.vitaminD,
        nutricional.vitaminB12,
        nutricional.aminoacids,
        nutricional.digestiveEnzymes,
        nutricional.serving,
      ]
    )

    // Guardar stock
    for (const variant of stock) {
      await client.execute(
        `INSERT INTO stock (product_id, sabor, tamano, cantidad, precio, oferta)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          productId,
          variant.sabor,
          variant.tamano,
          variant.cantidad,
          variant.precio,
          variant.oferta,
        ]
      )
    }

    return NextResponse.json({ ok: true, message: 'Producto insertado correctamente' })
  } catch (error) {
    console.error('Error al insertar producto:', error)
    return NextResponse.json({ ok: false, message: 'Error al insertar producto' }, { status: 500 })
  }
}
