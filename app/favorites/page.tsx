"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Share2, ArrowLeft, Filter, Search } from "lucide-react"
import Link from "next/link"
import FloatingSprinkles from "@/components/storefront/floating-sprinkles"

// Mock favorites data
const mockFavorites = [
  {
    id: "1",
    name: "Neon Pink Sunglasses",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
    slug: "neon-pink-sunglasses",
    category: "Accessories",
    isLiked: true
  },
  {
    id: "2",
    name: "Fondant Cake Sculpture",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop",
    slug: "fondant-cake-sculpture",
    category: "Art",
    isLiked: true
  },
  {
    id: "3",
    name: "Palm Tree Keychain",
    price: 18.00,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop",
    slug: "palm-tree-keychain",
    category: "Accessories",
    isLiked: true
  },
  {
    id: "4",
    name: "Miami Sunset Print",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    slug: "miami-sunset-print",
    category: "Art",
    isLiked: true
  },
  {
    id: "5",
    name: "Coconut Shell Bowl",
    price: 32.00,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
    slug: "coconut-shell-bowl",
    category: "Home",
    isLiked: true
  },
  {
    id: "6",
    name: "Alligator Keychain",
    price: 22.00,
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300&h=300&fit=crop",
    slug: "alligator-keychain",
    category: "Accessories",
    isLiked: true
  }
]

export default function FavoritesPage() {
  const [fontLoaded, setFontLoaded] = useState(false)
  const [favorites, setFavorites] = useState(mockFavorites)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name")

  // Add font loading effect
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'SkeletonBlood'
        src: url('/fonts/skeleton-blood.woff2') format('woff2'),
             url('/fonts/skeleton-blood.woff') format('woff'),
             url('/fonts/skeleton-blood.ttf') format('truetype'),
             url('/fonts/skeleton-blood.otf') format('opentype')
        font-weight: normal
        font-style: normal
        font-display: swap
      }
    `
    document.head.appendChild(style)
    
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        setFontLoaded(true)
      })
    } else {
      setFontLoaded(true)
    }
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const handleRemoveFavorite = (productId: string) => {
    setFavorites(prev => prev.filter(item => item.id !== productId))
  }

  const handleAddToCart = (product: any) => {
    console.log("Added to cart:", product)
    // Mock functionality
  }

  const handleShare = (product: any) => {
    const shareData = {
      title: product.name,
      text: `Check out this amazing ${product.name} from La Esquinita!`,
      url: `${window.location.origin}/product/${product.slug}`,
    }
    
    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareData.url)
      console.log("Link copied to clipboard")
    }
  }

  const filteredFavorites = favorites
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || item.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const categories = ["All", ...Array.from(new Set(favorites.map(item => item.category)))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue relative overflow-hidden">
      {/* Floating Elements */}
      <FloatingSprinkles />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff66bb' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Back Button */}
      <motion.div
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/">
          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-mint-rot hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl font-bold text-mint-rot mb-2"
              style={{
                fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
              }}
            >
              My Favorites
            </motion.h1>
            <p className="text-mint-rot/70">Your beloved sugar-coated collection</p>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-miami-pink/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mint-rot/50" />
                <input
                  type="text"
                  placeholder="Search favorites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mint-rot/50" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all appearance-none"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Favorites Grid */}
          {filteredFavorites.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {filteredFavorites.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-miami-pink/20 hover:shadow-neon-pink transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Product Image */}
                  <div className="relative mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <motion.button
                      onClick={() => handleRemoveFavorite(item.id)}
                      className="absolute top-2 right-2 p-2 bg-miami-pink text-white rounded-full hover:bg-red-500 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </motion.button>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-mint-rot">{item.name}</h3>
                    <p className="text-sm text-mint-rot/60 bg-miami-pink/10 px-2 py-1 rounded-full inline-block">
                      {item.category}
                    </p>
                    <p className="text-2xl font-bold text-miami-pink">${item.price.toFixed(2)}</p>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <motion.button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-miami-pink to-miami-blue text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleShare(item)}
                        className="p-2 bg-miami-yellow text-white rounded-lg hover:bg-miami-orange transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-miami-pink/20">
                <Heart className="w-16 h-16 text-miami-pink/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-mint-rot mb-2">No favorites yet</h3>
                <p className="text-mint-rot/70 mb-6">Start building your sugar-coated collection!</p>
                <Link href="/storefront">
                  <motion.button
                    className="bg-gradient-to-r from-miami-pink to-miami-blue text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Browse Products
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 