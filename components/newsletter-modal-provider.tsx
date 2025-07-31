"use client"

import { useNewsletterModal } from "@/hooks/use-newsletter-modal"
import NewsletterModal from "./newsletter-modal"

export default function NewsletterModalProvider() {
  const { isOpen, closeModal } = useNewsletterModal()

  return (
    <NewsletterModal 
      isOpen={isOpen} 
      onClose={closeModal} 
    />
  )
} 