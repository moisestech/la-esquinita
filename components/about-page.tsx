"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import BackgroundPattern from '@/components/background-pattern'

export default function AboutPage() {
  const [fontLoaded, setFontLoaded] = useState(false);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Landscape sponsorship image with cool effect */}
      <motion.div
        className="relative w-full h-96 md:h-[500px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.img
          src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1753918202/la-esquinita/La_Esquinita_sponsorship_2025_Tara_Long-store-outside_n7z755.png"
          alt="La Esquinita Sponsorship 2025 - Tara Long Store Outside"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-pink-200/60 via-pink-100/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
      </motion.div>

      <BackgroundPattern 
        imageUrl="https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/bg-rocks-color_ikxdem.jpg"
        className="opacity-90"
      />

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <motion.div
        className="relative max-w-3xl mx-auto px-6 py-20 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex justify-center mb-12"
          variants={textVariants}
        >
          <motion.img
            src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892200/la-esquinita/LE-logo-tara-2_aurodr.png"
            alt="La Esquinita"
            className="h-32 md:h-48 w-auto drop-shadow-neon-pink"
            whileHover={{ 
              scale: 1.05,
              filter: "drop-shadow(0 0 20px #ff69b4) drop-shadow(0 0 30px #4ecdc4)",
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              y: [0, -5, 0],
              filter: [
                "drop-shadow(0 0 10px #ff69b4)",
                "drop-shadow(0 0 20px #ff69b4) drop-shadow(0 0 15px #4ecdc4)",
                "drop-shadow(0 0 10px #ff69b4)"
              ]
            }}
            transition={{ 
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              filter: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </motion.div>

        <motion.p 
          className="text-xl mb-8 text-gray-300"
          variants={textVariants}
        >
          In the heart of Miami&apos;s neon-lit streets, artist Tara Long presents an immersive exploration 
          of cultural intersections and suburban mythology.
        </motion.p>

        <motion.p 
          className="text-lg mb-8 text-gray-400"
          variants={textVariants}
        >
          Through crystalline sugar sculptures and mixed media installations, 
          Long deconstructs the familiar corner store &quot;La Esquinita&quot; 
          transforming it into a dreamlike space where Miami&apos;s stereotypes 
          dissolve into something more profound, more personal.
        </motion.p>

        <motion.div 
          className="space-y-6 mb-12 text-gray-400"
          variants={textVariants}
        >
          <p>
            Each sugar crystal captures a fragment of memory, a distorted reflection 
            of convenience store aesthetics filtered through the lens of magical realism.
          </p>
          <p>
            The exhibition challenges our perception of the mundane, elevating corner 
            store artifacts into tokens of cultural significance.
          </p>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur-sm p-8 rounded-lg mb-12"
          variants={textVariants}
        >
          <h2 className="text-2xl font-semibold mb-4 text-miami-pink">
            Opening Night
          </h2>
          <p className="text-gray-400">
            Details of this transformative experience will be revealed exclusively 
            to our community. Join our newsletter to be part of this journey into 
            the heart of Miami&apos;s corner store culture.
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-miami-pink/10 to-miami-cyan/10 backdrop-blur-sm p-8 rounded-lg mb-12 border border-miami-pink/20"
          variants={textVariants}
        >
          <h2 className="text-2xl font-semibold mb-4 text-miami-pink">
            Special Thanks
          </h2>
          <p className="text-gray-400 mb-4">
            This exhibition would not be possible without the generous support and 
            creative vision of our partners in the Miami arts community.
          </p>
          <div className="bg-white/5 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-miami-cyan">
              Locust Projects
            </h3>
            <p className="text-gray-400">
              We extend our deepest gratitude to Locust Projects for their unwavering 
              support and commitment to contemporary art in Miami. Their dedication 
              to fostering innovative artistic practices has made this exploration 
              of Miami&apos;s cultural landscape possible.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={textVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/" className="flex-1">
            <Button 
              className="w-full bg-gradient-to-r from-miami-pink to-miami-cyan hover:opacity-90 text-white"
            >
              Return to Home
            </Button>
          </Link>
          <Link href="/#newsletter" className="flex-1">
            <Button 
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-miami-pink/30"
            >
              Subscribe for Details
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
} 