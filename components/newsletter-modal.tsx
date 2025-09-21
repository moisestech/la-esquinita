"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNewsletter } from "@/hooks/use-newsletter"
import { X } from "lucide-react"

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [fontLoaded, setFontLoaded] = useState(false)
  const { email, error, isSubmitting, isSuccess, handleEmailChange, handleSubmit } = useNewsletter()

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'SkeletonBlood'
        src: url('/fonts/skeleton-blood.woff2') format('woff2'),
             url('/fonts/skeleton-blood.woff') format('woff'),
             url('/fonts/skeleton-blood.ttf') format('truetype'),
             url('/fonts/skeleton-blood.otf') format('opentype')
        font-weight: normal
        font-style: normal
        font-display: swap
      }
    `
    document.head.appendChild(style)
    
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        setFontLoaded(true)
      })
    } else {
      setFontLoaded(true)
    }
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSubmit(e)
    if (isSuccess) {
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md"
          >
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-miami-pink via-miami-yellow to-miami-blue rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              
              {/* Main form container */}
              <form
                onSubmit={handleFormSubmit}
                className="relative bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-2 border-miami-pink/20 hover:border-miami-pink/40 transition-all duration-300"
              >
                {/* Close button */}
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-miami-pink/10 hover:bg-miami-pink/20 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} className="text-miami-pink" />
                </motion.button>

                {/* Decorative elements */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-miami-pink rounded-full animate-pulse"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-miami-yellow rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-miami-blue rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-miami-pink rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>

                {/* Header */}
                <div className="text-center mb-6">
                  <h2 
                    className="text-2xl font-bold mb-2 bg-gradient-to-r from-miami-pink via-miami-yellow to-miami-blue bg-clip-text text-transparent"
                    style={{
                      fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
                    }}
                  >
                    ✨ Stay in the Loop ✨
                  </h2>
                  <p className="text-mint-rot/80 text-sm">
                    Get exclusive updates, event announcements, and sugar-sweet inspiration
                  </p>
                </div>

                {/* Email input with enhanced styling */}
                <div className="space-y-4">
                  <div className="relative group/input">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-6 py-4 rounded-xl border-2 border-miami-pink/30 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-miami-pink focus:bg-white transition-all duration-300 placeholder-mint-rot/50 text-mint-rot font-medium"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-miami-pink/10 via-miami-yellow/10 to-miami-blue/10 opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  {/* Submit button with enhanced styling */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !!error}
                    className="w-full py-4 px-6 rounded-xl font-bold text-lg relative overflow-hidden group/button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Button background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-miami-pink via-miami-yellow to-miami-blue rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-miami-pink/80 via-miami-yellow/80 to-miami-blue/80 rounded-xl opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Button content */}
                    <span className="relative z-10 text-white flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <span>🎉</span>
                          Subscribe Now
                          <span>🎉</span>
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* Cancel button */}
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 px-6 rounded-xl font-medium text-lg border-2 border-miami-pink/30 text-miami-pink hover:bg-miami-pink/10 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Maybe Later
                  </motion.button>
                </div>

                {/* Status messages with enhanced styling */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm text-center mt-3 bg-red-50 p-3 rounded-lg border border-red-200"
                  >
                    ❌ {error}
                  </motion.p>
                )}

                {isSuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-600 text-sm text-center mt-3 bg-green-50 p-3 rounded-lg border border-green-200"
                  >
                    🎉 Successfully subscribed to our newsletter!
                  </motion.p>
                )}

                {/* Footer text */}
                <p className="text-xs text-mint-rot/60 text-center mt-4">
                  Join us • No spam, just art ✨
                </p>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 