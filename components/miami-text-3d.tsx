"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Center, OrbitControls, PresentationControls, Environment } from "@react-three/drei"
import * as THREE from "three"

export default function MiamiText3D() {
  return (
    <Canvas
      className="w-full h-full"
      orthographic
      camera={{
        zoom: 3.5,
        position: [0, 0, 100],
        near: -500,
        far: 1000,
      }}
    >
      <color attach="background" args={["white"]} />
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-0.2, 0.2]}
        azimuth={[-0.5, 0.5]}
        // @ts-ignore
        config={{ mass: 2, tension: 400 }}
        // @ts-ignore
        snap={{ mass: 4, tension: 400 }}
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </PresentationControls>
      <OrbitControls enableZoom={false} enablePan={false} />
      <Environment preset="studio" />
    </Canvas>
  )
}

