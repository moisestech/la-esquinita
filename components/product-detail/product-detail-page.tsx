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
    slug: "miami-sugar-skull",
    name: "I ❤️ Miami Sugar Skull",
    price: 19.99,
    description: "Hand-painted ceramic skull with Miami kitsch aesthetic. Each piece is uniquely crafted with vibrant colors and intricate details that capture the essence of Miami's artistic culture. Perfect for collectors and art enthusiasts who appreciate the fusion of traditional Mexican art with Miami's vibrant energy.",
    image_urls: [
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-parrot_zkp47z.png",
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-parrot_zkp47z.png",
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-parrot_zkp47z.png",
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-parrot_zkp47z.png"
    ],
    status: "active" as const,
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
    description: "Boho-chic dreamcatcher featuring palm tree motifs and Miami-inspired colors. Handcrafted with natural materials and adorned with beads, feathers, and palm tree charms. This piece brings the peaceful energy of Miami's palm-lined beaches into your home.",
    image_urls: [
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-baby_tlplfi.png",
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-baby_tlplfi.png",
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-baby_tlplfi.png"
    ],
    status: "active" as const,
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
    description: "Artisanal fragrance inspired by Miami's mysterious wetlands. A complex blend of earthy notes, tropical flowers, and the subtle hint of saltwater. Each bottle is hand-poured and numbered, making it a truly unique piece of Miami's natural essence.",
    image_urls: [
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-fish_tpgtwq.png",
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-fish_tpgtwq.png"
    ],
    status: "active" as const,
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
    description: "Vibrant neon pink sunglasses with Miami kitsch charm. Perfect for those sunny Florida days when you want to make a statement. These eye-catching shades feature a retro design with modern comfort.",
    image_urls: [
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-woman_rdz1b2.png",
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-woman_rdz1b2.png"
    ],
    status: "active" as const,
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
    description: "Inflatable flamingo pool float with Miami kitsch design. Perfect for pool parties and beach days. This iconic pink flamingo brings the Miami vibe to any water adventure.",
    image_urls: [
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-swan_ufmolk.png",
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-swan_ufmolk.png"
    ],
    status: "active" as const,
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
    description: "Scented candle with notes of coconut, lime, and ocean breeze. Inspired by the iconic Miami Vice aesthetic. Each candle is hand-poured and creates the perfect atmosphere for your Miami-inspired space.",
    image_urls: [
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-egg_jcys6k.png",
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057675/la-esquinita/laesquinita-product-egg_jcys6k.png"
    ],
    status: "active" as const,
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
    description: "Handcrafted alligator keychain made from recycled materials. A perfect Miami souvenir that's both cute and eco-friendly. Each piece is unique and represents the wild side of Florida.",
    image_urls: [
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-parrot_zkp47z.png",
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-parrot_zkp47z.png"
    ],
    status: "active" as const,
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
    description: "Natural coconut shell bowl hand-carved and polished. Perfect for serving tropical fruits or as a decorative piece. Each bowl is unique and brings the tropical essence of Miami into your home.",
    image_urls: [
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-baby_tlplfi.png",
      "https://res.cloudinary.com/dck5rzi4h/image/upload/v1754057676/la-esquinita/laesquinita-product-baby_tlplfi.png"
    ],
    status: "active" as const,
    category: "home",
    tags: ["coconut", "bowl", "natural", "tropical"],
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
            <span className="font-skeleton text-lg">Back to Storefront</span>
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