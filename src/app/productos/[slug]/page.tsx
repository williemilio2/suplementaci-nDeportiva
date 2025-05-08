import ProductDetailClient from "./product-detail-client";
import { allProducts }  from '../../../others/listaArchivos'


type Props = {
  params: {
    slug: string;
  };
};

export default function ProductoPage({ params }: Props) {
  // NO necesitamos await en params
  const slug = params.slug;

  const producto = allProducts.find((p) => p.slug === slug);

  if (!producto) {
    return <div>Producto no encontrado</div>;
  }

  return <ProductDetailClient producto={producto} />;
}

export async function generateStaticParams() {
  return allProducts.map((p) => ({
    slug: p.slug,
  }));
}
