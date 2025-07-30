"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, X } from "lucide-react"

interface HiddenDoorProps {
  isVisible: boolean
  onCodeSubmit: (code: string) => void
}

export default function HiddenDoor({ isVisible, onCodeSubmit }: HiddenDoorProps) {
  const [showModal, setShowModal] = useState(false)
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onCodeSubmit(code)
    setCode("")
    setShowModal(false)
    setIsSubmitting(false)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Hidden Door Trigger */}
      <motion.div
        className="fixed bottom-8 right-8 z-30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.button
          onClick={() => setShowModal(true)}
          className="relative group cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Candy Stripe Background */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-miami-pink via-miami-yellow to-miami-blue p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <Lock className="w-6 h-6 text-miami-pink" />
            </div>
          </div>

          {/* Pulsing Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-miami-pink"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Sprinkle Effect */}
          <div className="absolute -top-2 -right-2 text-lg animate-sprinkle">
            ✨
          </div>
        </motion.button>

        {/* Tooltip */}
        <motion.div
          className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-mint-rot text-white text-xs rounded-lg whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
        >
          Secret Door
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-mint-rot" />
        </motion.div>
      </motion.div>

      {/* Code Input Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 z-50 w-full max-w-md mx-4"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-miami-pink to-miami-purple flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-skeleton text-mint-rot mb-2">
                  Secret Access
                </h3>
                <p className="text-mint-rot/70">
                  Enter the secret code to unlock hidden experiences
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter secret code..."
                    className="w-full px-4 py-3 border-2 border-sugar-pink rounded-xl focus:border-miami-pink focus:outline-none text-center font-mono text-lg uppercase tracking-wider"
                    maxLength={10}
                    autoFocus
                  />
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-mint-rot text-mint-rot rounded-xl font-bold hover:bg-mint-rot hover:text-white transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={!code.trim() || isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-miami-pink to-miami-purple text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? "Validating..." : "Enter"}
                  </motion.button>
                </div>
              </form>

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-mint-rot hover:text-miami-pink hover:bg-miami-pink/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative Elements */}
              <div className="absolute -top-2 -left-2 text-2xl animate-sprinkle">
                ✨
              </div>
              <div className="absolute -bottom-2 -right-2 text-xl animate-sprinkle" style={{ animationDelay: "1s" }}>
                🌴
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 