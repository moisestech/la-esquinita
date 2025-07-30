"use client"

import { Canvas, useFrame, RootState, ThreeEvent, extend } from "@react-three/fiber"
import { OrbitControls, useTexture, Environment } from "@react-three/drei"
import { Suspense, useState, useEffect, useRef } from "react"
import * as THREE from 'three'
import SugarCubesV2 from "./sugar-cubes"
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { Font } from 'three/examples/jsm/loaders/FontLoader'

// Debug instrumentation
const DEBUG = process.env.NODE_ENV === 'development';

// Log initialization
if (DEBUG) {
  console.log('Simple3D component initializing...');
  console.log('three.js version:', THREE.REVISION);
  
  try {
    if (typeof window !== 'undefined') {
      // Check WebGL support
      const canvas = document.createElement('canvas');
      const gl = (
        canvas.getContext('webgl') || 
        canvas.getContext('experimental-webgl')
      ) as WebGLRenderingContext | null;
        
      console.log('WebGL support:', gl ? 'Available' : 'Not available');
      if (gl) {
        try {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            console.log('WebGL renderer:', gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
            console.log('WebGL vendor:', gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
          }
        } catch (e) {
          console.warn('WebGL debug info not available:', e);
        }
        console.log('Max texture size:', gl.getParameter(gl.MAX_TEXTURE_SIZE));
      }
    }
  } catch (e) {
    console.error('Error checking WebGL support:', e);
  }
}

// Add a type definition to window for texture timing
declare global {
  interface Window {
    textureStartTimes?: Record<string, number>;
  }
}

// Custom useMediaQuery hook for responsive design
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      // Update the state with the current match
      setMatches(media.matches);
      
      // Create event listener for subsequent changes
      const listener = () => setMatches(media.matches);
      media.addEventListener('change', listener);
      
      // Cleanup function
      return () => media.removeEventListener('change', listener);
    }
    
    return undefined;
  }, [query]);

  return matches;
}

// Extend Three.js with TextGeometry and register it with JSX
extend({ TextGeometry })

