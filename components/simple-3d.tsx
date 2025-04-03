"use client"

import { Canvas, useFrame, RootState, ThreeEvent, extend } from "@react-three/fiber"
import { OrbitControls, useTexture, Environment, Html, MeshTransmissionMaterial } from "@react-three/drei"
import { Suspense, useState, useEffect, useRef } from "react"
import * as THREE from 'three'
import SugarCubesV2 from "./sugar-cubes"
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

// Extend Three.js with TextGeometry and register it with JSX
extend({ TextGeometry })

// Declare the JSX namespace for Three.js components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      textGeometry: JSX.IntrinsicElements['mesh'] & {
        args?: [string, any]
        center?: boolean
      }
    }
  }
}

// Glass text component with frosted glass effect
function SimpleCssGlassText({ 
  text, 
  position, 
  size = 1,
  onClick
}: { 
  text: string, 
  position: [number, number, number], 
  size?: number,
  onClick?: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [font, setFont] = useState<any>(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load('/fonts/skeleton-blood.json', (loadedFont) => {
      console.log('Font loaded successfully:', loadedFont);
      setFont(loadedFont);
    }, 
    // Progress callback
    (progress) => {
      console.log('Loading font:', (progress.loaded / progress.total * 100) + '%');
    },
    // Error callback
    (error) => {
      console.error('Error loading font:', error);
    });
  }, []);

  if (!font) {
    console.log('Waiting for font to load...');
    return null;
  }

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
      >
        <textGeometry
          args={[text, { font, size: size * 0.5, depth: 0.1 }]}
          center
        />
        <MeshTransmissionMaterial
          thickness={0.1}
          roughness={0.05}
          transmission={0.95}
          ior={1.1}
          chromaticAberration={0.01}
          backside={true}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.05}
          attenuationDistance={1}
          attenuationColor="#ffffff"
          color="#ffffff"
          samples={16}
          resolution={256}
          anisotropy={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// FloatingObject component with proper types
interface FloatingObjectProps {
  url: string
  position: [number, number, number]
  scale?: number
  onClick?: () => void
}

// FloatingObject component with hover animation
function FloatingObject({ url, position, scale = 2.5, onClick }: FloatingObjectProps) {
  const texture = useTexture(url)
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0])
  const [hovered, setHovered] = useState(false)
  const [clickable, setClickable] = useState(false)
  
  // Reference to the sprite
  const spriteRef = useRef<THREE.Sprite>(null)
  
  // Normal animation
  useFrame((state: RootState) => {
    if (!spriteRef.current) return
    
    // Base rotation animation
    const baseRotation = [
      Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1,
      state.clock.getElapsedTime() * 0.3,
      Math.cos(state.clock.getElapsedTime() * 0.4) * 0.1
    ] as [number, number, number]
    
    // If hovered, add more intense rotation and pulsing scale
    if (hovered) {
      // Enhanced rotation when hovered
      baseRotation[0] *= 2
      baseRotation[1] *= 1.5
      baseRotation[2] *= 2
      
      // Pulse scale when hovered
      const pulseScale = 1 + 0.1 * Math.sin(state.clock.getElapsedTime() * 5)
      spriteRef.current.scale.set(
        scale * pulseScale,
        scale * pulseScale,
        scale * pulseScale
      )
      document.body.classList.add('cursor-pointer');
    } else {
      // Normal scale when not hovered
      spriteRef.current.scale.set(scale, scale, scale)
      document.body.classList.remove('cursor-pointer');
    }
    
    setRotation(baseRotation)
  })
  
  // Check if pointer is over this object after render
  useEffect(() => {
    const checkPointerEvents = () => {
      setClickable(true) // Enable pointer events after first render
    }
    checkPointerEvents()
  }, [])

  return (
    <sprite
      ref={spriteRef}
      position={position}
      scale={[scale, scale, scale]}
      rotation={rotation}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        console.log('Object clicked!'); // Debug log
        if (onClick) onClick()
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        if (clickable) setHovered(true)
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setHovered(false)
      }}
    >
      <spriteMaterial 
        map={texture} 
        transparent 
        opacity={hovered ? 1 : 0.9} // Increase opacity on hover
      />
    </sprite>
  )
}

function MinimalScene({ onTitleClick }: { onTitleClick?: () => void }) {
  const [showDebug, setShowDebug] = useState(true);

  // Define objects
  const objects = [
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918385/la-esquinita/object-cig-pack_fl1nii.png",
      position: [-2, 1, 0] as [number, number, number],
      scale: 2.5
    },
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918385/la-esquinita/object-bottle_hq76dx.png",
      position: [2, 1.5, 1] as [number, number, number],
      scale: 1.2
    },
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/object-candy_u5cxeb.png",
      position: [-1.5, -1, 0.5] as [number, number, number],
      scale: 1
    },
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/object-banana_d4tckn.png",
      position: [1.5, -1.5, -0.5] as [number, number, number],
      scale: 1.3
    },
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/object-bag_eyaj57.png",
      position: [0, 2, -1] as [number, number, number],
      scale: 1.4
    }
  ]

  return (
    <>
      {/* Debug controls */}
      {/* <Html position={[0, 3, 0]}>
        <button
          onClick={() => setShowDebug(!showDebug)}
          style={{
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </button>
      </Html> */}

      {/* Brighter lights to enhance the frost effect */}
      <ambientLight intensity={3} />
      <directionalLight position={[5, 5, 5]} intensity={3} />
      
      {/* Additional light for frosted effect */}
      <pointLight position={[0, 0, 2]} intensity={0.5} color="#ffffff" />

      {/* Sugar cubes background */}
      <Suspense fallback={null}>
        <SugarCubesV2 count={200} />
      </Suspense>
      
      {/* Glass text with frosted effect */}
      <SimpleCssGlassText
        text="La Esquinita" 
        position={[-2.5, 0, 0]}
        size={1.6}
        onClick={() => {
          console.log('Title clicked!');
          if (onTitleClick) onTitleClick();
        }}
      />

      {/* Floating objects */}
      {objects.map((obj, index) => {
        const adjustedPosition: [number, number, number] = [
          obj.position[0] * 1.5,
          obj.position[1],
          obj.position[2] * 1.5
        ];
        
        return (
          <FloatingObject
            key={index}
            url={obj.url}
            position={adjustedPosition}
            scale={obj.scale}
            onClick={() => {
              console.log('Object clicked!');
              if (onTitleClick) onTitleClick();
            }}
          />
        );
      })}
      
      <Environment preset="sunset" background={false} />
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        enableRotate={true}
        makeDefault
        minDistance={2}
        maxDistance={10}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0, 0]}
        pointerEvents="auto"
        domElement={document.body}
      />
    </>
  )
}

export default function Simple3D({ onTitleClick }: { onTitleClick?: () => void }) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 75,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
        dpr={[1, 2]}
        resize={{
          offsetSize: true,
          scroll: false,
        }}
        className="w-full h-full"
        onPointerDown={(e) => {
          console.log('Canvas pointer down');
        }}
        onPointerUp={(e) => {
          console.log('Canvas pointer up');
        }}
        eventSource={document.body}
        eventPrefix="client"
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <Suspense fallback={null}>
          <MinimalScene onTitleClick={onTitleClick} />
        </Suspense>
      </Canvas>
    </div>
  )
} 