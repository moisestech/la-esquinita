"use client"

import React, { useState, useEffect } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface Client3DWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function Client3DWrapper({ children, fallback }: Client3DWrapperProps) {
  const [isClient, setIsClient] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-miami-pink animate-spin mx-auto mb-2" />
          <p className="text-mint-rot text-sm">Loading 3D...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-full bg-gradient-to-br from-miami-pink/10 to-miami-blue/10 rounded-xl border border-miami-pink/20"
      >
        <div className="text-center p-8">
          <AlertCircle className="w-16 h-16 text-miami-pink mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-mint-rot mb-2">
            3D Component Error
          </h3>
          <p className="text-mint-rot/70 mb-6 max-w-md">
            There was an issue loading the 3D component. This might be due to browser compatibility or performance limitations.
          </p>
          <motion.button
            onClick={() => {
              setHasError(false)
              setError(null)
              window.location.reload()
            }}
            className="bg-gradient-to-r from-miami-pink to-miami-blue text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
          {error && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-mint-rot/60 cursor-pointer hover:text-mint-rot">
                Error Details
              </summary>
              <pre className="text-xs text-mint-rot/50 mt-2 p-2 bg-black/10 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <ErrorBoundary
      onError={(error) => {
        setHasError(true)
        setError(error)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// Simple error boundary for the wrapper
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: (error: Error) => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    this.props.onError(error)
  }

  render() {
    if (this.state.hasError) {
      return null // Let the parent handle the error display
    }

    return this.props.children
  }
} 