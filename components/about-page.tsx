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
      <BackgroundPattern 
        imageUrl="https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/bg-rocks-color_ikxdem.jpg"
        className="opacity-90"
      />

      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
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
            src="/logo/locustprojects1.png"
            alt="La Esquinita at Locust Projects"
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

        <motion.div
          className="text-center mb-16"
          variants={textVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-miami-pink mb-8 leading-tight">
            LA ESQUINITA (Little Corner)
          </h2>
          <p className="text-xl md:text-2xl font-light text-white mb-6 leading-relaxed">
            The first major solo exhibition by Miami-born artist and musician Tara Long.
          </p>
          <p className="text-lg md:text-xl text-gray-100 mb-4 leading-relaxed">
            Transforming the gallery&apos;s interior and exterior into a surreal &quot;Sweets & Souvenirs&quot; shop of over 500 miniature sculptures,
            Long stages a candy-coated critique of consumerism and cultural decay.
          </p>
          <p className="text-lg md:text-xl text-gray-100 mb-4 leading-relaxed">
            Visitors move from a playful storefront into an immersive dreamscape—a teetering, 20-foot cake under a glowing moon lightbox—accompanied
            by a haunting original score.
          </p>
          <p className="text-lg md:text-xl text-gray-100 mb-4 leading-relaxed">
            The installation culminates in a lush &quot;swamp-scape&quot; where nature overtakes the artificial, evoking Florida&apos;s ecological
            and cultural precarity.
          </p>
          <p className="text-lg md:text-xl text-white italic leading-relaxed">
            Curated by Executive Director Lorie Mertes, &quot;LA ESQUINITA&quot; blurs fantasy and critique, tracing Miami&apos;s transformation
            from sugar fields to tech hub while inviting reflection on indulgence, loss, and reclamation.
          </p>
          <p className="text-sm md:text-base text-gray-300 mt-8 leading-relaxed">
            La Esquinita is commissioned by Locust Projects and supported in part with a grant from Funding Arts Network.
          </p>
        </motion.div>

        <motion.div
          className="bg-miami-pink/10 backdrop-blur-sm p-8 rounded-lg mb-16 border border-miami-pink/30"
          variants={textVariants}
        >
          <h2 className="text-3xl font-bold mb-6 text-miami-pink">
            Artist Statement
          </h2>
          <p className="text-white mb-4">
            <strong>LA ESQUINITA</strong> is a sugar-laced parable about power.
          </p>
          <p className="text-gray-100 mb-4">
            Sugar—once Florida&apos;s economic engine—remains a potent symbol of over-indulgence, colonization
            and bodily harm. I merge that history with contemporary tech-led displacement: both promise
            progress, both leave chasms in place of community.
          </p>
          <p className="text-white mb-4">
            <strong>Visitors experience three acts:</strong>
          </p>
          <div className="space-y-3 text-gray-100 mb-4">
            <p>
              <strong className="text-white">1. Facade & Storefront (Seduction)</strong> – A corner-store mural blends bodega graphics with dripping
              icing. Inside, flawless candy-merch seduces buyers.
            </p>
            <p>
              <strong className="text-white">2. Backstage (Exposure)</strong> – A hidden door reveals consumption&apos;s darker appetite. A monumental
              cake resembles a toppled condo; performers embody female archetypes—Sweetheart, Siren,
              Fury—surfacing from its cavities.
            </p>
            <p>
              <strong className="text-white">3. Speakeasy (Collapse / Rebirth)</strong> - The rear lounge, overrun by swamp life, underscores nature&apos;s
              primacy and resilience.
            </p>
          </div>
          <p className="text-gray-100">
            Narrative threads connect macro (land use, capital) to micro (gut bacteria, gendered &quot;sweetness&quot;)
            while asserting that progress, like sugar, ferments.
          </p>
          <p className="text-gray-100 mt-4 text-right italic">
            Tara Long, September 2025
          </p>
        </motion.div>

        <motion.div
          className="text-center mb-16"
          variants={textVariants}
        >
          <h2 className="text-2xl font-light mb-6 text-miami-cyan tracking-wide">
            Artist Bio
          </h2>
          <p className="text-gray-100 italic leading-relaxed">
            Tara Long (b. 1984, Miami) transforms vernacular and popular iconography into immersive allegories. Raised in Miami's cultural cross-currents—and a survivor of personal tragedy—Long's practice spans installation, performance, and sound, exploring how communities metabolize trauma and change. Previous work includes underground left-field pop persona Poorgrrrl and collaborative exhibitions across South Florida. She has shown work and performed at Moma PS1, ICA and the PAMM in Miami. Long holds a studio at Bakehouse Art Complex. LA ESQUINITA is her first major solo institutional exhibition.
          </p>
        </motion.div>

      </motion.div>
    </div>
  )
} 