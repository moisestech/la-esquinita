import { useState } from 'react'
import { db, handleSupabaseError } from '@/lib/supabase'
import { isValidEmail, getEmailValidationMessage } from '@/lib/validation'

interface NewsletterState {
  email: string
  error: string
  isSubmitting: boolean
  isSuccess: boolean
}

export function useNewsletter() {
  const [state, setState] = useState<NewsletterState>({
    email: '',
    error: '',
    isSubmitting: false,
    isSuccess: false,
  })

  const handleEmailChange = (email: string) => {
    setState(prev => ({
      ...prev,
      email,
      error: getEmailValidationMessage(email),
      isSuccess: false,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValidEmail(state.email)) {
      setState(prev => ({
        ...prev,
        error: getEmailValidationMessage(state.email),
      }))
      return
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: '' }))

    try {
      // Check if email already exists
      const exists = await db.newsletter.checkEmailExists(state.email)
      if (exists) {
        setState(prev => ({
          ...prev,
          error: 'This email is already subscribed to our newsletter.',
          isSubmitting: false,
        }))
        return
      }

      // Subscribe the email
      await db.newsletter.subscribe(state.email)
      
      setState(prev => ({
        ...prev,
        email: '',
        isSuccess: true,
        isSubmitting: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred. Please try again.',
        isSubmitting: false,
      }))
    }
  }

  return {
    ...state,
    handleEmailChange,
    handleSubmit,
  }
} 