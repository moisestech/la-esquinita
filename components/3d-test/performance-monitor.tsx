"use client"

import React from "react"
import { motion } from "framer-motion"
import { Activity, Cpu, MemoryStick, Clock, BarChart3 } from "lucide-react"

interface PerformanceMetrics {
  fps: number
  memory: number
  triangles: number
  loadTime: number
}

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics
}

export default function PerformanceMonitor({ metrics }: PerformanceMonitorProps) {
  const getFpsColor = (fps: number) => {
    if (fps >= 55) return "text-green-500"
    if (fps >= 30) return "text-yellow-500"
    return "text-red-500"
  }

  const getMemoryColor = (memory: number) => {
    if (memory < 100) return "text-green-500"
    if (memory < 200) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-sugar-pink p-6">
      <h3 className="text-xl font-skeleton text-mint-rot mb-6 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5" />
        <span>Performance Monitor</span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* FPS */}
        <motion.div
          className="bg-gradient-to-br from-sugar-pink/10 to-fondant-blue/10 rounded-xl p-4 border border-sugar-pink/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-miami-pink" />
            <span className="text-sm font-skeleton text-mint-rot">FPS</span>
          </div>
          <div className={`text-2xl font-bold ${getFpsColor(metrics.fps)}`}>
            {metrics.fps.toFixed(1)}
          </div>
          <div className="text-xs text-mint-rot/70 mt-1">
            Target: 60 FPS
          </div>
        </motion.div>

        {/* Memory */}
        <motion.div
          className="bg-gradient-to-br from-sugar-pink/10 to-fondant-blue/10 rounded-xl p-4 border border-sugar-pink/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <MemoryStick className="w-4 h-4 text-miami-pink" />
            <span className="text-sm font-skeleton text-mint-rot">Memory</span>
          </div>
          <div className={`text-2xl font-bold ${getMemoryColor(metrics.memory)}`}>
            {metrics.memory.toFixed(1)} MB
          </div>
          <div className="text-xs text-mint-rot/70 mt-1">
            GPU Memory
          </div>
        </motion.div>

        {/* Triangles */}
        <motion.div
          className="bg-gradient-to-br from-sugar-pink/10 to-fondant-blue/10 rounded-xl p-4 border border-sugar-pink/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Cpu className="w-4 h-4 text-miami-pink" />
            <span className="text-sm font-skeleton text-mint-rot">Triangles</span>
          </div>
          <div className="text-2xl font-bold text-mint-rot">
            {metrics.triangles.toLocaleString()}
          </div>
          <div className="text-xs text-mint-rot/70 mt-1">
            Rendered
          </div>
        </motion.div>

        {/* Load Time */}
        <motion.div
          className="bg-gradient-to-br from-sugar-pink/10 to-fondant-blue/10 rounded-xl p-4 border border-sugar-pink/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-miami-pink" />
            <span className="text-sm font-skeleton text-mint-rot">Load Time</span>
          </div>
          <div className="text-2xl font-bold text-mint-rot">
            {metrics.loadTime.toFixed(2)}s
          </div>
          <div className="text-xs text-mint-rot/70 mt-1">
            Model Loading
          </div>
        </motion.div>
      </div>

      {/* Performance Tips */}
      <motion.div
        className="mt-6 p-4 bg-gradient-to-br from-miami-yellow/10 to-miami-orange/10 rounded-xl border border-miami-yellow/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h4 className="font-skeleton text-mint-rot mb-2">Performance Tips</h4>
        <ul className="text-sm text-mint-rot/70 space-y-1">
          <li>• Keep FPS above 30 for smooth experience</li>
          <li>• Monitor memory usage to prevent crashes</li>
          <li>• Reduce triangle count for better performance</li>
          <li>• Optimize textures and materials</li>
        </ul>
      </motion.div>

      {/* Debug Controls */}
      <motion.div
        className="mt-4 flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <button className="px-3 py-1 bg-miami-pink text-white text-xs rounded-lg hover:bg-miami-purple transition-colors">
          Reset Camera
        </button>
        <button className="px-3 py-1 bg-miami-blue text-white text-xs rounded-lg hover:bg-miami-purple transition-colors">
          Toggle Wireframe
        </button>
        <button className="px-3 py-1 bg-miami-yellow text-mint-rot text-xs rounded-lg hover:bg-miami-orange transition-colors">
          Show Bounds
        </button>
        <button className="px-3 py-1 bg-mint-rot text-white text-xs rounded-lg hover:bg-miami-pink transition-colors">
          Export Screenshot
        </button>
      </motion.div>
    </div>
  )
} 