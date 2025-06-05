import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.suplementaciondeportiva.es"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/auth/", "/checkout/", "/carrito", "/favoritos", "/pedidos", "/_next/"],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/productos/",
          "/especiales",
          "/topVentas",
          "/novedades",
          "/clubElite",
          "/nosotros",
          "/contacto",
          "/envios",
          "/devoluciones",
          "/preguntas-frecuentes",
          "/afiliados",
          "/politica-privacidad",
          "/terminos-condiciones",
        ],
        disallow: ["/api/", "/admin/", "/auth/", "/checkout/", "/carrito", "/favoritos", "/pedidos"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/tipo/", "/productos/", "/especiales/", "/topVentas", "/novedades"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
