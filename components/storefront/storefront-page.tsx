"use client"

import React, { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import SugarIcingMarquee from "./sugar-icing-marquee"
import ProductGrid from "./product-grid"
import CartDrawer from "./cart-drawer"
import HiddenDoor from "./hidden-door"
import FloatingSprinkles from "./floating-sprinkles"
import { Toaster } from "@/components/ui/toaster"
import { useCart } from "@/contexts/cart-context"
import { InventoryProduct, inventoryProducts } from "@/lib/inventory-data"

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min

const generateMosquitoPosition = () => ({
  top: `${randomBetween(5, 85)}vh`,
  left: `${randomBetween(5, 90)}vw`,
  rotate: randomBetween(-25, 25),
})

function FloatingMosquitoLink() {
  const controls = useAnimation()
  const initialPosition = { top: "50vh", left: "10vw", rotate: 0 }

  useEffect(() => {
    let isMounted = true

    const glideAcrossScreen = async () => {
      while (isMounted) {
        const nextPosition = generateMosquitoPosition()
        await controls.start({
          ...nextPosition,
          transition: {
            duration: randomBetween(10, 16),
            ease: "easeInOut",
          },
        })
      }
    }

    glideAcrossScreen()

    return () => {
      isMounted = false
      controls.stop()
    }
  }, [controls])

  return (
    <motion.a
      href="/mosquito-bar"
      aria-label="Visit the Mosquito Lounge"
      className="fixed z-40 text-6xl pointer-events-auto"
      initial={initialPosition}
      animate={controls}
      whileHover={{ scale: 1.2, rotate: 0 }}
      whileTap={{ scale: 0.9 }}
    >
      🦟
    </motion.a>
  )
}

export default function StorefrontPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showHiddenDoor, setShowHiddenDoor] = useState(false)
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart()
  const [products, setProducts] = useState<InventoryProduct[]>(inventoryProducts)
  const [inventorySource, setInventorySource] = useState<"static" | "supabase">("static")

  useEffect(() => {
    let isMounted = true

    const loadInventory = async () => {
      try {
        const response = await fetch("/api/inventory")
        if (!response.ok) throw new Error("Failed request")
        const payload = await response.json()
        if (!isMounted) return

        if (Array.isArray(payload.items)) {
          setProducts(payload.items)
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
  }, [])

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
          className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.img
          src="/front.jpg"
          alt="La Esquinita storefront exterior at Locust Projects"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-pink-200/60 via-pink-100/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
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
            <motion.img
              src="/logo/locustprojects1.png"
              alt="La Esquinita at Locust Projects"
              className="h-32 md:h-48 w-auto drop-shadow-neon-pink cursor-pointer"
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
              onClick={() => {
                // Add a fun interaction - could trigger a sprinkle animation or sound
                console.log("La Esquinita logo clicked!")
              }}
            />
          </div>
          <p className="text-sm text-gray-700">
            {inventorySource === "supabase" ? "Live inventory feed" : "Demo inventory (sample data)"}
          </p>
        </motion.div>

        {/* Product Grid */}
        <ProductGrid 
          products={products} 
        />

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
