"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Share2, ShoppingCart, Star, Tag, Calendar } from "lucide-react"
import { Product } from "@/lib/supabase"

interface ProductInfoProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductInfo({ product, onAddToCart }: ProductInfoProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    onAddToCart(product)
    // Add sprinkle animation effect
    const sprinkle = document.createElement('div')
    sprinkle.className = 'fixed pointer-events-none z-50 animate-sprinkle'
    sprinkle.innerHTML = '✨'
    sprinkle.style.left = '50%'
    sprinkle.style.top = '50%'
    document.body.appendChild(sprinkle)
    
    setTimeout(() => {
      document.body.removeChild(sprinkle)
    }, 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || '',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // Show toast notification
    }
  }

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div className="space-y-2">
        <motion.h1 
          className="text-3xl md:text-4xl font-skeleton text-mint-rot"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {product.name}
        </motion.h1>
        
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-5 h-5 ${i < 4 ? 'text-miami-yellow fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">(24 reviews)</span>
        </motion.div>
      </div>

      {/* Price */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-mint-rot">
            ${product.price.toFixed(2)}
          </span>
          {product.status === "coming_soon" && (
            <span className="px-3 py-1 bg-miami-yellow text-black text-sm font-medium rounded-full">
              Coming Soon
            </span>
          )}
        </div>
      </motion.div>

      {/* Description */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-medium text-mint-rot">Description</h3>
        <p className="text-gray-700 leading-relaxed">
          {product.description}
        </p>
      </motion.div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-medium text-mint-rot flex items-center space-x-2">
            <Tag className="w-5 h-5" />
            <span>Tags</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-sugar-pink text-mint-rot text-sm rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quantity Selector */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-lg font-medium text-mint-rot">Quantity</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-full bg-sugar-pink text-mint-rot flex items-center justify-center hover:bg-miami-pink transition-colors"
          >
            -
          </button>
          <span className="text-xl font-medium text-mint-rot min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-full bg-sugar-pink text-mint-rot flex items-center justify-center hover:bg-miami-pink transition-colors"
          >
            +
          </button>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <button
          onClick={handleAddToCart}
          disabled={product.status === "coming_soon"}
          className="flex-1 bg-mint-rot text-white py-4 px-6 rounded-2xl font-medium hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>
            {product.status === "coming_soon" ? "Coming Soon" : "Add to Cart"}
          </span>
        </button>
        
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="p-4 border-2 border-sugar-pink text-mint-rot rounded-2xl hover:bg-sugar-pink transition-colors duration-300"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-miami-pink' : ''}`} />
        </button>
        
        <button
          onClick={handleShare}
          className="p-4 border-2 border-sugar-pink text-mint-rot rounded-2xl hover:bg-sugar-pink transition-colors duration-300"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Product Meta */}
      <motion.div 
        className="pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Added: {new Date(product.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4" />
          <span>Category: {product.category}</span>
        </div>
      </motion.div>
    </div>
  )
} 