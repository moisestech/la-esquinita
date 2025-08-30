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
    price: 600.00,
    description: "Hand-painted ceramic skull with Miami kitsch aesthetic. Each piece is uniquely crafted with vibrant colors and intricate details that capture the essence of Miami's artistic culture. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-parrot_zkp47z.png"],
    status: "active",
    category: "art",
    tags: ["miami", "skull", "ceramic", "hand-painted", "discount"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "palm-tree-dreamcatcher",
    name: "Palm Tree Dreamcatcher",
    price: 600.00,
    description: "Boho-chic dreamcatcher featuring palm tree motifs and Miami-inspired colors. Handcrafted with natural materials and adorned with beads, feathers, and palm tree charms. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-baby_tlplfi.png"],
    status: "active",
    category: "home",
    tags: ["boho", "palm", "dreamcatcher", "natural", "discount"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    slug: "swamp-water-perfume",
    name: "Swamp Water Perfume",
    price: 600.00,
    description: "Artisanal fragrance inspired by Miami's mysterious wetlands. A complex blend of earthy notes, tropical flowers, and the subtle hint of saltwater. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-fish_tpgtwq.png"],
    status: "active",
    category: "beauty",
    tags: ["perfume", "swamp", "artisanal", "fragrance", "discount"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    slug: "neon-pink-sunglasses",
    name: "Neon Pink Sunglasses",
    price: 600.00,
    description: "Vibrant neon pink sunglasses with Miami kitsch charm. Perfect for those sunny Florida days when you want to make a statement. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-woman_rdz1b2.png"],
    status: "active",
    category: "fashion",
    tags: ["sunglasses", "neon", "pink", "miami", "discount"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    slug: "flamingo-pool-float",
    name: "Flamingo Pool Float",
    price: 600.00,
    description: "Inflatable flamingo pool float with Miami kitsch design. Perfect for pool parties and beach days. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-swan_ufmolk.png"],
    status: "active",
    category: "lifestyle",
    tags: ["pool", "float", "flamingo", "summer", "discount"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    slug: "miami-vice-candle",
    name: "Miami Vice Candle",
    price: 600.00,
    description: "Scented candle with notes of coconut, lime, and ocean breeze. Inspired by the iconic Miami Vice aesthetic. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-egg_jcys6k.png"],
    status: "active",
    category: "home",
    tags: ["candle", "scented", "miami", "vice", "discount"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    slug: "alligator-keychain",
    name: "Alligator Keychain",
    price: 600.00,
    description: "Handcrafted alligator keychain made from recycled materials. A perfect Miami souvenir that's both cute and eco-friendly. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-parrot_zkp47z.png"],
    status: "active",
    category: "accessories",
    tags: ["alligator", "keychain", "recycled", "miami", "discount"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "8",
    slug: "coconut-shell-bowl",
    name: "Coconut Shell Bowl",
    price: 600.00,
    description: "Natural coconut shell bowl hand-carved and polished. Perfect for serving tropical fruits or as a decorative piece. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-baby_tlplfi.png"],
    status: "active",
    category: "home",
    tags: ["coconut", "bowl", "natural", "tropical", "discount"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "9",
    slug: "miami-sunset-print",
    name: "Miami Sunset Print",
    price: 600.00,
    description: "Limited edition art print capturing the iconic Miami sunset. Hand-signed by the artist and printed on archival paper. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-fish_tpgtwq.png"],
    status: "active",
    category: "art",
    tags: ["print", "sunset", "miami", "limited-edition", "discount"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "10",
    slug: "palm-tree-keychain",
    name: "Palm Tree Keychain",
    price: 600.00,
    description: "Charming palm tree keychain with Miami kitsch charm. Perfect for adding a touch of tropical flair to your keys. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-woman_rdz1b2.png"],
    status: "active",
    category: "accessories",
    tags: ["palm", "keychain", "tropical", "miami", "discount"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "11",
    slug: "fondant-cake-sculpture",
    name: "Fondant Cake Sculpture",
    price: 600.00,
    description: "Exquisite fondant cake sculpture inspired by Miami's architectural landmarks. Each piece is handcrafted and unique. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-swan_ufmolk.png"],
    status: "active",
    category: "art",
    tags: ["fondant", "cake", "sculpture", "miami", "discount"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "12",
    slug: "neon-pink-sunglasses-v2",
    name: "Neon Pink Sunglasses V2",
    price: 600.00,
    description: "Vibrant neon pink sunglasses with Miami kitsch charm. Perfect for those sunny Florida days when you want to make a statement. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.",
    image_urls: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop"],
    status: "active",
    category: "fashion",
    tags: ["sunglasses", "neon", "pink", "miami", "discount"],
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
          src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1753918202/la-esquinita/La_Esquinita_sponsorship_2025_Tara_Long-store-outside_n7z755.png"
          alt="La Esquinita Sponsorship 2025 - Tara Long Store Outside"
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
        
        {/* Newsletter Subscription Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-miami-pink/20 max-w-md mx-4">
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-mint-rot mb-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              Stay Sweet! 🍭
            </motion.h2>
            <motion.p
              className="text-mint-rot/80 text-center mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              Subscribe to our newsletter for Miami kitsch updates, exclusive offers, and artistic adventures!
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.4 }}
            >
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-4 py-3 rounded-lg border-2 border-miami-pink/30 focus:border-miami-pink focus:outline-none bg-white/80 backdrop-blur-sm text-mint-rot placeholder-mint-rot/60"
              />
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-miami-pink to-miami-purple text-white font-semibold rounded-lg hover:from-miami-purple hover:to-miami-pink transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe ✨
              </motion.button>
            </motion.div>
            
            <motion.p
              className="text-xs text-mint-rot/60 text-center mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.6 }}
            >
              Join our Miami kitsch community! No spam, just sweetness.
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

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
          <div className="flex justify-center mb-4">
            <motion.img
              src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892200/la-esquinita/LE-logo-tara-2_aurodr.png"
              alt="La Esquinita"
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
          <p className="text-xl md:text-2xl text-mint-rot font-display">
            Convenience Store
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