"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ProductListing from "../../components/Product-listing"
import CustomCursor from "@/src/components/customCursor"

// Componente interno que usa useSearchParams
function SearchContent() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("q") || ""
  return <ProductListing searchTerm={searchTerm} displayMode="column" title={searchTerm} />
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white">
      <CustomCursor />
      <Suspense fallback={<div className="p-8 text-center">Cargando resultados...</div>}>
        <SearchContent />
      </Suspense>
    </main>
  )
}
