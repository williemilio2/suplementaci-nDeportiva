import ProductDetailClient from "./product-detail-client"
import { allProducts }  from '../../../others/listaArchivos'
//import { PageProps } from 'next';
import { notFound } from 'next/navigation';  // Asumiendo que usas 'notFound'

// Define el tipo Props con el tipo correcto para params
type Props = {
  params: Promise<{ slug: string }>;
};

// Componente ProductoPage
export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;  // Esperar a que 'params' se resuelva

  // Buscar el producto con el slug
  const producto = allProducts.find((p) => p.slug === slug);

  if (!producto) {
    notFound();
  }

  return <ProductDetailClient producto={producto} />;
}

export async function generateStaticParams() {
  return allProducts.map((p) => ({
    slug: p.slug,
  }));
}
