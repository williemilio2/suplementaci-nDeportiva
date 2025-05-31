import ProductDetailClient from "./product-detail-client"
import { getAllProducts } from "../../../products/listaArchivos"
import { notFound } from "next/navigation"

// Componente async sin tipos explícitos para params
export default async function ProductoPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  const products = await getAllProducts()
  const producto = products.find((p) => p.slug === slug)

  if (!producto) {
    console.error(`Producto con slug "${slug}" no encontrado`)
    notFound()
  }

  return <ProductDetailClient producto={producto} />
}

// Genera rutas estáticas para todos los productos
export async function generateStaticParams() {
  const products = await getAllProducts()

  return products.map((p) => ({
    slug: String(p.slug),
  }))
}
