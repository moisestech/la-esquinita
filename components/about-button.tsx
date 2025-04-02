"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutButton() {
  const [fontLoaded, setFontLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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
    <div className="about-button">
      <Link href="/about" className="block">
        <Button
          className={`about-button-content ${isHovered ? 'animate-pulse' : ''}`}
          style={{
            fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="relative z-10">About</span>
          <div 
            className={`about-button-shine ${isHovered ? 'translate-x-full' : 'translate-x-0'}`}
          />
        </Button>
      </Link>
    </div>
  )
} 