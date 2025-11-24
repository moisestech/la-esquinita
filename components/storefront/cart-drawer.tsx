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

  const [needsShipping, setNeedsShipping] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    phone: ''
  })

  const totalItems = getCartItemCount()
  const subtotal = getCartTotal()
  const shippingCost = needsShipping ? 20 : 0
  const total = subtotal + shippingCost

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
    if (needsShipping) {
      params.set("shipping", "true")
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
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
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

            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: '200px' }}>
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

            {/* Footer - Fixed at bottom */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-white flex-shrink-0 overflow-y-auto" style={{ maxHeight: '45vh' }}>
                {/* Shipping Option */}
                <div className="mb-4 p-4 bg-white rounded-lg border-2 border-fondant-blue shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center cursor-pointer gap-2">
                      <input
                        type="checkbox"
                        checked={needsShipping}
                        onChange={(e) => setNeedsShipping(e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: '#ff69b4' }}
                      />
                      <span className="font-semibold text-mint-rot">Need shipping? (+$20)</span>
                    </label>
                  </div>
                  <p className="text-xs text-mint-rot/70">
                    Free pickup available at the gallery during open hours
                  </p>

                  {needsShipping && (
                    <div className="mt-4 space-y-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={shippingAddress.name}
                        onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                        className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-500"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                          className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-500"
                          required
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={shippingAddress.zip}
                        onChange={(e) => setShippingAddress({...shippingAddress, zip: e.target.value})}
                        className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-500"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                        className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-500"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-500"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {needsShipping && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping & Processing:</span>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-lg font-medium text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-miami-pink">${total.toFixed(2)}</span>
                  </div>
                </div>

                <SquarePaymentSection
                  cartItems={cartItems}
                  total={total}
                  needsShipping={needsShipping}
                  shippingAddress={shippingAddress}
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
  needsShipping: boolean
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    email: string
    phone: string
  }
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
  needsShipping,
  shippingAddress,
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
    console.log("[Apple Pay] useEffect triggered - payments:", !!payments, "cartItems:", cartItems.length)
    if (!payments || cartItems.length === 0) {
      console.log("[Apple Pay] Not ready - payments:", !!payments, "cartItems:", cartItems.length)
      setApplePay(null)
      setApplePayReady(false)
      return
    }

    let isActive = true
    const setupApplePay = async () => {
      try {
        console.log("[Apple Pay] Starting setup...")
        console.log("[Apple Pay] Setting up with total:", total)
        console.log("[Apple Pay] Current domain:", window.location.hostname)
        console.log("[Apple Pay] Full URL:", window.location.href)
        console.log("[Apple Pay] payments object:", payments)
        console.log("[Apple Pay] payments.paymentRequest exists:", typeof payments.paymentRequest)
        console.log("[Apple Pay] payments.applePay exists:", typeof payments.applePay)

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
        console.log("[Apple Pay] Payment request created:", paymentRequest)

        console.log("[Apple Pay] Calling payments.applePay()...")
        const applePayInstance = await payments.applePay(paymentRequest)
        console.log("[Apple Pay] Got applePayInstance:", applePayInstance)
        console.log("[Apple Pay] applePayInstance type:", typeof applePayInstance)
        console.log("[Apple Pay] applePayInstance.canUse type:", typeof applePayInstance?.canUse)

        if (!applePayInstance || typeof applePayInstance.canUse !== 'function') {
          console.log("[Apple Pay] Invalid instance - bailing out")
          return
        }

        console.log("[Apple Pay] Calling canUse()...")
        const canUse = await applePayInstance.canUse()
        console.log("[Apple Pay] canUse result:", canUse)

        if (!isActive) {
          console.log("[Apple Pay] Component unmounted, aborting")
          return
        }

        if (canUse) {
          console.log("[Apple Pay] ✅ Ready! Setting state...")
          setApplePay(applePayInstance)
          setApplePayReady(true)
        } else {
          console.log("[Apple Pay] ❌ Cannot use - not available")
          setApplePay(null)
          setApplePayReady(false)
        }
      } catch (err) {
        console.error("[Apple Pay] Error caught:", err)
        console.error("[Apple Pay] Error type:", typeof err)
        console.error("[Apple Pay] Error message:", err instanceof Error ? err.message : String(err))
        console.error("[Apple Pay] Full error:", err)
        if (!isActive) return
        setApplePay(null)
        setApplePayReady(false)
      }
    }

    setupApplePay()
    return () => {
      console.log("[Apple Pay] Cleanup - component unmounting")
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
        needsShipping,
        shippingAddress: needsShipping ? shippingAddress : null,
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
