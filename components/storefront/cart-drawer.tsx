"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import CouponInput from "./coupon-input"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ 
  isOpen, 
  onClose
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const { 
    cartItems, 
    appliedCoupon,
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartSubtotal, 
    getCartDiscount, 
    getCartItemCount,
    applyCoupon,
    removeCoupon
  } = useCart()

  const totalItems = getCartItemCount()
  const subtotal = getCartSubtotal()
  const discount = getCartDiscount()
  const total = getCartTotal()

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    // TODO: Implement checkout logic
    setTimeout(() => {
      setIsCheckingOut(false)
      onClose()
    }, 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-end justify-end"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md h-full bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-6 h-6 text-miami-pink" />
                <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
                {totalItems > 0 && (
                  <span className="bg-miami-pink text-white text-xs px-2 py-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600">Add some treasures to your collection...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-miami-pink font-semibold">${item.price.toFixed(2)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </motion.button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <motion.button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </motion.button>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-full hover:bg-red-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                {/* Coupon Input */}
                <div className="mb-4">
                  <CouponInput
                    onCouponApplied={(discount, type) => {
                      // The coupon code will be passed from the CouponInput component
                      const code = appliedCoupon?.code || "COUPON"
                      applyCoupon(discount, type, code)
                    }}
                    onCouponRemoved={removeCoupon}
                    appliedCoupon={appliedCoupon}
                  />
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-lg font-medium text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-miami-pink">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  disabled
                  className="w-full bg-gray-500 text-white py-3 cursor-not-allowed opacity-75"
                >
                  Checkout Opens November 19th
                </Button>

                {/* Continue Shopping */}
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full mt-3 border-miami-pink/30 text-miami-pink hover:bg-miami-pink/10"
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 