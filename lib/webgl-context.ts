import { atom, useAtom } from 'jotai'
import { WebGLRenderer } from 'three'
import React from 'react'

// Type for our WebGL context state
type WebGLContextState = {
  isContextLost: boolean
  error: Error | null
}

// Create the atom for our WebGL context state
const webGLContextAtom = atom<WebGLContextState>({
  isContextLost: false,
  error: null,
})

// Hook to manage WebGL context
export function useWebGLContext() {
  const [state, setState] = useAtom(webGLContextAtom)
  const rendererRef = React.useRef<WebGLRenderer | null>(null)

  const initializeContext = React.useCallback((canvas: HTMLCanvasElement) => {
    try {
      if (rendererRef.current) {
        return rendererRef.current
      }

      const renderer = new WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: true,
        stencil: true,
        depth: true,
      })

      // Set up context loss handling
      renderer.getContext().canvas.addEventListener('webglcontextlost', (event) => {
        event.preventDefault()
        setState(prev => ({ ...prev, isContextLost: true }))
        return false
      })

      renderer.getContext().canvas.addEventListener('webglcontextrestored', () => {
        setState(prev => ({ ...prev, isContextLost: false }))
      })

      rendererRef.current = renderer
      setState(prev => ({ ...prev, error: null }))
      return renderer
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }))
      return null
    }
  }, [setState])

  const disposeContext = React.useCallback(() => {
    if (rendererRef.current) {
      rendererRef.current.dispose()
      rendererRef.current = null
    }
  }, [])

  return {
    ...state,
    initializeContext,
    disposeContext,
    renderer: rendererRef.current,
  }
} 