"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Upload, Plus, X, Save, Trash2, AlertCircle, Info, Check } from 'lucide-react'
import styles from "../../admin.module.css"

export default function NewProductPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const nutritionalFileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Estados para los campos del formulario
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    slug: "",
    brand: "",
    type: "",
    formato: "",
    badge: "",
    superOffers: false,
    allergenInfo: "",
    ingredients: "",
    usage: "",
    usageRecommendations: [] as string[],
    flavors: [] as string[],
    specialCategories: [] as string[],
  })

  const [stockVariants, setStockVariants] = useState<
    Array<{
      flavor: string
      size: string
      quantity: number
      price: number
      discount: number
    }>
  >([])

  const [productImage, setProductImage] = useState<string | null>(null)
  const [nutritionalImage, setNutritionalImage] = useState<string | null>(null)
  const [tempFlavor, setTempFlavor] = useState("")
  const [tempCategory, setTempCategory] = useState("")
  const [tempVariant, setTempVariant] = useState({
    flavor: "",
    size: "",
    quantity: 0,
    price: 0,
    discount: 0,
  })

  // Manejar cambio en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProductData({
      ...productData,
      [name]: value,
    })
  }

  // Manejar carga de imagen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProductImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleNutritionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setNutritionalImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  // Añadir sabor
  const addFlavor = () => {
    if (tempFlavor.trim() && !productData.flavors.includes(tempFlavor.trim())) {
      setProductData({
        ...productData,
        flavors: [...productData.flavors, tempFlavor.trim()],
      })
      setTempFlavor("")
    }
  }

  // Eliminar sabor
  const removeFlavor = (index: number) => {
    const newFlavors = [...productData.flavors]
    newFlavors.splice(index, 1)
    setProductData({
      ...productData,
      flavors: newFlavors,
    })
  }

  // Añadir categoría especial
  const addCategory = () => {
    if (tempCategory.trim() && !productData.specialCategories.includes(tempCategory.trim())) {
      setProductData({
        ...productData,
        specialCategories: [...productData.specialCategories, tempCategory.trim()],
      })
      setTempCategory("")
    }
  }

  // Eliminar categoría especial
  const removeCategory = (index: number) => {
    const newCategories = [...productData.specialCategories]
    newCategories.splice(index, 1)
    setProductData({
      ...productData,
      specialCategories: newCategories,
    })
  }

  // Añadir variante de stock
  const addStockVariant = () => {
    if (tempVariant.flavor && tempVariant.size && tempVariant.price > 0) {
      setStockVariants([...stockVariants, { ...tempVariant }])
      setTempVariant({
        flavor: "",
        size: "",
        quantity: 0,
        price: 0,
        discount: 0,
      })
    }
  }

  // Eliminar variante de stock
  const removeStockVariant = (index: number) => {
    const newVariants = [...stockVariants]
    newVariants.splice(index, 1)
    setStockVariants(newVariants)
  }

  // Manejar cambio en los campos de variante temporal
  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTempVariant({
      ...tempVariant,
      [name]: name === "quantity" || name === "price" || name === "discount" ? Number.parseFloat(value) || 0 : value,
    })
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (stockVariants.length === 0) {
      alert("Debes añadir al menos una variante del producto")
      setActiveTab("variants")
      return
    }

    setIsSubmitting(true)

    // 1. INFORMACIÓN GENERAL
    const informacionGeneral = {
      ...productData,
      flavors: productData.flavors.join('<<<'),
      specialCategories: productData.specialCategories.join('<<<'),
      productImage: "", // no se usa, va aparte
    }

    // 3. VARIANTES Y STOCK
    const variantesYStock = stockVariants.map(variant => ({
      sabor: variant.flavor,
      tamano: variant.size,
      cantidad: variant.quantity,
      precio: variant.price,
      oferta: variant.discount || 0,
    }))

    try {
      const formData = new FormData()
      formData.append("general", JSON.stringify(informacionGeneral))
      formData.append("stock", JSON.stringify(variantesYStock))

      if (!productImage ) {
        alert("Selecciona una imagen válida antes de enviar")
        setIsSubmitting(false)
        return
      }
      if (!nutritionalImage) {
        alert("Selecciona una imagen de información nutricional")
        setIsSubmitting(false)
        return
      }
      formData.append("image", productImage)
      formData.append("nutritionalImage", nutritionalImage)

      const res = await fetch("/api/meterDatosNuevoProducto", {
        method: "POST",
        body: formData,
      })

      const result = await res.json()

      if (result.ok) {
        setShowSuccess(true)
        // Reset form or redirect as needed
      } else {
        alert("Error al guardar el producto")
      }
    } catch (error) {
      console.error("Error al enviar datos:", error)
      alert("Error al enviar los datos")
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className={styles.newProductContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <Link href="/admin/productosAdmin" className={styles.backButton}>
            <ChevronLeft size={16} />
            Volver a productos
          </Link>
          <h1 className={styles.pageTitle}>Nuevo producto</h1>
        </div>
        <div className={styles.headerRight}>
          <button
            type="button"
            className={`${styles.saveButton} ${isSubmitting ? styles.loading : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={styles.spinner}></span>
            ) : (
              <>
                <Save size={16} />
                Guardar producto
              </>
            )}
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className={styles.successMessage}>
          <Check size={20} />
          <span>Producto guardado correctamente</span>
        </div>
      )}

      <div className={styles.productFormContainer}>
        <div className={styles.formTabs}>
          <button
            className={`${styles.formTab} ${activeTab === "general" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("general")}
          >
            Información general
          </button>
          <button
            className={`${styles.formTab} ${activeTab === "variants" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("variants")}
          >
            Variantes y stock {stockVariants.length === 0 && <span style={{color: 'red'}}>*</span>}
          </button>
        </div>

        <form className={styles.productForm}>
          {/* Pestaña de información general */}
          {activeTab === "general" && (
            <div className={styles.formTabContent}>
              <div className={styles.formGrid}>
                <div className={styles.formColumn}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>
                      Nombre del producto <span className={styles.requiredField}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={productData.name}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Ej: High-Quality MASS PROTEIN"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.formLabel}>
                      Descripción <span className={styles.requiredField}>*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={productData.description}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      placeholder="Describe el producto detalladamente..."
                      rows={4}
                      required
                    ></textarea>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="badge" className={styles.formLabel}>
                        Insignia
                      </label>
                      <input
                        type="text"
                        id="badge"
                        name="badge"
                        value={productData.badge}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Ej: EXCLUSIVO, NUEVO, OFERTA"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="brand" className={styles.formLabel}>
                        Marca <span className={styles.requiredField}>*</span>
                      </label>
                      <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={productData.brand}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Ej: Ronnie Coleman"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    

                    <div className={styles.formGroup}>
                      <label htmlFor="type" className={styles.formLabel}>
                        Categoria <span className={styles.requiredField}>*</span>
                      </label>
                      <input
                        type="text"
                        id="type"
                        name="type"
                        value={productData.type}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Ej: Hydrolyzed Protein"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="formato" className={styles.formLabel}>
                        Formato
                      </label>
                      <select
                        id="formato"
                        name="formato"
                        value={productData.formato}
                        onChange={handleInputChange}
                        className={styles.formSelect}
                      >
                        <option value="Polvo">Polvo</option>
                        <option value="Tabletas">Tabletas</option>
                        <option value="Capsulas">Capsulas</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="allergenInfo" className={styles.formLabel}>
                      Información de alérgenos
                    </label>
                    <textarea
                      id="allergenInfo"
                      name="allergenInfo"
                      value={productData.allergenInfo}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      placeholder="Ej: Contiene leche y soja. Fabricado en instalaciones que también procesan huevo..."
                      rows={3}
                    ></textarea>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="ingredients" className={styles.formLabel}>
                      Ingredientes
                    </label>
                    <textarea
                      id="ingredients"
                      name="ingredients"
                      value={productData.ingredients}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      placeholder="Lista detallada de ingredientes..."
                      rows={4}
                    ></textarea>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="usage" className={styles.formLabel}>
                      Modo de uso
                    </label>
                    <textarea
                      id="usage"
                      name="usage"
                      value={productData.usage}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      placeholder="Instrucciones de uso del producto..."
                      rows={3}
                    ></textarea>
                  </div>
                </div>

                <div className={styles.formColumn}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Imagen del producto</label>
                    <div
                      className={styles.imageUploadContainer}
                      onClick={() => fileInputRef.current?.click()}
                      style={{ cursor: "pointer" }}
                    >
                      {productImage ? (
                        <div className={styles.uploadedImageContainer}>
                          <Image
                            src={productImage || "/placeholder.svg"}
                            alt="Vista previa del producto"
                            width={200}
                            height={200}
                            className={styles.uploadedImage}
                          />
                          <button
                            type="button"
                            className={styles.removeImageButton}
                            onClick={(e) => {
                              e.stopPropagation()
                              setProductImage(null)
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className={styles.uploadPlaceholder}>
                          <Upload size={32} />
                          <p>Haz clic para subir una imagen</p>
                          <span>o arrastra y suelta</span>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className={styles.fileInput}
                        hidden
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Sabores disponibles</label>
                    <div className={styles.tagInputContainer}>
                      <input
                        type="text"
                        value={tempFlavor}
                        onChange={(e) => setTempFlavor(e.target.value)}
                        className={styles.tagInput}
                        placeholder="Añadir sabor y presionar Enter"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addFlavor()
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={styles.addTagButton}
                        onClick={addFlavor}
                        disabled={!tempFlavor.trim()}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className={styles.tagsContainer}>
                      {productData.flavors.map((flavor, index) => (
                        <div key={index} className={styles.tag}>
                          <span>{flavor}</span>
                          <button type="button" className={styles.removeTagButton} onClick={() => removeFlavor(index)}>
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Categorías especiales</label>
                    <div className={styles.tagInputContainer}>
                      <input
                        type="text"
                        value={tempCategory}
                        onChange={(e) => setTempCategory(e.target.value)}
                        className={styles.tagInput}
                        placeholder="Ej: veganas, OfertaDelDia, proteinas"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addCategory()
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={styles.addTagButton}
                        onClick={addCategory}
                        disabled={!tempCategory.trim()}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className={styles.tagsContainer}>
                      {productData.specialCategories.map((category, index) => (
                        <div key={index} className={styles.tag}>
                          <span>{category}</span>
                          <button
                            type="button"
                            className={styles.removeTagButton}
                            onClick={() => removeCategory(index)}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className={styles.fieldHelp}>
                      Categorías para filtrado y agrupación (veganas, OfertaDelDia, proteinas, etc.)
                    </p>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Imagen información nutricional</label>
                    <div
                      className={styles.imageUploadContainer}
                      onClick={() => nutritionalFileInputRef.current?.click()}
                      style={{ cursor: "pointer" }}
                    >
                      {nutritionalImage ? (
                        <div className={styles.uploadedImageContainer}>
                          <Image
                            src={nutritionalImage || "/placeholder.svg"}
                            alt="Vista previa de la información nutricional"
                            width={200}
                            height={200}
                            className={styles.uploadedImage}
                          />
                          <button
                            type="button"
                            className={styles.removeImageButton}
                            onClick={(e) => {
                              e.stopPropagation()
                              setNutritionalImage(null)
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className={styles.uploadPlaceholder}>
                          <Upload size={32} />
                          <p>Haz clic para subir la imagen</p>
                          <span>o arrastra y suelta</span>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={nutritionalFileInputRef}
                        onChange={handleNutritionalImageUpload}
                        accept="image/*"
                        className={styles.fileInput}
                        hidden
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pestaña de variantes y stock */}
          {activeTab === "variants" && (
            <div className={styles.formTabContent}>
              <div className={styles.variantsHeader}>
                <h3>Variantes y stock</h3>
                <div className={styles.infoBox}>
                  <Info size={16} />
                  <span>
                    Añade las diferentes variantes del producto (combinaciones de sabor y tamaño) con su precio, stock y
                    descuento. <strong>Debes añadir al menos una variante.</strong>
                  </span>
                </div>
              </div>

              <div className={styles.addVariantSection}>
                <h4>Añadir nueva variante</h4>
                <div className={styles.variantForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="variantFlavor" className={styles.formLabel}>
                        Sabor <span className={styles.requiredField}>*</span>
                      </label>
                      <select
                        id="variantFlavor"
                        name="flavor"
                        value={tempVariant.flavor}
                        onChange={handleVariantChange}
                        className={styles.formSelect}
                        required
                      >
                        <option value="">Seleccionar sabor</option>
                        {productData.flavors.map((flavor, index) => (
                          <option key={index} value={flavor}>
                            {flavor}
                          </option>
                        ))}
                      </select>
                      {productData.flavors.length === 0 && (
                        <p className={styles.fieldHelp} style={{color: 'red'}}>
                          Primero añade sabores en la pestaña `Información general`
                        </p>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="variantSize" className={styles.formLabel}>
                        Tamaño <span className={styles.requiredField}>*</span>
                      </label>
                      <select
                        id="variantSize"
                        name="size"
                        value={tempVariant.size}
                        onChange={handleVariantChange}
                        className={styles.formSelect}
                        required
                      >
                        <option value="">Seleccionar tamaño</option>
                        <option value="500g">500g</option>
                        <option value="1kg">1kg</option>
                        <option value="2kg">2kg</option>
                        <option value="5kg">5kg</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="variantQuantity" className={styles.formLabel}>
                        Cantidad en stock
                      </label>
                      <input
                        type="number"
                        id="variantQuantity"
                        name="quantity"
                        value={tempVariant.quantity}
                        onChange={handleVariantChange}
                        className={styles.formInput}
                        min="0"
                        placeholder="0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="variantPrice" className={styles.formLabel}>
                        Precio (€) <span className={styles.requiredField}>*</span>
                      </label>
                      <input
                        type="number"
                        id="variantPrice"
                        name="price"
                        value={tempVariant.price || ""}
                        onChange={handleVariantChange}
                        className={styles.formInput}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="variantDiscount" className={styles.formLabel}>
                        Descuento (%)
                      </label>
                      <input
                        type="number"
                        id="variantDiscount"
                        name="discount"
                        value={tempVariant.discount || ""}
                        onChange={handleVariantChange}
                        className={styles.formInput}
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.addVariantButton}
                    onClick={addStockVariant}
                    disabled={!tempVariant.flavor || !tempVariant.size || tempVariant.price <= 0}
                  >
                    <Plus size={16} />
                    Añadir variante
                  </button>
                </div>
              </div>

              <div className={styles.variantsTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableHeaderCell} style={{ flex: 2 }}>
                    Sabor
                  </div>
                  <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
                    Tamaño
                  </div>
                  <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
                    Stock
                  </div>
                  <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
                    Precio
                  </div>
                  <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
                    Descuento
                  </div>
                  <div className={styles.tableHeaderCell} style={{ width: "60px" }}>
                    Acciones
                  </div>
                </div>

                <div className={styles.tableBody}>
                  {stockVariants.length > 0 ? (
                    stockVariants.map((variant, index) => (
                      <div key={index} className={styles.tableRow}>
                        <div className={styles.tableCell} style={{ flex: 2 }}>
                          {variant.flavor}
                        </div>
                        <div className={styles.tableCell} style={{ flex: 1 }}>
                          {variant.size}
                        </div>
                        <div className={styles.tableCell} style={{ flex: 1 }}>
                          <span className={`${styles.stockBadge} ${variant.quantity === 0 ? styles.stockOut : ""}`}>
                            {variant.quantity}
                          </span>
                        </div>
                        <div className={styles.tableCell} style={{ flex: 1 }}>
                          €{variant.price.toFixed(2)}
                        </div>
                        <div className={styles.tableCell} style={{ flex: 1 }}>
                          {variant.discount > 0 ? (
                            <span className={styles.discountBadge}>{variant.discount}%</span>
                          ) : (
                            "-"
                          )}
                        </div>
                        <div className={styles.tableCell} style={{ width: "60px" }}>
                          <button
                            type="button"
                            className={styles.deleteVariantButton}
                            onClick={() => removeStockVariant(index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noVariants}>
                      <AlertCircle size={20} />
                      <p>No hay variantes añadidas. Añade al menos una variante para el producto.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}