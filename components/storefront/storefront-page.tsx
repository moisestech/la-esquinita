"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import SugarIcingMarquee from "./sugar-icing-marquee"
import ProductGrid from "./product-grid"
import CartDrawer from "./cart-drawer"
import HiddenDoor from "./hidden-door"
import { Product } from "@/lib/supabase"

// Placeholder product data for preview
const placeholderProducts: Product[] = [
  {
    id: "1",
    slug: "miami-sugar-skull",
    name: "I ❤️ Miami Sugar Skull",
    price: 19.99,
    description: "Hand-painted ceramic skull with Miami kitsch aesthetic",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892032/la-esquinita/LE-logo-tara_jdjyo9.png"],
    status: "active",
    category: "art",
    tags: ["miami", "skull", "ceramic"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "palm-tree-dreamcatcher",
    name: "Palm Tree Dreamcatcher",
    price: 29.99,
    description: "Boho-chic dreamcatcher with palm tree motifs",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892200/la-esquinita/LE-logo-tara-2_aurodr.png"],
    status: "active",
    category: "home",
    tags: ["boho", "palm", "dreamcatcher"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    slug: "swamp-water-perfume",
    name: "Swamp Water Perfume",
    price: 45.00,
    description: "Artisanal fragrance inspired by Miami wetlands",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892032/la-esquinita/LE-logo-tara_jdjyo9.png"],
    status: "active",
    category: "beauty",
    tags: ["perfume", "swamp", "artisanal"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    slug: "neon-mosquito-lamp",
    name: "Neon Mosquito Lamp",
    price: 75.00,
    description: "LED lamp with animated mosquito swarm effect",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892200/la-esquinita/LE-logo-tara-2_aurodr.png"],
    status: "active",
    category: "lighting",
    tags: ["neon", "mosquito", "led"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    slug: "fondant-cake-sculpture",
    name: "Fondant Cake Sculpture",
    price: 150.00,
    description: "Edible art piece - three-tier cake with breathing animation",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892032/la-esquinita/LE-logo-tara_jdjyo9.png"],
    status: "active",
    category: "art",
    tags: ["cake", "fondant", "sculpture"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function StorefrontPage() {
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showHiddenDoor, setShowHiddenDoor] = useState(false)

  const addToCart = (product: Product) => {
    setCartItems(prev => [...prev, product])
    setIsCartOpen(true)
  }

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue">
      {/* Sugar Icing Marquee */}
      <SugarIcingMarquee />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Storefront Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-skeleton text-miami-pink mb-4 drop-shadow-neon-pink">
            La Esquinita
          </h1>
          <p className="text-xl md:text-2xl text-mint-rot font-display">
            Miami's Artistic Convenience Store
          </p>
          <div className="flex justify-center mt-6 space-x-4">
            <motion.div 
              className="w-8 h-8 bg-miami-yellow rounded-full animate-neon-pulse"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="w-8 h-8 bg-miami-blue rounded-full animate-neon-pulse"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div 
              className="w-8 h-8 bg-miami-pink rounded-full animate-neon-pulse"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </div>
        </motion.div>

        {/* Product Grid */}
        <ProductGrid 
          products={placeholderProducts} 
          onAddToCart={addToCart}
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
          items={cartItems}
          total={cartTotal}
          onRemoveItem={removeFromCart}
        />
      </main>

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
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl animate-sprinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  )
} 