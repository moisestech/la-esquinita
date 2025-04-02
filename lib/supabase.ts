import { Database } from '@/types/supabase'
import { createClient } from '@supabase/supabase-js'
import { TABLES } from './constants/tables'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Database types
export type Tables = Database['public']['Tables']
export type Newsletter = Tables['newsletter']['Row']
export type NewsletterInsert = Tables['newsletter']['Insert']
export type NewsletterUpdate = Tables['newsletter']['Update']

// Database operations
export const db = {
  newsletter: {
    // Subscribe to newsletter
    subscribe: async (email: string) => {
      const { data, error } = await supabase
        .from(TABLES.NEWSLETTER)
        .insert([{ email }])
        .select()
        .single()

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new DatabaseError('This email is already subscribed to our newsletter.', error.code)
        }
        throw new DatabaseError(error.message || 'An unexpected error occurred', error.code)
      }

      return data
    },

    // Check if email exists
    checkEmailExists: async (email: string) => {
      const { data, error } = await supabase
        .from(TABLES.NEWSLETTER)
        .select('email')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error
      }

      return !!data
    },

    // Get all subscribers (admin only)
    getAllSubscribers: async () => {
      const { data, error } = await supabase
        .from(TABLES.NEWSLETTER)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    // Delete subscriber (admin only)
    deleteSubscriber: async (id: string) => {
      const { error } = await supabase
        .from(TABLES.NEWSLETTER)
        .delete()
        .eq('id', id)

      if (error) throw error
    },

    // Update subscriber (admin only)
    updateSubscriber: async (id: string, updates: NewsletterUpdate) => {
      const { data, error } = await supabase
        .from(TABLES.NEWSLETTER)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    }
  }
}

// Error handling
export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): never {
  if (error instanceof DatabaseError) {
    throw error
  }

  if (error.code === '23505') {
    throw new DatabaseError('This email is already subscribed to our newsletter.', error.code)
  }

  throw new DatabaseError(
    error.message || 'An unexpected error occurred',
    error.code
  )
} 