"use client"

import { motion } from "framer-motion"

interface LogoAndSponsorProps {
  className?: string;
  onLogoClick?: () => void;
}

export default function LogoAndSponsor({ className = "", onLogoClick }: LogoAndSponsorProps) {
  return (
    <motion.div
      className={`flex justify-center mb-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.img
        src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1758309726/la-esquinita/la-esquinita-at-locustprojects_oxyhpp.png"
        alt="La Esquinita at Locust Projects"
        className="h-32 md:h-48 w-auto drop-shadow-neon-pink cursor-pointer"
        whileHover={{ 
          scale: 1.1,
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
        onClick={() => {
          console.log("La Esquinita at Locust Projects logo clicked!")
          onLogoClick?.()
        }}
      />
    </motion.div>
  )
}
