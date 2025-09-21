"use client"

import { motion } from "framer-motion"
import { Cake, Star, MapPin } from "lucide-react"
import { useEffect, useRef } from "react"

export default function CakeHall() {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Play audio when component mounts
    if (audioRef.current) {
      audioRef.current.volume = 0.3 // Set to 30% volume
      audioRef.current.play().catch(error => {
        // Auto-play might be blocked by browser
        console.log("Audio autoplay blocked:", error)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        loop
        src="/audio/cake-hall-theme.mp3" // Add your MP3 file here
      />
      {/* Header */}
      <motion.div
        className="text-center py-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Cake className="w-16 h-16 text-miami-pink" />
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold text-miami-pink mb-4 drop-shadow-neon-pink">
          Cake Hall
        </h1>
        <p className="text-xl md:text-2xl text-white font-display max-w-2xl mx-auto">

        </p>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <motion.div
            className="relative overflow-hidden rounded-2xl shadow-2xl mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src="/esquinita3.jpg"
              alt="Cake Hall Installation"
              className="w-full h-96 md:h-[500px] object-cover"
            />
          </motion.div>

          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <p className="text-white/70 italic text-sm leading-relaxed max-w-md mx-auto">
              Three sacred clowns emerge from sugar cavities—<br />
              Sweetheart, Siren, Fury dance<br />
              in episodic rituals of desire and decay,<br />
              ancient archetypes surfacing<br />
              from the crumbling sweetness below.
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <img
              src="/shop/clown1.png"
              alt="Sacred Clown Performance"
              className="h-48 md:h-64 w-auto rounded-lg shadow-lg"
            />
            <img
              src="/shop/clown2.png"
              alt="Sacred Clown Performance"
              className="h-48 md:h-64 w-auto rounded-lg shadow-lg"
            />
          </motion.div>

        </div>
      </div>
    </div>
  )
}