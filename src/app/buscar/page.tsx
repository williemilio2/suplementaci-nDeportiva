'use client'

import { useSearchParams } from "next/navigation"
import ProductListing from "../../components/Product-listing"
import CustomCursor from "@/src/components/customCursor"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("q") || ""

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white">
        <CustomCursor />
      <ProductListing searchTerm={searchTerm} displayMode="column" title="Resultados de búsqueda" />
    </main>
  )
}
