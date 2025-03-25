"use client"

import type React from "react"
import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import BackgroundPattern from '@/components/background-pattern'

// Dynamically import the simple 3D component with error handling
const Simple3D = dynamic(
  () => {
    console.log("Starting dynamic import of Simple3D")
    return import("@/components/simple-3d")
      .then((module) => {
        console.log("Successfully imported Simple3D")
        return module.default
      })
      .catch((err) => {
        console.error("Error loading Simple3D:", err)
        return () => <div>Error loading 3D scene: {err.message}</div>
      })
  },
  {
    ssr: false,
    loading: () => {
      console.log("Loading Simple3D component...")
      return (
        <div className="flex items-center justify-center w-full h-screen bg-white">
          <div className="text-2xl font-bold text-pink-600">Loading 3D Scene...</div>
        </div>
      )
    },
  }
)

export default function HomePage() {
  const [email, setEmail] = useState("")
  const { toast } = useToast()

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
    <main className="relative w-full h-screen overflow-hidden">
      <BackgroundPattern 
        imageUrl="https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/bg-rocks-color_ikxdem.jpg"
        className="opacity-90"
      />
      
      <Simple3D />

      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-miami-cyan/30"
        >
          <h2 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-miami-pink to-miami-cyan bg-clip-text text-transparent">
            Subscribe to Our Newsletter
          </h2>

          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-miami-pink"
              required
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-miami-pink to-miami-cyan hover:from-miami-pink/90 hover:to-miami-cyan/90 text-white"
            >
              Subscribe
            </Button>
          </div>
        </form>
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <Button
          className="bg-gradient-to-r from-miami-pink to-miami-cyan hover:from-miami-pink/90 hover:to-miami-cyan/90 text-white"
          onClick={() => window.location.reload()}
        >
          Restart Animation
        </Button>
      </div>

      <Toaster />
    </main>
  )
} 