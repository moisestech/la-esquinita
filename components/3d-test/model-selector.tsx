"use client"

import React from "react"
import { motion } from "framer-motion"
import { Box } from "lucide-react"

interface Model {
  id: string
  name: string
  objPath: string
  mtlPath: string
  thumbnail: string
  description: string
}

interface ModelSelectorProps {
  models: Model[]
  selectedModel: Model
  onModelSelect: (model: Model) => void
}

export default function ModelSelector({ models, selectedModel, onModelSelect }: ModelSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-sugar-pink p-4">
      <h3 className="text-xl font-skeleton text-mint-rot mb-4 flex items-center space-x-2">
        <Box className="w-5 h-5" />
        <span>Available Models</span>
      </h3>
      
      <div className="space-y-3">
        {models.map((model, index) => (
          <motion.div
            key={model.id}
            className={`cursor-pointer rounded-xl p-3 border-2 transition-all duration-200 ${
              selectedModel.id === model.id
                ? 'border-miami-pink bg-miami-pink/10'
                : 'border-sugar-pink/30 hover:border-miami-pink/50 hover:bg-miami-pink/5'
            }`}
            onClick={() => onModelSelect(model)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-sugar-pink to-fondant-blue flex items-center justify-center">
                <img
                  src={model.thumbnail}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Model Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-skeleton text-mint-rot text-sm truncate">
                  {model.name}
                </h4>
                <p className="text-xs text-mint-rot/70 truncate">
                  {model.description}
                </p>
              </div>
              
              {/* Selection Indicator */}
              {selectedModel.id === model.id && (
                <motion.div
                  className="w-3 h-3 rounded-full bg-miami-pink"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Model Info Panel */}
      <motion.div
        className="mt-6 p-4 bg-gradient-to-br from-sugar-pink/10 to-fondant-blue/10 rounded-xl border border-sugar-pink/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h4 className="font-skeleton text-mint-rot mb-2">Selected Model</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-mint-rot/70">Name:</span>
            <span className="ml-2 text-mint-rot font-medium">{selectedModel.name}</span>
          </div>
          <div>
            <span className="text-mint-rot/70">OBJ File:</span>
            <span className="ml-2 text-mint-rot font-mono text-xs">{selectedModel.objPath}</span>
          </div>
          <div>
            <span className="text-mint-rot/70">MTL File:</span>
            <span className="ml-2 text-mint-rot font-mono text-xs">{selectedModel.mtlPath}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 