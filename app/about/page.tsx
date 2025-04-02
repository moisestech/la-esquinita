"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function AboutPage() {
  const [fontLoaded, setFontLoaded] = useState(false)

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
    <div className="about-page">
      {/* Navigation */}
      <nav className="about-nav">
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="about-content">
          <h1 
            className="text-4xl sm:text-5xl font-bold text-center mb-8 text-white"
            style={{
              fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
            }}
          >
            About La Esquinita
          </h1>

          <p className="text-lg leading-relaxed">
            Welcome to La Esquinita, where we celebrate the vibrant spirit of Miami's corner stores. 
            Our digital space is inspired by the colorful, eclectic nature of these beloved community hubs.
          </p>

          <p className="text-lg leading-relaxed">
            We're passionate about creating an immersive experience that captures the essence of 
            Miami's unique culture, from the neon lights to the tropical vibes.
          </p>

          <div className="about-card">
            <h2 
              className="text-2xl font-bold mb-4 text-miami-pink"
              style={{
                fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
              }}
            >
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed">
              To bring the authentic Miami corner store experience to the digital world, 
              creating a space that feels both familiar and exciting.
            </p>
          </div>

          <div className="about-card">
            <h2 
              className="text-2xl font-bold mb-4 text-miami-cyan"
              style={{
                fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
              }}
            >
              Our Vision
            </h2>
            <p className="text-lg leading-relaxed">
              To be the digital embodiment of Miami's vibrant corner store culture, 
              where tradition meets innovation and community thrives.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="about-footer">
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
    </div>
  )
}