"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/supabase"

interface NewsletterModalProps {
  onClose: () => void
}

export default function NewsletterModal({ onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      await db.newsletter.subscribe(email)

      toast({
        title: "Success!",
        description: "Your email has been captured. Thanks for subscribing!",
        variant: "default",
      })

      // Reset form and close modal
      setEmail("")
      onClose()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error subscribing. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-xl border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Subscribe to Our Newsletter
        </h2>

        <p className="text-white/80 mb-8 text-center">
          Stay updated with the latest news and exclusive offers!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-miami-pink to-miami-cyan hover:from-miami-pink/90 hover:to-miami-cyan/90 text-white"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  )
} 