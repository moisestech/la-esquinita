"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, Heart, User } from "lucide-react"
import CartDrawer from "./storefront/cart-drawer"
import UserMenu from "./user-menu"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const navItems = [
    { href: "/storefront", label: "Storefront" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-miami-pink/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/favorites">
              <motion.button
                className="p-2 text-mint-rot hover:text-miami-pink transition-colors relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className="w-5 h-5" />
              </motion.button>
            </Link>
            <motion.button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-mint-rot hover:text-miami-pink transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-miami-pink text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </motion.button>
            <UserMenu 
              isAuthenticated={isAuthenticated}
              userEmail={userEmail}
              onSignOut={() => setIsAuthenticated(false)}
            />
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
                <div className="flex items-center space-x-4 pt-4 border-t border-miami-pink/20">
                  <button className="p-2 text-mint-rot hover:text-miami-pink transition-colors relative">
                    <Heart className="w-5 h-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-miami-pink text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="p-2 text-mint-rot hover:text-miami-pink transition-colors relative"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-miami-pink text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                  <UserMenu 
                    isAuthenticated={isAuthenticated}
                    userEmail={userEmail}
                    onSignOut={() => setIsAuthenticated(false)}
                  />
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