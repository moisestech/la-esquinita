"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useTexture, Environment, Html, PerspectiveCamera } from "@react-three/drei"
import { Suspense, useState, useEffect, useRef } from "react"
import * as THREE from 'three'

// Glass text component with frosted glass effect
function SimpleCssGlassText({ 
  text, 
  position, 
  color = "#80ccff", // Ice blue color for frost effect
  highlightColor = "rgba(220, 240, 255, 0.9)", // Frosty highlight
  size = 1
}: { 
  text: string, 
  position: [number, number, number], 
  color?: string,
  highlightColor?: string,
  size?: number
}) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Load the font using the available font files
  useEffect(() => {
    // Create a style element for the custom font with all available formats
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'SkeletonBlood';
        src: url('/fonts/skeleton-blood.woff2') format('woff2'),
             url('/fonts/skeleton-blood.woff') format('woff'),
             url('/fonts/skeleton-blood.ttf') format('truetype'),
             url('/fonts/skeleton-blood.otf') format('opentype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    
    // Log the attempt
    console.log("Added @font-face for Skeleton-Blood with multiple formats");
    
    // Check if fonts are loaded using the document.fonts API
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        console.log("All fonts loaded and ready");
        setFontLoaded(true);
      });
    } else {
      // Fallback for browsers without document.fonts API
      setFontLoaded(true);
    }
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Handle scene interaction to trigger text animation
  useEffect(() => {
    const handleSceneInteraction = () => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000); // Animation lasts 2 seconds
    };
    
    // Listen for mouse movement in the scene
    window.addEventListener('mousemove', handleSceneInteraction);
    
    return () => {
      window.removeEventListener('mousemove', handleSceneInteraction);
    };
  }, []);
  
  return (
    <Html 
      position={position}
      transform
      scale={[0.01 * size * 3, 0.01 * size * 3, 0.01 * size * 3]}
      center
      zIndexRange={[100, 0]}
      occlude={false}
    >
      <div style={{ 
        width: '1200px', 
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        {/* Enhanced SVG filters for frosted glass effect */}
        <svg style={{ position: 'absolute', top: '-999em' }}>
          {/* Frosted glass light effect */}
          <filter id="frost-light" style={{ colorInterpolation: 'sRGB' as any }}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="B" />
            <feSpecularLighting in="B" specularExponent="80" lightingColor="#ffffff" result="S">
              <fePointLight x="120" y="60" z="80" />
            </feSpecularLighting>
            <feComposite in="S" in2="SourceAlpha" operator="in" result="L" />
            <feComposite in="SourceGraphic" in2="L" operator="arithmetic" k2="1" k3="1" />
          </filter>
          
          {/* Ice crystal texture */}
          <filter id="frost-texture" style={{ colorInterpolation: 'sRGB' as any }}>
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" seed="1" />
            <feDisplacementMap in="SourceGraphic" scale="5" />
          </filter>
          
          {/* Glass blur and highlight */}
          <filter id="frost-glass" style={{ colorInterpolation: 'sRGB' as any }}>
            <feGaussianBlur stdDeviation="3" />
            <feColorMatrix type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 18 -7" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </svg>

        {/* Frosted glass text element with skeleton-blood font */}
        <div 
          className={isAnimating ? 'animate-frost-text' : 'frost-text-container'}
          style={{
            position: 'relative',
            padding: '0 20px',
          }}
        >
          <p 
            data-text={text}
            style={{
              position: 'relative',
              fontFamily: fontLoaded ? "'SkeletonBlood', fantasy" : "fantasy",
              fontWeight: 'bold',
              fontSize: '14rem',
              textAlign: 'center',
              margin: 0,
              padding: '20px 40px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              boxShadow: `
                0 4px 30px rgba(0, 0, 0, 0.1),
                inset 0 0 20px rgba(255, 255, 255, 0.25)
              `,
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            {text}
          </p>
          
          <style jsx>{`
            .frost-text-container {
              transform-style: preserve-3d;
              transition: transform 0.5s ease-out;
            }
            
            .animate-frost-text {
              animation: frost-pulse 2s ease-in-out;
            }
            
            @keyframes frost-pulse {
              0% { transform: scale3d(1, 1, 1) rotate3d(0, 1, 0, 0deg); }
              25% { transform: scale3d(1.03, 1.03, 1.03) rotate3d(0, 1, 0, 2deg); }
              50% { transform: scale3d(1.05, 1.05, 1.05) rotate3d(0, 1, 0, 0deg); }
              75% { transform: scale3d(1.03, 1.03, 1.03) rotate3d(0, 1, 0, -2deg); }
              100% { transform: scale3d(1, 1, 1) rotate3d(0, 1, 0, 0deg); }
            }
            
            p {
              color: transparent;
              background-clip: text;
              -webkit-background-clip: text;
              background-image: linear-gradient(135deg, ${color} 20%, ${highlightColor} 50%, ${color} 80%);
              filter: url(#frost-light);
            }
            
            p:before,
            p:after {
              content: attr(data-text);
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: -1;
            }
            
            /* Outer glow */
            p:before {
              color: rgba(255, 255, 255, 0.4);
              text-shadow: 
                0 0 10px rgba(255, 255, 255, 0.8),
                0 0 20px rgba(255, 255, 255, 0.4),
                0 0 30px rgba(255, 255, 255, 0.2);
              filter: url(#frost-texture);
              transform: translateZ(-10px);
            }
            
            /* Inner detail */
            p:after {
              color: rgba(255, 255, 255, 0.9);
              text-shadow: 
                -1px -1px 1px rgba(255, 255, 255, 0.7), 
                1px 1px 1px rgba(0, 0, 0, 0.2);
              filter: url(#frost-glass);
            }
          `}</style>
        </div>
      </div>
    </Html>
  );
}

// FloatingObject component with proper types
interface FloatingObjectProps {
  url: string
  position: [number, number, number]
  scale?: number
}

// FloatingObject component with hover animation
function FloatingObject({ url, position, scale = 2.5 }: FloatingObjectProps) {
  const texture = useTexture(url)
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0])
  const [hovered, setHovered] = useState(false)
  const [clickable, setClickable] = useState(false)
  
  // Reference to the sprite
  const spriteRef = useRef<THREE.Sprite>(null)
  
  // Normal animation
  useFrame((state) => {
    if (!spriteRef.current) return
    
    // Base rotation animation
    const baseRotation = [
      Math.sin(state.clock.elapsedTime * 0.5) * 0.1,
      state.clock.elapsedTime * 0.3,
      Math.cos(state.clock.elapsedTime * 0.4) * 0.1
    ] as [number, number, number]
    
    // If hovered, add more intense rotation and pulsing scale
    if (hovered) {
      // Enhanced rotation when hovered
      baseRotation[0] *= 2
      baseRotation[1] *= 1.5
      baseRotation[2] *= 2
      
      // Pulse scale when hovered
      const pulseScale = 1 + 0.1 * Math.sin(state.clock.elapsedTime * 5)
      spriteRef.current.scale.set(
        scale * pulseScale,
        scale * pulseScale,
        scale * pulseScale
      )
    } else {
      // Normal scale when not hovered
      spriteRef.current.scale.set(scale, scale, scale)
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
      onClick={(e) => {
        e.stopPropagation()
        console.log('Clicked on object:', url.split('/').pop())
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (clickable) setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'auto'
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

function MinimalScene() {
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
      {/* Brighter lights to enhance the frost effect */}
      <ambientLight intensity={3} />
      <directionalLight position={[5, 5, 5]} intensity={3} />
      
      {/* Additional light for frosted effect */}
      <pointLight position={[0, 0, 2]} intensity={0.5} color="#ffffff" />
      
      {/* Glass text with frosted effect */}
      <SimpleCssGlassText
        text="La Esquinita" 
        position={[0, 0, 0]}
        color="#80ccff" // Ice blue for frost effect
        highlightColor="rgba(220, 240, 255, 0.9)" // Frosty highlight
        size={2.8} // Slightly smaller to fit with background
      />

      {/* Interactive floating objects */}
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
          />
        );
      })}
      
      <Environment preset="sunset" background={false} />
      <OrbitControls enablePan={false} enableZoom={true} />
    </>
  )
}

export default function Simple3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 75,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Suspense fallback={null}>
          <MinimalScene />
        </Suspense>
      </Canvas>
    </div>
  )
} 