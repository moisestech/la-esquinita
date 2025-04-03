"use client"

// REACT 
import React from "react"
import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"

// COMPONENTS
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import BackgroundPattern from '@/components/background-pattern'
import NewsletterModal from "@/components/newsletter-modal"
import AboutButton from "@/components/about-button"
import Simple3DFallback from "./simple-3d-fallback"

// HOOKS
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/supabase"

// Create an ErrorBoundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
}> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    // Prevent Next.js from capturing this error in development
    if (typeof window !== 'undefined') {
      // Store error info in sessionStorage to prevent console noise
      try {
        sessionStorage.setItem('3d-error', JSON.stringify({ 
          message: error.message, 
          stack: error.stack 
        }));
      } catch (e) {
        // Ignore storage errors
      }
    }
    
    // Safely log error - wrap in setTimeout to avoid Next.js error handler
    setTimeout(() => {
      console.log("Error in 3D component:", error);
      console.log("Component stack:", errorInfo?.componentStack);
    }, 0);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center w-full h-screen bg-black/30 backdrop-blur">
    <div className="text-3xl font-bold text-white">Loading 3D Scene...</div>
  </div>
);

// Use a state variable to track if 3D should be attempted
function useSkip3D() {
  const [should3DLoad, setShould3DLoad] = useState(true);
  
  useEffect(() => {
    // Check if we've had errors before
    try {
      const errorData = sessionStorage.getItem('3d-error');
      if (errorData) {
        console.log("Previous 3D error detected, skipping 3D load");
        setShould3DLoad(false);
      }
    } catch (e) {
      // Ignore storage errors
    }
    
    // Add a timeout as fallback
    const timeoutId = setTimeout(() => {
      // If 3D hasn't loaded after 10 seconds, show fallback
      const statusCheck = sessionStorage.getItem('3d-loaded');
      if (!statusCheck) {
        console.log("3D load timeout, showing fallback");
        setShould3DLoad(false);
      }
    }, 10000);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return { should3DLoad };
}

// Dynamically import the simple 3D component with error handling
const Simple3D = dynamic(
  () => import("@/components/simple-3d").then(mod => {
    // Mark as successfully loaded
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('3d-loaded', 'true');
      } catch (e) {
        // Ignore storage errors
      }
    }
    return mod;
  }).catch(error => {
    console.log("Error loading 3D component:", error);
    
    // Store error info
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('3d-error', JSON.stringify({ 
          message: error.message,
          stack: error.stack
        }));
      } catch (e) {
        // Ignore storage errors
      }
    }
    
    // Return a component that will throw
    return () => {
      throw new Error("Failed to load 3D component");
    };
  }),
  {
    ssr: false,
    loading: () => <LoadingComponent />
  }
);

export default function HomePage() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const { should3DLoad } = useSkip3D();
  const { toast } = useToast()

  // Add font loading effect
  useEffect(() => {
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
    
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        setFontLoaded(true);
      });
    } else {
      setFontLoaded(true);
    }
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleNewsletterSubmit = async (email: string) => {
    try {
      await db.newsletter.subscribe(email)
      toast({
        title: "Success!",
        description: "Your email has been captured. Thanks for subscribing!",
        variant: "default",
      })
      setShowNewsletter(false)
    } catch (error: any) {
      // Check for the specific error code from Supabase for unique constraint violation
      console.log(error)
      if (error.code === '23505') {
        toast({
          title: "Already Subscribed",
          description: "This email is already on our newsletter list!",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <main className="relative w-full h-full overflow-hidden">
      {/* Background pattern layer - lowest z-index */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <BackgroundPattern 
          imageUrl="https://res.cloudinary.com/dck5rzi4h/image/upload/v1742918384/la-esquinita/bg-rocks-color_ikxdem.jpg"
          className="opacity-90 pointer-events-none"
        />
      </div>

      {/* 3D Canvas layer */}
      <div className="absolute inset-0 z-10">
        {should3DLoad ? (
          <ErrorBoundary
            fallback={<Simple3DFallback onTitleClick={() => {
              console.log("Opening newsletter from fallback in ErrorBoundary");
              setShowNewsletter(true);
            }} />}
          >
            <Suspense fallback={<LoadingComponent />}>
              <Simple3D onTitleClick={() => {
                console.log("Opening newsletter from 3D component");
                setShowNewsletter(true);
              }} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <Simple3DFallback onTitleClick={() => {
            console.log("Opening newsletter from direct fallback");
            setShowNewsletter(true);
          }} />
        )}
      </div>

      {/* UI Controls layer - highest z-index */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        {/* About Button */}
        <div className="absolute top-4 right-4 pointer-events-auto">
          <AboutButton />
        </div>

        {/* Restart Button */}
        {/* <div className="absolute bottom-4 right-4 pointer-events-auto">
          <button
            className="bg-gradient-to-r from-miami-pink to-miami-cyan hover:from-miami-pink/90 hover:to-miami-cyan/90 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => {
              // Clear error state and reload
              try {
                sessionStorage.removeItem('3d-error');
                sessionStorage.removeItem('3d-loaded');
              } catch (e) {}
              window.location.reload();
            }}
          >
            Restart Animation
          </button>
        </div> */}
      </div>

      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={showNewsletter}
        onClose={() => setShowNewsletter(false)}
        onSubmit={handleNewsletterSubmit}
      />

      <Toaster />
    </main>
  )
} 