// Declare the JSX namespace for Three.js components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      textGeometry: JSX.IntrinsicElements['mesh'] & {
        args?: [string, { font: Font; size: number; height: number }]
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
  const glowRef = useRef<THREE.Mesh>(null);
  const pinkGlowRef = useRef<THREE.Mesh>(null);
  const [font, setFont] = useState<Font | null>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [fontError, setFontError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const adjustedSize = isMobile ? size * 0.5 : size;

  // Add shimmer effect with time
  const [rotation, setRotation] = useState(0);
  useFrame((state) => {
    if (meshRef.current && glowRef.current && pinkGlowRef.current) {
      // Subtle rotation for dynamism
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      
      // Update shimmer rotation
      const time = state.clock.getElapsedTime();
      setRotation(time * 0.2);
      
      // Pulsing effect for emissive intensity
      const emissiveIntensity = 0.2 + Math.sin(time * 1.5) * 0.1;
      if (meshRef.current.material) {
        (meshRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = emissiveIntensity;
      }
      
      // Pulsing effect for blue glow
      if (glowRef.current.material) {
        const glowOpacity = 0.3 + Math.sin(time * 1.2) * 0.1;
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = glowOpacity;
        
        // Subtle scale animation for the glow
        const scale = 1.02 + Math.sin(time * 1.0) * 0.01;
        glowRef.current.scale.set(scale, scale, scale);
      }
      
      // Animated pink glow with different phase
      if (pinkGlowRef.current.material) {
        const pinkGlowOpacity = 0.35 + Math.sin(time * 0.8) * 0.15;
        (pinkGlowRef.current.material as THREE.MeshBasicMaterial).opacity = pinkGlowOpacity;
        
        // Different scale animation for the pink glow
        const pinkScale = 1.04 + Math.sin(time * 0.7) * 0.02;
        pinkGlowRef.current.scale.set(pinkScale, pinkScale, pinkScale);
        
        // Slight position adjustment for the glow to create movement
        pinkGlowRef.current.position.y = Math.sin(time * 0.5) * 0.03;
      }
    }
  });

  useEffect(() => {
    if (DEBUG) console.log('Starting font loading for:', text);
    
    const loader = new FontLoader();
    const startTime = performance.now();
    
    loader.load('/fonts/skeleton-blood.json', (loadedFont) => {
      const loadTime = performance.now() - startTime;
      console.log(`Font loaded successfully in ${loadTime.toFixed(2)}ms:`, loadedFont);
      setFont(loadedFont);
      setFontError(null);
    }, 
    // Progress callback
    (progress) => {
      if (DEBUG) console.log('Loading font:', (progress.loaded / progress.total * 100).toFixed(1) + '%');
    },
    // Error callback
    (error) => {
      console.error('Error loading font:', error);
      setFontError(error instanceof Error ? error.message : 'Unknown font loading error');
      
      // Store error for debugging
      if (typeof window !== 'undefined') {
        try {
          const existingErrors = JSON.parse(sessionStorage.getItem('3d-error') || '{}');
          existingErrors.fontError = {
            message: error instanceof Error ? error.message : 'Unknown error',
            time: new Date().toISOString(),
            url: '/fonts/skeleton-blood.json'
          };
          sessionStorage.setItem('3d-error', JSON.stringify(existingErrors));
        } catch (e) {
          // Ignore storage errors
        }
      }
    });
  }, [text]);

  useEffect(() => {
    if (font && text) {
      if (DEBUG) console.log('Creating text geometry for:', text);
      try {
        const textGeometry = new TextGeometry(text, {
          font,
          size: adjustedSize * 0.5,
          height: 0.2, // Slightly deeper for better 3D effect
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelSegments: 5
        });
        textGeometry.center();
        setGeometry(textGeometry);
        if (DEBUG) console.log('Text geometry created successfully');
      } catch (error) {
        console.error('Error creating text geometry:', error);
        setFontError((error as Error).message || 'Unknown text geometry error');
      }
    }
  }, [font, text, adjustedSize]);

  if (!font || !geometry) {
    console.log('Waiting for font to load...');
    return null;
  }
  
  return (
    <group>
      {/* Main text with enhanced material */}
      <mesh
        ref={meshRef}
        position={position}
        geometry={geometry}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}
      >
        <meshPhysicalMaterial 
          color="#ffffff"
          emissive="#223355"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.2}
          reflectivity={1}
          transparent={true}
          opacity={0.9}
          side={THREE.DoubleSide}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Add a subtle blue glow/outline effect */}
      <mesh
        ref={glowRef}
        position={[position[0], position[1], position[2] - 0.01]}
        geometry={geometry}
        scale={1.02}
      >
        <meshBasicMaterial
          color="#88ccff"
          transparent={true}
          opacity={0.3 + Math.sin(rotation) * 0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Add a pink gradient glow for contrast */}
      <mesh
        ref={pinkGlowRef}
        position={[position[0], position[1], position[2] - 0.02]}
        geometry={geometry}
        scale={1.04}
      >
        <meshBasicMaterial
          color="#ff5599"
          transparent={true}
          opacity={0.35}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
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
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [textureError, setTextureError] = useState<string | null>(null);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [hovered, setHovered] = useState(false);
  const [clickable, setClickable] = useState(false);
  
  // Reference to the sprite
  const spriteRef = useRef<THREE.Sprite>(null);
  
  // Load texture with error handling
  useEffect(() => {
    if (DEBUG) console.log(`Loading texture for object: ${url}`);
    const startTime = performance.now();
    
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous'; // Ensure proper CORS handling
    
    // Add event listeners for texture loading issues
    if (typeof window !== 'undefined') {
      const errorHandler = (event: ErrorEvent) => {
        if (event.target instanceof HTMLImageElement) {
          const src = event.target.src || '';
          if (src.includes(url)) {
            console.error(`Image error for ${url}:`, event.error || event.message);
            if (typeof window !== 'undefined') {
              try {
                const errorData = JSON.parse(sessionStorage.getItem('3d-error') || '{}');
                if (!errorData.textureErrors) errorData.textureErrors = [];
                errorData.textureErrors.push({
                  url,
                  time: new Date().toISOString(),
                  message: event.error?.message || event.message || 'Unknown texture error'
                });
                sessionStorage.setItem('3d-error', JSON.stringify(errorData));
              } catch (e) {
                // Ignore storage errors
              }
            }
          }
        }
      };
      
      window.addEventListener('error', errorHandler, { capture: true });
      return () => window.removeEventListener('error', errorHandler, { capture: true });
    }
  }, [url]);
  
  // Use the useTexture hook with error handling
  try {
    const loadedTexture = useTexture(url);
    
    // Handle successful texture loading
    useEffect(() => {
      if (loadedTexture) {
        if (DEBUG) {
          const loadTime = performance.now() - (window.textureStartTimes?.[url] || performance.now());
          console.log(`Texture loaded successfully: ${url} (${loadTime.toFixed(2)}ms)`);
        }
        setTexture(loadedTexture);
        setTextureError(null);
      }
    }, [loadedTexture, url]);
    
  } catch (error) {
    if (!textureError) {
      console.error(`Exception loading texture ${url}:`, error);
      setTextureError((error as Error)?.message || 'Unknown texture loading exception');
    }
  }

  // Normal animation
  useFrame((state) => {
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
  const isMobile = useMediaQuery('(max-width: 768px)');
  // Add a reference for animated lights
  const pinkLightRef = useRef<THREE.SpotLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  
  // Animate the lights
  useFrame((state) => {
    if (pinkLightRef.current && pointLightRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Pink light movement
      pinkLightRef.current.position.x = Math.sin(time * 0.3) * 3;
      pinkLightRef.current.intensity = 5 + Math.sin(time * 0.5) * 2;
      
      // Secondary light pulse
      pointLightRef.current.intensity = 1.5 + Math.sin(time * 0.7) * 0.5;
    }
  });

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
      {/* Enhanced lighting setup */}
      <ambientLight intensity={1.5} color="#e0e0ff" />
      <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#ffaa88" />
      
      {/* Spotlight for dramatic effect on text */}
      <spotLight 
        position={[0, 5, 3]} 
        intensity={5} 
        color="#ffffff" 
        angle={0.5} 
        penumbra={0.5} 
        castShadow 
        distance={20}
      />
      
      {/* Animated pink spotlight for contrast */}
      <spotLight 
        ref={pinkLightRef}
        position={[3, -2, 4]} 
        intensity={5} 
        color="#ff5599" 
        angle={0.6} 
        penumbra={0.8} 
        distance={15}
      />
      
      {/* Additional colored lights for atmosphere */}
      <pointLight position={[3, 0, 2]} intensity={0.8} color="#ff88aa" />
      <pointLight 
        ref={pointLightRef}
        position={[-3, 0, 2]} 
        intensity={1.5} 
        color="#ff55aa" 
        distance={10}
      />
      <pointLight position={[0, -3, 2]} intensity={1.0} color="#88aaff" />

      {/* Gradient spotlight from below for extra pink glow */}
      <spotLight 
        position={[0, -5, 0]} 
        intensity={3} 
        color="#ff66aa" 
        angle={0.8} 
        penumbra={1} 
        distance={10}
      />

      {/* Sugar cubes background */}
      <Suspense fallback={null}>
        <SugarCubesV2 count={isMobile ? 100 : 200} />
      </Suspense>
      
      {/* Glass text with frosted effect */}
      <SimpleCssGlassText
        text="La Esquinita" 
        position={[0, 0, 0]}
        size={1.6}
        onClick={() => {
          console.log('Title clicked!');
          if (onTitleClick) onTitleClick();
        }}
      />

      {/* Floating objects */}
      {objects.map((obj, index) => {
        // Position adjustment for mobile
        const positionMultiplier = isMobile ? 1.0 : 1.5;
        const adjustedPosition: [number, number, number] = [
          obj.position[0] * positionMultiplier,
          obj.position[1],
          obj.position[2] * positionMultiplier
        ];
        
        // Scale adjustment for mobile
        const scaleMultiplier = isMobile ? 0.7 : 1.0;
        const adjustedScale = obj.scale * scaleMultiplier;
        
        return (
          <FloatingObject
            key={index}
            url={obj.url}
            position={adjustedPosition}
            scale={adjustedScale}
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
        minDistance={isMobile ? 3 : 2}
        maxDistance={isMobile ? 8 : 10}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0, 0]}
        domElement={document.body}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export default function Simple3D({ onTitleClick }: { onTitleClick?: () => void }) {
  // Check if the device is mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{
          position: [0, 0, isMobile ? 4 : 3],
          fov: isMobile ? 85 : 75,
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
          e.stopPropagation();
          console.log('Canvas pointer down');
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          console.log('Canvas pointer up');
        }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
        eventSource={document.body}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <MinimalScene onTitleClick={onTitleClick} />
        </Suspense>
      </Canvas>
    </div>
  )
} 