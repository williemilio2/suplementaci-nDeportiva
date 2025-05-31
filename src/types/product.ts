// Definición del tipo Product para usar en toda la aplicación
export interface Product {
  id: number
  name: string
  description: string // Cambiado de opcional a requerido
  image: string // Cambiado de opcional a requerido
  rating: number
  reviews: number
  badge?: string
  marca: string
  tipo: string // Cambiado de opcional a requerido
  colesterol?: string
  superOfertas?: number
  slug: string
  informacionAlergenos?: string
  infoIngredientes?: string
  modoDeUso?: string
  recomendacionesDeUso?: string
  sabores?: string
  categoriaEspecial?: string
  precio?: number
  precioAnterior?: number
  puntuacionSimilitud?: number
  rebajasElite?: number
}

// Alias para compatibilidad con código existente
export type Producto = Product
