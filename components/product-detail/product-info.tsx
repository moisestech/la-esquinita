"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Heart, Share2, ShoppingCart, Star, Tag, Calendar } from "lucide-react"
import { Product } from "@/lib/supabase"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { isCartEnabled, getCartLockedMessage } from "@/lib/constants/cart-config"

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart, isInCart } = useCart()
  const { toast } = useToast()
  const cartEnabled = isCartEnabled()
  const isUnique = product.is_unique ?? true
  const productStatus = (product.status || "active") as string
  const isSold = productStatus === "archived" || productStatus === "sold"
  const isReserved = productStatus === "reserved"
  const isComingSoon = productStatus === "coming_soon"
  const isUnavailable = isSold || isReserved || isComingSoon
  const inCart = isInCart(product.id)
  const restockHref = `mailto:hello@laesquinita.com?subject=Restock%20Request%20for%20${encodeURIComponent(
    product.name
  )}`

  useEffect(() => {
    setQuantity(1)
  }, [product.id])

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addToCart(product, quantity)
    setIsAddingToCart(false)
    
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
    const shareData = {
      title: product.name,
      text: product.description || `Check out this amazing ${product.name} from La Esquinita!`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url)
        toast({
          title: "Link Copied! 📋",
          description: "Product link has been copied to your clipboard.",
          variant: "default",
        })
      }
    } catch (error) {
      console.log('Error sharing:', error)
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url)
        toast({
          title: "Link Copied! 📋",
          description: "Product link has been copied to your clipboard.",
          variant: "default",
        })
      } catch (clipboardError) {
        console.log('Clipboard error:', clipboardError)
        toast({
          title: "Share Failed",
          description: "Unable to copy link to clipboard.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div className="space-y-2">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-mint-rot"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {product.name}
        </motion.h1>
        {product.display_number && (
          <p className="text-miami-pink font-semibold tracking-wide uppercase">
            {product.display_number}
          </p>
        )}
        
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
          {isUnavailable && (
            <span className="px-3 py-1 bg-black text-white text-sm font-medium rounded-full">
              {isSold ? "Sold" : isReserved ? "Reserved" : "Coming Soon"}
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
      {!isUnique && (
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
      )}
      {isUnique && (
        <div className="p-4 rounded-2xl bg-sugar-pink/60 text-sm text-mint-rot font-medium">
          One-of-one object. Limited to a single piece per customer.
        </div>
      )}

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <button
          onClick={handleAddToCart}
          disabled={isUnavailable || isAddingToCart || !cartEnabled || (isUnique && inCart)}
          className={`flex-1 py-4 px-6 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            inCart
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-mint-rot text-white hover:bg-opacity-90'
          }`}
          title={!cartEnabled ? getCartLockedMessage() : undefined}
        >
          {isAddingToCart ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding...</span>
            </>
          ) : !cartEnabled ? (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>{getCartLockedMessage()}</span>
            </>
          ) : isUnavailable ? (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>{isSold ? "Sold Out" : isReserved ? "Reserved" : "Coming Soon"}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>
                {inCart ? "In Cart ✓" : "Add to Cart"}
              </span>
            </>
          )}
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

      {isUnavailable && (
        <div className="mt-6 p-4 rounded-2xl border border-miami-pink bg-white/70">
          <p className="text-mint-rot font-semibold mb-2">
            Want to know when this piece returns?
          </p>
          <a
            href={restockHref}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-miami-pink text-white font-medium"
          >
            Text us about restocks
          </a>
        </div>
      )}
    </div>
  )
}
