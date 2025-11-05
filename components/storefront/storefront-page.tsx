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
import { Product } from "@/lib/supabase"

// Placeholder product data for preview
const placeholderProducts: Product[] = [
  {
    id: "15",
    slug: "tuba-ashtray",
    name: "Tuba Ashtray",
    price: 55.00,
    description: "Musical receptacle sculpture. Hand poured, fired, and glazed ceramic approximately 6 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/tuba_ashtray.png"],
    status: "active",
    category: "art",
    tags: ["tuba", "ashtray", "music", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "baby-doll-head-ceramic",
    name: "Baby Doll Head Ceramic",
    price: 25.00,
    description: "Innocent porcelain portrait. Hand poured, fired, and glazed ceramic approximately 3 inches tall. Slip cast ceramic object.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-baby_tlplfi.png"],
    status: "active",
    category: "art",
    tags: ["baby", "doll", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    slug: "fragile-goddess-statue",
    name: "Fragile Goddess Statue",
    price: 30.00,
    description: "Ethereal feminine form. Hand poured, fired, and glazed ceramic approximately 4 inches tall. Delicate slip cast ceramic object.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-woman_rdz1b2.png"],
    status: "active",
    category: "art",
    tags: ["goddess", "statue", "ceramic", "slip-cast", "glazed", "delicate"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    slug: "small-swan-dish",
    name: "Small Swan Dish",
    price: 22.00,
    description: "Graceful aquatic vessel. Hand poured, fired, and glazed ceramic approximately 2.5 inches tall. Slip cast ceramic object.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-swan_ufmolk.png"],
    status: "active",
    category: "art",
    tags: ["swan", "dish", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    slug: "anxious-egg-head",
    name: "Anxious Egg Head",
    price: 20.00,
    description: "Contemplative ovoid portrait. Hand poured, fired, and glazed ceramic approximately 3 inches tall. Slip cast ceramic object.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-egg_jcys6k.png"],
    status: "active",
    category: "art",
    tags: ["anxious", "egg", "head", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    slug: "happy-egg-head",
    name: "Happy Egg Head",
    price: 35.00,
    description: "Joyful ovoid expression. Hand poured, fired, and glazed ceramic approximately 4 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/babyhead2.png"],
    status: "active",
    category: "art",
    tags: ["happy", "egg", "head", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    slug: "sad-egg-head",
    name: "Sad Egg Head",
    price: 28.00,
    description: "Melancholic ovoid visage. Hand poured, fired, and glazed ceramic approximately 3.5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/eggheadsad.png"],
    status: "active",
    category: "art",
    tags: ["sad", "egg", "head", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "8",
    slug: "jolly-egg-head",
    name: "Jolly Egg Head",
    price: 24.00,
    description: "Whimsical ovoid character. Hand poured, fired, and glazed ceramic approximately 3.5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/jollyegghead.png"],
    status: "active",
    category: "art",
    tags: ["jolly", "egg", "head", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "9",
    slug: "boy-fish-wall-ornament",
    name: "Boy Fish Wall Ornament",
    price: 38.00,
    description: "Aquatic wall sculpture. Hand poured, fired, and glazed ceramic approximately 5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/boyfishwallornament.png"],
    status: "active",
    category: "art",
    tags: ["boy", "fish", "wall", "ornament", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "10",
    slug: "girl-fish-wall-ornament",
    name: "Girl Fish Wall Ornament",
    price: 38.00,
    description: "Feminine aquatic sculpture. Hand poured, fired, and glazed ceramic approximately 5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/girlfishwallornament.png"],
    status: "active",
    category: "art",
    tags: ["girl", "fish", "wall", "ornament", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "11",
    slug: "potato-ceramic",
    name: "Potato Ceramic",
    price: 26.00,
    description: "Earthy organic form. Hand poured, fired, and glazed ceramic approximately 4 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/potato1.png"],
    status: "active",
    category: "art",
    tags: ["potato", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "12",
    slug: "et-ceramic",
    name: "ET Ceramic",
    price: 45.00,
    description: "Otherworldly visitor sculpture. Hand poured, fired, and glazed ceramic approximately 6 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/ET.png"],
    status: "active",
    category: "art",
    tags: ["ET", "extraterrestrial", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "13",
    slug: "yoda-ceramic",
    name: "Yoda Ceramic",
    price: 42.00,
    description: "Wise mentor figure. Hand poured, fired, and glazed ceramic approximately 5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/yoda.png"],
    status: "active",
    category: "art",
    tags: ["yoda", "starwars", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "14",
    slug: "bride-groom-ceramic",
    name: "Bride and Groom Cake Topper",
    price: 15.00,
    description: "Ceremonial cake topper duo. Hand poured, fired, and glazed ceramic approximately 7 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/bride and groom.png"],
    status: "active",
    category: "art",
    tags: ["bride", "groom", "wedding", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "1",
    slug: "parrot-companion-ceramic",
    name: "Parrot Companion Ceramic",
    price: 40.00,
    description: "Vibrant companion vessel. Hand poured, fired, and glazed ceramic approximately 12 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/parrot1.png"],
    status: "active",
    category: "art",
    tags: ["parrot", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "16",
    slug: "denim-jean-mug",
    name: "Denim Jean Mug",
    price: 38.00,
    description: "Textile-inspired drinking vessel. Hand poured, fired, and glazed ceramic approximately 4 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/denimjeanmug.png"],
    status: "active",
    category: "art",
    tags: ["denim", "jean", "mug", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "17",
    slug: "flamingo-neck-ceramic",
    name: "Flamingo Neck Ceramic",
    price: 48.00,
    description: "Elongated avian silhouette. Hand poured, fired, and glazed ceramic approximately 8 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/flamingoneck.png"],
    status: "active",
    category: "art",
    tags: ["flamingo", "neck", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "18",
    slug: "turtle-lobster-leaf-dish",
    name: "Turtle Lobster Leaf Dish",
    price: 44.00,
    description: "Multi-creature botanical dish. Hand poured, fired, and glazed ceramic approximately 5 inches wide. Slip cast ceramic object.",
    image_urls: ["/shop/turtlelobsterleafdish.png"],
    status: "active",
    category: "art",
    tags: ["turtle", "lobster", "leaf", "dish", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "19",
    slug: "cat-head-ceramic",
    name: "Cat Head Ceramic",
    price: 36.00,
    description: "Feline portrait vessel. Hand poured, fired, and glazed ceramic approximately 4 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/cathead.png"],
    status: "active",
    category: "art",
    tags: ["cat", "head", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "20",
    slug: "small-ornate-pitcher",
    name: "Small Ornate Pitcher",
    price: 42.00,
    description: "Ornate pouring vessel. Hand poured, fired, and glazed ceramic approximately 5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/smallornatepitcher.png"],
    status: "active",
    category: "art",
    tags: ["small", "ornate", "pitcher", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "23",
    slug: "shallow-dish-pedestal",
    name: "Shallow Dish Pedestal",
    price: 35.00,
    description: "Curved serving platform. Hand poured, fired, and glazed ceramic approximately 3 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/shallowDishPedestal.png"],
    status: "active",
    category: "art",
    tags: ["shallow", "dish", "pedestal", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "24",
    slug: "shallow-dish",
    name: "Shallow Dish",
    price: 28.00,
    description: "Minimal serving basin. Hand poured, fired, and glazed ceramic approximately 2 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/shallowdish.png"],
    status: "active",
    category: "art",
    tags: ["shallow", "dish", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

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
      className="fixed z-40 text-5xl pointer-events-auto"
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
