"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { InventoryProduct } from "@/lib/inventory-data"

interface RelatedProductsProps {
  currentProduct: InventoryProduct
  products: InventoryProduct[]
}

export default function RelatedProducts({ currentProduct, products }: RelatedProductsProps) {
  // Filter out current product and get related products by category or tags
  const relatedProducts = products
    .filter(product => product.id !== currentProduct.id)
    .filter(product => 
      product.category === currentProduct.category ||
      product.tags.some(tag => currentProduct.tags.includes(tag))
    )
    .slice(0, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-sugar-pink p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-skeleton text-mint-rot">Related Products</h3>
        <Link 
          href="/storefront"
          className="flex items-center space-x-1 text-miami-pink hover:text-miami-blue transition-colors duration-300"
        >
          <span className="text-sm font-medium">View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/product/${product.slug}`}>
              <div className="group cursor-pointer">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-sugar-pink to-icing-white mb-3">
                  <img
                    src={product.image_urls[0]}
                    alt={product.name}
                    className="w-full h-32 object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Status Badge */}
                  {["coming_soon", "coming-soon"].includes(
                    (product.inventoryStatus || product.status || "active").toLowerCase()
                  ) && (
                    <div className="absolute top-2 right-2 bg-miami-yellow text-black text-xs px-2 py-1 rounded-full font-medium">
                      Coming Soon
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <h4 className="font-medium text-mint-rot group-hover:text-miami-pink transition-colors duration-300 line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-lg font-bold text-mint-rot">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {relatedProducts.length === 0 && (
        <motion.div 
          className="text-center py-8 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p>No related products found.</p>
          <Link 
            href="/storefront"
            className="inline-flex items-center space-x-1 text-miami-pink hover:text-miami-blue transition-colors duration-300 mt-2"
          >
            <span className="text-sm font-medium">Browse all products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </div>
  )
} 
