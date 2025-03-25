"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Center, Environment, useTexture } from "@react-three/drei"
import { useEffect, Suspense, useRef, useState } from "react"
import { useWebGLContext } from "@/lib/webgl-context"
import { extend } from '@react-three/fiber'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import * as THREE from 'three'
import { useFrame } from "@react-three/fiber"

// Extend Three.js with TextGeometry
extend({ TextGeometry })

// Type declarations for textGeometry
declare module '@react-three/fiber' {
  interface ThreeElements {
    textGeometry: any
  }
}

// Create new Text3D component
function Text3D({ text, position }: { text: string, position: [number, number, number] }) {
  const [font, setFont] = useState<any>(null)

  useEffect(() => {
    const loader = new FontLoader()
    loader.load('/fonts/skeleton-blood.json', (loadedFont) => {
      setFont(loadedFont)
    })
  }, [])

  if (!font) return null

  return (
    <Center position={position}>
      <mesh>
        <textGeometry 
          args={[
            text,
            {
              font: font,
              size: 0.5,
              height: 0.1,
              curveSegments: 10,
              bevelEnabled: true,
              bevelOffset: 0,
              bevelSegments: 5,
              bevelSize: 0.02,
              bevelThickness: 0.02
            }
          ]}
        />
        <meshPhysicalMaterial 
          color="hotpink"
          metalness={0}
          roughness={0}
          envMapIntensity={1}
          clearcoat={1}
          transparent={true}
          transmission={0.95}
          opacity={0.7}
          reflectivity={0.2}
        />
      </mesh>
    </Center>
  )
}

// Update FloatingObject component
interface FloatingObjectProps {
  url: string
  position: [number, number, number]
  scale?: number
}

function FloatingObject({ url, position, scale = 2.5 }: FloatingObjectProps) { // Increased default scale
  const texture = useTexture(url)
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0])

  useFrame((state) => {
    setRotation([
      Math.sin(state.clock.elapsedTime * 0.5) * 0.1,
      state.clock.elapsedTime * 0.3,
      Math.cos(state.clock.elapsedTime * 0.4) * 0.1
    ])
  })

  return (
    <sprite
      position={position}
      scale={[scale, scale, scale]}
      rotation={rotation}
    >
      <spriteMaterial
        attach="material"
        map={texture}
        transparent
      />
    </sprite>
  )
}

function Scene() {
  const objects = [
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918385/la-esquinita/object-cig-pack_fl1nii.png",
      position: [-2, 1, 0] as [number, number, number],
      scale: 2.5
    },
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918385/la-esquinita/object-bottle_hq76dx.png",
      position: [2, 1.5, 1],
      scale: 1.2
    },
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/object-candy_u5cxeb.png",
      position: [-1.5, -1, 0.5],
      scale: 1
    },
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/object-banana_d4tckn.png",
      position: [1.5, -1.5, -0.5],
      scale: 1.3
    },
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/object-bag_eyaj57.png",
      position: [0, 2, -1],
      scale: 1.4
    }
  ]

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* Glass cube */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial 
          color="hotpink"
          metalness={0}
          roughness={0}
          envMapIntensity={1}
          clearcoat={1}
          transparent={true}
          transmission={0.95}
          opacity={0.3}
          reflectivity={0.2}
        />
      </mesh>

      {/* 3D Text Component */}
      <Text3D text="La Esquinita" position={[0, 2, 0]} />

      {/* Floating Objects */}
      {objects.map((obj, index) => (
        <FloatingObject
          key={index}
          url={obj.url}
          position={obj.position}
          scale={obj.scale}
        />
      ))}

      <Environment preset="sunset" background={false} />
      <OrbitControls />
    </>
  )
}

export default function Simple3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { initializeContext, disposeContext, isContextLost, error } = useWebGLContext()

  useEffect(() => {
    let mounted = true

    const init = async () => {
      if (canvasRef.current && mounted) {
        const renderer = initializeContext(canvasRef.current)
        if (renderer) {
          console.log("WebGL context initialized successfully")
        }
      }
    }

    init()

    return () => {
      mounted = false
      disposeContext()
    }
  }, [initializeContext, disposeContext])

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-red-500">Error initializing WebGL: {error.message}</div>
      </div>
    )
  }

  if (isContextLost) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-yellow-500">WebGL context lost. Attempting to recover...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <Canvas
        ref={canvasRef}
        className="w-full h-full"
        camera={{
          position: [0, 0, 3],
          fov: 75,
        }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
} 