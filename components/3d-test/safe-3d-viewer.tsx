"use client"

import React, { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import ThreeDFallback from "../3d-fallback"

interface Model {
  id: string
  name: string
  objPath: string
  mtlPath: string
  thumbnail: string
  description: string
}

interface Safe3DViewerProps {
  model: Model
  onPerformanceUpdate?: (metrics: any) => void
}

// Lazy load the actual 3D viewer component
const Lazy3DViewer = React.lazy(() => {
  return new Promise<{ default: React.ComponentType<any> }>((resolve, reject) => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      reject(new Error('Server-side rendering not supported'))
      return
    }

    // Check for WebGL support
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) {
      reject(new Error('WebGL not supported'))
      return
    }

    // Dynamically import the 3D viewer
    import('./model-viewer')
      .then((module) => {
        resolve({ default: module.default })
      })
      .catch((error) => {
        console.error('Failed to load 3D viewer:', error)
        reject(error)
      })
  })
})

export default function Safe3DViewer({ model, onPerformanceUpdate }: Safe3DViewerProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-miami-pink animate-spin mx-auto mb-2" />
          <p className="text-mint-rot text-sm">Loading 3D viewer...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <ThreeDFallback
        title="3D Viewer Error"
        message={error?.message || "Failed to load the 3D viewer."}
        onRetry={() => {
          setHasError(false)
          setError(null)
          window.location.reload()
        }}
      />
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-miami-pink animate-spin mx-auto mb-4" />
            <p className="text-mint-rot font-skeleton">Initializing 3D viewer...</p>
          </div>
        </div>
      }
    >
      <ErrorBoundary
        onError={(error) => {
          setHasError(true)
          setError(error)
        }}
      >
        <Lazy3DViewer
          model={model}
          onPerformanceUpdate={onPerformanceUpdate}
        />
      </ErrorBoundary>
    </Suspense>
  )
}

// Simple error boundary
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