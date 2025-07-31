"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, MapPin, Edit, Camera, ArrowLeft } from "lucide-react"
import Link from "next/link"
import FloatingSprinkles from "@/components/storefront/floating-sprinkles"

export default function ProfilePage() {
  const [fontLoaded, setFontLoaded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Miami Kitsch Lover",
    email: "miami@example.com",
    phone: "+1 (305) 555-0123",
    location: "Miami Beach, FL",
    bio: "Passionate collector of all things Miami kitsch and lover of vibrant colors! 🌴✨",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  })

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

  const handleSave = () => {
    setIsEditing(false)
    // Mock save functionality
    console.log("Profile saved:", profileData)
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
      <div className="relative z-10 pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl font-bold text-mint-rot mb-2"
              style={{
                fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
              }}
            >
              My Profile
            </motion.h1>
            <p className="text-mint-rot/70">Manage your Miami kitsch account</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              className="md:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-miami-pink/20">
                {/* Avatar Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-miami-pink/30"
                    />
                    <motion.button
                      className="absolute bottom-0 right-0 p-2 bg-miami-pink rounded-full text-white hover:bg-miami-blue transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Camera className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <h2 className="text-xl font-semibold text-mint-rot mt-4">{profileData.name}</h2>
                  <p className="text-mint-rot/60 text-sm">Miami Kitsch Enthusiast</p>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-miami-pink/10 rounded-lg">
                    <span className="text-mint-rot">Orders</span>
                    <span className="font-semibold text-miami-pink">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-miami-blue/10 rounded-lg">
                    <span className="text-mint-rot">Favorites</span>
                    <span className="font-semibold text-miami-blue">8</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-miami-yellow/10 rounded-lg">
                    <span className="text-mint-rot">Reviews</span>
                    <span className="font-semibold text-miami-yellow">5</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Profile Details */}
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-miami-pink/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-mint-rot">Profile Information</h3>
                  <motion.button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 px-4 py-2 bg-miami-pink text-white rounded-lg hover:bg-miami-blue transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit className="w-4 h-4" />
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-mint-rot">
                      <User className="w-4 h-4" />
                      <span>Full Name</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-miami-pink/10 rounded-xl text-mint-rot">{profileData.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-mint-rot">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-miami-pink/10 rounded-xl text-mint-rot">{profileData.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-mint-rot">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-miami-pink/10 rounded-xl text-mint-rot">{profileData.phone}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-mint-rot">
                      <MapPin className="w-4 h-4" />
                      <span>Location</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-miami-pink/10 rounded-xl text-mint-rot">{profileData.location}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-mint-rot">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all resize-none"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-miami-pink/10 rounded-xl text-mint-rot">{profileData.bio}</p>
                    )}
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <motion.button
                      onClick={handleSave}
                      className="w-full bg-gradient-to-r from-miami-pink to-miami-blue text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Save Changes
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 