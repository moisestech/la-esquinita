import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { CartProvider } from '@/contexts/cart-context'

export const metadata: Metadata = {
  title: 'La Esquinita',
  description: 'La Esquinita by Tara Long, Locust Projects 2025',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full m-0 p-0">
        <CartProvider>
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
