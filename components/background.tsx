"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const floatingObjects = [
  {
    src: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/object-bag_eyaj57.png",
    alt: "Bag",
    initialX: -100,
    initialY: -50,
    animateX: 100,
    animateY: 50,
    duration: 8,
  },
  {
    src: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/object-banana_d4tckn.png",
    alt: "Banana",
    initialX: 100,
    initialY: -100,
    animateX: -100,
    animateY: 100,
    duration: 10,
  },
  {
    src: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/object-candy_u5cxeb.png",
    alt: "Candy",
    initialX: -150,
    initialY: 100,
    animateX: 150,
    animateY: -100,
    duration: 12,
  },
  {
    src: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918385/la-esquinita/object-bottle_hq76dx.png",
    alt: "Bottle",
    initialX: 150,
    initialY: 50,
    animateX: -150,
    animateY: -50,
    duration: 9,
  },
  {
    src: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918385/la-esquinita/object-cig-pack_fl1nii.png",
    alt: "Cigarette Pack",
    initialX: -50,
    initialY: -150,
    animateX: 50,
    animateY: 150,
    duration: 11,
  },
]

export default function Background() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Rock Pattern Background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url(https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/bg-rocks-color_ikxdem.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Floating Objects */}
      <div className="relative w-full h-full">
        {floatingObjects.map((object, index) => (
          <motion.div
            key={object.alt}
            className="absolute"
            initial={{ 
              x: object.initialX, 
              y: object.initialY,
              scale: 1,
              rotate: 0
            }}
            animate={{ 
              x: object.animateX, 
              y: object.animateY,
              scale: 1,
              rotate: 360
            }}
            transition={{
              duration: object.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            whileHover={{
              scale: 1.2,
              rotate: 0,
              transition: { duration: 0.3 }
            }}
          >
            <Image
              src={object.src}
              alt={object.alt}
              width={100}
              height={100}
              className="object-contain"
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
} 