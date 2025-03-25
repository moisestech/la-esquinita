"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PresentationControls, Environment } from "@react-three/drei"
import TextScene from "./text-scene"
import SugarCubesV2 from "./sugar-cubes-v2"

export default function MiamiText3DWithCubes() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{
        position: [0, 0, 15], // Use perspective camera for better visibility
        fov: 50,
        near: 0.1,
        far: 1000,
      }}
    >
      {/* Use a white background as requested */}
      <color attach="background" args={["white"]} />

      {/* Add ambient light for overall scene brightness */}
      <ambientLight intensity={0.6} />

      {/* Add directional light for shadows and highlights */}
      <directionalLight position={[10, 10, 10]} intensity={0.8} castShadow />

      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-0.2, 0.2]}
        azimuth={[-0.5, 0.5]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <TextScene />
        <Suspense fallback={null}>
          <SugarCubesV2 count={200} />
        </Suspense>
      </PresentationControls>
      <OrbitControls enableZoom={false} enablePan={false} />
      <Environment preset="studio" />
    </Canvas>
  )
}

