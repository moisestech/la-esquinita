"use client"

import React from "react"
import { motion } from "framer-motion"
import ProductCard from "./product-card"
import { Product } from "@/lib/supabase"

interface ProductGridProps {
  products: Product[]
}

const SPONSOR_INTERVAL = 16 // adjust to show banner every N items

const sponsorImages = [
  {
    src: "/front.jpg",
    alt: "La Esquinita storefront exterior",
    caption: "Our Locust Projects takeover in full bloom",
  },
  {
    src: "/storefront/420M5713.jpg",
    alt: "La Esquinita shelving close-up",
    caption: "New arrivals straight from the kiln",
  },
  {
    src: "/storefront/420M5717.jpg",
    alt: "Gallery view with shoppers",
    caption: "Gallery magic captured mid-visit",
  },
  {
    src: "/storefront/420M5723.jpg",
    alt: "Wall display detail",
    caption: "Handmade minis, lined up and glowing",
  },
  {
    src: "/storefront/420M5730.jpg",
    alt: "Interior corner vignette",
    caption: "Ceramics, sweets, and archival finds",
  },
  {
    src: "/storefront/420M5861.jpg",
    alt: "Checkout counter styling",
    caption: "Thank you for stepping into La Esquinita",
  },
  {
    src: "/storefront/196A5134.jpg",
    alt: "Shelf portrait from the pop-up",
    caption: "Every object numbered, every story unique",
  },
]

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
        <h2 className="text-4xl md:text-5xl font-skeleton text-white mb-4">
          Souvenir and Sweet Shop
        </h2>
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
            
            {/* Sponsorship Image after every SPONSOR_INTERVAL products */}
            {(index + 1) % SPONSOR_INTERVAL === 0 && (
              <motion.div
                className="md:col-span-2 lg:col-span-3 xl:col-span-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.05 * (index + 1),
                  ease: "easeOut",
                }}
              >
                {(() => {
                  const imageIndex = Math.floor((index + 1) / SPONSOR_INTERVAL)
                  const asset = sponsorImages[imageIndex % sponsorImages.length]
                  return (
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-miami-pink/20">
                      <motion.img
                        src={asset.src}
                        alt={asset.alt}
                        className="w-full h-64 md:h-80 object-cover"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white/90 text-sm">{asset.caption}</p>
                      </div>
                    </div>
                  )
                })()}
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
            Our sugar-coated collection is being prepared with love and artistry.
          </p>
        </motion.div>
      )}
    </div>
  )
} 
