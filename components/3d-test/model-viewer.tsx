"use client"
import React, { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, AlertCircle } from "lucide-react"

// Dynamic imports to avoid SSR issues
const Canvas = React.lazy(() => import("@react-three/fiber").then(module => ({ default: module.Canvas })))
const OrbitControls = React.lazy(() => import("@react-three/drei").then(module => ({ default: module.OrbitControls })))
const Environment = React.lazy(() => import("@react-three/drei").then(module => ({ default: module.Environment })))
const Stats = React.lazy(() => import("@react-three/drei").then(module => ({ default: module.Stats })))

// 3D Model Component
const Model = () => {
  const [model, setModel] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadModel = async () => {
      try {
        // Dynamic import for GLTF loader
        const { useGLTF } = await import("@react-three/drei")
        const gltf = useGLTF("/obj/Asset 1.glb")
        setModel(gltf)
      } catch (err) {
        console.error("Failed to load 3D model:", err)
        setError("Failed to load 3D model")
      }
    }

    loadModel()
  }, [])

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    )
  }

  if (!model) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    )
  }

  return <primitive object={model.scene} />
}

// Error Boundary for 3D Components
class ThreeDErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("3D Component Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-miami-pink to-miami-blue text-white p-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">3D Rendering Error</h3>
            <p className="text-sm opacity-80 mb-4">
              Unable to load 3D content. This might be due to browser compatibility or missing WebGL support.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-white text-miami-pink rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Main Model Viewer Component
const ModelViewer = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-miami-pink to-miami-blue">
        <div className="text-center text-white">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
          <p>Loading 3D Viewer...</p>
        </div>
      </div>
    )
  }

  return (
    <ThreeDErrorBoundary>
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)' }}
        >
          <Suspense fallback={null}>
            <Model />
            <Environment preset="sunset" />
            
            {/* Controls */}
            <OrbitControls 
              enablePan
              enableZoom
              enableRotate
              autoRotate={false}
              autoRotateSpeed={1}
            />
            
            {/* Performance Stats */}
            <Stats />
          </Suspense>
        </Canvas>
      </div>
    </ThreeDErrorBoundary>
  )
}

export default ModelViewer 