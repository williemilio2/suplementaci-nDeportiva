import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { client } from '@/src/lib/db'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const general = JSON.parse(formData.get('general'))
    const stock = JSON.parse(formData.get('stock'))

    const slug = general.name.trim().toLowerCase().replace(/\s+/g, '-')

    // Imagen principal
    const base64Image = formData.get('image')
    if (!base64Image) throw new Error('Falta la imagen principal')

    // Imagen nutricional
    const base64Nutritional = formData.get('nutritionalImage') // puede ser null

    // Función auxiliar para guardar imagen base64 y devolver ruta
    async function saveBase64Image(base64Str) {
      const matches = base64Str.match(/^data:image\/(\w+);base64,(.+)$/)
      if (!matches || matches.length !== 3) {
        throw new Error('Formato de imagen base64 inválido')
      }
      const extension = matches[1]
      const data = matches[2]
      const filename = `${uuidv4()}.${extension}`
      const imagePath = path.join(process.cwd(), 'public', filename)
      const buffer = Buffer.from(data, 'base64')
      await writeFile(imagePath, buffer)
      return `/${filename}`
    }

    const productImagePath = await saveBase64Image(base64Image)

    let nutritionalImagePath = null
    if (base64Nutritional) {
      nutritionalImagePath = await saveBase64Image(base64Nutritional)
    }

    // Insertar producto con imagen nutricional
    const insertedProduct = await client.execute(
      `INSERT INTO productos (
         name, description, marca, tipo, modoDeUso,
         badge, categoriaEspecial, informacionAlergenos, image,
         sabores, superOfertas, slug, infoIngredientes, formato,
         imagenInfoNutricional
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      [
        general.name,
        general.description,
        general.brand,
        general.type,
        general.usage,
        general.badge,
        general.specialCategories,
        general.allergenInfo,
        productImagePath,
        general.flavors,
        general.superOffers,
        slug,
        general.ingredients,
        general.formato,
        nutritionalImagePath ?? "", // por si no se envía
      ]
    )

    const productId = insertedProduct.rows[0].id

    // Guardar variantes de stock
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
