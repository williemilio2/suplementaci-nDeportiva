import ProductDetailClient from "./product-detail-client"
import { getAllProducts } from "../../../products/listaArchivos"
import { notFound } from "next/navigation"

type Props = {
  params: { slug: string }
}

// Método para generar todas las rutas estáticas (build time)
export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = params

  const products = await getAllProducts()

  // Normalizamos para evitar problemas con mayúsculas, codificación, etc.
  const cleanSlug = decodeURIComponent(slug).toLowerCase()

  const producto = products.find((p) => p.slug.toLowerCase() === cleanSlug)

  if (!producto) {
    notFound()
  }

  return <ProductDetailClient producto={producto} />
}
