"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Product } from "@/lib/supabase"
import { X, ShoppingBag, Trash2 } from "lucide-react"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: Product[]
  total: number
  onRemoveItem: (productId: string) => void
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  items, 
  total, 
  onRemoveItem 
}: CartDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-miami-pink to-miami-purple p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-6 h-6" />
                  <h2 className="text-2xl font-skeleton">Your Cart</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-skeleton text-mint-rot mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-mint-rot/70">
                    Add some Miami kitsch to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      className="flex items-center space-x-4 p-4 bg-sugar-pink/10 rounded-xl border border-sugar-pink/20"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-sugar-pink to-fondant-blue">
                        <img
                          src={item.image_urls[0] || "/placeholder-logo.png"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-skeleton text-mint-rot text-sm line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-miami-pink font-bold">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-mint-rot hover:text-miami-pink hover:bg-miami-pink/10 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-sugar-pink/20 p-6">
                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-skeleton text-mint-rot">Total:</span>
                  <span className="text-2xl font-bold text-miami-pink">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.button
                  className="w-full bg-gradient-to-r from-miami-pink to-miami-purple text-white py-4 rounded-xl font-bold text-lg hover:shadow-neon-pink transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    alert("🎂 See it IRL at La Esquinita! This is an artistic experience, not a real store. Visit us in Miami for the full experience!")
                    onClose()
                  }}
                >
                  See it IRL in Miami! 🎂
                </motion.button>

                {/* Disclaimer */}
                <p className="text-xs text-mint-rot/60 text-center mt-4">
                  This is an artistic experience. No actual purchases will be made.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 