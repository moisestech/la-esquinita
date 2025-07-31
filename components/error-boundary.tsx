"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-miami-pink/10 to-miami-blue/10 rounded-xl border border-miami-pink/20"
        >
          <div className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-miami-pink mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-mint-rot mb-2">
              3D Component Error
            </h3>
            <p className="text-mint-rot/70 mb-6 max-w-md">
              There was an issue loading the 3D component. This might be due to browser compatibility or performance limitations.
            </p>
            <motion.button
              onClick={this.handleRetry}
              className="bg-gradient-to-r from-miami-pink to-miami-blue text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </motion.button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-mint-rot/60 cursor-pointer hover:text-mint-rot">
                  Error Details
                </summary>
                <pre className="text-xs text-mint-rot/50 mt-2 p-2 bg-black/10 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </motion.div>
      )
    }

    return this.props.children
  }
} 