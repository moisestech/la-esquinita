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
        // Add timestamp to the error
        const errorData = {
          message: error.message, 
          stack: error.stack,
          timestamp: new Date().toISOString(),
          componentStack: errorInfo?.componentStack || 'No component stack available'
        };
        
        sessionStorage.setItem('3d-error', JSON.stringify(errorData));
        console.log("Stored 3D error details in sessionStorage");
      } catch (e) {
        // Ignore storage errors, but log them
        console.warn("Failed to store error details:", e);
      }
    }
    
    // Safely log error - wrap in setTimeout to avoid Next.js error handler
    setTimeout(() => {
      console.group("3D Component Error");
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
      console.log("Component stack:", errorInfo?.componentStack || 'No component stack available');
      console.groupEnd();
    }, 0);
  }
  
  render() {
    if (this.state.hasError) {
      // Log that we're rendering the fallback
      console.log("Rendering fallback due to error in 3D component");
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

// Debugging component to show 3D errors
const Debug3DErrors = () => {
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    try {
      const errorData = sessionStorage.getItem('3d-error');
      if (errorData) {
        setErrorDetails(JSON.parse(errorData));
      }
    } catch (e) {
      console.error("Error reading 3D error details:", e);
    }
  }, []);
  
  if (!errorDetails) return null;
  
  return (
    <div className="fixed bottom-0 right-0 m-4 p-3 bg-black/70 text-white text-xs backdrop-blur-md rounded-lg z-[1000] max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">3D Component Error</h3>
        <div className="space-x-2">
          <button 
            className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
          <button 
            className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-xs"
            onClick={() => {
              // Clear error state and reload
              try {
                sessionStorage.removeItem('3d-error');
                sessionStorage.removeItem('3d-loaded');
                window.location.reload();
              } catch (e) {
                console.error("Error clearing 3D error state:", e);
              }
            }}
          >
            Retry 3D
          </button>
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-2 border-t border-white/20 pt-2 overflow-auto max-h-[300px]">
          <div><strong>Message:</strong> {errorDetails.message}</div>
          {errorDetails.type && <div><strong>Type:</strong> {errorDetails.type}</div>}
          {errorDetails.timestamp && <div><strong>Time:</strong> {new Date(errorDetails.timestamp).toLocaleString()}</div>}
          {errorDetails.componentStack && (
            <div className="mt-2">
              <strong>Component Stack:</strong>
              <pre className="text-xs mt-1 overflow-x-auto whitespace-pre-wrap">
                {errorDetails.componentStack}
              </pre>
            </div>
          )}
          {errorDetails.stack && (
            <div className="mt-2">
              <strong>Stack Trace:</strong>
              <pre className="text-xs mt-1 overflow-x-auto whitespace-pre-wrap">
                {errorDetails.stack}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Use a state variable to track if 3D should be attempted
function useSkip3D() {
  const [should3DLoad, setShould3DLoad] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState<'loading' | 'loaded' | 'error' | 'timeout'>('loading');
  
  useEffect(() => {
    // Check if we've had errors before
    try {
      const errorData = sessionStorage.getItem('3d-error');
      if (errorData) {
        console.log("Previous 3D error detected, skipping 3D load");
        setShould3DLoad(false);
        setLoadingStatus('error');
        return; // Exit early
      }
      
      // Check if already loaded successfully
      const successData = sessionStorage.getItem('3d-loaded');
      if (successData) {
        console.log("3D previously loaded successfully");
        setLoadingStatus('loaded');
      }
    } catch (e) {
      // Ignore storage errors
      console.warn("Error checking 3D loading status:", e);
    }
    
    // Add a timeout as fallback
    const timeoutId = setTimeout(() => {
      // If 3D hasn't loaded after 8 seconds, show fallback
      const statusCheck = sessionStorage.getItem('3d-loaded');
      if (!statusCheck) {
        console.log("3D load timeout, showing fallback");
        setShould3DLoad(false);
        setLoadingStatus('timeout');
        
        // Store timeout info
        try {
          sessionStorage.setItem('3d-error', JSON.stringify({
            message: "Loading timeout exceeded",
            timestamp: new Date().toISOString(),
            type: 'timeout'
          }));
        } catch (e) {
          // Ignore storage errors
        }
      }
    }, 8000); // 8 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return { should3DLoad, loadingStatus };
}

// Dynamically import the simple 3D component with error handling
const Simple3D = dynamic(
  () => import("@/components/simple-3d").then(mod => {
    // Mark as successfully loaded
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('3d-loaded', 'true');
        console.log("3D component loaded successfully");
      } catch (e) {
        // Ignore storage errors
      }
    }
    return mod;
  }).catch(error => {
    console.error("Error loading 3D component:", error);
    
    // Enhanced error details
    const enhancedError = {
      message: error.message || "Failed to load 3D component",
      stack: error.stack || "No stack trace available",
      type: error.name || "Unknown",
      timestamp: new Date().toISOString(),
      browserInfo: typeof window !== 'undefined' ? {
        userAgent: navigator.userAgent,
        vendor: navigator.vendor,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        devicePixelRatio: window.devicePixelRatio,
        webGL: detectWebGLSupport()
      } : 'Not available'
    };
    
    // Store error info
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('3d-error', JSON.stringify(enhancedError));
        console.log("Enhanced error details stored:", enhancedError);
      } catch (e) {
        // Ignore storage errors
      }
    }
    
    // Instead of returning a component that throws,
    // return a component that renders the fallback
    return ({ onTitleClick }: { onTitleClick?: () => void }) => (
      <Simple3DFallback onTitleClick={onTitleClick || (() => {})} />
    );
  }),
  {
    ssr: false,
    loading: () => <LoadingComponent />
  }
);

// Helper function to detect WebGL support
function detectWebGLSupport(): Record<string, any> {
  if (typeof window === 'undefined') return { environment: 'SSR' };
  
  try {
    const canvas = document.createElement('canvas');
    // Type assertion to help TypeScript
    const gl = (
      canvas.getContext('webgl') || 
      canvas.getContext('experimental-webgl')
    ) as WebGLRenderingContext | null;
    
    if (!gl) {
      return { supported: false, reason: 'WebGL context creation failed' };
    }
    
    // WebGL is supported
    const result: Record<string, any> = { 
      supported: true,
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE)
    };
    
    // Try to get debug info if available
    try {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        result.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        result.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      } else {
        result.debugInfoAvailable = false;
      }
    } catch (debugError) {
      result.debugError = (debugError instanceof Error) ? 
        debugError.message : 'Unknown error getting debug info';
    }
    
    return result;
  } catch (error) {
    return { 
      supported: false, 
      error: (error instanceof Error) ? error.message : 'Unknown error'
    };
  }
}

