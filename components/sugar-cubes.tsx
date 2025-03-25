"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Helper function to get random number between min and max
const randBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

// Single sugar cube component
function SugarCube() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [textureLoaded, setTextureLoaded] = useState(false)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  // Create geometry
  const geometry = useMemo(() => {
    const length = randBetween(1, 6)
    const width = randBetween(1, 8)

    const shape = new THREE.Shape()
    shape.moveTo(randBetween(0, 1.5), randBetween(0, 1.5))
    shape.lineTo(randBetween(0, 1.5), width)
    shape.lineTo(length, width)
    shape.lineTo(length, randBetween(0, 1.5))
    shape.lineTo(randBetween(0, 1.5), randBetween(0, 1.5))

    const extrudeSettings = {
      steps: 2,
      depth: randBetween(3, 6),
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: randBetween(1, 3),
      bevelSegments: 1,
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  // Load texture
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = "anonymous"
    textureLoader.load("/sugar-texture.png", (loadedTexture) => {
      loadedTexture.wrapS = loadedTexture.wrapT = THREE.MirroredRepeatWrapping
      loadedTexture.repeat.set(0.1, 0.1)
      setTexture(loadedTexture)
      setTextureLoaded(true)
    })
  }, [])

  // Random position and rotation speed
  const position = useMemo(() => [randBetween(-120, 120), randBetween(-120, 120), randBetween(-120, 120)], [])

  const rotateSpeed = useMemo(() => randBetween(0.01, 0.04), [])

  // Animation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotateSpeed
      meshRef.current.rotation.y += rotateSpeed
    }
  })

  if (!textureLoaded) return null

  return (
    <mesh ref={meshRef} geometry={geometry} position={[position[0], position[1], position[2]]}>
      <meshBasicMaterial map={texture!} transparent={true} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

// Main component that renders multiple sugar cubes
export default function SugarCubes({ count = 100 }) {
  const cubes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => <SugarCube key={i} />)
  }, [count])

  return <>{cubes}</>
}

