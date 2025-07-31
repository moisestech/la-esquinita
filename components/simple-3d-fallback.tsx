"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'

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

interface FallbackProps {
  onTitleClick: () => void
}

// Floating object component for the fallback
const FloatingObject = ({ 
  url, 
  position, 
  scale = 1, 
  onClick,
  isMobile
}: { 
  url: string;
  position: [number, number, number];
  scale?: number;
  onClick: () => void;
  isMobile: boolean;
}) => {
  const [hover, setHover] = useState(false);
  const [animation, setAnimation] = useState(Math.random() * 10); // Random starting point for animation

  // Animation frame
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setAnimation(prev => prev + 0.01);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const floatY = Math.sin(animation * 0.5) * 20;
  const floatX = Math.cos(animation * 0.7) * 10;
  const rotate = Math.sin(animation * 0.3) * 10;
  
  // Scale based on z position to simulate depth
  const depthScale = (position[2] + 2) / 3; // Convert z-range from -1~1 to roughly 0.3~1
  
  // Position adjustments for mobile
  const positionFactor = isMobile ? 0.6 : 1.0; // Reduce spacing by 60% on mobile
  const xPosition = position[0] * 120 * positionFactor;
  const yPosition = -position[1] * 120 * positionFactor;

  return (
    <div 
      className="absolute transition-transform duration-300 transform-gpu"
      style={{
        left: `calc(50% + ${xPosition}px)`,
        top: `calc(50% + ${yPosition}px)`,
        transform: `translateX(${floatX}px) translateY(${floatY}px) rotate(${rotate}deg) scale(${hover ? scale * 1.1 * depthScale : scale * depthScale})`,
        zIndex: 10 + Math.round(position[2] * 10),
        transition: 'transform 0.3s ease-out',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        e.stopPropagation();
        console.log('Object clicked!');
        onClick();
      }}
    >
      <div 
        className={`transition-all duration-300 ${hover ? 'scale-110 -rotate-3' : ''}`}
        style={{
          filter: hover ? 'drop-shadow(0 0 10px rgba(255, 102, 187, 0.7))' : 'none',
        }}
      >
        <Image
          src={url}
          alt="Floating object"
          width={Math.round(120 * scale * depthScale * (isMobile ? 0.8 : 1.5))}
          height={Math.round(120 * scale * depthScale * (isMobile ? 0.8 : 1.5))}
          className="pointer-events-auto object-contain"
          style={{ opacity: 0.7 + 0.3 * depthScale }} // More opaque for objects "closer" to viewer
        />
      </div>
    </div>
  );
};

/**
 * A fallback component that displays when the 3D scene fails to load
 */
