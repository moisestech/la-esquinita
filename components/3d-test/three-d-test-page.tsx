"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ModelViewer from "./model-viewer"
import ModelSelector from "./model-selector"
import PerformanceMonitor from "./performance-monitor"
import { ChevronLeft, Settings, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

// Available 3D models from /public/obj directory
const availableModels = [
  {
    id: "asset-1",
    name: "Asset 1",
    objPath: "/obj/Asset 1.obj",
    mtlPath: "/obj/Asset 1.mtl",
    thumbnail: "/placeholder-logo.png",
    description: "First 3D asset for La Esquinita"
  },
  {
    id: "asset-2", 
    name: "Asset 2",
    objPath: "/obj/Asset 2.obj",
    mtlPath: "/obj/Asset 2.mtl",
    thumbnail: "/placeholder-logo.png",
    description: "Second 3D asset for La Esquinita"
  }
]

export default function ThreeDTestPage() {
  const [selectedModel, setSelectedModel] = useState(availableModels[0])
  const [showControls, setShowControls] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 0,
    memory: 0,
    triangles: 0,
    loadTime: 0
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-rot via-stucco to-icing-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-miami-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-mint-rot font-skeleton text-lg">Loading 3D Testing Lab...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-rot via-stucco to-icing-white">
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-sm border-b border-sugar-pink/20 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a 
              href="/storefront" 
              className="flex items-center space-x-2 text-mint-rot hover:text-miami-pink transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-skeleton text-lg">Back to Storefront</span>
            </a>
          </div>
          
          <h1 className="text-3xl font-skeleton text-miami-pink">
            3D Testing Lab
          </h1>
          
          <button
            onClick={() => setShowControls(!showControls)}
            className="p-2 bg-miami-pink text-white rounded-lg hover:bg-miami-purple transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Model Selector Sidebar */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ModelSelector
              models={availableModels}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
          </motion.div>

          {/* Main 3D Viewer */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-sugar-pink">
              {/* Viewer Header */}
              <div className="bg-gradient-to-r from-miami-pink to-miami-purple p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-skeleton">{selectedModel.name}</h2>
                    <p className="text-sm opacity-90">{selectedModel.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      <ZoomOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3D Viewer */}
              <div className="h-96 md:h-[500px] lg:h-[600px] relative">
                <ModelViewer
                  model={selectedModel}
                  onPerformanceUpdate={setPerformanceMetrics}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Monitor */}
        {showControls && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PerformanceMonitor metrics={performanceMetrics} />
          </motion.div>
        )}
      </div>

      {/* Floating Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl animate-sprinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  )
} 