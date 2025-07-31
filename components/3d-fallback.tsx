"use client"

import React from "react"
import { motion } from "framer-motion"
import { AlertCircle, Box } from "lucide-react"

interface ThreeDFallbackProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export default function ThreeDFallback({ 
  title = "3D Component Unavailable",
  message = "The 3D viewer is not available in your browser or device.",
  onRetry 
}: ThreeDFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center h-full bg-gradient-to-br from-miami-pink/10 to-miami-blue/10 rounded-xl border border-miami-pink/20"
    >
      <div className="text-center p-8 max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-miami-pink to-miami-blue rounded-full flex items-center justify-center mx-auto mb-6">
          <Box className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-mint-rot mb-3">
          {title}
        </h3>
        
        <p className="text-mint-rot/70 mb-6 leading-relaxed">
          {message}
        </p>
        
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="bg-gradient-to-r from-miami-pink to-miami-blue text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        )}
        
        <div className="mt-6 text-xs text-mint-rot/50">
          <p>This might be due to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Browser compatibility issues</li>
            <li>WebGL not supported</li>
            <li>Performance limitations</li>
            <li>Network connectivity problems</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
} 