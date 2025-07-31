"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Tag, Check, X, Loader2 } from "lucide-react"
import { coupons } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface CouponInputProps {
  onCouponApplied: (discount: number, type: 'percentage' | 'fixed') => void
  onCouponRemoved: () => void
  appliedCoupon?: { code: string; discount: number; type: 'percentage' | 'fixed' }
}

export default function CouponInput({ onCouponApplied, onCouponRemoved, appliedCoupon }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await coupons.validate(couponCode.trim())
      
      if (result.valid && result.discount && result.type) {
        onCouponApplied(result.discount, result.type)
        setCouponCode("")
        toast({
          title: "Coupon Applied! 🎉",
          description: result.message || "Discount has been applied to your order.",
          variant: "default",
        })
      } else {
        setError(result.message || "Invalid coupon code")
        toast({
          title: "Invalid Coupon",
          description: result.message || "Please check your coupon code and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setError("Error validating coupon")
      toast({
        title: "Error",
        description: "Unable to validate coupon. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    onCouponRemoved()
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order.",
      variant: "default",
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCoupon()
    }
  }

  return (
    <div className="space-y-4">
      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-miami-pink/10 to-miami-blue/10 border border-miami-pink/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-miami-pink rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-mint-rot">
                  {appliedCoupon.code} Applied
                </p>
                <p className="text-sm text-mint-rot/70">
                  {appliedCoupon.type === 'percentage' 
                    ? `${appliedCoupon.discount}% off` 
                    : `$${appliedCoupon.discount} off`
                  }
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleRemoveCoupon}
              className="p-2 text-miami-pink hover:text-red-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Coupon Input */}
      {!appliedCoupon && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mint-rot/50" />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Enter coupon code"
              className="w-full pl-10 pr-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-miami-pink transition-all placeholder-mint-rot/50 text-mint-rot"
              disabled={isLoading}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>{error}</span>
            </motion.p>
          )}

          <motion.button
            onClick={handleApplyCoupon}
            disabled={isLoading || !couponCode.trim()}
            className="w-full bg-gradient-to-r from-miami-pink to-miami-blue text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Applying...</span>
              </>
            ) : (
              <>
                <Tag className="w-4 h-4" />
                <span>Apply Coupon</span>
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Sample Coupons Hint */}
      {!appliedCoupon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-miami-yellow/10 border border-miami-yellow/30 rounded-lg p-3"
        >
          <p className="text-sm text-mint-rot/70 text-center">
            💡 Try: <span className="font-mono text-miami-yellow">MIAMI10</span> for 10% off or <span className="font-mono text-miami-yellow">WELCOME5</span> for $5 off
          </p>
        </motion.div>
      )}
    </div>
  )
} 