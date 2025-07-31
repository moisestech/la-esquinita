"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Bell, Shield, Palette, Globe, Moon, Sun, ArrowLeft, Save, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import FloatingSprinkles from "@/components/storefront/floating-sprinkles"

export default function SettingsPage() {
  const [fontLoaded, setFontLoaded] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      marketing: true,
      orderUpdates: true
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      allowMessages: true
    },
    appearance: {
      theme: "light",
      fontSize: "medium",
      animations: true
    },
    language: "en",
    currency: "USD"
  })
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)

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

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => {
      const categoryValue = prev[category as keyof typeof prev]
      if (typeof categoryValue === 'object' && categoryValue !== null) {
        return {
          ...prev,
          [category]: {
            ...categoryValue,
            [key]: value
          }
        }
      }
      return prev
    })
  }

  const handleSaveSettings = () => {
    console.log("Settings saved:", settings)
    // Mock save functionality
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!")
      return
    }
    console.log("Password changed")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
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
              Settings
            </motion.h1>
            <p className="text-mint-rot/70">Customize your Miami kitsch experience</p>
          </motion.div>

          <div className="space-y-8">
            {/* Notifications Settings */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-miami-pink/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-6 h-6 text-miami-pink" />
                <h3 className="text-2xl font-semibold text-mint-rot">Notifications</h3>
              </div>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-mint-rot capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-sm text-mint-rot/60">
                        {key === 'email' && 'Receive email notifications'}
                        {key === 'push' && 'Get push notifications on your device'}
                        {key === 'marketing' && 'Receive promotional emails and offers'}
                        {key === 'orderUpdates' && 'Get updates about your orders'}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => handleSettingChange('notifications', key, !value)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-miami-pink' : 'bg-gray-300'
                      }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Privacy Settings */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-miami-pink/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-miami-blue" />
                <h3 className="text-2xl font-semibold text-mint-rot">Privacy</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-mint-rot mb-2">Profile Visibility</label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                {Object.entries(settings.privacy).slice(1).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-mint-rot capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-sm text-mint-rot/60">
                        {key === 'showEmail' && 'Allow others to see your email address'}
                        {key === 'allowMessages' && 'Allow other users to send you messages'}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => handleSettingChange('privacy', key, !value)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-miami-blue' : 'bg-gray-300'
                      }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Appearance Settings */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-miami-pink/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Palette className="w-6 h-6 text-miami-yellow" />
                <h3 className="text-2xl font-semibold text-mint-rot">Appearance</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-mint-rot mb-2">Theme</label>
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                        settings.appearance.theme === 'light' 
                          ? 'border-miami-pink bg-miami-pink/10' 
                          : 'border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                        settings.appearance.theme === 'dark' 
                          ? 'border-miami-pink bg-miami-pink/10' 
                          : 'border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </motion.button>
                  </div>
                </div>
                
                <div>
                  <label className="block font-medium text-mint-rot mb-2">Font Size</label>
                  <select
                    value={settings.appearance.fontSize}
                    onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-mint-rot">Animations</p>
                    <p className="text-sm text-mint-rot/60">Enable smooth animations and transitions</p>
                  </div>
                  <motion.button
                    onClick={() => handleSettingChange('appearance', 'animations', !settings.appearance.animations)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.appearance.animations ? 'bg-miami-yellow' : 'bg-gray-300'
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.appearance.animations ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Password Change */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-miami-pink/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-semibold text-mint-rot mb-6">Change Password</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-mint-rot mb-2">Current Password</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mint-rot/50 hover:text-mint-rot transition-colors"
                  >
                    {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-mint-rot mb-2">New Password</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all pr-12"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-mint-rot mb-2">Confirm New Password</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-miami-pink/30 rounded-xl bg-white/80 focus:outline-none focus:border-miami-pink transition-all pr-12"
                    placeholder="Confirm new password"
                  />
                </div>
                
                <motion.button
                  onClick={handlePasswordChange}
                  className="w-full bg-gradient-to-r from-miami-pink to-miami-blue text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Change Password
                </motion.button>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button
                onClick={handleSaveSettings}
                className="flex items-center space-x-2 mx-auto bg-gradient-to-r from-miami-pink to-miami-blue text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="w-5 h-5" />
                <span>Save All Settings</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 