const Simple3DFallback: React.FC<FallbackProps> = ({ onTitleClick }) => {
  const [hovered, setHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Define objects to match the 3D scene
  const objects = [
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918385/la-esquinita/object-cig-pack_fl1nii.png",
      position: [-3.5, 1, 0] as [number, number, number],
      scale: 2
    },
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918385/la-esquinita/object-bottle_hq76dx.png",
      position: [0, 2.5, 0] as [number, number, number],
      scale: 2
    },
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/object-candy_u5cxeb.png",
      position: [-2, -1.8, 0] as [number, number, number],
      scale: 2
    },
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/object-banana_d4tckn.png",
      position: [0, -3, 0] as [number, number, number],
      scale: 2
    },
    {
      url: "https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/object-bag_eyaj57.png",
      position: [-2, 4, 0] as [number, number, number],
      scale: 2
    }
  ];
  
  // Track mouse position for 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get the mouse position relative to the viewport
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to +10
      const y = (e.clientY / window.innerHeight - 0.5) * 20; // -10 to +10
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const handleButtonClick = (e: React.MouseEvent) => {
    // Ensure the event doesn't get swallowed
    e.stopPropagation();
    
    // Debug log
    console.log("Newsletter button clicked");
    
    // Call the passed function
    if (typeof onTitleClick === 'function') {
      onTitleClick();
    } else {
      console.error("onTitleClick is not a function", onTitleClick);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-r from-black/40 to-black/60 backdrop-blur pointer-events-auto overflow-hidden"
      style={{ zIndex: 100, position: 'relative' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff66bb] via-[#22ccff] to-[#7700ee] opacity-20 animate-gradient-background pointer-events-none"></div>
      </div>
      
      {/* Floating objects */}
      {objects.map((obj, index) => (
        <FloatingObject
          key={index}
          url={obj.url}
          position={obj.position}
          scale={obj.scale}
          onClick={() => {
            console.log('Object clicked!');
            onTitleClick();
          }}
          isMobile={isMobile}
        />
      ))}
      
      {/* Title with 3D effect and animated gradient text */}
      <div 
        className="relative mb-8 transition-transform duration-500 group"
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          zIndex: 101,
          width: 'auto',
          display: 'inline-block',
          padding: '20px 40px'
        }}
      >
        {/* Card-like border */}
        <div 
          className="absolute inset-0 rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm"
          style={{
            transform: 'translateZ(5px)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)',
          }}
        ></div>
        
        <div
          className="transform-gpu transition-transform duration-300 ease-out"
          style={{
            transform: `perspective(1000px) 
                      rotateX(${-mousePosition.y * 0.05}deg) 
                      rotateY(${mousePosition.x * 0.05}deg)
                      translateZ(30px)`,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Title clicked");
            onTitleClick();
          }}
        >
          <div className="relative">
            <Image
              src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892200/la-esquinita/LE-logo-tara-2_aurodr.png"
              alt="La Esquinita"
              width={400}
              height={200}
              className={`pointer-events-auto transition-all duration-700 ease-in-out
                        ${hovered ? 'scale-105' : 'scale-100'}`}
              style={{ 
                transform: 'translateZ(20px)',
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
              }}
            />
          </div>
          
          {/* Glowing border effect */}
          <div 
            className={`absolute inset-0 rounded-xl pointer-events-none
                        transition-opacity duration-500 ease-in-out
                        ${hovered ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              boxShadow: `0 0 15px 5px rgba(255, 102, 187, 0.5), 
                          0 0 30px 15px rgba(34, 204, 255, 0.3)`,
              transform: 'translateZ(-10px)',
              filter: 'blur(8px)',
            }}
          ></div>
          
          {/* Shine effect */}
          <div
            className="absolute inset-0 overflow-hidden rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
            style={{
              transform: 'translateZ(5px)',
            }}
          >
            <div
              className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%]"
              style={{
                background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(0, 0, 0, 0.0) 100%)',
                transform: `translateX(${mousePosition.x}%) translateY(${mousePosition.y}%)`,
                transition: 'transform 0.2s ease-out'
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <p 
        className="text-xl text-white/80 mb-8 pointer-events-auto relative z-101 transform-gpu transition-transform duration-300"
        style={{ 
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          animation: 'pulse 3s infinite ease-in-out',
          transform: `perspective(1000px) 
                     translateZ(15px)
                     translateX(${mousePosition.x * 0.02}px)
                     translateY(${mousePosition.y * 0.02}px)`,
        }}
      >
        Your neighborhood corner store
      </p>
      
      <div 
        className="space-y-6 pointer-events-auto transform-gpu transition-transform duration-300" 
        style={{ 
          zIndex: 101,
          transform: `perspective(1000px) 
                    translateZ(25px)
                    translateX(${mousePosition.x * 0.03}px)
                    translateY(${mousePosition.y * 0.03}px)`,
        }}
      >
        <Button 
          className="relative overflow-hidden bg-gradient-to-r from-miami-pink to-miami-cyan hover:from-miami-pink/90 hover:to-miami-cyan/90 text-white px-6 py-3 text-lg hover:scale-105 active:scale-95 transition-transform pointer-events-auto"
          onClick={handleButtonClick}
          style={{ 
            zIndex: 101,
            boxShadow: '0 4px 20px rgba(255, 102, 187, 0.4)'
          }}
        >
          {/* Button shine effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent shine-effect"></span>
          
          Join Our Newsletter
        </Button>
      </div>
      
      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes gradientText {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes shine-effect {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        
        .shine-effect {
          transform: translateX(-100%);
          animation: shine-effect 3s infinite ease-in-out;
        }
        
        .animate-gradient-background {
          background-size: 400% 400%;
          animation: gradient-animation 15s ease infinite;
        }
        
        @keyframes gradient-animation {
          0% { background-position: 0% 0%; }
          25% { background-position: 50% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 50% 50%; }
          100% { background-position: 0% 0%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes tilt {
          0%, 100% { transform: rotate3d(1, 1, 1, 0deg); }
          25% { transform: rotate3d(1, 1, 1, 1deg); }
          50% { transform: rotate3d(1, 1, 1, 0deg); }
          75% { transform: rotate3d(1, 1, 1, -1deg); }
        }
      `}</style>
    </div>
  )
}

export default Simple3DFallback 