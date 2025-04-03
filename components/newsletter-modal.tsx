"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/supabase"

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => Promise<void>
}

export default function NewsletterModal({ isOpen, onClose, onSubmit }: NewsletterModalProps) {
  const [email, setEmail] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  // Debug useEffect to log when modal state changes
  useEffect(() => {
    console.log("Newsletter modal state changed:", { isOpen });
  }, [isOpen]);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    setIsValid(validateEmail(newEmail))
    setError("")
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setIsSubmitting(true)
    setError("")

    try {
      await onSubmit(email)
      setIsSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("")
      setIsValid(false)
      setIsSuccess(false)
      setError("")
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Success state */}
            {isSuccess ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank you!</h2>
                <p className="text-gray-600">You've successfully subscribed to our newsletter.</p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Join Our Newsletter
                  </h2>
                  <p className="text-gray-600">
                    Stay updated with our latest news and exclusive offers!
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email input with floating label */}
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      className={`peer w-full h-12 px-4 border-2 rounded-lg outline-none transition-colors
                        ${isValid ? 'border-green-500' : 'border-gray-300 focus:border-pink-500'}
                        ${error ? 'border-red-500' : ''}`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="email"
                      className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all
                        peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2
                        peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-pink-500
                        ${email ? '-top-2.5 text-sm' : ''}
                        ${isValid ? 'text-green-500' : ''}
                        ${error ? 'text-red-500' : ''}`}
                    >
                      Email address
                    </label>
                    {isValid && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                    {error && (
                      <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" />
                    )}
                  </div>

                  {/* Error message */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm"
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium
                      ${isValid
                        ? 'bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600'
                        : 'bg-gray-300 cursor-not-allowed'
                      } transition-all duration-300`}
                    whileHover={isValid ? { scale: 1.02 } : {}}
                    whileTap={isValid ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </span>
                    ) : (
                      "Subscribe Now"
                    )}
                  </motion.button>
                </form>

                {/* Trust message */}
                <p className="text-center text-sm text-gray-500 mt-6">
                  No spam, we promise! You can unsubscribe at any time.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 