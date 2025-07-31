"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { TextReveal } from "@/components/magicui/text-reveal"
import { useState, useEffect } from "react"
import NewsletterModal from "@/components/newsletter-modal"
import { TbHandFinger } from "react-icons/tb"

export default function AboutPageClient() {
  const [fontLoaded, setFontLoaded] = useState(false)
  const [showNewsletter, setShowNewsletter] = useState(false)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'SkeletonBlood'
        src: url('/fonts/skeleton-blood.woff2') format('woff2'),
             url('/fonts/skeleton-blood.woff') format('woff'),
             url('/fonts/skeleton-blood.ttf') format('truetype'),
             url('/fonts/skeleton-blood.otf') format('opentype')
        font-weight: normal
        font-style: normal
        font-display: swap
      }
    `
    document.head.appendChild(style)
    
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        setFontLoaded(true)
      })
    } else {
      setFontLoaded(true)
    }
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])



  return (
    <div className="about-page relative min-h-screen">
      {/* Navigation */}
      <nav className="about-nav fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              href="/"
              className="text-white hover:text-miami-pink transition-colors duration-300"
              style={{
                fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
                fontSize: "1.5rem"
              }}
            >
              La Esquinita
            </Link>
            <button
              onClick={() => setShowNewsletter(true)}
              className="text-white hover:text-miami-pink transition-colors duration-300"
              style={{
                fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
                fontSize: "1.2rem"
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-24 pb-16">
        <div className="about-content">
          <TextReveal 
            className="text-white" 
            style={{
              fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
            }}
          >
            Welcome to La Esquinita, where we celebrate Miami's vibrant corner store culture. Our digital space captures the essence of these beloved community hubs, from neon lights to tropical vibes.

            We're creating an immersive experience that brings the authentic Miami corner store to the digital world, where tradition meets innovation.
          </TextReveal>
        </div>
      </main>

      {/* Scroll Indicator */}
      <motion.div 
        className="fixed bottom-36 left-1/2 -translate-x-1/2 z-50"
        onClick={() => setShowNewsletter(true)}
      >
        <span className="text-white text-2xl mb-4">Scroll to Subscribe</span>
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20"
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="text-white flex justify-center items-center text-4xl">
            <TbHandFinger />
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="about-footer fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p 
            className="text-center text-white/80"
            style={{
              fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
            }}
          >
            © 2025 La Esquinita. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={showNewsletter}
        onClose={() => setShowNewsletter(false)}
      />
    </div>
  )
} 