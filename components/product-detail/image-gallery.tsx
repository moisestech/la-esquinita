"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"

interface ImageGalleryProps {
  images: string[]
  productName: string
  statusLabel?: string | null
}

export default function ImageGallery({ images, productName, statusLabel }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const mainImage = images[activeIndex] || images[0] || ""

  return (
    <div className="relative">
      {/* Single Image */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sugar-pink to-icing-white p-4">
        <motion.img
          src={mainImage}
          alt={productName}
          loading="lazy"
          className="w-full h-96 md:h-[500px] object-contain"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        {statusLabel && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-2xl font-bold rounded-2xl">
            <span>{statusLabel}</span>
            <span className="text-sm uppercase tracking-wide mt-1">Request restock below</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setActiveIndex(index)}
              className={`w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${
                activeIndex === index
                  ? "border-miami-pink shadow-lg"
                  : "border-transparent opacity-70"
              }`}
            >
              <img
                src={image}
                alt={`${productName} view ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
