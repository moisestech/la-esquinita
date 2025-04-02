"use client"

// REACT 
import type React from "react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"

// COMPONENTS
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import BackgroundPattern from '@/components/background-pattern'
import NewsletterForm from "@/components/newsletter-form"
import AboutButton from "@/components/about-button"

// HOOKS
import { useToast } from "@/hooks/use-toast"


// Dynamically import the simple 3D component with error handling
const Simple3D = dynamic(
  () => import("@/components/simple-3d"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-screen bg-white">
        <div className="text-2xl font-bold text-pink-600">Loading 3D Scene...</div>
      </div>
    ),
  }
)

export default function HomePage() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const { toast } = useToast()
  const [email, setEmail] = useState("")

  // Add font loading effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'SkeletonBlood';
        src: url('/fonts/skeleton-blood.woff2') format('woff2'),
             url('/fonts/skeleton-blood.woff') format('woff'),
             url('/fonts/skeleton-blood.ttf') format('truetype'),
             url('/fonts/skeleton-blood.otf') format('opentype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        setFontLoaded(true);
      });
    } else {
      setFontLoaded(true);
    }
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    // Success notification
    toast({
      title: "Success!",
      description: "Your email has been captured. Thanks for subscribing!",
      variant: "default",
    })

    // Reset form
    setEmail("")
  }

  return (
    <main className="relative w-full h-full overflow-hidden bg-green-500">
      {/* Background pattern layer - lowest z-index */}
      <div className="absolute inset-0 -z-10">
        <BackgroundPattern 
          imageUrl="https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/bg-rocks-color_ikxdem.jpg"
          className="opacity-90"
        />
      </div>

      {/* 3D Canvas layer */}
      <div className="absolute inset-0 z-10">
        <Simple3D />
      </div>

      {/* UI Controls layer - highest z-index */}
      <div className="absolute inset-0 z-50">
        {/* About Button */}
        <div className="absolute top-4 right-4">
          <AboutButton />
        </div>

        {/* Restart Button */}
        <div className="absolute bottom-4 right-4">
          <button
            className="bg-gradient-to-r from-miami-pink to-miami-cyan hover:from-miami-pink/90 hover:to-miami-cyan/90 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => window.location.reload()}
          >
            Restart Animation
          </button>
        </div>
      </div>

      <Toaster />
    </main>
  )
} 