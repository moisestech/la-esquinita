"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min

const generateMosquitoPosition = () => ({
  top: `${randomBetween(5, 85)}vh`,
  left: `${randomBetween(5, 90)}vw`,
  rotate: randomBetween(-25, 25),
})

export default function FloatingMosquitoLink() {
  const controls = useAnimation()
  const initialPosition = { top: "50vh", left: "10vw", rotate: 0 }

  useEffect(() => {
    let isMounted = true

    const glideAcrossScreen = async () => {
      while (isMounted) {
        const nextPosition = generateMosquitoPosition()
        await controls.start({
          ...nextPosition,
          transition: {
            duration: randomBetween(10, 16),
            ease: "easeInOut",
          },
        })
      }
    }

    glideAcrossScreen()

    return () => {
      isMounted = false
      controls.stop()
    }
  }, [controls])

  return (
    <motion.a
      href="/mosquito-bar"
      aria-label="Visit the Mosquito Lounge"
      className="fixed z-40 text-6xl pointer-events-auto"
      initial={initialPosition}
      animate={controls}
      whileHover={{ scale: 1.2, rotate: 0 }}
      whileTap={{ scale: 0.9 }}
    >
      🦟
    </motion.a>
  )
}
