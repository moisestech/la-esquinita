"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Sprinkle {
  id: number
  left: number
  top: number
  animationDelay: number
  duration: number
  delay: number
}

export default function FloatingSprinkles() {
  const [sprinkles, setSprinkles] = useState<Sprinkle[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Generate sprinkles only on client side
    const generateSprinkles = () => {
      const newSprinkles: Sprinkle[] = []
      for (let i = 0; i < 20; i++) {
        newSprinkles.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          animationDelay: Math.random() * 2,
          duration: 2 + Math.random() * 2,
          delay: Math.random() * 2,
        })
      }
      setSprinkles(newSprinkles)
    }

    generateSprinkles()
  }, [])

  // Don't render anything on server side
  if (!isClient) {
    return null
  }

  return (
    <>
      {sprinkles.map((sprinkle) => (
        <motion.div
          key={sprinkle.id}
          className="absolute text-2xl animate-sprinkle"
          style={{
            left: `${sprinkle.left}%`,
            top: `${sprinkle.top}%`,
            animationDelay: `${sprinkle.animationDelay}s`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: sprinkle.duration,
            repeat: Infinity,
            delay: sprinkle.delay,
          }}
        >
          ✨
        </motion.div>
      ))}
    </>
  )
} 