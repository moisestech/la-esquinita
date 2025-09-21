"use client"

import { motion } from "framer-motion"
import { Download, Mail, CreditCard, Building, Code, Palette, Smartphone, Database, Globe, Zap } from "lucide-react"

export default function InvoiceDisplay() {
  const invoiceData = {
    invoiceNumber: "2",
    date: "08/30/2025",
    clientName: "Moises Sanabria",
    address: "1500 Bay Rd, Apt 572S South Tower",
    city: "Miami Beach, FL, 33139",
    phone: "954-588-4680",
    totalHours: 40,
    hourlyRate: 50,
    totalAmount: 2000,
    originalValue: 6000,
    savings: 4000,
    services: [
      // Core Infrastructure
      "Next.js 15 App Router setup with TypeScript configuration",
      "Complete project architecture with organized component structure",
      "Tailwind CSS integration with custom Miami kitsch design system",
      "Supabase database setup with PostgreSQL and Row Level Security",
      "Environment configuration and deployment setup for Vercel",
      
      // Design System & UI Components
      "Custom Miami kitsch color palette with neon effects and animations",
      "Skeleton Blood font integration with custom typography system",
      "shadcn/ui component library integration and customization",
      "Responsive design system for mobile, tablet, and desktop",
      "Custom animations: sprinkle effects, neon pulses, palm sway, candy shimmer",
      
      // 3D Graphics & Interactive Elements
      "Three.js integration with React Three Fiber for 3D experiences",
      "3D model loading system with performance optimization",
      "3D fallback system for graceful degradation",
      "Interactive 3D sugar cubes with drag functionality",
      "3D testing environment with model selector and performance monitor",
      
      // Storefront & E-commerce
      "Complete storefront page with Miami kitsch aesthetic",
      "Product grid with 12 Miami kitsch products and responsive layout",
      "Product cards with hover effects, sprinkle animations, and neon borders",
      "Product detail pages with dynamic routing and image galleries",
      "Cart system with drawer interface and state management",
      "Coupon system with validation, discount calculation, and database integration",
      
      // User Experience & Navigation
      "Global cart context with persistent state management",
      "Toast notification system for user feedback",
      "Responsive navigation with mobile hamburger menu",
      "User authentication pages (login, register, profile, settings, favorites)",
      "User menu with authentication state management",
      "Breadcrumb navigation for product detail pages",
      
      // Content Management & Features
      "Newsletter subscription system with modal interface",
      "Events page with event management and RSVP functionality",
      "About page with 3D logo and Skeleton Blood font",
      "Contact page with contact form and information",
      "Hidden door functionality with secret code access",
      "Sugar-icing marquee with animated scrolling text",
      
      // Database & Backend
      "Supabase database schema with products, events, and newsletter tables",
      "Row Level Security policies for data protection",
      "Database functions for coupon validation and usage tracking",
      "Real-time data synchronization capabilities",
      "Error handling and validation throughout the application",
      
      // Performance & Optimization
      "Image optimization with responsive sizing and lazy loading",
      "Bundle size optimization and code splitting",
      "Mobile performance optimization with touch interactions",
      "SEO optimization with meta tags and structured data",
      "Accessibility improvements and keyboard navigation",
      
      // Integration & Deployment
      "GoDaddy domain integration with laesquinita.miami",
      "Vercel deployment configuration and optimization",
      "Cloudinary image hosting and optimization",
      "Environment variable management and security",
      "Git version control with organized commit history"
    ],
    paymentMethods: [
      { name: "Check", icon: Building },
      { name: "Venmo", icon: CreditCard },
      { name: "Zelle", icon: CreditCard },
      { name: "PayPal", icon: CreditCard },
      { name: "Direct Deposit", icon: Building }
    ],
    bankInfo: {
      bank: "Bank of America",
      accountNumber: "229039208722",
      routingNumber: "063100277"
    },
    technicalSpecs: [
      { category: "Frontend", items: ["Next.js 15", "React 18", "TypeScript", "Tailwind CSS", "Framer Motion"] },
      { category: "3D Graphics", items: ["Three.js", "React Three Fiber", "WebGL", "3D Model Loading"] },
      { category: "Backend", items: ["Supabase", "PostgreSQL", "Row Level Security", "Real-time Sync"] },
      { category: "Deployment", items: ["Vercel", "Cloudinary", "GoDaddy Domain", "Environment Config"] },
      { category: "Design", items: ["Miami Kitsch Aesthetic", "Custom Fonts", "Neon Effects", "Responsive Design"] }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-mint-rot mb-4">
            Professional Development Invoice
          </h1>
          <p className="text-xl text-mint-rot/80">
            La Esquinita - Miami Artistic Convenience Store
          </p>
          <p className="text-lg text-mint-rot/70 mt-2">
            Complete Full-Stack Web Application Development
          </p>
        </motion.div>

        {/* Invoice Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl border-2 border-miami-pink/20 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-miami-pink to-miami-purple text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">INVOICE</h2>
                <p className="text-white/80">La Esquinita Development Services</p>
                <p className="text-white/70 text-sm">Full-Stack Web Application</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80">Invoice #</p>
                <p className="text-2xl font-bold">{invoiceData.invoiceNumber}</p>
                <p className="text-sm text-white/80">Date: {invoiceData.date}</p>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-mint-rot mb-3">Bill To:</h3>
            <div className="space-y-1">
              <p className="font-medium">{invoiceData.clientName}</p>
              <p className="text-gray-600">{invoiceData.address}</p>
              <p className="text-gray-600">{invoiceData.city}</p>
              <p className="text-gray-600">Phone: {invoiceData.phone}</p>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-mint-rot mb-4">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {invoiceData.technicalSpecs.map((spec, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    {spec.category === "Frontend" && <Code className="w-4 h-4 mr-2 text-miami-pink" />}
                    {spec.category === "3D Graphics" && <Palette className="w-4 h-4 mr-2 text-miami-pink" />}
                    {spec.category === "Backend" && <Database className="w-4 h-4 mr-2 text-miami-pink" />}
                    {spec.category === "Deployment" && <Globe className="w-4 h-4 mr-2 text-miami-pink" />}
                    {spec.category === "Design" && <Smartphone className="w-4 h-4 mr-2 text-miami-pink" />}
                    {spec.category}
                  </h4>
                  <ul className="space-y-1">
                    {spec.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                        <span className="text-miami-pink mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Services Rendered */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-mint-rot mb-4">
              Complete Development Services Rendered
            </h3>
            <p className="text-gray-600 mb-4">
              Comprehensive full-stack web application development for La Esquinita, including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {invoiceData.services.map((service, index) => (
                <motion.li
                  key={index}
                  className="flex items-start space-x-3 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                >
                  <span className="text-miami-pink text-lg mt-0.5">•</span>
                  <span className="text-gray-700">{service}</span>
                </motion.li>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Pricing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Project Value</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Original Project Value:</span>
                    <span className="line-through text-gray-500">${invoiceData.originalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Special Discount Applied:</span>
                    <span className="text-red-600">-${invoiceData.savings.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Final Project Price:</span>
                      <span className="text-miami-pink">${invoiceData.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Development Time</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Development Hours:</span>
                    <span>{invoiceData.totalHours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hourly Development Rate:</span>
                    <span>${invoiceData.hourlyRate}/hour</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Standard Rate Total:</span>
                      <span>${(invoiceData.totalHours * invoiceData.hourlyRate).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-mint-rot mb-4">Payment Information</h3>
            
            {/* Payment Methods */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Accepted Payment Methods:</h4>
              <div className="flex flex-wrap gap-3">
                {invoiceData.paymentMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <method.icon className="w-4 h-4 text-miami-pink" />
                    <span className="text-sm font-medium">{method.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bank Information */}
            <div className="bg-gradient-to-r from-miami-pink/10 to-miami-purple/10 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Direct Deposit Information:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Bank:</span>
                  <span>{invoiceData.bankInfo.bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Account Number:</span>
                  <span className="font-mono">{invoiceData.bankInfo.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Routing Number:</span>
                  <span className="font-mono">{invoiceData.bankInfo.routingNumber}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-2">Payment can be made to Moises Sanabria at</p>
              <motion.a
                href="mailto:m@moises.tech"
                className="inline-flex items-center space-x-2 text-miami-pink hover:text-miami-purple transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="w-4 h-4" />
                <span className="font-medium">m@moises.tech</span>
              </motion.a>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-miami-pink to-miami-purple text-white p-6">
            <div className="text-center">
              <p className="text-white/80 text-sm">Total Project Cost</p>
              <p className="text-4xl font-bold">${invoiceData.totalAmount.toFixed(2)}</p>
              <p className="text-white/80 text-sm mt-2">
                Thank you for choosing La Esquinita development services!
              </p>
              <p className="text-white/70 text-xs mt-1">
                A complete full-stack web application with 3D graphics, e-commerce, and Miami kitsch aesthetic
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex justify-center space-x-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className="flex items-center space-x-2 bg-miami-pink text-white px-6 py-3 rounded-lg font-semibold hover:bg-miami-purple transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice</span>
          </motion.button>
          
          <motion.button
            className="flex items-center space-x-2 bg-miami-cyan text-white px-6 py-3 rounded-lg font-semibold hover:bg-miami-blue transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-4 h-4" />
            <span>Email Invoice</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
