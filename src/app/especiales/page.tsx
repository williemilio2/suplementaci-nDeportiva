"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ProductListing from "../../components/Product-listing"
import CustomCursor from "@/src/components/customCursor"

function SearchContent() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("t") || ""  // Get search term from URL

  return <ProductListing coleccionEspecial={searchTerm} displayMode="column" title={searchTerm} />
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white">
      <CustomCursor />
      {/* Wrap with Suspense to handle asynchronous loading */}
      <Suspense fallback={<div className="p-8 text-center">Cargando resultados...</div>}>
        <SearchContent />
      </Suspense>
    </main>
  )
}
