"use client"

import Link from "next/link"
import { motion } from "framer-motion"

type Props = {
  reason?: string | null
}

export default function CheckoutFailureScreen({ reason }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-icing-white via-sugar-pink to-fondant-blue flex items-center justify-center px-4">
      <motion.div
        className="max-w-xl w-full bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-red-200 p-8 space-y-6 text-center"
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
            😞
          </motion.span>
          <h1 className="text-3xl font-bold text-mint-rot">Payment didn&apos;t go through</h1>
          <p className="text-mint-rot/70">
            No worries—your cart is still intact. Double-check the tips below and try again.
          </p>
          <p className="text-sm text-miami-pink">
            If you&apos;re on-site, please proceed to the bar and pay for ceramics with the bartender.
          </p>
          {reason && (
            <p className="text-xs uppercase tracking-wide text-red-500">
              {reason}
            </p>
          )}
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-left space-y-2">
          <p className="font-semibold text-red-700">Quick fixes:</p>
          <ul className="text-sm text-red-700/80 list-disc list-inside space-y-1">
            <li>Confirm your card details and billing ZIP.</li>
            <li>Try a different card or Apple Pay if you&apos;re on Safari.</li>
            <li>
              Ping{" "}
              <a href="mailto:hello@laesquinita.com" className="underline">
                hello@laesquinita.com
              </a>{" "}
              if the issue persists.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/storefront"
            className="inline-flex justify-center rounded-full bg-miami-pink text-white px-6 py-3 font-semibold shadow-lg hover:bg-miami-purple transition"
          >
            Return to Storefront
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
