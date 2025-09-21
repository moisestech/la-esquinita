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
import { Product } from "@/lib/supabase"

// Placeholder product data - replace with real data from Supabase
const products: Product[] = [
  {
    id: "1",
    slug: "parrot-companion-ceramic",
    name: "Parrot Companion Ceramic",
    price: 40.00,
    description: "Vibrant companion vessel. Hand poured, fired, and glazed ceramic approximately 12 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/parrot1.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["parrot", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "baby-doll-head-ceramic",
    name: "Baby Doll Head Ceramic",
    price: 20.00,
    description: "Innocent porcelain portrait. Hand poured, fired, and glazed ceramic approximately 3 inches tall. Slip cast ceramic object.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-baby_tlplfi.png"],
    status: "active" as const,
    category: "ceramics",
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
    status: "active" as const,
    category: "ceramics",
    tags: ["goddess", "statue", "ceramic", "slip-cast", "glazed", "delicate"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    slug: "small-swan-dish",
    name: "Small Swan Dish",
    price: 30.00,
    description: "Graceful aquatic vessel. Hand poured, fired, and glazed ceramic approximately 2.5 inches tall. Slip cast ceramic object.",
    image_urls: ["https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-swan_ufmolk.png"],
    status: "active" as const,
    category: "ceramics",
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
    status: "active" as const,
    category: "ceramics",
    tags: ["anxious", "egg", "head", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    slug: "happy-egg-head",
    name: "Happy Egg Head",
    price: 35.00,
    description: "Hand poured, fired, and glazed ceramic approximately 4 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/babyhead2.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["happy", "egg", "head", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    slug: "sad-egg-head",
    name: "Sad Egg Head",
    price: 28.00,
    description: "Hand poured, fired, and glazed ceramic approximately 3.5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/eggheadsad.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["sad", "egg", "head", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "8",
    slug: "jolly-egg-head",
    name: "Jolly Egg Head",
    price: 24.00,
    description: "Hand poured, fired, and glazed ceramic approximately 3.5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/jollyegghead.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["jolly", "egg", "head", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "9",
    slug: "boy-fish-wall-ornament",
    name: "Boy Fish Wall Ornament",
    price: 38.00,
    description: "Hand poured, fired, and glazed ceramic approximately 5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/boyfishwallornament.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["boy", "fish", "wall", "ornament", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "10",
    slug: "girl-fish-wall-ornament",
    name: "Girl Fish Wall Ornament",
    price: 38.00,
    description: "Hand poured, fired, and glazed ceramic approximately 5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/girlfishwallornament.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["girl", "fish", "wall", "ornament", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "11",
    slug: "potato-ceramic",
    name: "Potato Ceramic",
    price: 26.00,
    description: "Hand poured, fired, and glazed ceramic approximately 4 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/potato1.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["potato", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "12",
    slug: "et-ceramic",
    name: "ET Ceramic",
    price: 45.00,
    description: "Hand poured, fired, and glazed ceramic approximately 6 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/ET.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["ET", "extraterrestrial", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "13",
    slug: "yoda-ceramic",
    name: "Yoda Ceramic",
    price: 42.00,
    description: "Hand poured, fired, and glazed ceramic approximately 5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/yoda.png"],
    status: "active" as const,
    category: "ceramics",
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
    status: "active" as const,
    category: "ceramics",
    tags: ["bride", "groom", "wedding", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "15",
    slug: "tuba-ashtray",
    name: "Tuba Ashtray",
    price: 55.00,
    description: "Hand poured, fired, and glazed ceramic approximately 6 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/tuba_ashtray.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["tuba", "ashtray", "music", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "16",
    slug: "denim-jean-mug",
    name: "Denim Jean Mug",
    price: 38.00,
    description: "Hand poured, fired, and glazed ceramic approximately 4 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/denimjeanmug.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["denim", "jean", "mug", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "17",
    slug: "flamingo-neck-ceramic",
    name: "Flamingo Neck Ceramic",
    price: 48.00,
    description: "Hand poured, fired, and glazed ceramic approximately 8 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/flamingoneck.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["flamingo", "neck", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "18",
    slug: "turtle-lobster-leaf-dish",
    name: "Turtle Lobster Leaf Dish",
    price: 44.00,
    description: "Hand poured, fired, and glazed ceramic approximately 5 inches wide. Slip cast ceramic object.",
    image_urls: ["/shop/turtlelobsterleafdish.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["turtle", "lobster", "leaf", "dish", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "19",
    slug: "cat-head-ceramic",
    name: "Cat Head Ceramic",
    price: 36.00,
    description: "Hand poured, fired, and glazed ceramic approximately 4 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/cathead.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["cat", "head", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "20",
    slug: "small-ornate-pitcher",
    name: "Small Ornate Pitcher",
    price: 42.00,
    description: "Hand poured, fired, and glazed ceramic approximately 5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/smallornatepitcher.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["small", "ornate", "pitcher", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "21",
    slug: "baby-hand-right",
    name: "Baby Hand Right",
    price: 32.00,
    description: "Hand poured, fired, and glazed ceramic approximately 4.5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/babyhandright.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["baby", "hand", "right", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "22",
    slug: "baby-hand-left",
    name: "Baby Hand Left",
    price: 32.00,
    description: "Hand poured, fired, and glazed ceramic approximately 4.5 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/babyhandleft.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["baby", "hand", "left", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "23",
    slug: "shallow-dish-pedestal",
    name: "Shallow Dish Pedestal",
    price: 35.00,
    description: "Hand poured, fired, and glazed ceramic approximately 3 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/shallowDishPedestal.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["shallow", "dish", "pedestal", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "24",
    slug: "shallow-dish",
    name: "Shallow Dish",
    price: 28.00,
    description: "Hand poured, fired, and glazed ceramic approximately 2 inches tall. Slip cast ceramic object.",
    image_urls: ["/shop/shallowdish.png"],
    status: "active" as const,
    category: "ceramics",
    tags: ["shallow", "dish", "ceramic", "slip-cast", "glazed"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

const getProductBySlug = (slug: string): Product | null => {
  return products.find(p => p.slug === slug) || null
}

interface ProductDetailPageProps {
  slug: string
}

export default function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)



  useEffect(() => {
    // Simulate API call
    const loadProduct = async () => {
      setLoading(true)
      setError(null)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const foundProduct = getProductBySlug(slug)
      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        setError("Product not found")
      }
      
      setLoading(false)
    }

    loadProduct()
  }, [slug])

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
            <ImageGallery images={product.image_urls} productName={product.name} />
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
          <RelatedProducts currentProduct={product} products={products} />
        </motion.div>
      </div>

      {/* Floating Elements */}
      <FloatingSprinkles />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
} 