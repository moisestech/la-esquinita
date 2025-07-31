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
          event_id: string | null
          email: string
          name: string | null
          plus_ones: number
          dietary_restrictions: string | null
          notes: string | null
          status: 'confirmed' | 'cancelled' | 'waitlist'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          email: string
          name?: string | null
          plus_ones?: number
          dietary_restrictions?: string | null
          notes?: string | null
          status?: 'confirmed' | 'cancelled' | 'waitlist'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string | null
          email?: string
          name?: string | null
          plus_ones?: number
          dietary_restrictions?: string | null
          notes?: string | null
          status?: 'confirmed' | 'cancelled' | 'waitlist'
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
          type: 'text' | 'html' | 'markdown' | 'json'
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          title?: string | null
          content?: string | null
          type?: 'text' | 'html' | 'markdown' | 'json'
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          title?: string | null
          content?: string | null
          type?: 'text' | 'html' | 'markdown' | 'json'
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
      create_rsvp: {
        Args: {
          p_event_id: string
          p_email: string
          p_name?: string
          p_plus_ones?: number
          p_dietary_restrictions?: string
          p_notes?: string
        }
        Returns: string
      }
      validate_secret_code: {
        Args: {
          p_code: string
          p_target_route: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 