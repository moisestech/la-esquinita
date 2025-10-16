"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Instagram, MapPin, Clock } from "lucide-react"

interface FooterProps {
  photographerName?: string;
}

export default function Footer({ photographerName }: FooterProps = {}) {
  return (
    <footer className="bg-gradient-to-r from-mint-rot via-stucco to-icing-white border-t-2 border-miami-pink/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              A 2,500 sq ft walk-through installation confronting Miami's cycles of exploitation—from "Big Sugar" to Big Tech—and asking who really owns progress.
            </p>
            <div className="flex flex-col items-start space-y-4">
              <div className="flex space-x-4">
                <motion.a
                  href="https://www.instagram.com/taralong.overdraft.fee/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="text-miami-pink hover:text-miami-cyan transition-colors"
                >
                  <Instagram size={24} />
                </motion.a>
                <motion.a
                  href="mailto:egodeathllc@gmail.com"
                  whileHover={{ scale: 1.1 }}
                  className="text-miami-pink hover:text-miami-cyan transition-colors"
                >
                  <Mail size={24} />
                </motion.a>
              </div>

              <motion.a
                href="https://locustprojects.org"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="block"
              >
                <img
                  src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1755037354/locust-projects/logo-LocustProjects_gsc87t.png"
                  alt="Locust Projects"
                  className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </motion.a>
            </div>
          </motion.div>


          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-miami-pink mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-miami-pink mt-1" />
                <span className="text-gray-700">
                  297 NE 67th St<br />
                  Miami, FL 33138
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-miami-pink" />
                <span className="text-gray-700">See Gallery Hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-miami-pink" />
                <a href="mailto:egodeathllc@gmail.com" className="text-gray-700 hover:text-miami-pink transition-colors">
                  egodeathllc@gmail.com
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
          className="border-t border-miami-pink/20 mt-8 pt-8 text-center space-y-2"
        >
          <p className="text-gray-600 text-sm">
             La Esquinita is commissioned by Locust Projects and supported in part with a grant from Funding Arts Network.
          </p>
          <p className="text-gray-600 text-sm">
            © 2025 Ego Death LLC. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
} 