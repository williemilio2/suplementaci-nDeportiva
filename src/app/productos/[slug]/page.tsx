import ProductDetailClient from "./product-detail-client"
import { getAllProducts } from "../../../products/listaArchivos"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params

  const products = await getAllProducts()
  const producto = products.find((p) => p.slug === slug)

  if (!producto) {
    notFound()
  }

  return <ProductDetailClient producto={producto} />
}
