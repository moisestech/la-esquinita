"use client"

import React, { Suspense, useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, Stats } from "@react-three/drei"
import { motion } from "framer-motion"
import { Loader2, AlertCircle } from "lucide-react"

interface Model {
  id: string
  name: string
  objPath: string
  mtlPath: string
  thumbnail: string
  description: string
}

interface ModelViewerProps {
  model: Model
  onPerformanceUpdate: (metrics: any) => void
}

function ModelLoader({ model }: { model: Model }) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
  }, [model.id])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-miami-pink mx-auto mb-4" />
          <p className="text-mint-rot font-skeleton">Failed to load model</p>
          <p className="text-sm text-mint-rot/70 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-miami-pink mx-auto mb-4 animate-spin" />
          <p className="text-mint-rot font-skeleton">Loading {model.name}...</p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-miami-pink animate-spin" />
      </div>
    }>
      <ModelScene model={model} />
    </Suspense>
  )
}

function ModelScene({ model }: { model: Model }) {
  // For now, we'll use a placeholder geometry since we need to implement OBJ loading
  // In a real implementation, you'd use useGLTF or a custom OBJ loader
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff69b4" />
      
      {/* Environment */}
      <Environment preset="sunset" />
      
      {/* Placeholder Geometry (replace with actual OBJ loading) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#ff69b4" 
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false}
        autoRotateSpeed={1}
      />
      
      {/* Performance Stats */}
      <Stats />
    </>
  )
}

export default function ModelViewer({ model, onPerformanceUpdate }: ModelViewerProps) {
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Reset error state when model changes
    setError(null)
  }, [model.id])

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-miami-pink mx-auto mb-4 animate-spin" />
          <p className="text-mint-rot font-skeleton">Initializing 3D viewer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Error Boundary */}
      {error ? (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-pink-50">
          <div className="text-center p-6">
            <AlertCircle className="w-16 h-16 text-miami-pink mx-auto mb-4" />
            <h3 className="text-xl font-skeleton text-mint-rot mb-2">
              Model Loading Error
            </h3>
            <p className="text-mint-rot/70 mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-miami-pink text-white rounded-lg hover:bg-miami-purple transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor('#fff8f2', 1)
            gl.shadowMap.enabled = true
            gl.shadowMap.type = 2
          }}
          onError={(error) => {
            console.error('Canvas error:', error)
            setError('Failed to initialize 3D viewer')
          }}
        >
          <ModelLoader model={model} />
        </Canvas>
      )}
      
      {/* Loading Overlay */}
      <motion.div
        className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-skeleton text-mint-rot"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {model.name}
      </motion.div>
    </div>
  )
} 