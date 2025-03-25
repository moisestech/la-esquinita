"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Helper function to get random number between min and max
const randBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

// Main component that renders multiple sugar cubes
export default function SugarCubesV2({ count = 200 }) {
  // Create a group to hold all cubes
  const groupRef = useRef<THREE.Group>(null)

  // Create all cube meshes
  const cubes = useMemo(() => {
    const meshes = []

    for (let i = 0; i < count; i++) {
      // Create geometry
      const length = randBetween(0.5, 2) // Smaller cubes
      const width = randBetween(0.5, 2.5) // Smaller cubes

      const shape = new THREE.Shape()
      shape.moveTo(randBetween(0, 0.5), randBetween(0, 0.5))
      shape.lineTo(randBetween(0, 0.5), width)
      shape.lineTo(length, width)
      shape.lineTo(length, randBetween(0, 0.5))
      shape.lineTo(randBetween(0, 0.5), randBetween(0, 0.5))

      const extrudeSettings = {
        steps: 2,
        depth: randBetween(0.5, 2),
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: randBetween(0.2, 0.5),
        bevelSegments: 1,
      }

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      geometry.center() // Center the geometry

      // Create material - add some color tint to make cubes visible against white
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f0f0f0"),
        transparent: true,
        opacity: 0.7,
        metalness: 0.4,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
        // Add subtle color variations to make cubes visible against white
        emissive: new THREE.Color(i % 3 === 0 ? "#ffddee" : i % 3 === 1 ? "#ddffff" : "#eeeeee"),
        emissiveIntensity: 0.1,
      })

      const mesh = new THREE.Mesh(geometry, material)

      // Set position - ensure no cubes are in front of the text
      // Define text boundaries (approximate)
      const textWidth = 4 // Approximate width of "La Esquinita" text
      const textHeight = 1 // Approximate height of text

      // Generate x and y positions
      const x = randBetween(-20, 20)
      const y = randBetween(-20, 20)

      // Generate z position - either behind the text or far in front
      // Text is at z=0, so we'll place cubes either at z < -1 (behind) or z > 5 (far in front)
      let z

      // Check if the cube would be in the text area in x,y plane
      const inTextAreaXY = Math.abs(x) < textWidth / 2 && Math.abs(y) < textHeight / 2

      if (inTextAreaXY) {
        // If in text area, place behind the text
        z = randBetween(-20, -1.5)
      } else {
        // If not in text area, can be anywhere
        z =
          Math.random() > 0.5
            ? randBetween(-20, -1.5) // behind text
            : randBetween(5, 20) // far in front of text
      }

      mesh.position.set(x, y, z)

      // Make them appropriately sized
      const scale = randBetween(0.5, 1.2)
      mesh.scale.set(scale, scale, scale)

      // Store rotation speed
      mesh.userData.rotateSpeed = randBetween(0.01, 0.04)

      meshes.push(mesh)
    }

    return meshes
  }, [count])

  // Add meshes to the scene
  useEffect(() => {
    if (groupRef.current) {
      cubes.forEach((cube) => {
        groupRef.current!.add(cube)
      })
    }

    // Cleanup
    return () => {
      if (groupRef.current) {
        cubes.forEach((cube) => {
          groupRef.current!.remove(cube)
        })
      }
    }
  }, [cubes])

  // Animate cubes
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        const speed = child.userData.rotateSpeed
        child.rotation.x += speed
        child.rotation.y += speed
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Add lights with colors to help cubes stand out against white */}
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffddee" />
      <pointLight position={[-10, -10, 10]} intensity={0.8} color="#ddffff" />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#FF1493" />
    </group>
  )
}

