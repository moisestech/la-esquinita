"use client"

import React from "react"
import { motion } from "framer-motion"
import ProductCard from "./product-card"
import { Product } from "@/lib/supabase"

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="mb-16">
      {/* Section Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-4xl md:text-5xl font-skeleton text-mint-rot mb-4">
          Miami Kitsch Collection
        </h2>
        <p className="text-lg text-mint-rot/80 font-display">
          Discover the magic of Miami's artistic convenience store
        </p>
      </motion.div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <React.Fragment key={product.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.1 * index,
                ease: "easeOut"
              }}
            >
              <ProductCard 
                product={product} 
              />
            </motion.div>
            
            {/* Sponsorship Image after every 4th product */}
            {(index + 1) % 4 === 0 && (
              <motion.div
                className="md:col-span-2 lg:col-span-3 xl:col-span-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.1 * (index + 1),
                  ease: "easeOut"
                }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-miami-pink/20">
                  <motion.img
                    src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1753918203/la-esquinita/La_Esquinita_sponsorship_2025_Tara_Long-store_jx4rl5.png"
                    alt="La Esquinita Sponsorship 2025 - Tara Long Store"
                    className="w-full h-64 md:h-80 object-cover"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-lg md:text-xl font-bold mb-1">
                      La Esquinita Sponsorship 2025
                    </h3>
                    <p className="text-white/90 text-sm">
                      Supporting Miami's artistic community
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">🌴</div>
          <h3 className="text-2xl font-skeleton text-mint-rot mb-2">
            Coming Soon!
          </h3>
          <p className="text-mint-rot/80">
            Our Miami kitsch collection is being prepared with love and sugar.
          </p>
        </motion.div>
      )}
    </div>
  )
} 