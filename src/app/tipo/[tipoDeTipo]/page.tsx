"use client"

import { Suspense } from "react"
import { useParams } from "next/navigation"
import ProductListing from "../../../components/Product-listing"
import CustomCursor from "@/src/components/customCursor"

function TypeContent() {
  const params = useParams()
  const tipoDeTipo = params.tipoDeTipo as string

  // Decodificar el tipo de la URL
  const decodedType = tipoDeTipo ? decodeURIComponent(tipoDeTipo) : ""

  return <ProductListing tipoDeTipo={decodedType} displayMode="column" title={decodedType} />
}

export default function TypePage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white">
      <CustomCursor />
      <Suspense fallback={<div className="p-8 text-center">Cargando resultados...</div>}>
        <TypeContent />
      </Suspense>
    </main>
  )
}
