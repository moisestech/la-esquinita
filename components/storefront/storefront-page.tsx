"use client"

import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import Image from "next/image"
import dynamic from "next/dynamic"
import SugarIcingMarquee from "./sugar-icing-marquee"
import ProductGrid from "./product-grid"
import HiddenDoor from "./hidden-door"
import { Toaster } from "@/components/ui/toaster"
import { InventoryProduct, inventoryProducts } from "@/lib/inventory-data"

// Lazy load heavy components
const CartDrawer = dynamic(() => import("./cart-drawer"), { ssr: false })
const FloatingSprinkles = dynamic(() => import("./floating-sprinkles"), { ssr: false })
const FloatingMosquitoLink = dynamic(() => import("./floating-mosquito-link"), { ssr: false })

interface StorefrontPageProps {
  initialProducts: InventoryProduct[]
  initialSource: "supabase" | "static"
}

const INITIAL_BATCH = 24
const BATCH_SIZE = 12

export default function StorefrontPage({ initialProducts, initialSource }: StorefrontPageProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showHiddenDoor, setShowHiddenDoor] = useState(false)
  const [products, setProducts] = useState<InventoryProduct[]>(
    initialProducts.length ? initialProducts : inventoryProducts
  )
  const [inventorySource, setInventorySource] = useState<"static" | "supabase">(initialSource)

  // Poll Supabase for updates every 30 seconds
  useEffect(() => {
    const pollForUpdates = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          if (data.products && data.products.length > 0) {
            setProducts(data.products)
          }
        }
      } catch (error) {
        console.error('Failed to fetch product updates:', error)
      }
    }

    // Initial fetch
    pollForUpdates()

    // Poll every 30 seconds
    const interval = setInterval(pollForUpdates, 30000)
    return () => clearInterval(interval)
  }, [])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all')
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(
    Math.min(INITIAL_BATCH, (initialProducts.length ? initialProducts : inventoryProducts).length)
  )
  const isSearchPending = searchTerm !== deferredSearchTerm

  const availableTags = useMemo(() => {
    const excludedTags = ['ceramic', 'limited', 'one-of-one', 'tuba']
    const tagSet = new Set<string>()
    products.forEach((p) => {
      if (p.tags) {
        p.tags.forEach((tag: string) => {
          if (!excludedTags.includes(tag)) {
            tagSet.add(tag)
          }
        })
      }
    })
    return Array.from(tagSet).sort()
  }, [products])

  const searchPool = useMemo(
    () =>
      products.map((product) => ({
        product,
        number: product.inventoryNumber?.toString().toLowerCase() ?? "",
        display: product.displayNumber?.toLowerCase() ?? "",
        slug: product.slug.toLowerCase(),
        name: product.name.toLowerCase(),
      })),
    [products]
  )

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by status first
    if (statusFilter === 'available') {
      filtered = filtered.filter((p) => !p.sold_at && p.status !== 'sold')
    } else if (statusFilter === 'sold') {
      filtered = filtered.filter((p) => p.sold_at || p.status === 'sold')
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((p) => p.tags?.includes(selectedTag))
    }

    // Then filter by search term
    const normalized = deferredSearchTerm.trim().toLowerCase()
    if (normalized) {
      const searchPool = filtered.map((product) => ({
        product,
        number: product.inventoryNumber?.toString().toLowerCase() ?? "",
        display: product.displayNumber?.toLowerCase() ?? "",
        slug: product.slug.toLowerCase(),
        name: product.name.toLowerCase(),
      }))

      filtered = searchPool
        .filter(({ number, display, slug, name }) => {
          return (
            (number && number.startsWith(normalized)) ||
            (display && display.includes(normalized)) ||
            slug.includes(normalized) ||
            name.includes(normalized)
          )
        })
        .map(({ product }) => product)
    }

    return filtered
  }, [products, deferredSearchTerm, selectedTag, statusFilter])

  const isSearching = Boolean(deferredSearchTerm.trim())
  const displayedProducts = useMemo(() => {
    if (isSearching) return filteredProducts
    return filteredProducts.slice(0, visibleCount)
  }, [filteredProducts, isSearching, visibleCount])

  useEffect(() => {
    // Only scroll when user is actively searching, not when more items load
    if (!deferredSearchTerm.trim() || filteredProducts.length === 0 || !isSearching) return

    const targetId = filteredProducts[0]?.id
    if (!targetId) return

    const element = document.getElementById(`inventory-${targetId}`)
    if (!element) return

    element.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [deferredSearchTerm]) // Only trigger on search term change, not filteredProducts change

  useEffect(() => {
    if (isSearching) return
    const target = loadMoreRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + BATCH_SIZE, filteredProducts.length)
          )
        }
      },
      { rootMargin: "400px" }
    )

    observer.observe(target)
    return () => {
      observer.disconnect()
    }
  }, [filteredProducts.length, isSearching])

  useEffect(() => {
    let isMounted = true

    if (inventorySource === "supabase") {
      return () => {
        isMounted = false
      }
    }

    const loadInventory = async () => {
      try {
        const response = await fetch("/api/inventory")
        if (!response.ok) throw new Error("Failed request")
        const payload = await response.json()
        if (!isMounted) return

        if (Array.isArray(payload.items) && payload.items.length) {
          setProducts(payload.items)
          setVisibleCount(Math.min(INITIAL_BATCH, payload.items.length))
        }
        if (payload.source === "supabase" || payload.source === "static") {
          setInventorySource(payload.source)
        }
      } catch (error) {
        console.error("Failed to load inventory", error)
      }
    }

    loadInventory()

    return () => {
      isMounted = false
    }
  }, [inventorySource])

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_BATCH, products.length))
  }, [products])

  return (
    <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue">
      {/* Landscape Sponsorship Image Above the Fold */}
      <motion.div
        className="relative w-full h-96 md:h-[500px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <Image
          src="/front.jpg"
          alt="La Esquinita storefront exterior at Locust Projects"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-pink-200/60 via-pink-100/30 to-transparent z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end pb-10 pointer-events-none z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
        >
          <p className="text-white text-lg md:text-xl font-display italic drop-shadow-lg px-4 text-center">
            Choose a ceramic sculpture in the gallery, purchase below, and walk out with it! ♡
          </p>
          <span className="mt-2 text-4xl md:text-5xl text-white animate-bounce">↓</span>
        </motion.div>
      </motion.div>

      {/* Sugar Icing Marquee */}
      <SugarIcingMarquee />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Storefront Header */}
        <motion.div
          className="text-center mb-12 pt-[15px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              className="relative h-32 md:h-48 w-auto cursor-pointer"
              whileHover={{
                scale: 1.1,
                filter: "drop-shadow(0 0 20px #ff69b4) drop-shadow(0 0 30px #4ecdc4)",
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -5, 0],
                filter: [
                  "drop-shadow(0 0 10px #ff69b4)",
                  "drop-shadow(0 0 20px #ff69b4) drop-shadow(0 0 15px #4ecdc4)",
                  "drop-shadow(0 0 10px #ff69b4)"
                ]
              }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Image
                src="/logo/locustprojects1.png"
                alt="La Esquinita at Locust Projects"
                width={384}
                height={192}
                priority
                quality={90}
                className="h-32 md:h-48 w-auto object-contain"
              />
            </motion.div>
          </div>

          {/* Instructions */}
          <motion.p
            className="text-center text-mint-rot/80 text-sm md:text-base max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find the number on the bottom of the ceramic and search for it below!
          </motion.p>
        </motion.div>

      {/* Product Grid */}
        <div className="sticky top-0 z-30 pb-4 bg-gradient-to-b from-icing-white via-icing-white/95 to-transparent space-y-3">
          <label className="flex items-center gap-3 bg-white/90 border border-miami-pink/40 rounded-full px-4 py-3 shadow-lg">
            <span className="text-sm font-semibold text-miami-pink uppercase tracking-wide">
              Search No.
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Try 19, 190, No. 21..."
              className="flex-1 bg-transparent focus:outline-none text-mint-rot placeholder:text-mint-rot/60"
            />
          </label>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${
                statusFilter === 'all'
                  ? "bg-miami-blue text-white shadow-md"
                  : "bg-white/80 text-mint-rot border border-miami-blue/30 hover:bg-miami-blue/10"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${
                statusFilter === 'available'
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-white/80 text-mint-rot border border-green-500/30 hover:bg-green-500/10"
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setStatusFilter('sold')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${
                statusFilter === 'sold'
                  ? "bg-gray-500 text-white shadow-md"
                  : "bg-white/80 text-mint-rot border border-gray-500/30 hover:bg-gray-500/10"
              }`}
            >
              Sold
            </button>
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${
                !selectedTag
                  ? "bg-miami-pink text-white shadow-md"
                  : "bg-white/80 text-mint-rot border border-miami-pink/30 hover:bg-miami-pink/10"
              }`}
            >
              All
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${
                  selectedTag === tag
                    ? "bg-miami-pink text-white shadow-md"
                    : "bg-white/80 text-mint-rot border border-miami-pink/30 hover:bg-miami-pink/10"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef}>
          {isSearchPending ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                🍰
              </motion.div>
              <p className="text-mint-rot/60 text-lg font-medium">Searching...</p>
            </div>
          ) : (
            <ProductGrid products={displayedProducts} />
          )}
        </div>

        {!isSearching && visibleCount < filteredProducts.length && (
          <div ref={loadMoreRef} className="mt-8 text-center text-mint-rot font-medium h-12 flex items-center justify-center">
            Loading more objects...
          </div>
        )}

        {/* Hidden Door */}
        <HiddenDoor 
          isVisible={showHiddenDoor}
          onCodeSubmit={(code) => {
            console.log("Secret code entered:", code)
            // TODO: Implement secret code validation
          }}
        />

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </main>

      {/* Floating Mosquito Link */}
      <FloatingMosquitoLink />

      {/* Miami Atmosphere Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Floating Palm Trees */}
        <motion.div 
          className="absolute top-20 left-10 text-6xl animate-palm-sway"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🌴
        </motion.div>
        <motion.div 
          className="absolute top-40 right-20 text-4xl animate-palm-sway"
          animate={{ rotate: [2, -2, 2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          🌴
        </motion.div>

        {/* Floating Sprinkles */}
        <FloatingSprinkles />
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
} 
