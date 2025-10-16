"use client"

import React from "react"
import { motion } from "framer-motion"

const marqueeItems = [
  "🍒 Delight & Devour Benefit Dinner → Nov 14th @ 6 PM 🍒",
  "🏴‍☠️ Opening Reception → Nov 21st @ 6 PM 🌟",
  "🎂 Miami Art Week Press Preview → Dec 2 @ 10 AM 🎂",
  "🎂 Meet the Artist VIP Basel Reception → Dec 6 @ 7 PM 🎂",
  "🎁 Holiday Makers Mart → Dec 13 @ 12 PM 🎁",
  "🏴‍☠️ Closing Reception → January 17th @ 6 PM 🌟",
]

export default function SugarIcingMarquee() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-miami-pink via-miami-yellow to-miami-blue py-4">
      {/* Icing Texture Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full animate-candy-shimmer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Marquee Content */}
      <div className="relative">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -50 * marqueeItems.length],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Duplicate items for seamless loop */}
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div
              key={index}
              className="flex items-center mx-8 text-white font-bold text-lg md:text-xl"
            >
              <span className="mr-4">✨</span>
              <span className="drop-shadow-lg">{item}</span>
              <span className="ml-4">✨</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Neon Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-neon-pulse" />
    </div>
  )
} 