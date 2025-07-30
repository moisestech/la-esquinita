"use client"

import dynamicImport from 'next/dynamic'

// Dynamically import the 3D test page to prevent SSR issues
const ThreeDTestPage = dynamicImport(
  () => import("@/components/3d-test/three-d-test-page"),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-mint-rot via-stucco to-icing-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-miami-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-mint-rot font-skeleton text-lg">Loading 3D Testing Lab...</p>
        </div>
      </div>
    )
  }
)

export default function ThreeDTest() {
  return <ThreeDTestPage />
} 