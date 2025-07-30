export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      newsletter: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          name: string
          price: number
          description: string | null
          image_urls: string[]
          status: 'active' | 'coming_soon' | 'archived'
          category: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          price: number
          description?: string | null
          image_urls?: string[]
          status?: 'active' | 'coming_soon' | 'archived'
          category?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          price?: number
          description?: string | null
          image_urls?: string[]
          status?: 'active' | 'coming_soon' | 'archived'
          category?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_at: string
          end_at: string
          type: 'opening' | 'rave' | 'talk' | 'workshop' | 'performance'
          location: string | null
          rsvp_url: string | null
          max_capacity: number | null
          current_rsvps: number
          is_live: boolean
          stream_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_at: string
          end_at: string
          type: 'opening' | 'rave' | 'talk' | 'workshop' | 'performance'
          location?: string | null
          rsvp_url?: string | null
          max_capacity?: number | null
          current_rsvps?: number
          is_live?: boolean
          stream_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_at?: string
          end_at?: string
          type?: 'opening' | 'rave' | 'talk' | 'workshop' | 'performance'
          location?: string | null
          rsvp_url?: string | null
          max_capacity?: number | null
          current_rsvps?: number
          is_live?: boolean
          stream_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      secret_passes: {
        Row: {
          id: string
          code: string
          target_route: string
          description: string | null
          max_uses: number | null
          current_uses: number
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          target_route: string
          description?: string | null
          max_uses?: number | null
          current_uses?: number
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          target_route?: string
          description?: string | null
          max_uses?: number | null
          current_uses?: number
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      rsvps: {
        Row: {
          id: string
          event_id: string
          email: string
          name: string | null
          guest_count: number
          status: 'confirmed' | 'waitlist' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          email: string
          name?: string | null
          guest_count?: number
          status?: 'confirmed' | 'waitlist' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          email?: string
          name?: string | null
          guest_count?: number
          status?: 'confirmed' | 'waitlist' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      content: {
        Row: {
          id: string
          key: string
          title: string | null
          content: string | null
          content_type: 'text' | 'html' | 'markdown' | 'json'
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          title?: string | null
          content?: string | null
          content_type?: 'text' | 'html' | 'markdown' | 'json'
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          title?: string | null
          content?: string | null
          content_type?: 'text' | 'html' | 'markdown' | 'json'
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 