"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag } from "lucide-react"
import CartDrawer from "./storefront/cart-drawer"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])

  const navItems = [
    { href: "/storefront", label: "Storefront" },
    { href: "/cake-hall", label: "Cake Hall" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-miami-pink/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center md:flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892032/la-esquinita/LE-logo-tara_jdjyo9.png"
                  alt="La Esquinita"
                  className="h-8 w-auto"
                />
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8 md:flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-mint-rot hover:text-miami-pink transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center justify-end space-x-4 md:flex-1">
            <motion.button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/90 border border-miami-pink/40 rounded-full text-mint-rot hover:text-miami-pink hover:bg-miami-pink/10 transition-all relative shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-semibold text-sm uppercase tracking-wide">Checkout</span>
              {cartItems.length > 0 && (
                <span className="bg-miami-pink text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  {cartItems.length}
                </span>
              )}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-mint-rot hover:text-miami-pink transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-miami-pink/20"
            >
              <div className="py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-mint-rot hover:text-miami-pink transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex items-center pt-4 border-t border-miami-pink/20">
                  <button
                    onClick={() => {
                      setIsCartOpen(true)
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 border border-miami-pink/40 rounded-full text-mint-rot hover:text-miami-pink hover:bg-miami-pink/10 transition-all relative shadow-md w-full justify-center"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="font-semibold text-sm uppercase tracking-wide">Checkout</span>
                    {cartItems.length > 0 && (
                      <span className="bg-miami-pink text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </nav>
  )
} 
