"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import FloatingSprinkles from "@/components/storefront/floating-sprinkles"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fontLoaded, setFontLoaded] = useState(false)

  // Add font loading effect
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'SkeletonBlood'
        src: url('/fonts/skeleton-blood.woff2') format('woff2'),
             url('/fonts/skeleton-blood.woff') format('woff'),
             url('/fonts/skeleton-blood.ttf') format('truetype'),
             url('/fonts/skeleton-blood.otf') format('opentype')
        font-weight: normal
        font-style: normal
        font-display: swap
      }
    `
    document.head.appendChild(style)
    
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        setFontLoaded(true)
      })
    } else {
      setFontLoaded(true)
    }
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock successful registration
    console.log("Registration attempt:", formData)
    setIsLoading(false)
    
    // For now, just show a success message
    alert("Registration functionality coming soon! This is a mock page.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue relative overflow-hidden">
      {/* Floating Elements */}
      <FloatingSprinkles />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff66bb' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Back Button */}
      <motion.div
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/">
          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-mint-rot hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img
                src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892032/la-esquinita/LE-logo-tara_jdjyo9.png"
                alt="La Esquinita"
                className="h-16 w-auto"
              />
            </motion.div>
            <motion.h1
              className="text-3xl font-bold text-mint-rot mb-2"
              style={{
                fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Join the Party
            </motion.h1>
            <motion.p
              className="text-mint-rot/70"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Create your Miami kitsch account
            </motion.p>
          </div>

          {/* Register Form */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-miami-pink/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-mint-rot">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mint-rot/50" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-miami-pink focus:bg-white transition-all duration-300 placeholder-mint-rot/50 text-mint-rot"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-mint-rot">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mint-rot/50" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-miami-pink focus:bg-white transition-all duration-300 placeholder-mint-rot/50 text-mint-rot"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-mint-rot">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mint-rot/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-miami-pink focus:bg-white transition-all duration-300 placeholder-mint-rot/50 text-mint-rot"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mint-rot/50 hover:text-mint-rot transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-mint-rot">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mint-rot/50" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-miami-pink focus:bg-white transition-all duration-300 placeholder-mint-rot/50 text-mint-rot"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mint-rot/50 hover:text-mint-rot transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 text-miami-pink border-miami-pink/30 rounded focus:ring-miami-pink"
                  required
                />
                <label className="text-sm text-mint-rot">
                  I agree to the{" "}
                  <Link href="/terms" className="text-miami-pink hover:text-miami-blue transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-miami-pink hover:text-miami-blue transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-miami-pink to-miami-blue text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-miami-pink/20"></div>
              <span className="px-4 text-sm text-mint-rot/60">or</span>
              <div className="flex-1 border-t border-miami-pink/20"></div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-mint-rot/70">
                Already have an account?{" "}
                <Link href="/login" className="text-miami-pink hover:text-miami-blue transition-colors font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 text-2xl animate-sprinkle">
            🌴
          </div>
          <div className="absolute -bottom-4 -left-4 text-xl animate-sprinkle" style={{ animationDelay: "1s" }}>
            ✨
          </div>
        </motion.div>
      </div>
    </div>
  )
} 