import { allProducts } from "../../../others/listaArchivos"
import ProductDetailClient from "./product-detail-client"

export default function ProductoPage({ params }: { params: { slug: string } }) {
  // Obtener el producto correspondiente al slug
  const producto = allProducts.find((p) => p.slug === params.slug)

  if (!producto) {
    return <div>Producto no encontrado</div>
  }

  return <ProductDetailClient producto={producto} />
}

// Esta función se utiliza para generar las rutas estáticas basadas en los slugs
export async function generateStaticParams() {
  const paths = allProducts.map((p) => ({
    slug: p.slug,
  }))

  return paths
}
