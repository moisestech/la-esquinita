"use client"

import { motion } from "framer-motion"
import { Download, Mail, CreditCard, Building } from "lucide-react"

export default function InvoiceDisplay() {
  const invoiceData = {
    invoiceNumber: "2",
    date: "08/30/2025",
    clientName: "Moises Sanabria",
    address: "1500 Bay Rd, Apt 572S South Tower",
    city: "Miami Beach, FL, 33139",
    phone: "954-588-4680",
    totalHours: 8,
    hourlyRate: 50,
    totalAmount: 600,
    originalValue: 1800,
    savings: 1200,
    services: [
      "Interactive draggable ThreeJS Environment with 3D animated sugar cubes",
      "Background artwork cover image wrapping the environment",
      "Clickable Artwork Product images opening up the Newsletter CTA",
      "Connected Supabase to Vercel Web Application security keys",
      "Saving Newsletter Input Emails to Supabase 'newsletter' table in the Database",
      "Newsletter Input Email validation to avoid email duplication or invalid inputs",
      "GoDaddy laesquinita.miami integration to Vercel Hosting",
      "About Page with 3D Logo and Skeleton-Blood Font",
      "Mobile Friendly responsive design"
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
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-mint-rot mb-4">
            Professional Invoice
          </h1>
          <p className="text-xl text-mint-rot/80">
            La Esquinita - Miami Artistic Convenience Store
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

          {/* Services Rendered */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-mint-rot mb-4">
              Fullstack Services Rendered
            </h3>
            <p className="text-gray-600 mb-4">
              From Mar 13 - Apr 2, Moises Sanabria provided web dev for a 3D interactive website marketing funnel system, including:
            </p>
            <ul className="space-y-2">
              {invoiceData.services.map((service, index) => (
                <motion.li
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <span className="text-miami-pink text-lg">•</span>
                  <span className="text-gray-700">{service}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Pricing Breakdown */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Pricing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Original Value</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span className="line-through text-gray-500">${invoiceData.originalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount Applied:</span>
                    <span className="text-red-600">-${invoiceData.savings.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Final Price:</span>
                      <span className="text-miami-pink">${invoiceData.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Time Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Hours:</span>
                    <span>{invoiceData.totalHours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hourly Rate:</span>
                    <span>${invoiceData.hourlyRate}/hour</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
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
              <p className="text-white/80 text-sm">Total Remaining</p>
              <p className="text-4xl font-bold">${invoiceData.totalAmount.toFixed(2)}</p>
              <p className="text-white/80 text-sm mt-2">
                Thank you for your business!
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
