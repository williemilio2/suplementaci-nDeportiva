import type { Metadata } from "next"

type Props = {
  params: { tipo: string }
}

// Metadata dinámica basada en el tipo (proteina, creatina, etc.)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tipo = decodeURIComponent(params.tipo)

  const title = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} - Suplementos Deportivos`
  const description = `Descubre nuestra selección de ${tipo} para mejorar tu rendimiento y nutrición deportiva. Ofertas exclusivas en suplementos deportivos.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://suplementaciondeportiva.es/tipo/${params.tipo}`,
      images: ["/og-home.jpg"],
    },
    alternates: {
      canonical: `https://suplementaciondeportiva.es/tipo/${params.tipo}`,
    },
  }
}
