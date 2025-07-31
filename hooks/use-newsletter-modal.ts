import { useState, useEffect } from 'react'

export function useNewsletterModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Show modal after 5 seconds if user hasn't seen it
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true)
        setHasShown(true)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [hasShown])

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return {
    isOpen,
    openModal,
    closeModal,
    hasShown
  }
} 