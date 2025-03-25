"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface BackgroundPatternProps {
  imageUrl: string
  className?: string
}

export default function BackgroundPattern({ imageUrl, className = '' }: BackgroundPatternProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Test if image URL is accessible using HTMLImageElement
    const img = new window.Image()
    img.src = imageUrl
    img.onload = () => {
      console.log('Background image loaded successfully')
      setLoaded(true)
    }
    img.onerror = () => {
      console.error('Failed to load background image')
      setError('Failed to load image')
    }
  }, [imageUrl])

  return (
    <>
      <div 
        className={`fixed inset-0 w-full h-full -z-10 ${className}`}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          backgroundColor: '#f5f5f5',
        }}
      />
      <div className="fixed inset-0 -z-20">
        <Image
          src={imageUrl}
          alt="Background pattern"
          fill
          className="object-cover"
          onLoad={() => setLoaded(true)}
          onError={() => setError('Failed to load image')}
          priority
        />
      </div>
      {error && (
        <div className="fixed top-0 left-0 text-red-500 p-4 z-50">
          {error}
        </div>
      )}
    </>
  )
} 