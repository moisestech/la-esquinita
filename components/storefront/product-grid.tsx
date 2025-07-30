"use client"

import React from "react"
import { motion } from "framer-motion"
import ProductCard from "./product-card"
import { Product } from "@/lib/supabase"

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
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
          <motion.div
            key={product.id}
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
              onAddToCart={onAddToCart}
            />
          </motion.div>
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