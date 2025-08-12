"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Instagram, Facebook, MapPin, Clock, Sparkles } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-mint-rot via-stucco to-icing-white border-t-2 border-miami-pink/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <div className="flex items-center mb-4">
              <img
                src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892032/la-esquinita/LE-logo-tara_jdjyo9.png"
                alt="La Esquinita"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-700 mb-4">
              An immersive exploration of Miami's cultural intersections and suburban mythology 
              through crystalline sugar sculptures and mixed media installations.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="text-miami-pink hover:text-miami-cyan transition-colors"
              >
                <Instagram size={24} />
              </motion.a>
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="text-miami-pink hover:text-miami-cyan transition-colors"
              >
                <Facebook size={24} />
              </motion.a>
              <motion.a
                href="mailto:info@laesquinita.com"
                whileHover={{ scale: 1.1 }}
                className="text-miami-pink hover:text-miami-cyan transition-colors"
              >
                <Mail size={24} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-miami-pink mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-700 hover:text-miami-pink transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 hover:text-miami-pink transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/storefront" className="text-gray-700 hover:text-miami-pink transition-colors">
                  Storefront
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-700 hover:text-miami-pink transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-miami-pink transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-miami-pink mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-miami-pink" />
                <span className="text-gray-700">Miami, FL</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-miami-pink" />
                <span className="text-gray-700">By Appointment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-miami-pink" />
                <a href="mailto:info@laesquinita.com" className="text-gray-700 hover:text-miami-pink transition-colors">
                  info@laesquinita.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sponsor Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t-2 border-miami-pink/30"
        >
          <div className="text-center">
            <motion.div
              className="flex items-center justify-center space-x-2 mb-4"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-miami-pink"
              >
                <Sparkles size={20} />
              </motion.div>
              <span className="text-lg font-semibold text-miami-pink">Thank You to Our Sponsor</span>
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-miami-pink"
              >
                <Sparkles size={20} />
              </motion.div>
            </motion.div>
            
            <motion.div
              className="flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.a
                href="https://locustprojects.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="relative"
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(236, 72, 153, 0.4)",
                      "0 0 20px rgba(236, 72, 153, 0.6)",
                      "0 0 0 rgba(236, 72, 153, 0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <img
                    src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1755037354/locust-projects/logo-LocustProjects_gsc87t.png"
                    alt="Locust Projects - Our Generous Sponsor"
                    className="h-16 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.div>
                
                {/* Floating sparkles around the logo */}
                <motion.div
                  className="absolute -top-2 -left-2 text-miami-pink"
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  <Sparkles size={12} />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 text-miami-cyan"
                  animate={{ 
                    y: [0, -8, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkles size={10} />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -left-1 text-miami-pink"
                  animate={{ 
                    y: [0, -6, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Sparkles size={8} />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -right-2 text-miami-cyan"
                  animate={{ 
                    y: [0, -12, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                >
                  <Sparkles size={14} />
                </motion.div>
              </motion.a>
            </motion.div>
            
            <motion.p
              className="text-gray-600 mt-4 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Special thanks to <span className="font-semibold text-miami-pink">Locust Projects</span> for their generous support 
              in making this digital experience possible.
            </motion.p>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-miami-pink/20 mt-8 pt-8 text-center"
        >
          <p className="text-gray-600 text-sm">
            © 2025 La Esquinita. All rights reserved. | 
            <Link href="/privacy" className="hover:text-miami-pink transition-colors ml-1">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </footer>
  )
} 