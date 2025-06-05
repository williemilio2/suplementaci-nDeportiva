import type { Metadata } from "next"

type Props = {
  params: { categoria: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoria = decodeURIComponent(params.categoria)

  const title = `${categoria.charAt(0).toUpperCase() + categoria.slice(1)} - Edición Especial`
  const description = `Explora nuestra colección especial de ${categoria}. Encuentra suplementos únicos y ediciones limitadas para llevar tu rendimiento al siguiente nivel.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://suplementaciondeportiva.es/especiales/${params.categoria}`,
      images: ["/og-home.jpg"],
    },
    alternates: {
      canonical: `https://suplementaciondeportiva.es/especiales/${params.categoria}`,
    },
  }
}
