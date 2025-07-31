"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import CouponInput from "@/components/storefront/coupon-input"
import { useCart } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"

export default function CouponTestPage() {
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | undefined>()
  const { applyCoupon, removeCoupon, getCartSubtotal, getCartDiscount, getCartTotal } = useCart()

  const handleCouponApplied = (discount: number, type: 'percentage' | 'fixed') => {
    const code = "TESTCOUPON"
    setAppliedCoupon({ code, discount, type })
    applyCoupon(discount, type, code)
  }

  const handleCouponRemoved = () => {
    setAppliedCoupon(undefined)
    removeCoupon()
  }

  // Mock cart items for testing
  const mockSubtotal = 150.00
  const discount = getCartDiscount()
  const total = getCartTotal()

  return (
    <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-miami-pink/20"
        >
          <h1 className="text-3xl font-bold text-mint-rot mb-8 text-center">
            Coupon System Test
          </h1>

          <div className="space-y-6">
            {/* Mock Cart Summary */}
            <div className="bg-miami-pink/10 rounded-xl p-6 border border-miami-pink/30">
              <h2 className="text-xl font-semibold text-mint-rot mb-4">Mock Cart Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-mint-rot">Subtotal:</span>
                  <span className="font-semibold">${mockSubtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-miami-pink border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Coupon Input */}
            <div className="bg-white/50 rounded-xl p-6 border border-miami-blue/30">
              <h2 className="text-xl font-semibold text-mint-rot mb-4">Coupon Input</h2>
              <CouponInput
                onCouponApplied={handleCouponApplied}
                onCouponRemoved={handleCouponRemoved}
                appliedCoupon={appliedCoupon}
              />
            </div>

            {/* Test Coupons */}
            <div className="bg-miami-yellow/10 rounded-xl p-6 border border-miami-yellow/30">
              <h2 className="text-xl font-semibold text-mint-rot mb-4">Test Coupons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-lg p-4 border border-miami-pink/20">
                  <h3 className="font-semibold text-mint-rot mb-2">MIAMI10</h3>
                  <p className="text-sm text-mint-rot/70 mb-2">10% off your order</p>
                  <p className="text-xs text-mint-rot/50">Min order: $25</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 border border-miami-pink/20">
                  <h3 className="font-semibold text-mint-rot mb-2">WELCOME5</h3>
                  <p className="text-sm text-mint-rot/70 mb-2">$5 off your order</p>
                  <p className="text-xs text-mint-rot/50">Min order: $10</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 border border-miami-pink/20">
                  <h3 className="font-semibold text-mint-rot mb-2">SUGAR20</h3>
                  <p className="text-sm text-mint-rot/70 mb-2">20% off sugar items</p>
                  <p className="text-xs text-mint-rot/50">Min order: $50</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 border border-miami-pink/20">
                  <h3 className="font-semibold text-mint-rot mb-2">FONDANT25</h3>
                  <p className="text-sm text-mint-rot/70 mb-2">$25 off fondant sculptures</p>
                  <p className="text-xs text-mint-rot/50">Min order: $100</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-miami-blue/10 rounded-xl p-6 border border-miami-blue/30">
              <h2 className="text-xl font-semibold text-mint-rot mb-4">How to Test</h2>
              <ol className="list-decimal list-inside space-y-2 text-mint-rot/80">
                <li>Enter one of the test coupon codes above</li>
                <li>Click "Apply Coupon" to see the discount applied</li>
                <li>Try invalid codes to see error handling</li>
                <li>Remove the coupon to see it disappear</li>
                <li>Check the cart total updates correctly</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
      <Toaster />
    </div>
  )
} 