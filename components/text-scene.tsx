"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text3D, Center } from "@react-three/drei"
import * as THREE from "three"
import TriangleCornerParticles from "./triangle-particles"

export default function TextScene() {
  const groupRef = useRef<THREE.Group>(null)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Animation timing
  useFrame((state) => {
    if (!groupRef.current || animationComplete) return

    const t = state.clock.getElapsedTime()

    // Initial entrance animation (0-2 seconds)
    if (t < 2) {
      groupRef.current.position.z = THREE.MathUtils.lerp(-20, 0, Math.min(1, t / 2))
      groupRef.current.rotation.y = THREE.MathUtils.lerp(-Math.PI, 0, Math.min(1, t / 2))
    }
    // Subtle triangular movement animation after entrance
    else {
      if (t > 2 && !animationComplete) {
        setAnimationComplete(true)
      }

      // Angular movement pattern (moving between corners)
      const cornerIndex = Math.floor((t * 0.2) % 3)
      const nextCornerIndex = (cornerIndex + 1) % 3
      const progress = (t * 0.2) % 1

      // Define the three corners of a triangle
      const corners = [
        { x: 0, y: 0.2 }, // Top
        { x: -0.2, y: -0.1 }, // Bottom left
        { x: 0.2, y: -0.1 }, // Bottom right
      ]

      // Use sharp, angular easing
      let easedProgress
      if (progress < 0.3) {
        easedProgress = progress * 3.33 * 0.3
      } else if (progress > 0.7) {
        easedProgress = 0.7 + (progress - 0.7) * 3.33 * 0.3
      } else {
        easedProgress = 0.3 + ((progress - 0.3) * 0.4) / 0.4
      }

      // Move between corners with angular motion
      const currentCorner = corners[cornerIndex]
      const nextCorner = corners[nextCornerIndex]

      groupRef.current.position.x = currentCorner.x + (nextCorner.x - currentCorner.x) * easedProgress
      groupRef.current.position.y = currentCorner.y + (nextCorner.y - currentCorner.y) * easedProgress

      // Add a slight rotation based on which corner we're moving to
      groupRef.current.rotation.y = ((cornerIndex * Math.PI) / 6) * Math.sin(t * 0.1)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <Center>
        {/* Cyan layer (back) */}
        <Text3D
          font="/fonts/Geist_Bold.json"
          position={[0, 0, -0.6]} // Adjusted for smaller text
          size={1.715} // 30% smaller than 2.45
          height={0.25} // Adjusted height for better proportions
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.05}
          bevelOffset={0}
          bevelSegments={5}
        >
          La Esquinita
          <meshStandardMaterial
            color="#00E4FF"
            metalness={0.5}
            roughness={0.2}
            emissive="#00E4FF"
            emissiveIntensity={0.5}
          />
        </Text3D>

        {/* Black layer (middle) */}
        <Text3D
          font="/fonts/Geist_Bold.json"
          position={[0, 0, -0.3]} // Adjusted for smaller text
          size={1.715} // 30% smaller than 2.45
          height={0.25} // Adjusted height for better proportions
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.05}
          bevelOffset={0}
          bevelSegments={5}
        >
          La Esquinita
          <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.2} />
        </Text3D>

        {/* Neon Pink layer (front) */}
        <Text3D
          font="/fonts/Geist_Bold.json"
          position={[0, 0, 0]}
          size={1.715} // 30% smaller than 2.45
          height={0.25} // Adjusted height for better proportions
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.05}
          bevelOffset={0}
          bevelSegments={5}
        >
          La Esquinita
          <meshStandardMaterial
            color="#FF1493"
            emissive="#FF1493"
            emissiveIntensity={1.0}
            metalness={0.7}
            roughness={0.2}
          />
        </Text3D>
      </Center>

      {/* Add triangular corner particles for thematic effect */}
      <TriangleCornerParticles count={50} />
    </group>
  )
}

