"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter } from "lucide-react"

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-rot via-stucco to-icing-white">
      {/* Header */}
      <motion.div
        className="text-center py-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl md:text-8xl font-skeleton text-miami-pink mb-4 drop-shadow-neon-pink">
          Contact
        </h1>
        <p className="text-xl md:text-2xl text-mint-rot font-display max-w-2xl mx-auto">
          Get in touch with us for questions, collaborations, or just to say hello
        </p>
      </motion.div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h2 className="text-3xl font-skeleton text-mint-rot mb-6">
                Visit Us
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-miami-pink mt-1" />
                  <div>
                    <h3 className="font-bold text-mint-rot">Address</h3>
                    <p className="text-mint-rot/70">
                      123 Miami Kitsch Ave<br />
                      Miami, FL 33101
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-miami-pink mt-1" />
                  <div>
                    <h3 className="font-bold text-mint-rot">Hours</h3>
                    <p className="text-mint-rot/70">
                      Monday - Sunday<br />
                      10:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-miami-pink mt-1" />
                  <div>
                    <h3 className="font-bold text-mint-rot">Phone</h3>
                    <p className="text-mint-rot/70">(305) 555-0123</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-miami-pink mt-1" />
                  <div>
                    <h3 className="font-bold text-mint-rot">Email</h3>
                    <p className="text-mint-rot/70">hello@laesquinita.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h2 className="text-3xl font-skeleton text-mint-rot mb-6">
                Follow Us
              </h2>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="w-12 h-12 bg-miami-pink text-white rounded-full flex items-center justify-center hover:bg-miami-purple transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Instagram className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-12 h-12 bg-miami-pink text-white rounded-full flex items-center justify-center hover:bg-miami-purple transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Facebook className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-12 h-12 bg-miami-pink text-white rounded-full flex items-center justify-center hover:bg-miami-purple transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Twitter className="w-6 h-6" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 border-2 border-sugar-pink"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-skeleton text-mint-rot mb-6">
              Send us a Message
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-mint-rot mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 border-2 border-sugar-pink rounded-lg focus:border-miami-pink focus:outline-none"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-mint-rot mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-3 border-2 border-sugar-pink rounded-lg focus:border-miami-pink focus:outline-none"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-mint-rot mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border-2 border-sugar-pink rounded-lg focus:border-miami-pink focus:outline-none"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-mint-rot mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-3 border-2 border-sugar-pink rounded-lg focus:border-miami-pink focus:outline-none"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="products">Product Questions</option>
                  <option value="events">Event Information</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-mint-rot mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-sugar-pink rounded-lg focus:border-miami-pink focus:outline-none resize-none"
                  placeholder="Tell us what's on your mind..."
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-miami-pink to-miami-purple text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 