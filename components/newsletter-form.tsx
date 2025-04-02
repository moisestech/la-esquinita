"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useNewsletter } from "@/hooks/use-newsletter"

export default function NewsletterForm() {
  const [fontLoaded, setFontLoaded] = useState(false)
  const { email, error, isSubmitting, isSuccess, handleEmailChange, handleSubmit } = useNewsletter()

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
    <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-miami-cyan/30"
      >
        <h2 
          className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-miami-pink to-miami-cyan bg-clip-text text-transparent"
          style={{
            fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
          }}
        >
          Subscribe to Our Newsletter
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-miami-pink"
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting || !!error}
              className="bg-gradient-to-r from-miami-pink to-miami-cyan hover:from-miami-pink/90 hover:to-miami-cyan/90 text-white"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {isSuccess && (
            <p className="text-green-500 text-sm">Successfully subscribed to our newsletter!</p>
          )}
        </div>
      </form>
    </div>
  )
} 