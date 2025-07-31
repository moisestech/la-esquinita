"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  slug: string
}

interface CartContextType {
  cartItems: CartItem[]
  appliedCoupon?: { code: string; discount: number; type: 'percentage' | 'fixed' }
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (discount: number, type: 'percentage' | 'fixed', code: string) => void
  removeCoupon: () => void
  getCartTotal: () => number
  getCartSubtotal: () => number
  getCartDiscount: () => number
  getCartItemCount: () => number
  isInCart: (productId: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | undefined>()
  const [toastQueue, setToastQueue] = useState<Array<{title: string, description: string, variant?: "default" | "destructive"}>>([])
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('la-esquinita-cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.log('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('la-esquinita-cart', JSON.stringify(cartItems))
    } catch (error) {
      console.log('Error saving cart to localStorage:', error)
    }
  }, [cartItems])

  // Process toast queue
  useEffect(() => {
    if (toastQueue.length > 0) {
      const nextToast = toastQueue[0]
      toast(nextToast)
      setToastQueue(prev => prev.slice(1))
    }
  }, [toastQueue, toast])

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      
      if (existingItem) {
        // Update existing item quantity
        const updatedItems = prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        
        setToastQueue(prev => [...prev, {
          title: "Updated Cart! 🛒",
          description: `Added ${quantity} more ${product.name} to your cart.`,
          variant: "default",
        }])
        
        return updatedItems
      } else {
        // Add new item
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_urls[0] || "/placeholder-logo.png",
          quantity,
          slug: product.slug,
        }
        
        setToastQueue(prev => [...prev, {
          title: "Added to Cart! 🛒",
          description: `${product.name} has been added to your cart.`,
          variant: "default",
        }])
        
        return [...prev, newItem]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
    
    setToastQueue(prev => [...prev, {
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
      variant: "default",
    }])
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    
    setToastQueue(prev => [...prev, {
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      variant: "default",
    }])
  }



  const getCartItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId)
  }

  const applyCoupon = (discount: number, type: 'percentage' | 'fixed', code: string) => {
    setAppliedCoupon({ code, discount, type })
  }

  const removeCoupon = () => {
    setAppliedCoupon(undefined)
  }

  const getCartSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const getCartDiscount = () => {
    if (!appliedCoupon) return 0
    
    const subtotal = getCartSubtotal()
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.discount) / 100
    } else {
      return Math.min(appliedCoupon.discount, subtotal)
    }
  }

  const getCartTotal = () => {
    const subtotal = getCartSubtotal()
    const discount = getCartDiscount()
    return Math.max(0, subtotal - discount)
  }

  const value: CartContextType = {
    cartItems,
    appliedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartTotal,
    getCartSubtotal,
    getCartDiscount,
    getCartItemCount,
    isInCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 