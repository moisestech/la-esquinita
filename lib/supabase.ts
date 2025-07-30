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
export type Product = Tables['products']['Row']
export type ProductInsert = Tables['products']['Insert']
export type ProductUpdate = Tables['products']['Update']
export type Event = Tables['events']['Row']
export type EventInsert = Tables['events']['Insert']
export type EventUpdate = Tables['events']['Update']
export type SecretPass = Tables['secret_passes']['Row']
export type SecretPassInsert = Tables['secret_passes']['Insert']
export type SecretPassUpdate = Tables['secret_passes']['Update']
export type RSVP = Tables['rsvps']['Row']
export type RSVPInsert = Tables['rsvps']['Insert']
export type RSVPUpdate = Tables['rsvps']['Update']
export type Content = Tables['content']['Row']
export type ContentInsert = Tables['content']['Insert']
export type ContentUpdate = Tables['content']['Update']

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
  },

  products: {
    // Get all active products
    getAll: async () => {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    // Get product by slug
    getBySlug: async (slug: string) => {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single()

      if (error) throw error
      return data
    },

    // Search products
    search: async (query: string) => {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('status', 'active')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    // Get products by category
    getByCategory: async (category: string) => {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('category', category)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    // Create product (admin only)
    create: async (product: ProductInsert) => {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .insert([product])
        .select()
        .single()

      if (error) throw error
      return data
    },

    // Update product (admin only)
    update: async (id: string, updates: ProductUpdate) => {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    // Delete product (admin only)
    delete: async (id: string) => {
      const { error } = await supabase
        .from(TABLES.PRODUCTS)
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  },

  events: {
    // Get all events
    getAll: async () => {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .order('start_at', { ascending: true })

      if (error) throw error
      return data
    },

    // Get upcoming events
    getUpcoming: async () => {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .gte('start_at', new Date().toISOString())
        .order('start_at', { ascending: true })

      if (error) throw error
      return data
    },

    // Get live events
    getLive: async () => {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .eq('is_live', true)
        .order('start_at', { ascending: true })

      if (error) throw error
      return data
    },

    // Get event by ID
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },

    // Create event (admin only)
    create: async (event: EventInsert) => {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .insert([event])
        .select()
        .single()

      if (error) throw error
      return data
    },

    // Update event (admin only)
    update: async (id: string, updates: EventUpdate) => {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    // Delete event (admin only)
    delete: async (id: string) => {
      const { error } = await supabase
        .from(TABLES.EVENTS)
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  },

  secretPasses: {
    // Validate secret code
    validate: async (code: string, targetRoute: string) => {
      const { data, error } = await supabase
        .from(TABLES.SECRET_PASSES)
        .select('*')
        .eq('code', code)
        .eq('target_route', targetRoute)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null
        }
        throw error
      }

      // Check if expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return null
      }

      // Check usage limits
      if (data.max_uses && data.current_uses >= data.max_uses) {
        return null
      }

      return data
    },

    // Increment usage count
    incrementUsage: async (id: string) => {
      const { error } = await supabase
        .from(TABLES.SECRET_PASSES)
        .update({ current_uses: supabase.rpc('increment') })
        .eq('id', id)

      if (error) throw error
    },

    // Get all secret passes (admin only)
    getAll: async () => {
      const { data, error } = await supabase
        .from(TABLES.SECRET_PASSES)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    // Create secret pass (admin only)
    create: async (secretPass: SecretPassInsert) => {
      const { data, error } = await supabase
        .from(TABLES.SECRET_PASSES)
        .insert([secretPass])
        .select()
        .single()

      if (error) throw error
      return data
    },

    // Update secret pass (admin only)
    update: async (id: string, updates: SecretPassUpdate) => {
      const { data, error } = await supabase
        .from(TABLES.SECRET_PASSES)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    // Delete secret pass (admin only)
    delete: async (id: string) => {
      const { error } = await supabase
        .from(TABLES.SECRET_PASSES)
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  },

  rsvps: {
    // Create RSVP
    create: async (rsvp: RSVPInsert) => {
      const { data, error } = await supabase
        .from(TABLES.RSVPS)
        .insert([rsvp])
        .select()
        .single()

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new DatabaseError('You have already RSVP\'d for this event.', error.code)
        }
        throw error
      }

      return data
    },

    // Get RSVPs for event
    getByEvent: async (eventId: string) => {
      const { data, error } = await supabase
        .from(TABLES.RSVPS)
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    // Get RSVP by user email
    getByEmail: async (email: string) => {
      const { data, error } = await supabase
        .from(TABLES.RSVPS)
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    // Update RSVP
    update: async (id: string, updates: RSVPUpdate) => {
      const { data, error } = await supabase
        .from(TABLES.RSVPS)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    // Cancel RSVP
    cancel: async (id: string) => {
      const { error } = await supabase
        .from(TABLES.RSVPS)
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (error) throw error
    }
  },

  content: {
    // Get published content by key
    getByKey: async (key: string) => {
      const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .select('*')
        .eq('key', key)
        .eq('is_published', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null
        }
        throw error
      }

      return data
    },

    // Get all published content
    getAllPublished: async () => {
      const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    // Create content (admin only)
    create: async (content: ContentInsert) => {
      const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .insert([content])
        .select()
        .single()

      if (error) throw error
      return data
    },

    // Update content (admin only)
    update: async (id: string, updates: ContentUpdate) => {
      const { data, error } = await supabase
        .from(TABLES.CONTENT)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    // Delete content (admin only)
    delete: async (id: string) => {
      const { error } = await supabase
        .from(TABLES.CONTENT)
        .delete()
        .eq('id', id)

      if (error) throw error
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