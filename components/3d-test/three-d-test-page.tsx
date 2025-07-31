"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, AlertCircle, Box } from "lucide-react"

// Main 3D Test Page Component
export default function ThreeDTestPage() {
  const [isClient, setIsClient] = useState(false)
  const [show3D, setShow3D] = useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue flex items-center justify-center">
        <div className="text-center text-mint-rot">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
          <p className="text-xl font-skeleton">Loading 3D Test Environment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue">
      {/* Header */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-skeleton text-mint-rot mb-4">
            3D Test Environment
          </h1>
          <p className="text-lg text-mint-rot/80 max-w-2xl">
            Testing React Three Fiber compatibility with Next.js 15 and React 19
          </p>
        </div>
      </motion.div>

      {/* 3D Canvas */}
      <div className="w-full h-screen">
        {show3D ? (
          <ThreeDScene />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Box className="w-24 h-24 text-miami-pink mx-auto mb-6" />
              <h2 className="text-2xl font-skeleton text-mint-rot mb-4">
                Ready to Test 3D?
              </h2>
              <p className="text-mint-rot/80 mb-6 max-w-md">
                Click the button below to load the 3D scene. If there are any compatibility issues, 
                you'll see a graceful error message.
              </p>
              <button
                onClick={() => setShow3D(true)}
                className="px-6 py-3 bg-miami-pink text-white rounded-lg font-medium hover:bg-miami-purple transition-colors"
              >
                Load 3D Scene
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <motion.div
        className="absolute bottom-6 left-6 right-6 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <Box className="w-5 h-5 text-miami-pink" />
            <h3 className="font-skeleton text-mint-rot font-semibold">3D Scene Info</h3>
          </div>
          <ul className="text-sm text-mint-rot/80 space-y-1">
            <li>• Interactive 3D scene with basic geometry</li>
            <li>• Orbit controls for camera movement</li>
            <li>• Auto-rotation enabled</li>
            <li>• Miami kitsch color palette</li>
            <li>• Error boundary protection</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

// Simple 3D Scene Component with Error Boundary
function ThreeDScene() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [Canvas, setCanvas] = useState<any>(null)
  const [OrbitControls, setOrbitControls] = useState<any>(null)

  useEffect(() => {
    const load3DComponents = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Load 3D components
        const fiberModule = await import("@react-three/fiber")
        const dreiModule = await import("@react-three/drei")
        
        setCanvas(() => fiberModule.Canvas)
        setOrbitControls(() => dreiModule.OrbitControls)
        setIsLoading(false)
      } catch (err) {
        console.error("3D Component Error:", err)
        setError("Failed to load 3D components. This might be due to browser compatibility or missing WebGL support.")
        setIsLoading(false)
      }
    }

    load3DComponents()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-miami-pink to-miami-blue">
        <div className="text-center text-white">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
          <p>Loading 3D Components...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-miami-pink to-miami-blue text-white p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">3D Rendering Error</h3>
          <p className="text-sm opacity-80 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white text-miami-pink rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  if (!Canvas || !OrbitControls) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-miami-pink to-miami-blue text-white p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">3D Components Not Loaded</h3>
          <p className="text-sm opacity-80 mb-4">
            Failed to load 3D components.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white text-miami-pink rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 75 }}
      style={{ background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)' }}
      onError={(error: any) => {
        console.error("Canvas error:", error)
        setError("Failed to initialize 3D canvas")
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff69b4" />
      
      {/* Simple Geometry */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#ff69b4" 
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Additional decorative elements */}
      <mesh position={[3, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#4ecdc4" 
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>
      
      <mesh position={[-3, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial 
          color="#ffe66d" 
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>
      
      {/* Controls */}
      <OrbitControls 
        enablePan
        enableZoom
        enableRotate
        autoRotate={true}
        autoRotateSpeed={1}
      />
    </Canvas>
  )
} 