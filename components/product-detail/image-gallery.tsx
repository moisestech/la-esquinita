"use client"

import React from "react"
import { motion } from "framer-motion"

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const mainImage = images[0] || ""

  return (
    <div className="relative">
      {/* Single Image */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sugar-pink to-icing-white p-4">
        <motion.img
          src={mainImage}
          alt={productName}
          className="w-full h-96 md:h-[500px] object-contain"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
} 