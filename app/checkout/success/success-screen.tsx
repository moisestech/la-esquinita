"use client"

import Link from "next/link"
import { motion } from "framer-motion"

type Props = {
  orderId?: string | null
  needsShipping?: boolean
}

export default function CheckoutSuccessScreen({ orderId, needsShipping }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue flex items-center justify-center px-4">
      <motion.div
        className="max-w-xl w-full bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-miami-pink/30 p-8 space-y-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center space-y-3">
          <motion.span
            className="text-6xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
          >
            🐜✨
          </motion.span>
          <h1 className="text-3xl md:text-4xl font-bold text-mint-rot">Thank you so much!</h1>
          <p className="text-lg md:text-xl text-mint-rot/90 font-semibold">
            We appreciate your purchase!
          </p>
          {orderId && (
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Reference: <span className="font-semibold text-mint-rot">{orderId}</span>
            </p>
          )}
        </div>

        <div className="bg-fondant-blue/10 border border-fondant-blue/30 rounded-2xl p-5 text-left space-y-3">
          <p className="font-semibold text-mint-rot text-lg">What happens next?</p>
          <ul className="text-sm text-mint-rot/80 space-y-2">
            {needsShipping ? (
              <>
                <li>• We will ship your ceramic within the next week.</li>
                <li>• Expect a tracking number sent to your email within a week.</li>
                <li>• Keep browsing—there are 200+ one-of-ones still live.</li>
              </>
            ) : (
              <>
                <li>• If you're in the gallery, you may take your ceramic with you now!</li>
                <li>• Keep browsing—there are 200+ one-of-ones still live.</li>
              </>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/storefront"
            className="inline-flex justify-center rounded-full bg-miami-pink text-white px-6 py-3 font-semibold shadow-lg hover:bg-miami-purple transition"
          >
            Back to Storefront
          </Link>
          <Link
            href="/"
            className="inline-flex justify-center rounded-full border border-miami-pink/40 text-miami-pink px-6 py-3 font-semibold hover:bg-miami-pink/10 transition"
          >
            Explore Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
