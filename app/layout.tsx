import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'La Esquinita',
  description: 'La Esquinita by Tara Long, Locust Projects 2025',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full m-0 p-0">
        {children}
      </body>
    </html>
  )
}
