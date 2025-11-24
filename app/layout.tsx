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
  openGraph: {
    title: 'La Esquinita',
    description: 'La Esquinita by Tara Long, Locust Projects 2025',
    url: 'https://www.laesquinita.miami',
    siteName: 'La Esquinita',
    images: [
      {
        url: '/front.jpg',
        width: 1200,
        height: 630,
        alt: 'La Esquinita at Locust Projects',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Esquinita',
    description: 'La Esquinita by Tara Long, Locust Projects 2025',
    images: ['/front.jpg'],
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
