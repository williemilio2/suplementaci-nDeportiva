'use client'

import { useSearchParams } from "next/navigation"
import ProductListing from "../../components/Product-listing"
import CustomCursor from "@/src/components/customCursor"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("t") || ""

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white">
        <CustomCursor />
      <ProductListing coleccionEspecial={searchTerm} displayMode="column" title={searchTerm} />
    </main>
  )
}
