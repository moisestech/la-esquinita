"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Star, Share2, Heart, ShoppingCart, MessageCircle } from "lucide-react"
import ImageGallery from "./image-gallery"
import ProductInfo from "./product-info"
import StarRating from "./star-rating"
import CommentsSection from "./comments-section"
import RelatedProducts from "./related-products"
import BreadcrumbNav from "./breadcrumb-nav"
import FloatingSprinkles from "../storefront/floating-sprinkles"
import { Toaster } from "@/components/ui/toaster"
import { InventoryProduct, inventoryProducts } from "@/lib/inventory-data"

const getFallbackProduct = (slug: string): InventoryProduct | null => {
  return (
    inventoryProducts.find(
      (p) => p.slug === slug || p.inventoryNumber === Number(slug)
    ) || null
  )
}

const getStatusLabel = (status?: string | null) => {
  const normalized = (status || "active").toLowerCase()
  if (normalized === "archived" || normalized === "sold") return "Sold Out"
  if (normalized === "reserved") return "Reserved"
  if (normalized === "coming_soon") return "Coming Soon"
  return null
}

interface ProductDetailPageProps {
  slug: string
  initialProduct: InventoryProduct | null
  initialSource: "supabase" | "static"
  relatedProducts: InventoryProduct[]
}

export default function ProductDetailPage({
  slug,
  initialProduct,
  initialSource,
  relatedProducts,
}: ProductDetailPageProps) {
  const [product, setProduct] = useState<InventoryProduct | null>(initialProduct)
  const [loading, setLoading] = useState(!initialProduct)
  const [error, setError] = useState<string | null>(null)
  const relatedPool = relatedProducts.length ? relatedProducts : inventoryProducts
  const statusLabel = product ? getStatusLabel(product.status) : null
  const shouldFetchFromApi = !initialProduct || initialSource !== "supabase"

  useEffect(() => {
    let isMounted = true

    if (!shouldFetchFromApi) {
      setProduct(initialProduct)
      setLoading(false)
      setError(null)
      return () => {
        isMounted = false
      }
    }

    const loadProduct = async () => {
      if (!initialProduct) {
        setLoading(true)
      }
      setError(null)

      try {
        const response = await fetch(`/api/inventory/${slug}`)
        if (!response.ok) throw new Error("Inventory request failed")
        const payload = await response.json()
        if (!isMounted) return

        if (payload.item) {
          setProduct(payload.item)
          setLoading(false)
          return
        }
      } catch (err) {
        console.error("Failed to fetch inventory item", err)
      }

      const fallback = getFallbackProduct(slug)
      if (isMounted) {
        if (fallback) {
          setProduct(fallback)
        } else {
          setError("Product not found")
        }
        setLoading(false)
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [slug, initialProduct, initialSource, shouldFetchFromApi])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-miami-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-mint-rot font-skeleton text-lg">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-skeleton text-mint-rot mb-2">Product Not Found</h1>
          <p className="text-mint-rot/70 mb-4">The product you're looking for doesn't exist.</p>
          <a 
            href="/storefront"
            className="inline-flex items-center space-x-2 bg-miami-pink text-white px-6 py-3 rounded-lg hover:bg-miami-purple transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue">
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-sm border-b border-sugar-pink/20 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <a 
            href="/storefront" 
            className="flex items-center space-x-2 text-mint-rot hover:text-miami-pink transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold text-lg">Back to Storefront</span>
          </a>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-mint-rot hover:text-miami-pink transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-mint-rot hover:text-miami-pink transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto p-4">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav productName={product.name} category={product.category} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ImageGallery
              images={product.image_urls}
              productName={product.name}
              statusLabel={statusLabel}
            />
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProductInfo product={product} />
          </motion.div>
        </div>

        {/* Star Rating and Reviews */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <StarRating rating={4.5} showScore />
        </motion.div>

        {/* Comments Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CommentsSection productId={product.id} />
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <RelatedProducts currentProduct={product} products={relatedPool} />
        </motion.div>
      </div>

      {/* Floating Elements */}
      <FloatingSprinkles />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
} 
