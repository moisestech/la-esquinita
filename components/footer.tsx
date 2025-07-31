"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Instagram, Facebook, MapPin, Clock } from "lucide-react"

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