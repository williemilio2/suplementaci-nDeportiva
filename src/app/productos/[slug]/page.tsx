import ProductDetailClient from "./product-detail-client"
import { getAllProducts } from "../../../products/listaArchivos"
import { notFound } from "next/navigation"

// Define el tipo Props con el tipo correcto para params
type Props = {
  params: { slug: string }
}

// Componente ProductoPage
export default async function ProductoPage({ params }: Props) {
  const { slug } = params

  // Cargar productos de forma asíncrona
  const products = await getAllProducts()

  // Buscar el producto con el slug
  const producto = products.find((p) => p.slug === slug)

  // Si no se encuentra el producto, mostrar la página 404
  if (!producto) {
    console.error(`Producto con slug "${slug}" no encontrado`)
    notFound()
  }

  return <ProductDetailClient producto={producto} />
}

// Generar rutas estáticas para todos los productos
export async function generateStaticParams() {
  const products = await getAllProducts()

  return products.map((p) => ({
    slug: String(p.slug), // asegúrate de que es string
  }))
}