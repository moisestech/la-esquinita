"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function TriangleCornerParticles({ count = 60 }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const [trianglePoints] = useState(() => {
    // Define the three corners of our triangle path
    return [
      new THREE.Vector3(0, 2, 0), // Top
      new THREE.Vector3(-2, -1, 0), // Bottom left
      new THREE.Vector3(2, -1, 0), // Bottom right
    ]
  })

  useFrame((state) => {
    if (!mesh.current) return

    const time = state.clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
      const id = i
      const tempObject = new THREE.Object3D()

      // Get the current position
      mesh.current.getMatrixAt(id, tempObject.matrix)
      tempObject.position.setFromMatrixPosition(tempObject.matrix)

      // Calculate which segment of the triangle this particle is moving along
      // Each particle moves from one corner to the next
      const segmentIndex = Math.floor(i % 3)
      const nextSegmentIndex = (segmentIndex + 1) % 3

      // Calculate progress along the current segment (0 to 1)
      // Different speeds for different particles
      const speed = 0.2 + (i % 5) * 0.05
      const progress = (time * speed + i * 0.1) % 1

      // Use sharp, angular easing instead of smooth sine
      // This creates more corner-like movement
      let easedProgress
      if (progress < 0.3) {
        // Fast at beginning
        easedProgress = progress * 3.33 * 0.3
      } else if (progress > 0.7) {
        // Fast at end
        easedProgress = 0.7 + (progress - 0.7) * 3.33 * 0.3
      } else {
        // Slow in middle
        easedProgress = 0.3 + ((progress - 0.3) * 0.4) / 0.4
      }

      // Linear interpolation between current corner and next corner
      const startPoint = trianglePoints[segmentIndex]
      const endPoint = trianglePoints[nextSegmentIndex]

      // Set position along the line segment
      tempObject.position.x = startPoint.x + (endPoint.x - startPoint.x) * easedProgress
      tempObject.position.y = startPoint.y + (endPoint.y - startPoint.y) * easedProgress
      tempObject.position.z = (Math.random() - 0.5) * 0.1 // Small random z variation

      // Rotate to face direction of travel
      const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x)
      tempObject.rotation.z = angle + Math.PI / 2

      // Scale based on position in journey (larger at corners)
      const distanceToCorner = Math.min(easedProgress, 1 - easedProgress)
      const scale = 0.8 + (1 - distanceToCorner) * 0.5
      tempObject.scale.set(scale, scale, scale)

      // Update the matrix
      tempObject.updateMatrix()
      mesh.current.setMatrixAt(id, tempObject.matrix)
    }

    mesh.current.instanceMatrix.needsUpdate = true
  })

  // Create initial positions along the triangle path
  const [positions] = useState(() => {
    const positions = []

    for (let i = 0; i < count; i++) {
      // Determine which segment this particle starts on
      const segmentIndex = i % 3
      const nextSegmentIndex = (segmentIndex + 1) % 3

      // Random position along the segment
      const randomProgress = Math.random()
      const startPoint = trianglePoints[segmentIndex]
      const endPoint = trianglePoints[nextSegmentIndex]

      const x = startPoint.x + (endPoint.x - startPoint.x) * randomProgress
      const y = startPoint.y + (endPoint.y - startPoint.y) * randomProgress
      const z = (Math.random() - 0.5) * 2

      positions.push(new THREE.Vector3(x, y, z))
    }

    return positions
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      {/* Use a custom triangle geometry */}
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={
            new Float32Array([
              0,
              0.1,
              0, // top
              -0.08,
              -0.05,
              0, // bottom left
              0.08,
              -0.05,
              0, // bottom right
            ])
          }
          count={3}
          itemSize={3}
        />
      </bufferGeometry>
      <meshBasicMaterial color="#FF1493" transparent opacity={0.8} side={THREE.DoubleSide} />
      {positions.map((pos, i) => (
        <group key={i} position={[pos.x, pos.y, pos.z]} />
      ))}
    </instancedMesh>
  )
}