export default function HomePage() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const { should3DLoad, loadingStatus } = useSkip3D();
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
            fallback={
              <Simple3DFallback 
                onTitleClick={() => {
                  console.log("Opening newsletter from fallback in ErrorBoundary");
                  setShowNewsletter(true);
                }} 
              />
            }
          >
            <Suspense fallback={<LoadingComponent />}>
              <Simple3D onTitleClick={() => {
                console.log("Opening newsletter from 3D component");
                setShowNewsletter(true);
              }} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <>
            {/* Show different message based on loading status */}
            {loadingStatus === 'error' && (
              <div className="absolute top-0 left-0 m-4 bg-red-500/20 backdrop-blur-sm text-white px-3 py-2 text-xs rounded-md">
                3D disabled due to previous error
              </div>
            )}
            {loadingStatus === 'timeout' && (
              <div className="absolute top-0 left-0 m-4 bg-yellow-500/20 backdrop-blur-sm text-white px-3 py-2 text-xs rounded-md">
                3D loading timed out
              </div>
            )}
            <Simple3DFallback 
              onTitleClick={() => {
                console.log("Opening newsletter from direct fallback");
                setShowNewsletter(true);
              }} 
            />
          </>
        )}
      </div>

      {/* UI Controls layer - highest z-index */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        {/* About Button */}
        <div className="absolute top-4 right-4 pointer-events-auto">
          <AboutButton />
        </div>

        {/* Debug Controls - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-4 right-4 pointer-events-auto">
            <button
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 text-xs"
              onClick={() => {
                // Clear error state and reload
                try {
                  sessionStorage.removeItem('3d-error');
                  sessionStorage.removeItem('3d-loaded');
                  console.log("Cleared 3D cache, reloading...");
                  window.location.reload();
                } catch (e) {
                  console.error("Error clearing cache:", e);
                }
              }}
            >
              Reset & Reload 3D
            </button>
          </div>
        )}
      </div>

      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={showNewsletter}
        onClose={() => setShowNewsletter(false)}
        onSubmit={handleNewsletterSubmit}
      />

      <Toaster />

      <Debug3DErrors />
    </main>
  )
} 