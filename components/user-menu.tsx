"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"
import Link from "next/link"

interface UserMenuProps {
  isAuthenticated?: boolean
  userEmail?: string
  onSignOut?: () => void
}

export default function UserMenu({ isAuthenticated = false, userEmail, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)



  return (
    <div className="relative">
      {/* User Button */}
      <motion.button
        onClick={toggleMenu}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-miami-pink to-miami-cyan rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-medium hidden md:block">
          {userEmail?.split('@')[0] || 'User'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-miami-pink to-miami-cyan rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {userEmail?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-sm text-gray-500">{userEmail}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link href="/profile" onClick={closeMenu}>
                <motion.div
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  whileHover={{ x: 4 }}
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Profile</span>
                </motion.div>
              </Link>

              <Link href="/settings" onClick={closeMenu}>
                <motion.div
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  whileHover={{ x: 4 }}
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Settings</span>
                </motion.div>
              </Link>

              <div className="border-t border-gray-100 mt-2 pt-2">
                <motion.button
                  onClick={() => {
                    onSignOut?.()
                    closeMenu()
                  }}
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
                  whileHover={{ x: 4 }}
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span className="text-red-500">Sign Out</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>
    </div>
  )
} 