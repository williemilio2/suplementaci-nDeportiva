"use client"

import { Suspense } from "react"
import { useParams } from "next/navigation"
import ProductListing from "../../../components/Product-listing"
import CustomCursor from "@/src/components/customCursor"

function CategoryContent() {
  const params = useParams()
  const categoria = params.categoria as string

  // Decodificar la categoría de la URL
  const decodedCategory = categoria ? decodeURIComponent(categoria) : ""

  return <ProductListing coleccionEspecial={decodedCategory} displayMode="column" title={decodedCategory} />
}

export default function CategoryPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white">
      <CustomCursor />
      <Suspense fallback={<div className="p-8 text-center">Cargando resultados...</div>}>
        <CategoryContent />
      </Suspense>
    </main>
  )
}
