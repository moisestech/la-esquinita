"use client"

import { motion } from "framer-motion"
import { Wine, Clock, Users, MapPin } from "lucide-react"

export default function MosquitoBar() {
  return (
    <div className="min-h-screen bg-black">
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
          <Wine className="w-16 h-16 text-miami-pink" />
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-neon-pink">
          Mosquito Lounge
        </h1>
        <p className="text-xl md:text-2xl text-white font-display max-w-2xl mx-auto">
          The secret speakeasy hidden within La Esquinita
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <motion.div
            className="relative overflow-hidden rounded-2xl shadow-2xl mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src="/mosquitobar.jpg"
              alt="Mosquito Lounge Cocktails"
              className="w-full h-96 md:h-[600px] object-cover"
            />
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Wine className="w-8 h-8 text-miami-pink mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Craft Cocktails</h4>
              <p className="text-white/80 text-sm">
                Inspired by Miami's Swamp Consumption
              </p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Clock className="w-8 h-8 text-miami-yellow mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Weekend Hours</h4>
              <p className="text-white/80 text-sm">
                Open late for the Miami Night Owls
              </p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Users className="w-8 h-8 text-miami-cyan mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Intimate Setting</h4>
              <p className="text-white/80 text-sm">
                Hidden speakeasy for close gatherings
              </p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <MapPin className="w-8 h-8 text-miami-pink mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Secret Location</h4>
              <p className="text-white/80 text-sm">
                Find the hidden entrance at La Esquinita
              </p>
            </motion.div>
          </div>

          {/* Coming Soon Text */}
          <motion.div
            className="text-center mt-8 mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-white/60 italic text-lg">
              Details and hours of service coming soon...
            </p>
          </motion.div>

        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 text-4xl opacity-30"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          🦟
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 text-3xl opacity-20"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🍸
        </motion.div>
      </div>
    </div>
  )
}