"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Share2, ShoppingCart, Heart } from "lucide-react"
import { InventoryProduct } from "@/lib/inventory-data"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"
import { isCartEnabled, getCartLockedMessage } from "@/lib/constants/cart-config"

interface ProductCardProps {
  product: InventoryProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showSprinkles, setShowSprinkles] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const { toast } = useToast()
  const { addToCart, isInCart } = useCart()
  const cartEnabled = isCartEnabled()
  const inventoryNumber =
    (product as InventoryProduct).displayNumber ||
    product.display_number ||
    (product.inventory_number ? `No. ${product.inventory_number}` : null)
  const productStatus = (product.inventoryStatus || product.status || "active") as string
  const isSold = productStatus === "sold"
  const isReserved = productStatus === "reserved"
  const isComingSoon =
    productStatus === "coming_soon" || productStatus === "coming-soon"
  const isUnavailable = isSold || isReserved || isComingSoon
  const primaryImage =
    product.primary_image || product.image_urls?.[0] || "/placeholder-logo.png"
  const secondaryImage = product.underside_image || product.image_urls?.[1]
  const inCart = isInCart(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAddingToCart(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addToCart(product)
    setShowSprinkles(true)
    setIsAddingToCart(false)
    
    // Show success toast
    toast({
      title: "Added to Cart! 🛒",
      description: `${product.name} has been added to your cart.`,
      variant: "default",
    })
    
    setTimeout(() => setShowSprinkles(false), 2000)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const shareData = {
      title: product.name,
      text: product.description || `Check out this amazing ${product.name} from La Esquinita!`,
      url: `${window.location.origin}/product/${product.slug}`,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
              // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareData.url)
      setIsShared(true)
      toast({
        title: "Link Copied! 📋",
        description: "Product link has been copied to your clipboard.",
        variant: "default",
      })
      setTimeout(() => setIsShared(false), 2000)
      }
    } catch (error) {
      console.log('Error sharing:', error)
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url)
        setIsShared(true)
        toast({
          title: "Link Copied! 📋",
          description: "Product link has been copied to your clipboard.",
          variant: "default",
        })
        setTimeout(() => setIsShared(false), 2000)
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

  const cardContent = (
    <motion.div
      className={`relative group ${isSold ? "cursor-default" : "cursor-pointer"}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={isSold ? {} : { y: -8 }}
      transition={{ duration: 0.3 }}
      id={`inventory-${product.id}`}
    >
      {/* Sprinkle Animation */}
      {showSprinkles && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{
                x: "50%",
                y: "50%",
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0,
                scale: 1,
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}

      {/* Share Success Feedback */}
      {isShared && (
        <motion.div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          Link copied to clipboard! 📋
        </motion.div>
      )}

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-sugar-pink hover:border-miami-pink transition-colors duration-300">
        {/* Product Image */}
        <div className="relative h-64 bg-gradient-to-br from-sugar-pink to-fondant-blue overflow-hidden p-4">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              secondaryImage ? "group-hover:opacity-0" : ""
            }`}
          />
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} underside`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
          
          {/* Display Number */}
          {inventoryNumber && (
            <div className="absolute top-3 left-3">
              <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {inventoryNumber}
              </span>
            </div>
          )}
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Share Button */}
            <motion.button
              onClick={handleShare}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Share"
            >
              <Share2 size={16} className="text-miami-pink" />
            </motion.button>
            
            {/* Favorite Button */}
            <motion.button
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Add to Favorites"
            >
              <Heart size={16} className="text-miami-pink" />
            </motion.button>
          </div>

          {/* Tags */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-miami-yellow text-mint-rot px-2 py-1 rounded-full text-xs font-bold"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          />

          {isSold && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-2xl font-extrabold uppercase text-white tracking-[0.4em]">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Product Name */}
          <h3 className="text-xl font-bold text-mint-rot mb-2 line-clamp-2">
            {product.name}
          </h3>
          {inventoryNumber && (
            <p className="text-sm font-semibold text-miami-pink mb-2">{inventoryNumber}</p>
          )}

          {/* Description */}
          <p className="text-mint-rot/70 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            {/* Price Tag */}
            <motion.div
              className="flex flex-col"
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-2xl font-bold text-miami-pink">
                ${product.price.toFixed(2)}
              </span>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !cartEnabled || isUnavailable || inCart}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                isAddingToCart || !cartEnabled || isUnavailable || inCart
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-miami-pink to-miami-purple text-white hover:shadow-neon-pink'
              }`}
              whileHover={!isAddingToCart && cartEnabled ? { scale: 1.05 } : {}}
              whileTap={!isAddingToCart && cartEnabled ? { scale: 0.95 } : {}}
              title={!cartEnabled ? getCartLockedMessage() : undefined}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : !cartEnabled ? (
                <>
                  <ShoppingCart size={16} />
                  <span className="text-xs">Nov 14th</span>
                </>
              ) : isUnavailable ? (
                <>
                  <ShoppingCart size={16} />
                  <span>{isSold ? "Sold Out" : isReserved ? "Reserved" : "Coming Soon"}</span>
                </>
              ) : inCart ? (
                <>
                  <ShoppingCart size={16} />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Add to Cart
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Neon Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent"
          animate={isHovered ? { 
            borderColor: "rgba(255, 105, 180, 0.6)",
            boxShadow: "0 0 20px rgba(255, 105, 180, 0.4)"
          } : { 
            borderColor: "transparent",
            boxShadow: "none"
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-2 -right-2 text-2xl animate-sprinkle">
        🌴
      </div>
      <div className="absolute -bottom-2 -left-2 text-xl animate-sprinkle" style={{ animationDelay: "1s" }}>
        ✨
      </div>
    </motion.div>
  )

  if (isSold) {
    return cardContent
  }

  return (
    <Link href={`/product/${product.slug}`} className="block">
      {cardContent}
    </Link>
  )
} 
