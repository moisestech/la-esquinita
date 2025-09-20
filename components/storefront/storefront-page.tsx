"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import SugarIcingMarquee from "./sugar-icing-marquee"
import ProductGrid from "./product-grid"
import CartDrawer from "./cart-drawer"
import HiddenDoor from "./hidden-door"
import FloatingSprinkles from "./floating-sprinkles"
import { Toaster } from "@/components/ui/toaster"
import { useCart } from "@/contexts/cart-context"
import { Product } from "@/lib/supabase"

// Placeholder product data for preview
const placeholderProducts: Product[] = [
  {
    id: "1",
    slug: "miami-sugar-skull",
    name: "I ❤️ Miami Sugar Skull",
    price: 19.99,
    description: "Hand-painted ceramic skull with Miami kitsch aesthetic. Each piece is uniquely crafted with vibrant colors and intricate details that capture the essence of Miami's artistic culture.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-parrot_zkp47z.png"],
    status: "active",
    category: "art",
    tags: ["miami", "skull", "ceramic", "hand-painted"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "palm-tree-dreamcatcher",
    name: "Palm Tree Dreamcatcher",
    price: 29.99,
    description: "Boho-chic dreamcatcher featuring palm tree motifs and Miami-inspired colors. Handcrafted with natural materials and adorned with beads, feathers, and palm tree charms.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-baby_tlplfi.png"],
    status: "active",
    category: "home",
    tags: ["boho", "palm", "dreamcatcher", "natural"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    slug: "swamp-water-perfume",
    name: "Swamp Water Perfume",
    price: 45.00,
    description: "Artisanal fragrance inspired by Miami's mysterious wetlands. A complex blend of earthy notes, tropical flowers, and the subtle hint of saltwater.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-fish_tpgtwq.png"],
    status: "active",
    category: "beauty",
    tags: ["perfume", "swamp", "artisanal", "fragrance"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    slug: "neon-pink-sunglasses",
    name: "Neon Pink Sunglasses",
    price: 35.00,
    description: "Vibrant neon pink sunglasses with Miami kitsch charm. Perfect for those sunny Florida days when you want to make a statement.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-woman_rdz1b2.png"],
    status: "active",
    category: "fashion",
    tags: ["sunglasses", "neon", "pink", "miami"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    slug: "flamingo-pool-float",
    name: "Flamingo Pool Float",
    price: 25.00,
    description: "Inflatable flamingo pool float with Miami kitsch design. Perfect for pool parties and beach days.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-swan_ufmolk.png"],
    status: "active",
    category: "lifestyle",
    tags: ["pool", "float", "flamingo", "summer"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    slug: "miami-vice-candle",
    name: "Miami Vice Candle",
    price: 22.00,
    description: "Scented candle with notes of coconut, lime, and ocean breeze. Inspired by the iconic Miami Vice aesthetic.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-egg_jcys6k.png"],
    status: "active",
    category: "home",
    tags: ["candle", "scented", "miami", "vice"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    slug: "alligator-keychain",
    name: "Alligator Keychain",
    price: 15.00,
    description: "Handcrafted alligator keychain made from recycled materials. A perfect Miami souvenir that's both cute and eco-friendly.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-parrot_zkp47z.png"],
    status: "active",
    category: "accessories",
    tags: ["alligator", "keychain", "recycled", "miami"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "8",
    slug: "coconut-shell-bowl",
    name: "Coconut Shell Bowl",
    price: 28.00,
    description: "Natural coconut shell bowl hand-carved and polished. Perfect for serving tropical fruits or as a decorative piece.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-baby_tlplfi.png"],
    status: "active",
    category: "home",
    tags: ["coconut", "bowl", "natural", "tropical"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "9",
    slug: "miami-sunset-print",
    name: "Miami Sunset Print",
    price: 85.00,
    description: "Limited edition art print capturing the iconic Miami sunset. Hand-signed by the artist and printed on archival paper.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-fish_tpgtwq.png"],
    status: "active",
    category: "art",
    tags: ["print", "sunset", "miami", "limited-edition"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "10",
    slug: "palm-tree-keychain",
    name: "Palm Tree Keychain",
    price: 18.00,
    description: "Charming palm tree keychain with Miami kitsch charm. Perfect for adding a touch of tropical flair to your keys.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-woman_rdz1b2.png"],
    status: "active",
    category: "accessories",
    tags: ["palm", "keychain", "tropical", "miami"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "11",
    slug: "fondant-cake-sculpture",
    name: "Fondant Cake Sculpture",
    price: 120.00,
    description: "Exquisite fondant cake sculpture inspired by Miami's architectural landmarks. Each piece is handcrafted and unique.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-swan_ufmolk.png"],
    status: "active",
    category: "art",
    tags: ["fondant", "cake", "sculpture", "miami"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "12",
    slug: "neon-pink-sunglasses",
    name: "Neon Pink Sunglasses",
    price: 45.00,
    description: "Vibrant neon pink sunglasses with Miami kitsch charm. Perfect for those sunny Florida days when you want to make a statement.",
    image_urls: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop"],
    status: "active",
    category: "fashion",
    tags: ["sunglasses", "neon", "pink", "miami"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function StorefrontPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showHiddenDoor, setShowHiddenDoor] = useState(false)
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart()

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
          src="/esquinita1.jpg"
          alt="La Esquinita - Colorful storefront with birthday cake theme"
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
        </motion.div>

        {/* Product Grid */}
        <ProductGrid 
          products={placeholderProducts} 
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