"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

declare global {
  interface Window {
    Square?: any
    ApplePaySession?: any
  }
}

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

type CheckoutResult = {
  orderId?: string
  paymentId?: string
}

export default function CartDrawer({ 
  isOpen, 
  onClose
}: CartDrawerProps) {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemCount,
    clearCart,
  } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const totalItems = getCartItemCount()
  const total = getCartTotal()

  const handlePaymentSuccess = (details?: CheckoutResult) => {
    toast({
      title: "Payment successful",
      description: "Thanks for supporting La Esquinita!",
    })
    clearCart()
    onClose()

    const params = new URLSearchParams()
    if (details?.orderId) {
      params.set("orderId", details.orderId)
    } else if (details?.paymentId) {
      params.set("paymentId", details.paymentId)
    }
    const query = params.toString()
    router.push(`/checkout/success${query ? `?${query}` : ""}`)
  }

  const handlePaymentFailure = (message: string) => {
    toast({
      title: "Payment failed",
      description: message,
      variant: "destructive",
    })
    onClose()
    const params = new URLSearchParams()
    if (message) {
      params.set("reason", message)
    }
    router.push(`/checkout/failure${message ? `?${params.toString()}` : ""}`)
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
                          className="w-full h-full object-contain"
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
                {/* Price Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-medium text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-miami-pink">${total.toFixed(2)}</span>
                  </div>
                </div>

                <SquarePaymentSection
                  cartItems={cartItems}
                  total={total}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />

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

type SquarePaymentSectionProps = {
  cartItems: Array<{
    id: string
    name: string
    price: number
    quantity: number
    slug: string
  }>
  total: number
  onSuccess: (details?: CheckoutResult) => void
  onFailure?: (message: string) => void
}

type CheckoutResponsePayload = {
  orderId?: string | null
  payment?: {
    id?: string | null
  } | null
}

function SquarePaymentSection({
  cartItems,
  total,
  onSuccess,
  onFailure,
}: SquarePaymentSectionProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [card, setCard] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [squareEnv, setSquareEnv] = useState<"sandbox" | "production">("sandbox")
  const [payments, setPayments] = useState<any>(null)
  const [applePay, setApplePay] = useState<any>(null)
  const [applePayReady, setApplePayReady] = useState(false)

  const paymentItems = useMemo(
    () =>
      cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        slug: item.slug,
      })),
    [cartItems]
  )

  useEffect(() => {
    if (cartItems.length === 0 || card) return // Don't reinitialize if card already exists
    let isMounted = true

    const loadSquareScript = (env: "sandbox" | "production") => {
      const scriptId = "square-payments-sdk"
      const existingScript = document.getElementById(scriptId)
      const src =
        env === "production"
          ? "https://web.squarecdn.com/v1/square.js"
          : "https://sandbox.web.squarecdn.com/v1/square.js"

      return new Promise<void>((resolve, reject) => {
        if (window.Square) {
          resolve()
          return
        }

        if (existingScript) {
          existingScript.addEventListener("load", () => resolve(), { once: true })
          existingScript.addEventListener("error", () => reject(new Error("Square script failed")), { once: true })
          return
        }

        const script = document.createElement("script")
        script.id = scriptId
        script.src = src
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error("Square script failed"))
        document.body.appendChild(script)
      })
    }

    const initPayments = async () => {
      try {
        setStatusMessage("Preparing checkout...")
        const response = await fetch("/api/square/config")
        if (!response.ok) {
          throw new Error("Checkout temporarily unavailable")
        }
        const config = await response.json()
        if (!isMounted) return
        setSquareEnv(config.environment === "production" ? "production" : "sandbox")
        await loadSquareScript(config.environment === "production" ? "production" : "sandbox")
        if (!window.Square) {
          throw new Error("Square failed to initialize")
        }

        const paymentsInstance = window.Square.payments(config.applicationId, config.locationId, {
          environment: config.environment,
        })
        const cardInstance = await paymentsInstance.card()
        await cardInstance.attach("#square-card-container")

        if (!isMounted) return
        setPayments(paymentsInstance)
        setCard(cardInstance)
        setStatusMessage(null)
        setIsLoading(false)

      } catch (err) {
        if (!isMounted) return
        console.error(err)
        setError(err instanceof Error ? err.message : "Unable to load checkout")
        setIsLoading(false)
        setStatusMessage(null)
      }
    }

    initPayments()
    return () => {
      isMounted = false
    }
  }, [cartItems.length, card])

  useEffect(() => {
    if (!payments || cartItems.length === 0) {
      console.log("[Apple Pay] Not ready - payments:", !!payments, "cartItems:", cartItems.length)
      setApplePay(null)
      setApplePayReady(false)
      return
    }

    let isActive = true
    const setupApplePay = async () => {
      try {
        console.log("[Apple Pay] Setting up with total:", total)
        console.log("[Apple Pay] Current domain:", window.location.hostname)
        console.log("[Apple Pay] Full URL:", window.location.href)
        const paymentRequest = payments.paymentRequest({
          countryCode: "US",
          currencyCode: "USD",
          total: {
            amount: total.toFixed(2),
            label: "La Esquinita",
          },
          lineItems: cartItems.map((item) => ({
            amount: (item.price * item.quantity).toFixed(2),
            label: item.name,
          })),
        })

        console.log("[Apple Pay] Payment request created, getting Apple Pay instance...")
        const applePayInstance = await payments.applePay(paymentRequest)
        console.log("[Apple Pay] Instance:", !!applePayInstance)
        if (!applePayInstance) {
          console.log("[Apple Pay] No instance returned")
          return
        }
        const canUse = await applePayInstance.canUse()
        console.log("[Apple Pay] Can use:", canUse)
        if (!isActive) return
        if (canUse) {
          console.log("[Apple Pay] ✅ Ready to use!")
          setApplePay(applePayInstance)
          setApplePayReady(true)
        } else {
          console.log("[Apple Pay] ❌ Cannot use")
          setApplePay(null)
          setApplePayReady(false)
        }
      } catch (err) {
        console.error("[Apple Pay] Error:", err)
        if (!isActive) return
        setApplePay(null)
        setApplePayReady(false)
      }
    }

    setupApplePay()
    return () => {
      isActive = false
    }
  }, [payments, cartItems, total])

  const sendPayment = async (token: string): Promise<CheckoutResponsePayload> => {
    const response = await fetch("/api/checkout/square", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceId: token,
        cartItems: paymentItems,
        totalAmount: total,
      }),
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(payload.error || "Square payment failed")
    }
    return payload as CheckoutResponsePayload
  }

  const handleCardPayment = async () => {
    if (!card) return
    setIsProcessing(true)
    setError(null)
    try {
      const result = await card.tokenize()
      if (result.status !== "OK") {
        throw new Error(result.errors?.[0]?.message || "Card tokenization failed")
      }
      const paymentResult = await sendPayment(result.token)
      onSuccess({
        orderId: paymentResult.orderId ?? undefined,
        paymentId: paymentResult.payment?.id ?? undefined,
      })
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Payment failed"
      setError(message)
      onFailure?.(message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplePayPayment = async () => {
    if (!applePay) return
    setIsProcessing(true)
    setError(null)
    try {
      const result = await applePay.tokenize()
      if (result.status !== "OK") {
        throw new Error(result.errors?.[0]?.message || "Apple Pay tokenization failed")
      }
      const paymentResult = await sendPayment(result.token)
      onSuccess({
        orderId: paymentResult.orderId ?? undefined,
        paymentId: paymentResult.payment?.id ?? undefined,
      })
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : "Apple Pay payment failed"
      setError(message)
      onFailure?.(message)
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) return null

  return (
    <div className="space-y-4">
      {statusMessage && (
        <p className="text-sm text-gray-500">{statusMessage}</p>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <div className="border border-gray-200 rounded-lg p-3">
        <div id="square-card-container" className="min-h-[120px] flex items-center justify-center">
          {isLoading && <span className="text-sm text-gray-500">Loading secure card form...</span>}
        </div>
      </div>
      <Button
        disabled={!card || isProcessing}
        onClick={handleCardPayment}
        className="w-full bg-miami-pink text-white py-3"
      >
        {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)} with Card`}
      </Button>
      {applePayReady && (
        <button
          onClick={handleApplePayPayment}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-black bg-black py-3 text-white text-lg transition-opacity disabled:opacity-60"
        >
          <span className="text-xl font-semibold tracking-tight">Apple Pay</span>
          <span className="text-base">
            {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </span>
        </button>
      )}
      <p className="text-xs text-gray-500 text-center">
        Powered by Square ({squareEnv === "production" ? "Live" : "Sandbox"})
      </p>
    </div>
  )
}
