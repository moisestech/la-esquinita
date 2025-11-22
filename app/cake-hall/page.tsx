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
              src="/cakeHall1.jpg"
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
              maiden mother crone dance<br />
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

          {/* Mysterious Performance Dates */}
          <motion.div
            className="mt-16 mb-8 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <div className="bg-gradient-to-b from-miami-pink/10 to-transparent border border-miami-pink/30 rounded-xl p-8 backdrop-blur-sm">
              <motion.h3
                className="text-2xl md:text-3xl font-bold text-miami-pink text-center mb-6 tracking-wider"
                animate={{
                  opacity: [0.7, 1, 0.7],
                  textShadow: [
                    "0 0 10px rgba(255, 105, 180, 0.5)",
                    "0 0 20px rgba(255, 105, 180, 0.8)",
                    "0 0 10px rgba(255, 105, 180, 0.5)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✨ When the Moon Rises ✨
              </motion.h3>

              <div className="space-y-4 text-center">
                <motion.p
                  className="text-white/80 text-lg italic"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.8 }}
                >
                  The clowns will perform their ritual dance on three sacred nights...
                </motion.p>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <motion.div
                    className="bg-black/40 border border-miami-pink/20 rounded-lg p-6 hover:border-miami-pink/60 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.0 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 105, 180, 0.3)" }}
                  >
                    <div className="text-miami-pink text-4xl mb-3">🌙</div>
                    <p className="text-white/60 text-sm uppercase tracking-widest mb-2">The Opening</p>
                    <p className="text-miami-pink font-bold text-xl">November 21st</p>
                    <p className="text-white/40 text-xs mt-2 italic">When the door first opens...</p>
                  </motion.div>

                  <motion.div
                    className="bg-black/40 border border-miami-pink/20 rounded-lg p-6 hover:border-miami-pink/60 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.2 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 105, 180, 0.3)" }}
                  >
                    <div className="text-miami-pink text-4xl mb-3">🎭</div>
                    <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Art Basel</p>
                    <p className="text-miami-pink font-bold text-xl">December 6th</p>
                    <p className="text-white/40 text-xs mt-2 italic">When the city dreams in neon...</p>
                  </motion.div>

                  <motion.div
                    className="bg-black/40 border border-miami-pink/20 rounded-lg p-6 hover:border-miami-pink/60 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.4 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 105, 180, 0.3)" }}
                  >
                    <div className="text-miami-pink text-4xl mb-3">🌟</div>
                    <p className="text-white/60 text-sm uppercase tracking-widest mb-2">The Finale</p>
                    <p className="text-miami-pink font-bold text-xl">January 17th</p>
                    <p className="text-white/40 text-xs mt-2 italic">When the sweetness returns to earth...</p>
                  </motion.div>
                </div>

                <motion.p
                  className="text-white/50 text-sm italic mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2.8 }}
                >
                  More details will be revealed as the dates approach...
                </motion.p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
